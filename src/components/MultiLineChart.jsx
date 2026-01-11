// import React, { useEffect, useRef, memo } from "react";
// import { createChart, CrosshairMode } from "lightweight-charts";

// const MultiLineChart = ({ newPoints = [] }) => {
//   const chartContainerRef = useRef();
//   const chartRef = useRef();
//   const seriesRefs = useRef({});

//   useEffect(() => {
//     chartRef.current = createChart(chartContainerRef.current, {
//       width: (window.innerWidth / 100) * 88,
//       height: 450,
//       layout: { background: { color: "transparent" } },
//       rightPriceScale: { visible: true, borderVisible: false, minValue: 2},
//       leftPriceScale: { visible: false,minValue: 2 },
//       watermark: {
//         visible: true,
//         text: "Botfather",
//         color: "rgba(217, 222, 220, 1)",
//         fontSize: 24,
//         horzAlign: "center",
//         vertAlign: "center",
//       },
//       crosshair: { mode: CrosshairMode.Normal },
//       timeScale: { timeVisible: true, secondsVisible: true, barSpacing: 10, rightOffset: 2 },
//     });

//     return () => {
//       if (chartRef.current) chartRef.current.remove();
//     };
//   }, []);

//   // Append new points via update
//   useEffect(() => {
//     if (!newPoints || newPoints.length === 0) return;

//     newPoints.forEach(({ series, point }) => {
//       if (!seriesRefs.current[series]) {
//         seriesRefs.current[series] = chartRef.current.addLineSeries({
//         //   color: series === "Profit/Loss" ? "rgba(78, 181, 141, 0.67)" : "rgba(255, 99, 132, 0.67)",
//            color:
//           series === "Profit"
//             ? "rgba(78, 181, 141, 0.67)"
//             : series === "Loss" 
//             ? "rgba(255, 99, 132, 0.67)"
//             : series === "Odds"
//             ? "rgba(247, 239, 15, 0.67)"
//             : series === "AwayOdds"
//             ? "rgba(77, 32, 225, 0.87)"
//             : series === "1"
//             ? "black"   // <-- fixed horizontal line
//             : "gray",
//           lastPriceAnimation: 2,
//           autoScale: false,
//         });
//       }

//       seriesRefs.current[series].update(point);
//     });
//   }, [newPoints]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default memo(MultiLineChart);






// // import React, { useEffect, useRef, memo } from "react";
// // import { createChart, CrosshairMode } from "lightweight-charts";

// // const MultiLineChart = ({ newPoints = [] }) => {
// //   const chartContainerRef = useRef();
// //   const chartRef = useRef();
// //   const seriesRefs = useRef({});
// //   const seriesDataRefs = useRef({}); // store full data arrays for each series
// //   const axisLinesRef = useRef([]);

// //   useEffect(() => {
// //     chartRef.current = createChart(chartContainerRef.current, {
// //       width: (window.innerWidth / 100) * 88,
// //       height: 450,
// //       layout: { background: { color: "transparent" } },
// //       rightPriceScale: { visible: true, borderVisible: false },
// //       leftPriceScale: { visible: false },
// //       watermark: {
// //         visible: true,
// //         text: "Botfather",
// //         color: "rgba(217, 222, 220, 1)",
// //         fontSize: 24,
// //         horzAlign: "center",
// //         vertAlign: "center",
// //       },
// //       crosshair: { mode: CrosshairMode.Normal },
// //       timeScale: { timeVisible: true, secondsVisible: true, barSpacing: 10, rightOffset: 2 },
// //     });

// //     // Fixed horizontal line at y = 2
// //     const horizontalLine = chartRef.current.addLineSeries({
// //       color: "blue",
// //       lineWidth: 1,
// //     //   lineStyle: 2, // dashed
// //       priceLineVisible: false,
// //       crossHairMarkerVisible: false,
// //     });
// //     const now = Math.floor(Date.now() / 1000);
// //     horizontalLine.setData([
// //       { time: now - 10, value: 2 },
// //       { time: now + 10, value: 2 },
// //     ]);
// //     axisLinesRef.current.push(horizontalLine);

// //     return () => {
// //       if (chartRef.current) chartRef.current.remove();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (!newPoints || newPoints.length === 0) return;

// //     newPoints.forEach(({ series, point }) => {
// //       if (!seriesRefs.current[series]) {
// //         seriesRefs.current[series] = chartRef.current.addLineSeries({
// //           color: series === "Profit/Loss" ? "rgba(78, 181, 141, 0.67)" : "rgba(255, 99, 132, 0.67)",
// //           lastPriceAnimation: 2,
// //           autoScale: true,
// //         });
// //         seriesDataRefs.current[series] = [];
// //       }

// //       // Append new point to the full series data
// //       seriesDataRefs.current[series].push(point);

// //       // Make sure data is sorted by time ascending
// //       seriesDataRefs.current[series].sort((a, b) => a.time - b.time);

// //       // Update the series with full data
// //       seriesRefs.current[series].setData(seriesDataRefs.current[series]);
// //     });
// //   }, [newPoints]);

// //   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// // };

// // export default memo(MultiLineChart);




import React, { useEffect, useRef, memo } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

const COLOR_MAP = {
  Profit: "rgba(78, 181, 141, 0.67)",
  Loss: "rgba(255, 99, 132, 0.67)",
  Fav: "rgba(247, 239, 15, 0.67)",
  Away: "rgba(77, 32, 225, 0.87)",
  One: "black",
};

const MultiLineChart = ({ newPoints = [] }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRefs = useRef({});
  const lastColorRef = useRef({});

  // 1️⃣ Chart init
  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: (window.innerWidth / 100) * 95,
      height: 450,
      layout: { background: { color: "transparent" } },
      rightPriceScale: { visible: true, borderVisible: false },
      leftPriceScale: { visible: false },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        barSpacing: 10,
        rightOffset: 2,
      },
    });

    return () => chartRef.current?.remove();
  }, []);

  // 2️⃣ Stream updates
  useEffect(() => {
    if (!newPoints.length || !chartRef.current) return;

    newPoints.forEach(({ series, point, meta }) => {
      // Create series ONCE
      if (!seriesRefs.current[series]) {
        seriesRefs.current[series] = chartRef.current.addLineSeries({
          color: "gray",
          lineWidth: series === "PL" || series === "ODDS" ? 2 : 1,
          lastPriceAnimation: 2,
          autoScale: true,
        });
      }

      const s = seriesRefs.current[series];

      // 🔁 Dynamic color (only when meta present)
      if (meta && COLOR_MAP[meta]) {
        const nextColor = COLOR_MAP[meta];

        if (lastColorRef.current[series] !== nextColor) {
          s.applyOptions({ color: nextColor });
          lastColorRef.current[series] = nextColor;
        }
      }

      // Update point (NO new lines)
      s.update(point);
    });
  }, [newPoints]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "750px", height: "450px" }}
    />
  );
};

export default memo(MultiLineChart);
