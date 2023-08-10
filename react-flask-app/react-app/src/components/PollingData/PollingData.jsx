// Examples of how to extract the polling results

const PollingData = ({ pollingMedia }) => {
    const [outMedia, setOutputMedia] = useState(null);
    const outputURL = "http://127.0.0.1:5000/output";

    useEffect(() => {
        const fetchOutput = async () => {
            let form = new FormData();
            form.append("input", pollingMedia["input"]);
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/inference",
                    {
                        method: "GET",
                        body: form,
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                let text = await response.text();
                setOutputMedia(JSON.parse(text));
            } catch (error) {
                console.error(
                    "There has been a problem with your GET operation: ",
                    error
                );
            }
        };
        fetchOutput();
    }, [pollingMedia]);

    return (
        pollingMedia && (
            <div className="w-full p-8 bg-slate-800 rounded-md text-center text-white">
                <h1 className="font-black text-2xl">Results</h1>
                <p># People: {pollingMedia["people_detected"].count}</p>
                <p># Gestures: {pollingMedia["gestures_detected"].count}</p>
                <div>
                    Gesture details:{" "}
                    {Object.entries(pollingMedia["gesture_categories"]).map(
                        ([k, v]) => (
                            <p key={k}>
                                {k}: {v}
                            </p>
                        )
                    )}
                </div>
                {pollingMedia["input"] == "image" ? (
                    <img
                        src={`data:image/jpeg;base64,${outMedia}`}
                        className="w-full h-full"
                    />
                ) : (
                    <video controls>
                        <source
                            src="http://localhost:5000/output"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                )}
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
