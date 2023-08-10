from utils import recognize_gesture, annotate_gesture_and_hand_landmark, gesture_crop_dimensions
from pathlib import Path
from ultralytics import YOLO
from flask import Flask, Response, request, send_from_directory, send_file
from flask_cors import CORS, cross_origin
from base64 import b64encode
from PIL import Image
from copy import deepcopy
import io
import json
import argparse
import cv2


GESTURE_THRESHOLD = 0.5
MEDIA_EXTENSIONS = {
    "image": ["png", "jpg", "webp"],
    "video": ["mp4", "webm"],
}
DATA_TEMPLATE = {
    "participants": 0,
    "gestures": 0,
    "gesture_annotations": [],
    "gesture_categories": {},
    "input": "",
}

model = YOLO(r"models/best.pt")
app = Flask(__name__, static_url_path="/outputs")
CORS(app, support_credentials=True)


@app.put("/")
@cross_origin(supports_credentials=True)
def collect_poll_results():
    [f.unlink() for f in Path("outputs").glob("*") if f.is_file()]  # Clear "outputs" folder content for new submissions

    if request.files["file"]:
        # Initialize a new poll data object for new submissions
        poll_data = deepcopy(DATA_TEMPLATE)

        file = request.files["file"]
        file_extension = file.filename.rsplit(".", 1)[1].lower()

        # Process image file
        if file_extension in MEDIA_EXTENSIONS["image"]:
            poll_data["input"] = "image"
            file.save(f"static/media.{file_extension}")
            image = cv2.imread(f"static/media.{file_extension}")  # BGR image array
            results = model.predict(
                image, save=False
            )  # Returns an array, each item corresponds to each frame/image passed in
            pose_annotations = results[0].plot()
            height, width = image.shape[:2]

            # Loops through each person detected
            for i, keypoints in enumerate(results[0].keypoints.cpu().numpy()):
                # keypoints has 17 objects, one for each pose landmark
                ear_left = keypoints.data[0][3]
                ear_right = keypoints.data[0][4]
                shoulder_left = keypoints.data[0][5]
                shoulder_right = keypoints.data[0][6]
                wrist_left = keypoints.data[0][9]
                wrist_right = keypoints.data[0][10]
                hand_crop = ear_left[0] - ear_right[0]  # Set gesture crop dimensions relative to the person's face size
                poll_data["participants"] += 1

                for j, wrist_data in enumerate([wrist_left, wrist_right]):
                    x, y, confidence = wrist_data

                    # Trigger gesture recognition on hands above a point slightly below their shoulders
                    hand_raised = y < ((shoulder_left[1] + shoulder_right[1]) / 2) + (hand_crop / 2)

                    if confidence > GESTURE_THRESHOLD and hand_raised:
                        x_upper, y_upper, x_lower, y_lower = gesture_crop_dimensions(x, y, hand_crop, width, height)
                        wrist_cropped = image[
                            y_upper:y_lower,
                            x_upper:x_lower,
                        ]

                        # Mediapipe only accepts RGB images, we must convert this here
                        wrist_cropped_rgb = cv2.cvtColor(wrist_cropped, cv2.COLOR_BGR2RGB)
                        top_gesture, hand_landmarks = recognize_gesture(wrist_cropped_rgb)
                        if top_gesture != None:
                            # Mediapipe returns a BGR image
                            wrist_cropped_bgr = annotate_gesture_and_hand_landmark(
                                wrist_cropped_rgb, top_gesture, hand_landmarks
                            )
                            cv2.imwrite(f"outputs/person{i}_gesture{j}.jpg", wrist_cropped_bgr)
                            poll_data["gestures"] += 1
                            poll_data["gesture_categories"].setdefault(top_gesture.category_name, 0)
                            poll_data["gesture_categories"][top_gesture.category_name] += 1

                            # Convert nparray image array to base64 image string, converts BGR to RGB
                            img_byte_arr = io.BytesIO()
                            gesture_img = Image.fromarray(wrist_cropped_bgr.astype("uint8"), "RGB")
                            gesture_img.save(img_byte_arr, format="JPEG")
                            base64_image = b64encode(img_byte_arr.getvalue()).decode("utf-8")
                            poll_data["gesture_annotations"].append(base64_image)

            cv2.imwrite("outputs/output.jpg", pose_annotations)

        #   Process video file
        elif file_extension in MEDIA_EXTENSIONS["video"]:
            best_gestures = {}
            poll_data["input"] = "video"

            # Prepare OpenCV VideoWriter to create an annotated MP4 file
            file.save("static/media.mp4")
            cap = cv2.VideoCapture("static/media.mp4")
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

                # Loops through each person detected
                for i, keypoints in enumerate(results[0].keypoints.cpu().numpy()):
                    # keypoints has 17 objects, one for each pose landmark
                    ear_left = keypoints.data[0][3]
                    ear_right = keypoints.data[0][4]
                    shoulder_left = keypoints.data[0][5]
                    shoulder_right = keypoints.data[0][6]
                    wrist_left = keypoints.data[0][9]
                    wrist_right = keypoints.data[0][10]
                    hand_crop = (
                        ear_left[0] - ear_right[0]
                    )  # Set gesture crop dimensions relative to the person's face size
                    poll_data["participants"] += 1

                for j, wrist_data in enumerate([wrist_left, wrist_right]):
                    x, y, confidence = wrist_data

                    # Trigger gesture recognition on hands above a point slightly below their shoulders
                    hand_raised = y < ((shoulder_left[1] + shoulder_right[1]) / 2) + (hand_crop / 2)

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
                            # Mediapipe returns a BGR image
                            wrist_cropped_bgr = annotate_gesture_and_hand_landmark(
                                wrist_cropped_rgb, top_gesture, hand_landmarks
                            )
                            current_gesture = best_gestures.setdefault(
                                f"person{i}_gesture{j}", [wrist_cropped_bgr, top_gesture]
                            )
                            if current_gesture[1].score < top_gesture.score:
                                best_gestures[f"person{i}_gesture{j}"] = [wrist_cropped_bgr, top_gesture]

            for key, value in best_gestures.items():
                if value[0].any():
                    cv2.imwrite(f"outputs/{key}.jpg", value[0])
                    poll_data["gestures"] += 1
                    poll_data["gesture_categories"].setdefault(value[1].category_name, 0)
                    poll_data["gestures_detected"][value[1].category_name] += 1

                    # Convert nparray image array to base64 image string
                    img_byte_arr = io.BytesIO()
                    gesture_img = Image.fromarray(value[0].astype("uint8"), "RGB")
                    gesture_img.save(img_byte_arr, format="JPEG")
                    base64_image = b64encode(img_byte_arr.getvalue()).decode("utf-8")
                    poll_data["gesture_annotations"].append(base64_image)

    json_object = json.dumps(poll_data, indent=4)
    with open("outputs/data.json", "w") as outfile:
        outfile.write(json_object)

    response = Response("200")
    return response


@app.get("/")
@cross_origin(supports_credentials=True)
def retrieve_poll_results():
    with open("outputs/data.json", "r") as openfile:
        json_object = json.load(openfile)
        return json_object


@app.get("/output")
@cross_origin(supports_credentials=True)
def retrieve_media():
    pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QuimPoll")
    app.run(host="0.0.0.0", port=5000)
