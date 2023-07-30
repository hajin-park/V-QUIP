const PollingData = ({ pollingMedia }) => {
    return (
        <div className="w-full p-8 bg-slate-800 rounded-md text-center">
            <h1 className="font-black text-2xl text-white">Results</h1>
            <p>{pollingMedia}</p>
        </div>
    );
};

export default PollingData;
