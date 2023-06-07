import torch.nn as nn
from torchvision import models
class DenseNet121(nn.Module):

    def __init__(self, classCount):
        super(DenseNet121, self).__init__()

        self.densenet121 = models.densenet121(pretrained=True)

        kernelCount = self.densenet121.classifier.in_features

        self.densenet121.classifier = nn.Sequential(nn.Linear(kernelCount, classCount), nn.Sigmoid())

    def forward(self, x):
        x = self.densenet121(x)
        return x