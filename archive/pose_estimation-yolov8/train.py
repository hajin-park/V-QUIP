# WARNING: datasets is ~50GB

from ultralytics import YOLO


def run():
    # Load a model
    model = YOLO("weights/yolov8n-pose.pt")  # load a pretrained model (recommended for training)

    # Train the model
    model.train(data="coco-pose.yaml", epochs=100)

    # evaluate model performance on the validation set
    results = model.val()

    print(results)


if __name__ == "__main__":
    run()
