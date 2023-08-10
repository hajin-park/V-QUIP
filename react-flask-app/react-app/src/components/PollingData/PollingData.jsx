import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack} from 'victory';



const PollingData = ({ pollingMedia }) => {
    const imageURL = "";
    const videoURL = "http://127.0.0.1:5000/videos";

    const data2012 = [
        {quarter: 1, earnings: 13000},
        {quarter: 2, earnings: 16500},
        {quarter: 3, earnings: 14250},
        {quarter: 4, earnings: 19000}
      ];
      
      const data2013 = [
        {quarter: 1, earnings: 15000},
        {quarter: 2, earnings: 12500},
        {quarter: 3, earnings: 19500},
        {quarter: 4, earnings: 13000}
      ];
      
      const data2014 = [
        {quarter: 1, earnings: 11500},
        {quarter: 2, earnings: 13250},
        {quarter: 3, earnings: 20000},
        {quarter: 4, earnings: 15500}
      ];
      
      const data2015 = [
        {quarter: 1, earnings: 18000},
        {quarter: 2, earnings: 13250},
        {quarter: 3, earnings: 15000},
        {quarter: 4, earnings: 12000}
      ];
    






    return ( <>
        {/* pollingMedia && ( */}
            {/* <div className="w-full p-8 bg-slate-800 rounded-md text-center text-white">
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
                </div> */}

                




            {/* </div> */}



        <div className="w-full p-8 bg-slate-800 rounded-md text-center text-white">  
        <h1 className="font-black text-2xl">Results</h1>
        
        <VictoryChart 
        domainPadding={20}
        theme={VictoryTheme.material}
        >

        <VictoryAxis
        tickValues={[1,2,3,4]}
        tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
        />


        <VictoryAxis
        dependentAxis
        tickFormat={(x) => (`$${x / 100}k`)}
        />

    <VictoryStack>
      <VictoryBar
        data={data2012}
        x="quarter"
        y="earnings"
      />
      <VictoryBar
        data={data2013}
        x="quarter"
        y="earnings"
      />
      <VictoryBar
        data={data2014}
        x="quarter"
        y="earnings"
      />
      <VictoryBar
        data={data2015}
        x="quarter"
        y="earnings"
      />
    </VictoryStack>
    </VictoryChart>

      
      </div>
      </>
    );
 
};

export default PollingData;