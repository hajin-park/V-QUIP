from ultralytics import YOLO

# Load a model
model = YOLO("yolov8n-pose.pt")  # load a pretrained model (recommended for training)

# Train the model
model.train(data="coco-pose.yaml", epochs=50)

# evaluate model performance on the validation set
results = model.val()
