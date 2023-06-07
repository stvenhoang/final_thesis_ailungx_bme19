import torch.nn as nn
from torchvision import models
class Efficientnet_b0(nn.Module):

    def __init__(self, classCount):
        super(Efficientnet_b0, self).__init__()

        self.efficientnet_b0 = models.efficientnet_b0(pretrained=True)

        kernelCount = self.efficientnet_b0.classifier[1].in_features

        self.efficientnet_b0.classifier[1] = nn.Sequential(nn.Linear(kernelCount, classCount), nn.Sigmoid())

    def forward(self, x):
        x = self.efficientnet_b0(x)
        return x