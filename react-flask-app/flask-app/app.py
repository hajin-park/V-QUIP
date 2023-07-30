from ultralytics import YOLO
from flask import Flask, Response, request
from flask_cors import CORS, cross_origin
from ultralytics import YOLO
import argparse
import cv2


model = YOLO(r"models/best.pt")
app = Flask(__name__)
CORS(app, support_credentials=True)
image_extensions = ["png", "jpg", "webp"]
video_extensions = ["mp4", "webm"]


@app.route("/inference", methods=["PUT"])
@cross_origin(supports_credentials=True)
def predict_img():
    if request.method == "PUT":
        if request.files["file"]:
            file = request.files["file"]
            file_extension = file.filename.rsplit(".", 1)[1].lower()

            if file_extension in image_extensions:
                file.save("media.webp")
                image = cv2.imread(file.filename)
                result = model.predict(image, save=False)
                cv2.imwrite("output.jpg", result[0].plot())

            elif file_extension in video_extensions:
                # Prepare OpenCV to create a new output MP4 file
                file.save("media.mp4")
                cap = cv2.VideoCapture("media.mp4")
                frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                out = cv2.VideoWriter("output.mp4", fourcc, 30.0, (frame_width, frame_height))

                # Annotate the video frame by frame
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                    results = model(frame, save=False)
                    results_plotted = results[0].plot()
                    out.write(results_plotted)

    elif request.method == "GET":
        pass

    response = Response("Inference Successful")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ExploreCSR Demo App")
    app.run(host="0.0.0.0", port=5000)
