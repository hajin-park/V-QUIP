import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    facingMode: "user",
};

const WebcamForm = ({ setPollingMedia }) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [screenshot, setScreenshot] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordingURL, setRecordingURL] = useState(null);

    // MediaPlayer API webcam recording
    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleTakePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setScreenshot(imageSrc);
    }, [webcamRef]);

    const handleRetakePhoto = () => {
        setScreenshot(null);
    };

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm",
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start(10);
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm",
            });
            const url = URL.createObjectURL(blob);
            setRecordingURL(url);
            setRecordedChunks([]);
        }
    }, [mediaRecorderRef, setCapturing, recordedChunks]);

    const handleRetakePollingClick = () => {
        if (!capturing) {
            window.URL.revokeObjectURL(recordingURL);
            setRecordedChunks([]);
            setRecordingURL(null);
        }
    };

    const handleWebcamSubmit = async (e) => {
        e.preventDefault();
        let form = new FormData();
        let blob;

        if (recordingURL) {
            // Fetch the data from the URL and convert it into a blob
            const response = await fetch(recordingURL);
            console.log(recordingURL);
            blob = await response.blob();
        } else if (screenshot) {
            // Convert the base64 string to a Blob object
            let byteCharacters = atob(screenshot.split(",")[1]);
            console.log(screenshot);
            let byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: "image/webp" });
        }

        // Create a File object from the Blob
        let file = new File(
            [blob],
            blob.type === "image/webp" ? "media.webp" : "media.webm",
            {
                type: blob.type,
            }
        );
        form.append("file", file);
        try {
            const response = await fetch("http://127.0.0.1:5000/inference", {
                method: "PUT",
                body: form,
            });
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/inference",
                    {
                        method: "GET",
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                let text = await response.text();
                setPollingMedia(JSON.parse(text));
            } catch (error) {
                console.error(
                    "There has been a problem with your GET operation: ",
                    error
                );
            }
        } catch (error) {
            console.error(
                "There has been a problem with your PUT operation: ",
                error
            );
        }
    };

    return (
        <form onSubmit={handleWebcamSubmit} className="w-full">
            <div className="py-4 w-full flex flex-col md:flex-row gap-x-8 gap-y-4 place-content-center">
                <span className="w-fit isolate inline-flex rounded-md shadow-sm">
                    {capturing ? (
                        <button
                            onClick={handleStopCaptureClick}
                            type="button"
                            className="relative inline-flex items-center rounded-l-md bg-white hover:bg-gray-50 px-3 py-2 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10"
                        >
                            Stop Poll
                        </button>
                    ) : (
                        <button
                            onClick={handleStartCaptureClick}
                            disabled={screenshot || capturing || recordingURL}
                            type="button"
                            className={`relative inline-flex items-center rounded-l-md ${
                                screenshot || capturing || recordingURL
                                    ? "bg-gray-300"
                                    : "bg-white hover:bg-gray-50"
                            }  px-3 py-2 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                        >
                            Start Poll
                        </button>
                    )}

                    <button
                        onClick={handleRetakePollingClick}
                        type="button"
                        className={`relative -ml-px inline-flex items-center rounded-r-md ${
                            recordingURL
                                ? "bg-white hover:bg-gray-50"
                                : "bg-gray-300"
                        } px-3 py-2 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                    >
                        Retake Poll
                    </button>
                </span>
                <span className="w-fit isolate inline-flex rounded-r-md rounded-md shadow-sm">
                    <button
                        onClick={handleTakePhoto}
                        type="button"
                        disabled={capturing || recordingURL}
                        className={`relative inline-flex items-center rounded-l-md ${
                            screenshot || capturing || recordingURL
                                ? "bg-gray-300"
                                : "bg-white hover:bg-gray-50"
                        } px-3 py-2 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                    >
                        Take Photo
                    </button>
                    <button
                        onClick={handleRetakePhoto}
                        type="button"
                        className={`relative -ml-px inline-flex items-center rounded-r-md ${
                            screenshot
                                ? "bg-white hover:bg-gray-50"
                                : "bg-gray-300"
                        } px-3 py-2 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
                    >
                        Retake Photo
                    </button>
                </span>
                <span className="w-fit isolate inline-flex rounded-md shadow-sm">
                    <button
                        type="submit"
                        disabled={!screenshot && !recordingURL}
                        className="relative inline-flex items-center rounded-md bg-indigo-500 hover:bg-indigo-400 px-3 py-2 text-lg font-semibold text-white ring-1 ring-inset ring-gray-300 focus:z-10"
                    >
                        Submit
                    </button>
                </span>
            </div>
            <div className="w-full h-fit rounded-lg">
                {screenshot && (
                    <img
                        src={screenshot}
                        alt="Webcam Screenshot"
                        className="mx-auto border-8 border-white rounded-2xl"
                    />
                )}

                {recordingURL && (
                    <video
                        controls
                        autoPlay
                        className="mx-auto border-8 border-white rounded-2xl"
                    >
                        <source src={recordingURL} type="video/webm" />
                    </video>
                )}

                {!screenshot && !recordingURL && (
                    <Webcam
                        audio={false}
                        videoConstraints={videoConstraints}
                        className="mx-auto border-8 border-white rounded-2xl"
                        ref={webcamRef}
                    />
                )}
            </div>
        </form>
    );
};

export default WebcamForm;
