// import { useState, useEffect } from "react";
// import MultiLineChart from "../../components/MultiLineChart";

// async function fetcher(url) {
//   const data = await fetch(url);
//   return data.json();
// }

// const CombinedChart = () => {
//   const [latestPLs, setLatestPLs] = useState([0, 0]);
//   const [latestOdds, setLatestOdds] = useState([0, 0]);
//   const [newPoints, setNewPoints] = useState([]); // temporary points for chart
//   const [bookValue, setBookValue] = useState(0);

//   useEffect(() => {
//     let active = true;

//     async function pollAll() {
//       try {
//         const [plRes, oddsRes] = await Promise.all([
//           fetcher("http://localhost:3001/getPl"),
//           fetcher("http://localhost:3001/bookOdds")
//         ]);

//         if (!active) return;

//         const pl1 = plRes?.[0]?.profitAndLosses?.[0]?.ifWin ?? 0;
//         const pl2 = plRes?.[0]?.profitAndLosses?.[1]?.ifWin ?? 0;
//         const odds1 = oddsRes?.[0]?.runners?.[0]?.lastPriceTraded ?? 0;
//         const odds2 = oddsRes?.[0]?.runners?.[1]?.lastPriceTraded ?? 0;

//         setLatestPLs([pl1, pl2]);
//         setLatestOdds([odds1, odds2]);

//         const now = Math.floor(Date.now() / 1000);

//         const maxprofit = Math.max(pl1, pl2);
//         const minprofit = Math.min(pl1,pl2);

//         const favOdds = Math.min(odds1-1, odds2-1);
//         // const underdogOdds = Math.max(odds1-1, odds2-1);
//         setBookValue(maxprofit <0 && minprofit <0 ? maxprofit/minprofit : Math.abs(maxprofit/minprofit));
//         // Send new points to chart
//         // setNewPoints([
//         //   { series: maxprofit == pl1 ? "Profit" : "Loss", point: { time: now, value: maxprofit <0 && minprofit <0 ? maxprofit/minprofit : Math.abs(maxprofit/minprofit) } },
//         //   { series: favOdds == odds1-1 ? "Odds" : "AwayOdds", point: { time: now, value: favOdds} },
//         //   { series: "1", point: { time: now, value: 1 } },
//         //   { series: "0", point: { time: now, value: 0 } }
//         // ]);

//         setNewPoints([
//   {
//     series: "PL", // FIXED
//     meta: maxprofit/minprofit > 0 ? "Profit" : "Loss",
//     point: {
//       time: now,
//       value:
//         maxprofit < 0 && minprofit < 0
//           ? -(maxprofit / minprofit)
//           : Math.abs(maxprofit / minprofit),
//     },
//   },
//   {
//     series: "ODDS", // FIXED
//     meta: favOdds === odds1 - 1 ? "Fav" : "Away",
//     point: { time: now, value: favOdds },
//   },
//   {
//     series: "ONE",
//     meta: "One",
//     point: { time: now, value: 1 },
//   },
//   {
//     series: "ZERO",
//     point: { time: now, value: 0 },
//   },
// ]);


//       } catch (err) {
//         console.log(err);
//       }

//       if (active) setTimeout(pollAll, 5000);
//     }

//     pollAll();
//     return () => { active = false; };
//   }, []);

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
//         <div>
//           <h3>Profit/Loss:</h3>
//           <p>{latestPLs[0]}, {latestPLs[1]}</p>
//         </div>
//         <div>
//           <h3>Odds:</h3>
//           <p>{latestOdds[0]}, {latestOdds[1]}</p>
//         </div>
//       </div>

//       {/* Chart manages series internally; newPoints are appended via update */}

//       <MultiLineChart newPoints={newPoints} />
//      <div style={{display:'flex',gap:'10px',paddingLeft:'20px',justifyContent:'left',alignItems:'center'}}>
//       <h4>Book Value: {bookValue.toFixed(2)} </h4>,
//       <h4>Home</h4><div style={{height:"20px",width:'20px',backgroundColor:"rgba(247, 239, 15, 0.67)",borderRadius:'50%'}}></div>,
//       <h4>Away</h4><div style={{height:"20px",width:'20px',backgroundColor:"rgba(77, 32, 225, 0.87)",borderRadius:'50%'}}></div>
//       </div>
//     </div>
//   );
// };

