import { useState } from "react";

import WebcamForm from "./components/WebcamForm/WebcamForm.jsx";
import MediaForm from "./components/MediaForm/MediaForm.jsx";
import PollingData from "./components/PollingData/PollingData.jsx";
import "./App.css";

function App() {
    const [pollingMedia, setPollingMedia] = useState(null);

    return (
        <main className="w-full min-h-screen p-8 bg-gray-200 grid grid-rows-3 md:grid-rows-2 grid-cols-1 md:grid-cols-2">
            <section className="row-start-1 row-span-2">
                <WebcamForm setPollingMedia={setPollingMedia} />
                <MediaForm setPollingMedia={setPollingMedia} />
            </section>

            <PollingData pollingMedia={pollingMedia} />
        </main>
    );
}

export default App;
