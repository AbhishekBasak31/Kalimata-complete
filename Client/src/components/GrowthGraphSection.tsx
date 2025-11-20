import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartDataset,
  Chart
} from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GrowthGraph: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<Chart<"bar" | "line", number[], unknown> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setRenderKey((prev) => prev + 1);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, []);

  // --- Fixed data provided ---
// ✅ REVERSED DATA ORDER
const raw = [
  { label: "2016–2017", value: -17.14 },
  { label: "2017–2018", value: 49.49 },
  { label: "2018–2019", value: 53.50 },
  { label: "2019–2020", value: 14.16 },
  { label: "2020–2021", value: -9.61 },
  { label: "2021–2022", value: 59.28 },
  { label: "2022–2023", value: 3.33 },
  { label: "2023–2024", value: 17.78 },
  { label: "2024–2025", value: 8.90 },
];

const labels = raw.map((r) => r.label);
const dataPoints = raw.map((r) => r.value);


  const primaryColor = "#f97316"; // tailwind orange-500
  const negativeColor = "#ef4444"; // tailwind red-500

  const barColors = dataPoints.map((v) => (v >= 0 ? primaryColor : negativeColor));

  const maxVal = Math.max(...dataPoints, 0);
  const minVal = Math.min(...dataPoints, 0);
  const pad = 5; // % padding on y-axis

  const data: { labels: string[]; datasets: ChartDataset<"bar" | "line", number[]>[] } = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Growth",
        data: dataPoints,
        backgroundColor: barColors,
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        type: "line",
        label: "Trend",
        data: dataPoints,
        borderColor: primaryColor,
        backgroundColor: primaryColor + "33",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
        pointBorderColor: primaryColor,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: isVisible
      ? {
          duration: 2000,
          easing: "easeOutQuart",
          delay: (context) => {
            if (context.type === "data" && context.dataset.type === "bar") {
              return context.dataIndex * 120;
            }
            if (context.type === "data" && context.dataset.type === "line") {
              return 120 * dataPoints.length + context.dataIndex * 40;
            }
            return 0;
          },
        }
      : false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#1f2937", font: { size: 12 } },
        border: { color: "#00000022" },
      },
      y: {
        min: Math.floor((Math.min(minVal, 0) - pad) * 1) / 1,
        max: Math.ceil((Math.max(maxVal, 0) + pad) * 1) / 1,
        grid: { display: false },
        ticks: {
          color: "#1f2937",
          font: { size: 12 },
          callback: (value) => `${value}%`,
        },
        border: { color: "#00000022" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        padding: 8,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const v = typeof ctx.parsed.y === "number" ? ctx.parsed.y : 0;
            return `${ctx.dataset.label}: ${v.toFixed(2)}%`;
          },
        },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  return (
    <section className="w-full mx-auto py-6 md:py-8 px-4 bg-gray-100 text-gray-900">
      {/* Header — matches AboutSection text design */}
      <div
        className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          Our <span className="text-primary">Growth Journey</span>
        </h2>
        <div className="mt-2 w-16 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-gray-700 mt-3 text-sm md:text-base max-w-2xl mx-auto">
          A timeline of consistent progress and innovation.
        </p>
      </div>

      <div
        ref={divRef}
        className={`w-full flex justify-center transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full md:w-4/5 lg:w-3/5">
          <div
            key={renderKey}
            className="bg-gray-100 rounded-2xl p-4 transition-all duration-500"
            style={{ aspectRatio: "2 / 1" }}
          >
            <ReactChart
              ref={chartRef}
              type="bar"
              data={data}
              options={options}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthGraph;
