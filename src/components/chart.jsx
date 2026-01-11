import React, { useEffect, useRef, memo } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

const MultiLineChart = ({ seriesData = [] }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRefs = useRef({});

  // Initialize chart once
  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: (window.innerWidth / 100) * 88,
      height: 450,
      layout: { background: { color: "transparent" } },
      rightPriceScale: { visible: true, borderVisible: false },
      leftPriceScale: { visible: false },
      watermark: {
        visible: true,
        text: "Botfather",
        color: "rgba(217, 222, 220, 1)",
        fontSize: 24,
        horzAlign: "center",
        vertAlign: "center",
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { timeVisible: true, secondsVisible: true, barSpacing: 10, rightOffset: 2 },
    });

    return () => {
      if (chartRef.current) chartRef.current.remove();
    };
  }, []);

  // Append new points using .update()
  useEffect(() => {
    if (!seriesData || seriesData.length === 0) return;

    seriesData.forEach((s, idx) => {
      // create line series if not exist
      if (!seriesRefs.current[s.name]) {
        seriesRefs.current[s.name] = chartRef.current.addLineSeries({
          color: s.color || (idx === 0 ? "rgba(78, 181, 141, 0.67)" : "rgba(255, 99, 132, 0.67)"),
          lastPriceAnimation: 1,
          autoScale: true,
        });
      }

      // append new points
      s.data.forEach(point => {
        seriesRefs.current[s.name].update({
          time: point.time,
          value: point.value
        });
      });
    });
  }, [seriesData]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
};

export default memo(MultiLineChart);
