import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Download, Maximize2, Minimize2, Loader } from "lucide-react";

export default function ReportCharts({
  chartData,
  chartTypes = ["line", "bar"],
  height = 400,
  onExport,
}) {
  const [selectedChart, setSelectedChart] = useState("weight");
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setAnimateChart(true);
  }, [selectedChart]);

  // Mock data for different charts
  const weightData = [
    { day: "Day 1", weight: 78.5 },
    { day: "Day 3", weight: 78.2 },
    { day: "Day 5", weight: 77.9 },
    { day: "Day 7", weight: 77.6 },
    { day: "Day 10", weight: 77.2 },
    { day: "Day 14", weight: 76.8 },
    { day: "Day 18", weight: 76.5 },
    { day: "Day 21", weight: 76.1 },
  ];

  const calorieData = [
    { day: "Mon", target: 2000, actual: 2050 },
    { day: "Tue", target: 2000, actual: 1950 },
    { day: "Wed", target: 2000, actual: 2020 },
    { day: "Thu", target: 2000, actual: 2000 },
    { day: "Fri", target: 2000, actual: 1980 },
    { day: "Sat", target: 2200, actual: 2300 },
    { day: "Sun", target: 2200, actual: 2100 },
  ];

  const macroData = [
    { name: "Protein", value: 40, fill: "#ff6b6b" },
    { name: "Carbs", value: 35, fill: "#4ecdc4" },
    { name: "Fats", value: 25, fill: "#95e1d3" },
  ];

  const habitScoreData = [
    { week: "Week 1", score: 78 },
    { week: "Week 2", score: 82 },
    { week: "Week 3", score: 85 },
    { week: "Week 4", score: 87 },
  ];

  const workoutVolumeData = [
    { week: "Week 1", volume: 25 },
    { week: "Week 2", volume: 28 },
    { week: "Week 3", volume: 32 },
    { week: "Week 4", volume: 35 },
  ];

  const chartContent = {
    weight: (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={weightData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="day" stroke="#888" />
          <YAxis stroke="#888" domain={[75, 79]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "2px solid #00d4ff",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#00d4ff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            isAnimationActive={animateChart}
          />
        </AreaChart>
      </ResponsiveContainer>
    ),
    calories: (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={calorieData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="day" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "2px solid #ff6b6b",
              borderRadius: "8px",
            }}
            cursor={{ fill: "rgba(255, 107, 107, 0.1)" }}
          />
          <Legend />
          <Bar
            dataKey="target"
            fill="#4ecdc4"
            name="Target"
            isAnimationActive={animateChart}
            radius={[8, 8, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ff6b6b"
            strokeWidth={3}
            name="Actual"
            isAnimationActive={animateChart}
          />
        </ComposedChart>
      </ResponsiveContainer>
    ),
    macros: (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={macroData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} ${value}%`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    ),
    habits: (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={habitScoreData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorHabit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="week" stroke="#888" />
          <YAxis stroke="#888" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "2px solid #00ff88",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#00ff88"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorHabit)"
            isAnimationActive={animateChart}
          />
        </AreaChart>
      </ResponsiveContainer>
    ),
  };

  const Chart = ({ full = false }) => (
    <div
      className={`${full ? "w-full h-screen bg-gray-950" : "bg-gray-900 border border-gray-700 rounded-lg p-6"}`}
    >
      {chartContent[selectedChart] || chartContent.weight}
    </div>
  );

  return (
    <div
      className={`space-y-6 ${fullscreen ? "fixed inset-0 bg-black z-50 p-6 overflow-auto" : ""}`}
    >
      {/* Chart Selector */}
      <div className="flex flex-wrap gap-2">
        {["weight", "calories", "macros", "habits"].map((chart) => (
          <button
            key={chart}
            onClick={() => {
              setLoading(true);
              setSelectedChart(chart);
              setTimeout(() => setLoading(false), 300);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 duration-200 ${
              selectedChart === chart
                ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {chart === "macros"
              ? "Macro Split"
              : chart.charAt(0).toUpperCase() + chart.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div
        className={`relative transition-all duration-300 ${fullscreen ? "w-full h-screen flex flex-col" : ""}`}
      >
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-blue-400 transition transform hover:scale-110 duration-200"
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={onExport}
            className="p-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white transition transform hover:scale-110 duration-200"
            title="Download chart"
          >
            <Download size={18} />
          </button>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-20">
            <Loader className="animate-spin text-blue-400" size={32} />
          </div>
        )}

        <div
          className={`bg-gray-900 border border-gray-700 rounded-lg p-6 transition-all duration-300 ${fullscreen ? "flex-1" : ""}`}
        >
          {chartContent[selectedChart] || chartContent.weight}
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
        <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105">
          <p className="text-gray-400 text-sm font-medium">Starting Weight</p>
          <p className="text-white text-3xl font-bold mt-2">78.5 kg</p>
          <p className="text-gray-500 text-xs mt-2">Initial measurement</p>
        </div>
        <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105">
          <p className="text-gray-400 text-sm font-medium">Current Weight</p>
          <p className="text-white text-3xl font-bold mt-2">76.1 kg</p>
          <p className="text-gray-500 text-xs mt-2">Latest measurement</p>
        </div>
        <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105">
          <p className="text-gray-400 text-sm font-medium">Total Change</p>
          <p className="text-green-400 text-3xl font-bold mt-2">-2.4 kg</p>
          <p className="text-gray-500 text-xs mt-2">Progress achieved</p>
        </div>
        <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105">
          <p className="text-gray-400 text-sm font-medium">Weekly Rate</p>
          <p className="text-blue-400 text-3xl font-bold mt-2">-0.57 kg</p>
          <p className="text-gray-500 text-xs mt-2">Sustainable pace</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
