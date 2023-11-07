from matplotlib import pyplot as plt
from mediapipe.framework.formats import landmark_pb2
import mediapipe as mp
import cv2

plt.rcParams.update(
    {
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.spines.left": False,
        "axes.spines.bottom": False,
        "xtick.labelbottom": False,
        "xtick.bottom": False,
        "ytick.labelleft": False,
        "ytick.left": False,
        "xtick.labeltop": False,
        "xtick.top": False,
        "ytick.labelright": False,
        "ytick.right": False,
    }
)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles


def annotate_gesture_and_hand_landmark(image, top_gesture, hand_landmarks):
    """Annotates a frame with the gesture category and its score along with the hand landmarks."""

    title = f"{top_gesture.category_name} ({top_gesture.score:.2f})"
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    annotated_image = image.copy()

    hand_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
    hand_landmarks_proto.landmark.extend(
        [landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in hand_landmarks[0]]
    )

    mp_drawing.draw_landmarks(
        annotated_image,
        hand_landmarks_proto,
        mp_hands.HAND_CONNECTIONS,
        mp_drawing_styles.get_default_hand_landmarks_style(),
        mp_drawing_styles.get_default_hand_connections_style(),
    )

    annotated_image = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
    annotated_image = cv2.putText(
        annotated_image, title, (50, 50), cv2.FONT_HERSHEY_PLAIN, 1, (255, 0, 0), 2, cv2.LINE_AA
    )

    return annotated_image
