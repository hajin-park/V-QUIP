import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
};

export default function WebcamCapture() {
    return (
        <Webcam
            audio={false}
            height={720}
            width={1280}
            videoConstraints={videoConstraints}
        />
    );
}
