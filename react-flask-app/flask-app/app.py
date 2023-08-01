from utils import recognize_gesture, annotate_gesture_and_hand_landmark, gesture_crop_dimensions
from pathlib import Path
from ultralytics import YOLO
from flask import Flask, Response, request
from flask_cors import CORS, cross_origin
import argparse
import cv2

GESTURE_THRESHOLD = 0.6

model = YOLO(r"models/best.pt")
app = Flask(__name__)
CORS(app, support_credentials=True)
image_extensions = ["png", "jpg", "webp"]
video_extensions = ["mp4", "webm"]


@app.route("/inference", methods=["PUT", "GET"])
@cross_origin(supports_credentials=True)
def inference():
    if request.method == "PUT":
        [
            f.unlink() for f in Path("outputs").glob("*") if f.is_file()
        ]  # clear outputs folder for each new inference request
        if request.files["file"]:
            file = request.files["file"]
            file_extension = file.filename.rsplit(".", 1)[1].lower()

            #   Process image file
            if file_extension in image_extensions:
                file.save(f"media.{file_extension}")
                image = cv2.imread(f"media.{file_extension}")  # returns a BGR image
                results = model.predict(
                    image, save=False
                )  # results is an array, each item corresponds to each file passed in or each frame of a video
                pose_annotations = results[0].plot()  # .plot() returns an annotated image
                height, width = image.shape[:2]

                # each loop represents one person detected (i.e. three people detected, three loops)
                for i, keypoints in enumerate(
                    results[0].keypoints.cpu().numpy()
                ):  # .keypoints returns a Tensor matrix of keypoints, use .cpu().numpy() to convert it
                    # keypoints has 17 objects, one for each landmark
                    ear_left = keypoints.data[0][3]
                    ear_right = keypoints.data[0][4]
                    shoulder_left = keypoints.data[0][5]
                    shoulder_right = keypoints.data[0][6]
                    wrist_left = keypoints.data[0][9]
                    wrist_right = keypoints.data[0][10]
                    hand_crop = (
                        ear_left[0] - ear_right[0]
                    )  # hand crop dimensions are relative to the size of the person's face

                    for j, wrist_data in enumerate([wrist_left, wrist_right]):
                        x, y, confidence = wrist_data
                        hand_raised = y < ((shoulder_left[1] + shoulder_right[1]) / 2) + (hand_crop / 2)

                        # process hand if the confidence is high enough and the arm/hand position is "raised" (around or above the shoulder-line)
                        if confidence > GESTURE_THRESHOLD and hand_raised:
                            x_upper, y_upper, x_lower, y_lower = gesture_crop_dimensions(x, y, hand_crop, width, height)
                            wrist_cropped = image.copy()[
                                y_upper:y_lower,
                                x_upper:x_lower,
                            ]
                            wrist_cropped_rgb = cv2.cvtColor(
                                wrist_cropped, cv2.COLOR_BGR2RGB
                            )  # Mediapipe only accepts RGB images, cv2 returns BGR image so we must convert it here
                            top_gesture, hand_landmarks = recognize_gesture(wrist_cropped_rgb)
                            if top_gesture != None:
                                wrist_cropped_rgb = cv2.cvtColor(
                                    annotate_gesture_and_hand_landmark(wrist_cropped_rgb, top_gesture, hand_landmarks),
                                    cv2.COLOR_BGR2RGB,
                                )  # Mediapipe returns a BGR image, convert it back into RGB
                                cv2.imwrite(f"outputs/person{i}_gesture{j}.jpg", wrist_cropped_rgb)

                cv2.imwrite("outputs/output.jpg", pose_annotations)

            #   Process video file
            elif file_extension in video_extensions:
                best_gestures = {}

                # Prepare OpenCV VideoWriter to create a new output MP4 file
                file.save("media.mp4")
                cap = cv2.VideoCapture("media.mp4")
                frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                out = cv2.VideoWriter("outputs/output.mp4", fourcc, 30.0, (frame_width, frame_height))

                # Annotate the video frame by frame
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                    results = model(frame, save=False)
                    results_plotted = results[0].plot()
                    out.write(results_plotted)

                    # each loop represents one person detected (i.e. three people detected, three loops)
                    for i, keypoints in enumerate(
                        results[0].keypoints.cpu().numpy()
                    ):  # .keypoints returns a Tensor matrix of keypoints, use .cpu().numpy() to convert it
                        # keypoints has 17 objects, one for each landmark
                        ear_left = keypoints.data[0][3]
                        ear_right = keypoints.data[0][4]
                        shoulder_left = keypoints.data[0][5]
                        shoulder_right = keypoints.data[0][6]
                        wrist_left = keypoints.data[0][9]
                        wrist_right = keypoints.data[0][10]
                        hand_crop = (
                            ear_left[0] - ear_right[0]
                        )  # hand crop dimensions are relative to the size of the person's face

                    for j, wrist_data in enumerate([wrist_left, wrist_right]):
                        x, y, confidence = wrist_data
                        hand_raised = y < ((shoulder_left[1] + shoulder_right[1]) / 2) + (hand_crop / 2)

                        # process hand if the confidence is high enough and the arm/hand position is "raised" (around or above the shoulder-line)
                        if confidence > GESTURE_THRESHOLD and hand_raised:
                            x_upper, y_upper, x_lower, y_lower = gesture_crop_dimensions(
                                x, y, hand_crop, frame_width, frame_height
                            )
                            wrist_cropped = frame.copy()[
                                y_upper:y_lower,
                                x_upper:x_lower,
                            ]
                            wrist_cropped_rgb = cv2.cvtColor(
                                wrist_cropped, cv2.COLOR_BGR2RGB
                            )  # Mediapipe only accepts RGB images, cv2 returns BGR image so we must convert it here
                            top_gesture, hand_landmarks = recognize_gesture(wrist_cropped_rgb)
                            if top_gesture != None and top_gesture.category_name != "None":
                                wrist_cropped_rgb = cv2.cvtColor(
                                    annotate_gesture_and_hand_landmark(wrist_cropped_rgb, top_gesture, hand_landmarks),
                                    cv2.COLOR_BGR2RGB,
                                )  # Mediapipe returns a BGR image, convert it back into RGB
                                current_gesture = best_gestures.setdefault(
                                    f"person{i}_gesture{j}", [wrist_cropped_rgb, top_gesture.score]
                                )
                                if current_gesture[1] < top_gesture.score:
                                    best_gestures[f"person{i}_gesture{j}"] = [wrist_cropped_rgb, top_gesture.score]

                for key, value in best_gestures.items():
                    if value[0].any():
                        cv2.imwrite(f"outputs/{key}.jpg", value[0])

        response = Response("200")
        return response

    elif request.method == "GET":
        response = Response("200")
        return response


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ExploreCSR Demo App")
    app.run(host="0.0.0.0", port=5000)
