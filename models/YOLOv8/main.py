from ultralytics import YOLO

# Load a model
model = YOLO('yolov8n-pose.pt')  # load a pretrained model (recommended for training)

# evaluate model performance on the validation set
if __name__ == '__main__':
    
    # Train the model
    model.train(data='coco-pose.yaml', epochs=50)
    results = model.val()