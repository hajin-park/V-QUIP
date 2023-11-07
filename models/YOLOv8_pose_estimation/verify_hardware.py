import torch
import ultralytics
ultralytics.checks()
print(torch.cuda.is_available())