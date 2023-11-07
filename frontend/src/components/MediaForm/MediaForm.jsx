import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

const MediaForm = ({ setPollingMedia }) => {
    const [currentMedia, setCurrentMedia] = useState(null);

    const handleMediaSubmit = async (e) => {
        e.preventDefault();
        let form = new FormData();
        form.append("file", currentMedia);
        try {
            await fetch("http://127.0.0.1:5000/", {
                method: "PUT",
                body: form,
            });
            try {
                const response = await fetch("http://127.0.0.1:5000/", {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                let text = await response.text();
                setPollingMedia(JSON.parse(text));
            } catch (error) {
                console.error(
                    "There has been a problem with your GET operation:",
                    error
                );
            }
        } catch (error) {
            console.error(
                "There has been a problem with your PUT operation:",
                error
            );
        }
    };

    return (
        <div className="h-fit p-8 divide-y divide-gray-900/10 flex flex-col gap-x-8 gap-y-8 md:flex-row place-content-center">
            <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Or...
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Upload your own media.
                </p>
            </div>

            <form
                onSubmit={handleMediaSubmit}
                className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl w-fit"
            >
                <div className="px-4 py-6 sm:p-8 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    <div className="col-span-full">
                        <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Only PNG, JPG, WEBP, MP4, or WEBM accepted
                        </label>
                        {currentMedia ? (
                            currentMedia.name
                        ) : (
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon
                                        className="mx-auto h-12 w-12 text-gray-300"
                                        aria-hidden="true"
                                    />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/png, image/jpeg, image/webp, video/mp4, video/webm"
                                                onChange={(e) => {
                                                    setCurrentMedia(
                                                        e.target.files[0]
                                                    );
                                                }}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                        PNG, JPG, MP4
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button
                        type="reset"
                        onClick={() => setCurrentMedia(null)}
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MediaForm;
