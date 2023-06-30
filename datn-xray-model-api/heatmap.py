import numpy as np
from torch.nn import functional as F
from torch.autograd import Variable
import cv2
import base64
import torch
import torchvision.transforms as transforms
from densenet121 import DenseNet121
class HeatmapGenerator():

    def __init__(self, pathModel, transCrop):

        # ---- Initialize the network
        model = torch.load(pathModel, map_location=torch.device("cpu"))
        model = torch.nn.DataParallel(model).to("cpu")
        self.model = model.module.densenet121.features
        # ---- Initialize the weights
        self.weights = list(self.model.parameters())[-2]
        # ---- Initialize the image transform - resize + normalize
        normalize = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        transformList = []
        transformList.append(transforms.Resize(transCrop))
        transformList.append(transforms.ToTensor())
        transformList.append(normalize)

        self.transformSequence = transforms.Compose(transformList)

    # --------------------------------------------------------------------------------

    def generate(self, imagePil, imageOri, transCrop, predictresult):

        # ---- Load image, transform, convert
        imageData = self.transformSequence(imagePil)
        imageData = imageData.unsqueeze_(0)

        input = torch.autograd.Variable(imageData)

        self.model.to("cpu")
        output = self.model(input.to("cpu"))
        # ---- Generate heatmap
        heatmap = None
        for i in range(0, len(self.weights)):
            map = output[0, i, :, :]
            if i == 0:
                heatmap = self.weights[i] * map
            else:
                heatmap += self.weights[i] * map

        # ---- Blend original and heatmap
        heatmap = F.relu(Variable(heatmap))
        npHeatmap = heatmap.cpu().data.numpy()
        npHeatmap -= npHeatmap.min()

        nparr = np.frombuffer(imageOri, np.uint8)
        imgOriginal = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        imgOriginal = cv2.resize(imgOriginal, (transCrop, transCrop))

        npHeatmap /= npHeatmap.max()
        cam = cv2.resize(npHeatmap, (transCrop, transCrop))
        if (predictresult == "No Finding"):
            cam = cam * 0 + 0.12345223
        heatmap = cv2.applyColorMap(np.uint8(255.0 * cam), cv2.COLORMAP_JET)

        img = heatmap.astype(np.float) + imgOriginal.astype(np.float)
        img = img / img.max() * 255.0

        retval, buffer = cv2.imencode('.jpg', img)
        img_base64 = base64.b64encode(buffer)
        imgstr = img_base64.decode("utf-8")
        return imgstr