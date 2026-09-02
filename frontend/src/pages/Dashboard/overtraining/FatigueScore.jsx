import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Zap } from "lucide-react";
import { overtrainingService } from "../../../Services/overtrainingService";

const FatigueScore = () => {
  const [fatigueData, setFatigueData] = useState([]);
  const [currentFatigue, setCurrentFatigue] = useState(0);
  const [timeRange, setTimeRange] = useState("7days");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFatigueData();
  }, []);

  const loadFatigueData = async () => {
    try {
      const response = await overtrainingService.getOvertrainingData();
      if (response?.data?.fatigueMetrics?.length > 0) {
        const data = response.data.fatigueMetrics;
        setFatigueData(data);
        setCurrentFatigue(data[data.length - 1].fatigue);
      }
    } catch (error) {
      console.error("Failed to load fatigue data", error);
    } finally {
      setLoading(false);
    }
  };

  const addFatigueEntry = async () => {
    const today = new Date().toISOString().split("T")[0];
    const newEntry = {
      date: today,
      fatigue: Math.floor(Math.random() * 70) + 20,
      intensity: Math.floor(Math.random() * 100),
      recovery: Math.floor(Math.random() * 80) + 20,
    };

    const existingIndex = fatigueData.findIndex((d) => d.date === today);
    let updated = fatigueData;

    if (existingIndex !== -1) {
      updated[existingIndex] = newEntry;
    } else {
      updated = [...fatigueData, newEntry];
    }

    setFatigueData(updated);
    setCurrentFatigue(newEntry.fatigue);

    try {
      await overtrainingService.updateOvertrainingData({
        fatigueMetrics: updated,
      });
    } catch (error) {
      console.error("Failed to save fatigue metrics", error);
    }
  };

  const getFilteredData = () => {
    const daysToShow =
      timeRange === "7days" ? 7 : timeRange === "14days" ? 14 : 30;
    return fatigueData.slice(-daysToShow);
  };

  const getFatigueLevel = (fatigue) => {
    if (fatigue > 85)
      return {
        status: "Critical",
        color: "from-red-500 to-pink-500",
        emoji: "🚨",
      };
    if (fatigue > 70)
      return {
        status: "High",
        color: "from-orange-500 to-red-500",
        emoji: "⚠️",
      };
    if (fatigue > 50)
      return {
        status: "Moderate",
        color: "from-yellow-500 to-orange-500",
        emoji: "😐",
      };
    if (fatigue > 30)
      return {
        status: "Low",
        color: "from-green-500 to-lime-500",
        emoji: "✅",
      };
    return {
      status: "Fresh",
      color: "from-cyan-500 to-green-500",
      emoji: "⚡",
    };
  };

  const chartData = getFilteredData().map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    fatigue: d.fatigue,
    intensity: d.intensity,
    recovery: d.recovery,
  }));

  const fatigueLevel = getFatigueLevel(currentFatigue);
  const avgFatigue =
    fatigueData.length > 0
      ? (
          fatigueData.reduce((sum, d) => sum + d.fatigue, 0) /
          fatigueData.length
        ).toFixed(1)
      : 0;
  const maxFatigue =
    fatigueData.length > 0 ? Math.max(...fatigueData.map((d) => d.fatigue)) : 0;
  const minFatigue =
    fatigueData.length > 0 ? Math.min(...fatigueData.map((d) => d.fatigue)) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Fatigue Score */}
      <div
        className={`bg-linear-to-br ${fatigueLevel.color} rounded-2xl shadow-lg p-8 text-white`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold opacity-90">
              Today's Fatigue Score
            </p>
            <h2 className="text-6xl font-bold mt-2">{currentFatigue}</h2>
            <p className="text-xl font-semibold mt-2">{fatigueLevel.status}</p>
          </div>
          <div className="text-7xl opacity-90">{fatigueLevel.emoji}</div>
        </div>

        {/* Progress Ring */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${currentFatigue}%` }}
          />
        </div>

        <p className="text-xs opacity-90 mt-2">
          0 = Fresh | 100 = Extremely Fatigued
        </p>
      </div>

      {/* Quick Actions */}
      <button
        onClick={addFatigueEntry}
        className="w-full bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Log Today's Fatigue
      </button>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {["7days", "14days", "30days"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              timeRange === range
                ? "bg-linear-to-r from-orange-600 to-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {range === "7days"
              ? "7 Days"
              : range === "14days"
                ? "14 Days"
                : "30 Days"}
          </button>
        ))}
      </div>

      {/* Fatigue Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Fatigue Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <ReferenceLine
              y={50}
              stroke="#fbbf24"
              strokeDasharray="5 5"
              label="Safe Threshold"
            />
            <ReferenceLine
              y={70}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label="Warning"
            />

            <Line
              type="monotone"
              dataKey="fatigue"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: "#f97316", r: 4 }}
              name="Fatigue Level"
            />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#3b82f6"
              strokeWidth={2}
              opacity={0.6}
              name="Workout Intensity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Average Fatigue
          </p>
          <p className="text-3xl font-bold text-orange-600">{avgFatigue}</p>
          <p className="text-xs text-gray-500 mt-2">
            Last{" "}
            {timeRange === "7days" ? "7" : timeRange === "14days" ? "14" : "30"}{" "}
            days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Highest Fatigue
          </p>
          <p className="text-3xl font-bold text-red-600">{maxFatigue}</p>
          <p className="text-xs text-gray-500 mt-2">Peak fatigue level</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Lowest Fatigue
          </p>
          <p className="text-3xl font-bold text-green-600">{minFatigue}</p>
          <p className="text-xs text-gray-500 mt-2">Best recovery day</p>
        </div>
      </div>

      {/* Recommendations */}
      <div
        className={`bg-linear-to-r ${currentFatigue > 70 ? "from-red-50 to-orange-50 border-red-200" : "from-blue-50 to-cyan-50 border-blue-200"} rounded-xl border-2 p-6`}
      >
        <h4
          className={`font-bold ${currentFatigue > 70 ? "text-red-900" : "text-blue-900"} mb-3`}
        >
          💡 Today's Recommendation
        </h4>
        <p
          className={`text-sm ${currentFatigue > 70 ? "text-red-800" : "text-blue-800"}`}
        >
          {currentFatigue > 85
            ? "🚨 CRITICAL: Take a rest day today. Severe fatigue detected. Consider consulting a healthcare professional."
            : currentFatigue > 70
              ? "⚠️ HIGH FATIGUE: Reduce workout intensity by 30-40%. Focus on recovery and light activities."
              : currentFatigue > 50
                ? "😐 MODERATE: Moderate fatigue. You can train, but monitor your form and avoid heavy lifts."
                : "✅ LOW FATIGUE: You're well-recovered! Great day for high-intensity training."}
        </p>
      </div>
    </div>
  );
};

export default FatigueScore;