// export default CombinedChart;




import { useState, useEffect } from "react";
import MultiLineChart from "../../components/MultiLineChart";

async function fetcher(url) {
  const data = await fetch(url);
  return data.json();
}

const CombinedChart = () => {
  const [latestPLs, setLatestPLs] = useState([0, 0]);
  const [latestOdds, setLatestOdds] = useState([0, 0]);
  const [newPoints, setNewPoints] = useState([]);
  const [bookValue, setBookValue] = useState(0);

  useEffect(() => {
    let active = true;

    async function pollAll() {
      try {
        const [plRes, oddsRes] = await Promise.all([
          fetcher("http://localhost:3001/getPl"),
          fetcher("http://localhost:3001/bookOdds"),
        ]);

        if (!active) return;

        const pl1 = plRes?.[0]?.profitAndLosses?.[0]?.ifWin ?? 0;
        const pl2 = plRes?.[0]?.profitAndLosses?.[1]?.ifWin ?? 0;
        const odds1 = oddsRes?.[0]?.runners?.[0]?.lastPriceTraded ?? 0;
        const odds2 = oddsRes?.[0]?.runners?.[1]?.lastPriceTraded ?? 0;

        setLatestPLs([pl1, pl2]);
        setLatestOdds([odds1, odds2]);

        const now = Math.floor(Date.now() / 1000);

        const maxprofit = Math.max(pl1, pl2);
        const minprofit = Math.min(pl1, pl2);

        const favOdds = Math.min(odds1 - 1, odds2 - 1);

        // ✅ SINGLE SOURCE OF TRUTH
        const isProfit = maxprofit > 0;

        // ✅ CONSISTENT VALUE LOGIC
        const rawRatio =
          maxprofit < 0 && minprofit < 0
            ? maxprofit / minprofit
            : Math.abs(maxprofit / minprofit);

        const finalBookValue = isProfit ? rawRatio : -rawRatio;

        setBookValue(finalBookValue);

        setNewPoints([
          {
            series: "PL",
            meta: isProfit ? "Profit" : "Loss",
            point: {
              time: now,
              value: finalBookValue,
            },
          },
          {
            series: "ODDS",
            meta: favOdds === odds1 - 1 ? "Fav" : "Away",
            point: { time: now, value: favOdds },
          },
          {
            series: "ONE",
            meta: "One",
            point: { time: now, value: 1 },
          },
          {
            series: "ZERO",
            point: { time: now, value: 0 },
          },
        ]);
      } catch (err) {
        console.log(err);
      }

      if (active) setTimeout(pollAll, 5000);
    }

    pollAll();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          marginBottom: "10px",
          paddingLeft: "20px",
        }}
      >
        <div>
          <h3>Profit/Loss:</h3>
          <p>{latestPLs[0]}, {latestPLs[1]}</p>
        </div>
        <div>
          <h3>Odds:</h3>
          <p>{latestOdds[0]}, {latestOdds[1]}</p>
        </div>
      </div>
        <div style={{ width: "97%",margin:'0 auto',boxShadow  :'0 0 10px rgba(0,0,0,0.1)',borderRadius:'8px',padding:'10px',backgroundColor:'white'}}>
            <MultiLineChart newPoints={newPoints} />
        </div>
     

      <div
        style={{
          display: "flex",
          gap: "10px",
          paddingLeft: "20px",
          alignItems: "center",
        }}
      >
        <h4>Book Value: {bookValue.toFixed(2)}</h4>

        <h4>Home</h4>
        <div
          style={{
            height: "20px",
            width: "20px",
            backgroundColor: "rgba(247, 239, 15, 0.67)",
            borderRadius: "50%",
          }}
        />

        <h4>Away</h4>
        <div
          style={{
            height: "20px",
            width: "20px",
            backgroundColor: "rgba(77, 32, 225, 0.87)",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
};

export default CombinedChart;
