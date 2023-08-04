// Examples of how to extract the polling results

const PollingData = ({ pollingMedia }) => {
    const imageURL = "";
    const videoURL = "http://127.0.0.1:5000/videos";

    return (
        pollingMedia && (
            <div className="w-full p-8 bg-slate-800 rounded-md text-center text-white">
                <h1 className="font-black text-2xl">Results</h1>
                <p># People: {pollingMedia["people_detected"].count}</p>
                <p># Gestures: {pollingMedia["gestures_detected"].count}</p>
                <div>
                    Gesture details:{" "}
                    {Object.entries(
                        pollingMedia["gestures_detected"]["gestures"]
                    ).map(([k, v]) => (
                        <p key={k}>
                            {k}: {v}
                        </p>
                    ))}
                </div>
                <div>
                    {imageURL ? (
                        <img src={imageURL} className="w-full h-full" />
                    ) : (
                        <video width="320" height="240" controls>
                            <source src={videoURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
                <div className="w-full flex">
                    {pollingMedia["gestures_detected"]["media"].map(
                        (base64img) => (
                            <img
                                key={base64img}
                                src={`data:image/jpeg;base64,${base64img}`}
                                className="w-full h-full"
                            />
                        )
                    )}
                </div>
            </div>
        )
    );
};

export default PollingData;
