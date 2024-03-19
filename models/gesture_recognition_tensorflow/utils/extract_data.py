from pathlib import Path
import numpy as np
import mediapipe as mp
import cv2 as cv
import csv
import copy
import argparse
import itertools

DATASET_PATH = r"dataset"

files = Path(DATASET_PATH).glob("*")
for file in files:
    frame_counter = -1

    cap = cv.VideoCapture(file)

    while cap.isOpened():
        frame_counter += 1

        ret, frame = cap.read()

        if not ret:
            break

        if frame_counter % 5 != 0:
            continue
