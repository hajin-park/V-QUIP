from flask import Flask, Response, request
from subprocess import Popen
from ultralytics import YOLO
from PIL import Image
from re import DEBUG, sub
import numpy as np
import tensorflow as tf
import torch
import datetime
import argparse
import io
import subprocess
import requests
import shutil
import cv2
import glob
import time
import os
import re

IMG_UPLOAD_ID = "img_file"
VIDEO_UPLOAD_ID = ""
RECORDING_FILE_ID = ""

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def predict_img():
    if request.method == "POST":
        if "file" in request.files:
            # Retrieve the file from the HTML component specified by its name-ID
            with request.files[IMG_UPLOAD_ID] as f:
                basepath = os.path.dirname(__file__)
                filepath = os.path.join(basepath, "uploads", f.filename)
                f.save(filepath)
                global imgpath
                predict_img.imgpath = f.filename
                file_extension = f.filename.rsplit(".", 1)[1].lower()

                if file_extension == "jpg":
                    pass

                if file_extension == "mp4":
                    pass

    if request.method == "GET":
        pass


@app.route("/<path:filename>")
def display(filename):
    pass


def get_frame():
    pass


@app.route("/video_feed")
def video_feed():
    pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ExploreCSR Demo App")
    parser.add_argument("--port", default=5000, type=int, help="port number")
    args = parser.parse_args()
    model = torch.hub.load(".", "custom", "best_246.pt", source="local")
    model.eval()
    app.run(host="0.0.0.0", port=args.port)  # debug=True causes Restarting with stat
