from flask import Flask, Request

app = Flask(__name__)

@app.route("/upload", methods=["POST"])
def get_media():
    pass

@app.route("/inference", methods=["POST"])
def inference_media():
    pass

@app.route("/inference", methods=["GET"])
def inference_media():
    pass