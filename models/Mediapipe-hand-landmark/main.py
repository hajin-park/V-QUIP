from utils import annotate_gesture_and_hand_landmark
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import mediapipe as mp
import cv2
import math


DESIRED_HEIGHT = 480
DESIRED_WIDTH = 480
IMAGE_FILENAMES = ["models/Mediapipe/mp_test_1.png", "models/Mediapipe/mp_test_2.png"]


base_options = python.BaseOptions(model_asset_path="models/Mediapipe/models/gesture_recognizer.task")
options = vision.GestureRecognizerOptions(base_options=base_options)
recognizer = vision.GestureRecognizer.create_from_options(options)


def resize_and_show(image):
    h, w = image.shape[:2]
    if h < w:
        img = cv2.resize(image, (DESIRED_WIDTH, math.floor(h / (w / DESIRED_WIDTH))))
    else:
        img = cv2.resize(image, (math.floor(w / (h / DESIRED_HEIGHT)), DESIRED_HEIGHT))
    return img


def recognize_gesture(frame):
    # STEP 3: Load the input image.
    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame)

    # STEP 4: Recognize gestures in the input image.
    recognition_result = recognizer.recognize(image)

    if not recognition_result.gestures:
        return None, None

    # STEP 5: Process the result. In this case, visualize it.
    top_gesture = recognition_result.gestures[0][0]
    hand_landmarks = recognition_result.hand_landmarks

    return [top_gesture, hand_landmarks]


def run():
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        ret, frame = cap.read()

        if ret:
            # Flip on horizontal
            flipped_frame = cv2.flip(frame, 1)

            top_gesture, hand_landmarks = recognize_gesture(flipped_frame)

            if top_gesture == None:
                cv2.imshow("Mediapipe Gesture Recognition", flipped_frame)
            else:
                annotated_frame = annotate_gesture_and_hand_landmark(flipped_frame, top_gesture, hand_landmarks)
                cv2.imshow("Mediapipe Gesture Recognition", annotated_frame)

            if cv2.waitKey(1) == ord("q"):
                break

        else:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()
