from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
import torch
import imageio
from PIL import Image
from torchvision import transforms
import base64
import numpy as np
from waitress import serve
from heatmap import HeatmapGenerator
from densenet121 import DenseNet121

app = Flask(__name__)
api = Api(app)

img_post_args = reqparse.RequestParser()
img_post_args.add_argument("imgb64", type=str, help="B64 of the image is required")

# Load model
device = torch.device("cpu")
model = torch.load('densenet121_Chest14.pth', map_location=torch.device("cpu"))



mean = np.array([0.485, 0.456, 0.406])
std = np.array([0.229, 0.224, 0.225])

data_transforms = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])

classname = ['Emphysema', 'Hernia', 'Nodule', 'Effusion', 'Pleural_Thickening',
       'Pneumonia', 'Cardiomegaly', 'Infiltration', 'Consolidation',
       'Atelectasis', 'Pneumothorax', 'Mass', 'Edema', 'Fibrosis']

class PostImg(Resource):
    def post(self):
        pred_classname = []
        args = img_post_args.parse_args()
        imgb64 = args['imgb64']
        img_pd = base64.b64decode(imgb64)
        img_pd2 = imageio.v3.imread(img_pd)
        img_pil = Image.fromarray(img_pd2).convert('RGB')

        # Preprocess the image
        img = data_transforms(img_pil)
        img = img.unsqueeze(0)

        # Make a prediction
        with torch.no_grad():
            img = img.to(device)
            output = model(img)
            pred = output > 0.4
            pred = pred.to(torch.float32)
            pred = pred.cpu().squeeze().detach().numpy().tolist()
            for i, e in enumerate(pred):
                if e==1.0:
                    pred_classname.append(classname[i])
        predictresult = ", ".join(pred_classname)
        if predictresult == "":
            predictresult = "No Finding"
        # Return the result as JSON
        h = HeatmapGenerator('densenet121_Chest14.pth', 224)
        hmImg = h.generate(img_pil, img_pd, 224, predictresult)
        result = {'predict_result': predictresult,
                  'heatmap_image': hmImg}
        return jsonify(result)

api.add_resource(PostImg, "/predict")

if __name__ == '__main__':
    serve(app, host="0.0.0.0", port=9000, threads=3)
