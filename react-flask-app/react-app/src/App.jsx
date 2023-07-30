import { useState } from "react";

import WebcamForm from "./components/WebcamForm/WebcamForm.jsx";
import MediaForm from "./components/MediaForm/MediaForm.jsx";
import PollingData from "./components/PollingData/PollingData.jsx";
import "./App.css";

function App() {
    const [pollingMedia, setPollingMedia] = useState(null);

    return (
        <div className="w-full min-h-screen p-8 bg-gray-200">
            <WebcamForm setPollingMedia={setPollingMedia} />
            <MediaForm setPollingMedi={setPollingMedia} />
            <PollingData pollingMedia={pollingMedia} />
        </div>
    );
}

export default App;
