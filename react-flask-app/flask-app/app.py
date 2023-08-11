from utils import (
    gesture_crop_dimensions,
    calc_bounding_rect,
    calc_landmark_list,
    pre_process_landmark,
    draw_landmarks,
    draw_bounding_rect,
    draw_info_text,
    gesture_crop_dimensions,
)
from pathlib import Path
from ultralytics import YOLO
from flask import Flask, Response, request, render_template
from flask_cors import CORS, cross_origin
from base64 import b64encode
from PIL import Image
from copy import deepcopy
import mediapipe as mp
from models import KeyPointClassifier
import os
import csv
import io
import json
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

yolo = YOLO(r"models/PoseEstimation/best.pt")
app = Flask(__name__, static_url_path="/static")
CORS(app, support_credentials=True)

# Model Gesture Model
use_brect = True
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)
keypoint_classifier = KeyPointClassifier()
with open(
    r"models/CustomGestures/keypoint_classifier_label.csv",
    encoding="utf-8",
) as f:
    keypoint_classifier_labels = csv.reader(f)
    keypoint_classifier_labels = [row[0].replace("\ufeff", "") for row in keypoint_classifier_labels]


@app.put("/")
@cross_origin(supports_credentials=True)
def collect_poll_results():
    # Make new media directories if they dont already exist
    os.makedirs("static", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)

    # Clear "outputs" folder content for new submissions
    [f.unlink() for f in Path("outputs").glob("*") if f.is_file()]

    if request.files["file"]:
        # Initialize a new poll data object for each new submissions
        poll_data = deepcopy(DATA_TEMPLATE)

        file = request.files["file"]
        file_extension = file.filename.rsplit(".", 1)[1].lower()

        # Process a image file submission
        if file_extension in MEDIA_EXTENSIONS["image"]:
            poll_data["input"] = "image"
            file.save(f"static/media.{file_extension}")
            image = cv2.imread(f"static/media.{file_extension}")  # BGR image array
            results = yolo.predict(
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

                        # Extract Hand Landmark data
                        wrist_cropped_rgb = cv2.cvtColor(wrist_cropped, cv2.COLOR_BGR2RGB)
                        debug_image = deepcopy(wrist_cropped_rgb)
                        wrist_cropped_rgb.flags.writeable = False
                        results = hands.process(wrist_cropped_rgb)
                        wrist_cropped_rgb.flags.writeable = True

                        # Draw hand landmarks and classify gesture
                        if results.multi_hand_landmarks is not None:
                            for hand_landmarks, handedness in zip(
                                results.multi_hand_landmarks, results.multi_handedness
                            ):
                                # Bounding box calculation
                                brect = calc_bounding_rect(debug_image, hand_landmarks)
                                # Landmark calculation
                                landmark_list = calc_landmark_list(debug_image, hand_landmarks)

                                # Conversion to relative coordinates / normalized coordinates
                                pre_processed_landmark_list = pre_process_landmark(landmark_list)

                                # Hand sign classification
                                hand_sign_id, hand_sign_confidence = keypoint_classifier(pre_processed_landmark_list)

                                # Drawing part
                                debug_image = draw_bounding_rect(use_brect, debug_image, brect)
                                debug_image = draw_landmarks(debug_image, landmark_list)
                                debug_image = draw_info_text(
                                    debug_image,
                                    brect,
                                    handedness,
                                    keypoint_classifier_labels[hand_sign_id],
                                )

                                cv2.imwrite(f"outputs/person{i}_gesture{j}.jpg", debug_image)
                                poll_data["gestures"] += 1
                                poll_data["gesture_categories"].setdefault(keypoint_classifier_labels[hand_sign_id], 0)
                                poll_data["gesture_categories"][keypoint_classifier_labels[hand_sign_id]] += 1

                                # Convert nparray image array to base64 image string, converts BGR to RGB
                                img_byte_arr = io.BytesIO()
                                gesture_img = Image.fromarray(debug_image.astype("uint8"), "RGB")
                                gesture_img.save(img_byte_arr, format="JPEG")
                                base64_image = b64encode(img_byte_arr.getvalue()).decode("utf-8")
                                poll_data["gesture_annotations"].append(base64_image)

            cv2.imwrite("static/output.jpg", pose_annotations)

        #   Process a video file submission
        elif file_extension in MEDIA_EXTENSIONS["video"]:
            best_gestures = {}
            poll_data["input"] = "video"

            # Prepare OpenCV VideoWriter to create an annotated MP4 file
            file.save("static/media.mp4")
            cap = cv2.VideoCapture("static/media.mp4")
            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            out = cv2.VideoWriter("static/output.mp4", fourcc, 30.0, (frame_width, frame_height))
            frame_counter = -1

            # Annotate the video frame by frame
            while cap.isOpened():
                frame_counter += 1
                ret, frame = cap.read()
                if not ret:
                    break
                if frame_counter % 5 != 0:
                    continue

                results = yolo(frame, save=False)
                results_plotted = results[0].plot()
                out.write(results_plotted)
                poll_data["participants"] = 0

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

                        # Extract Hand Landmark data
                        wrist_cropped_rgb = cv2.cvtColor(wrist_cropped, cv2.COLOR_BGR2RGB)
                        debug_image = deepcopy(wrist_cropped_rgb)
                        wrist_cropped_rgb.flags.writeable = False
                        results = hands.process(wrist_cropped_rgb)
                        wrist_cropped_rgb.flags.writeable = True

                        # Draw hand landmarks and classify gesture
                        if results.multi_hand_landmarks is not None:
                            for hand_landmarks, handedness in zip(
                                results.multi_hand_landmarks, results.multi_handedness
                            ):
                                # Bounding box calculation
                                brect = calc_bounding_rect(debug_image, hand_landmarks)
                                # Landmark calculation
                                landmark_list = calc_landmark_list(debug_image, hand_landmarks)

                                # Conversion to relative coordinates / normalized coordinates
                                pre_processed_landmark_list = pre_process_landmark(landmark_list)

                                # Hand sign classification
                                hand_sign_id, hand_sign_confidence = keypoint_classifier(pre_processed_landmark_list)

                                # Drawing part
                                debug_image = draw_bounding_rect(use_brect, debug_image, brect)
                                debug_image = draw_landmarks(debug_image, landmark_list)
                                debug_image = draw_info_text(
                                    debug_image,
                                    brect,
                                    handedness,
                                    keypoint_classifier_labels[hand_sign_id],
                                )

                                current_gesture = best_gestures.setdefault(
                                    f"person{i}_gesture{j}",
                                    [debug_image, [keypoint_classifier_labels[hand_sign_id], hand_sign_confidence]],
                                )
                                if current_gesture[1][1] < hand_sign_confidence:
                                    best_gestures[f"person{i}_gesture{j}"] = [
                                        debug_image,
                                        [keypoint_classifier_labels[hand_sign_id], hand_sign_confidence],
                                    ]
            print(frame_counter)
            for key, value in best_gestures.items():
                if value[0].any():
                    cv2.imwrite(f"outputs/{key}.jpg", value[0])
                    poll_data["gestures"] += 1
                    poll_data["gesture_categories"].setdefault(value[1][0], 0)
                    poll_data["gesture_categories"][value[1][0]] += 1

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


@app.get("/video")
@cross_origin(supports_credentials=True)
def retrieve_video():
    return render_template("video.html")


@app.get("/image")
@cross_origin(supports_credentials=True)
def retrieve_image():
    return render_template("image.html")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QuimPoll")
    app.run(host="0.0.0.0", port=5000)
