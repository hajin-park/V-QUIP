// Examples of how to extract the polling results
import {
    VictoryBar,
    VictorySharedEvents,
    VictoryPie,
    VictoryLabel,
} from "victory";
import { useState } from "react";

const PollingData = ({ pollingMedia }) => {
    const [showGestures, setShowGestures] = useState(false);
    const [showGraph, setShowGraph] = useState(false);

    return (
        pollingMedia && (
            <div className="w-full p-8 mx-auto bg-slate-800 rounded-md text-white">
                <div className="flex flex-col gap-y-4">
                    <h1 className="font-black text-3xl">
                        <a
                            href={`http://127.0.0.1:5000/${
                                pollingMedia["input"] == "video"
                                    ? "video"
                                    : "image"
                            }`}
                            rel="noreferrer"
                            target="_blank"
                            className="hover:text-indigo-500 hover:text-4xl transition-all"
                        >
                            Polling Results
                        </a>
                    </h1>
                    <hr />
                    <p className="font-semibold text-xl">
                        # of People Detected: {pollingMedia["participants"]}
                    </p>
                    <p className="font-semibold text-xl">
                        # of Gestures Recognized: {pollingMedia["gestures"]}
                    </p>
                    <hr />
                    <div>
                        <p className="font-semibold text-xl">
                            Gesture details:{" "}
                        </p>
                        {Object.entries(pollingMedia["gesture_categories"]).map(
                            ([k, v]) => (
                                <p key={k}>
                                    {k}: {v}
                                </p>
                            )
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowGestures((e) => !e);
                        }}
                        className="font-bold text-indigo-200 text-lg text-left hover:text-indigo-500"
                    >
                        {showGestures ? "Hide" : "Show"} Gesture Annotations
                    </button>
                    {showGestures && (
                        <div className="w-full grid md:grid-flow-col p-8 gap-4 justify-around">
                            {pollingMedia["gesture_annotations"].map(
                                (base64img) => (
                                    <img
                                        key={base64img}
                                        src={`data:image/jpeg;base64,${base64img}`}
                                        className="w-32 h-32 object-center object-cover rounded-md"
                                    />
                                )
                            )}
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowGraph((e) => !e);
                        }}
                        className="font-bold text-indigo-200 text-lg text-left hover:text-indigo-500"
                    >
                        {showGraph ? "Hide" : "Show"} Graph View
                    </button>

                    {showGraph && pollingMedia["gestures"] && (
                        <div className="w-full p-8 bg-slate-300 rounded-md text-center text-black">
                            <h1 className="font-black text-2xl">Graph View</h1>

                            <svg viewBox="0 0 550 450">
                                <VictorySharedEvents
                                    events={[
                                        {
                                            childName: ["pie", "bar"],
                                            target: "data",
                                            eventHandlers: {
                                                onMouseOver: () => {
                                                    return [
                                                        {
                                                            childName: [
                                                                "pie",
                                                                "bar",
                                                            ],
                                                            mutation: (
                                                                props
                                                            ) => {
                                                                return {
                                                                    style: Object.assign(
                                                                        {},
                                                                        props.style,
                                                                        {
                                                                            fill: "tomato",
                                                                        }
                                                                    ),
                                                                };
                                                            },
                                                        },
                                                    ];
                                                },
                                                onMouseOut: () => {
                                                    return [
                                                        {
                                                            childName: [
                                                                "pie",
                                                                "bar",
                                                            ],
                                                            mutation: () => {
                                                                return null;
                                                            },
                                                        },
                                                    ];
                                                },
                                            },
                                        },
                                    ]}
                                >
                                    <g transform={"translate(250, 100)"}>
                                        <VictoryBar
                                            name="bar"
                                            width={300}
                                            standalone={false}
                                            style={{
                                                data: { width: 20 },
                                                labels: { fontSize: 10 },
                                            }}
                                            data={Object.entries(
                                                pollingMedia[
                                                    "gesture_categories"
                                                ]
                                            ).map(([k, v]) => ({ x: k, y: v }))}
                                            labels={Object.entries(
                                                pollingMedia[
                                                    "gesture_categories"
                                                ]
                                            ).map(([k, v]) => k + " : " + v)}
                                            labelComponent={
                                                <VictoryLabel y={290} />
                                            }
                                        />
                                    </g>
                                    <g transform={"translate(0, -75)"}>
                                        <VictoryPie
                                            name="pie"
                                            width={250}
                                            standalone={false}
                                            style={{
                                                labels: {
                                                    fontSize: 10,
                                                    padding: 5,
                                                },
                                            }}
                                            data={Object.entries(
                                                pollingMedia[
                                                    "gesture_categories"
                                                ]
                                            ).map(([k, v]) => ({ x: k, y: v }))}
                                        />
                                    </g>
                                </VictorySharedEvents>
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default PollingData;
