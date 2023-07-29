import cv2
import mediapipe as mp
import utils as landmark_utils
import time

BaseOptions = mp.tasks.BaseOptions
GestureRecognizer = mp.tasks.vision.GestureRecognizer
GestureRecognizerOptions = mp.tasks.vision.GestureRecognizerOptions
GestureRecognizerResult = mp.tasks.vision.GestureRecognizerResult
VisionRunningMode = mp.tasks.vision.RunningMode
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands
model_path = r'./Mediapipe/models/gesture_recognizer.task'

def print_result(result: GestureRecognizerResult, output_image: mp.Image, timestamp_ms: int):

    # Flip the image horizontally for a selfie-view display.
    final = cv2.flip(image, 1)
    cv2.putText(final, result.gestures[-1], (10, 30), cv2.FONT_HERSHEY_DUPLEX, 1, 255)
    cv2.imshow('MediaPipe Hands', final)

options = GestureRecognizerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.LIVE_STREAM,
    result_callback=print_result)

hands = mp_hands.Hands(
        model_complexity=0,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    
with GestureRecognizer.create_from_options(options) as recognizer:
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        timestamp = round(time.time() * 1000)
        success, image = cap.read()

        if not success:
            print("Ignoring empty camera frame.")
            continue

        # To improve performance, optionally mark the image as not writeable
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)
        landmark_results = hands.process(image)

        # Draw the hand annotations on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        if landmark_results.multi_hand_landmarks:
            for hand_landmarks in landmark_results.multi_hand_landmarks:
                landmark_list = landmark_utils.calc_landmark_list(image, hand_landmarks)
                keypoints = landmark_utils.pre_process_landmark(landmark_list)

                mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())
                
        recognizer.recognize_async(mp_image, timestamp)

        if cv2.waitKey(5) == ord('q'):
            break

cap.release()
