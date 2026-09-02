import React, { useState, useEffect } from "react";
import { Heart, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { overtrainingService } from "../../../Services/overtrainingService";

const RecoveryRate = () => {
  const [recoveryData, setRecoveryData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecoveryData();
  }, []);

  const loadRecoveryData = async () => {
    try {
      const response = await overtrainingService.getOvertrainingData();
      if (response?.data?.fatigueMetrics?.length > 0) {
        const processed = processRecoveryMetrics(response.data.fatigueMetrics);
        setRecoveryData(processed);
      }
    } catch (error) {
      console.error("Failed to load recovery data", error);
    } finally {
      setLoading(false);
    }
  };

  const processRecoveryMetrics = (data) => {
    return data.map((entry, idx) => {
      const prevFatigue = idx > 0 ? data[idx - 1].fatigue : entry.fatigue;
      const recoveryAmount = prevFatigue - entry.fatigue;
      const recoveryPercentage = ((recoveryAmount / prevFatigue) * 100).toFixed(
        1,
      );

      return {
        date: new Date(entry.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        rawDate: entry.date,
        fatigue: entry.fatigue,
        prevFatigue: prevFatigue,
        recoveryAmount: Math.max(0, recoveryAmount),
        recoveryPercentage: Math.max(0, recoveryPercentage),
        intensity: entry.intensity,
      };
    });
  };

  const getRecoverySpeed = (percentage) => {
    const avg = (
      recoveryData.reduce(
        (sum, d) => sum + parseFloat(d.recoveryPercentage),
        0,
      ) / recoveryData.length
    ).toFixed(1);

    if (avg > 20)
      return {
        status: "Fast",
        color: "from-green-500 to-emerald-500",
        emoji: "⚡",
      };
    if (avg > 10)
      return {
        status: "Moderate",
        color: "from-blue-500 to-cyan-500",
        emoji: "✅",
      };
    return { status: "Slow", color: "from-orange-500 to-red-500", emoji: "⚠️" };
  };

  const avg =
    recoveryData.length > 0
      ? (
          recoveryData.reduce(
            (sum, d) => sum + parseFloat(d.recoveryPercentage),
            0,
          ) / recoveryData.length
        ).toFixed(1)
      : 0;

  const recoverySpeed = getRecoverySpeed(avg);
  const lastWeek = recoveryData.slice(-7);
  const weeklyAvg =
    lastWeek.length > 0
      ? (
          lastWeek.reduce(
            (sum, d) => sum + parseFloat(d.recoveryPercentage),
            0,
          ) / lastWeek.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recovery Speed Indicator */}
      <div
        className={`bg-linear-to-br ${recoverySpeed.color} rounded-2xl shadow-lg p-8 text-white`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold opacity-90">
              Average Recovery Speed
            </p>
            <h2 className="text-5xl font-bold mt-2">{avg}%</h2>
            <p className="text-xl font-semibold mt-2">
              {recoverySpeed.status} Recovery
            </p>
          </div>
          <div className="text-7xl opacity-90">{recoverySpeed.emoji}</div>
        </div>

        <p className="text-sm opacity-90">
          Daily fatigue reduction rate per day
        </p>

        {/* Speed Gauge */}
        <div className="mt-6 bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(avg * 5, 100)}%` }}
          />
        </div>
      </div>

      {/* Recovery Speed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Overall Average
          </p>
          <p className="text-3xl font-bold text-orange-600">{avg}%</p>
          <p className="text-xs text-gray-500 mt-2">All-time recovery rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Last 7 Days
          </p>
          <p className="text-3xl font-bold text-blue-600">{weeklyAvg}%</p>
          <p className="text-xs text-gray-500 mt-2">Weekly recovery rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <p className="text-sm font-semibold text-gray-600 mb-2">Best Day</p>
          <p className="text-3xl font-bold text-green-600">
            {Math.max(
              ...recoveryData.map((d) => parseFloat(d.recoveryPercentage)),
            )}
            %
          </p>
          <p className="text-xs text-gray-500 mt-2">Peak recovery day</p>
        </div>
      </div>

      {/* Recovery Rate Trend */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Recovery Rate Over Time
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={recoveryData.slice(-14)}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="recoveryPercentage"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", r: 4 }}
              name="Recovery Rate %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recovery Factors */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🔍 Factors Affecting Recovery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-900">
              ✅ Improves Recovery Speed
            </p>
            <ul className="text-sm text-green-800 mt-2 space-y-1">
              <li>✓ Quality sleep (8+ hours)</li>
              <li>✓ Proper hydration</li>
              <li>✓ Active recovery days</li>
              <li>✓ Adequate nutrition</li>
              <li>✓ Stress management</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-bold text-red-900">❌ Slows Recovery Speed</p>
            <ul className="text-sm text-red-800 mt-2 space-y-1">
              <li>✗ Sleep deprivation</li>
              <li>✗ High stress levels</li>
              <li>✗ Poor nutrition</li>
              <li>✗ Dehydration</li>
              <li>✗ Consecutive intense workouts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recovery Time Estimates */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <h4 className="font-bold text-purple-900 mb-3">
          ⏱️ Recovery Time Estimates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold text-purple-900">
              Fast Recovery ({">"}20%)
            </p>
            <p className="text-sm text-purple-800">
              Ready for intense training in 24-36 hours
            </p>
          </div>
          <div>
            <p className="font-semibold text-purple-900">
              Moderate Recovery (10-20%)
            </p>
            <p className="text-sm text-purple-800">
              Ready for intense training in 36-48 hours
            </p>
          </div>
          <div>
            <p className="font-semibold text-purple-900">
              Slow Recovery ({"<"}10%)
            </p>
            <p className="text-sm text-purple-800">
              Need 48-72 hours for full recovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryRate;
