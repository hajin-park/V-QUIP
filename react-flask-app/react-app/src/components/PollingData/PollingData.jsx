const PollingData = ({ pollingMedia }) => {
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
