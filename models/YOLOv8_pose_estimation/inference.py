"""
@software{yolov8_ultralytics,
  author       = {Glenn Jocher and Ayush Chaurasia and Jing Qiu},
  title        = {Ultralytics YOLOv8},
  version      = {8.0.0},
  year         = {2023},
  url          = {https://github.com/ultralytics/ultralytics},
  orcid        = {0000-0001-5950-6979, 0000-0002-7603-6750, 0000-0003-3783-7069},
  license      = {AGPL-3.0}
}
"""

import cv2
from ultralytics import YOLO


# Load a model
model = YOLO(r"weights/best.pt")


def run():
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        ret, frame = cap.read()

        if ret:
            # Flip on horizontal
            image = cv2.flip(frame, 1)
            results = model(image, save=False)
            annotated_frame = results[0].plot()

            cv2.imshow("YOLO-v8 Pose Estimation", annotated_frame)
            if cv2.waitKey(1) == ord("q"):
                break

        else:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()
