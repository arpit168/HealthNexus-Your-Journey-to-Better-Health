import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Zap, TrendingUp, Percent, Calendar } from "lucide-react";
import { sustainabilityService } from "../../../Services/sustainabilityService";

const CompoundingRate = () => {
  const [compoundingData, setCompoundingData] = useState([]);
  const [todayImprovement, setTodayImprovement] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompoundingData();
  }, []);

  const loadCompoundingData = async () => {
    try {
      const response = await sustainabilityService.getSustainabilityData();
      if (response?.data?.compoundingRate?.length > 0) {
        setCompoundingData(response.data.compoundingRate);
      }
    } catch (error) {
      console.error("Failed to load compounding data", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompoundingEffect = () => {
    if (compoundingData.length === 0)
      return { total: 0, perDay: 0, projected90: 0, projected365: 0 };

    const latest = compoundingData[compoundingData.length - 1];
    const firstWeek = compoundingData[0];
    const avgDailyRate =
      compoundingData.reduce((sum, d) => sum + d.dailyImprovement, 0) /
      compoundingData.length;

    // Project future gains
    const current = latest.totalValue;
    const projected90 = current * Math.pow(1 + avgDailyRate / 100, 90);
    const projected365 = current * Math.pow(1 + avgDailyRate / 100, 365);

    return {
      total: latest.cumulativeGain,
      perDay: avgDailyRate,
      projected90:
        Math.round(((projected90 - current) / current) * 100 * 10) / 10,
      projected365:
        Math.round(((projected365 - current) / current) * 100 * 10) / 10,
    };
  };

  const getCompoundingLevel = (totalGain) => {
    if (totalGain >= 50)
      return {
        level: "Exceptional Growth",
        color: "green",
        emoji: "🚀",
        description: "1% daily adds up fast!",
      };
    if (totalGain >= 30)
      return {
        level: "Strong Compounding",
        color: "blue",
        emoji: "📈",
        description: "Consistency is paying off!",
      };
    if (totalGain >= 15)
      return {
        level: "Good Progress",
        color: "yellow",
        emoji: "⚡",
        description: "Keep the momentum going!",
      };
    if (totalGain >= 5)
      return {
        level: "Starting to Compound",
        color: "orange",
        emoji: "🌱",
        description: "Small steps, big results!",
      };
    return {
      level: "Building Foundation",
      color: "gray",
      emoji: "🔨",
      description: "Every journey starts here!",
    };
  };

  const simulateFutureGrowth = (improvement) => {
    const current = 100;
    const days30 = current * Math.pow(1 + improvement / 100, 30) - current;
    const days90 = current * Math.pow(1 + improvement / 100, 90) - current;
    const days365 = current * Math.pow(1 + improvement / 100, 365) - current;

    return {
      days30: Math.round(days30 * 10) / 10,
      days90: Math.round(days90 * 10) / 10,
      days365: Math.round(days365 * 10) / 10,
    };
  };

  const stats = calculateCompoundingEffect();
  const status = getCompoundingLevel(stats.total);
  const simulation = simulateFutureGrowth(todayImprovement);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Compounding Effect */}
      <div
        className={`bg-linear-to-br from-${status.color}-50 to-${status.color}-100 rounded-xl p-6 border-2 border-${status.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {status.emoji} Total Compounding Gain
            </h3>
            <p className="text-5xl font-bold text-gray-900">+{stats.total}%</p>
            <p
              className={`text-lg font-semibold text-${status.color}-700 mt-2`}
            >
              {status.level}
            </p>
            <p className="text-gray-600 mt-1">{status.description}</p>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="text-3xl font-bold text-green-600">
                +{stats.perDay}%
              </p>
              <p className="text-sm text-gray-600">Average Daily Improvement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compounding Growth Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📈 Cumulative Growth Over Time
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={compoundingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#10b981"
              fill="#d1fae5"
              strokeWidth={2}
              name="Total Fitness Value"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                +{stats.total}%
              </p>
              <p className="text-sm text-gray-600">Total Growth (90 days)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Percent className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                +{stats.perDay}%
              </p>
              <p className="text-sm text-gray-600">Avg Daily Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                +{stats.projected365}%
              </p>
              <p className="text-sm text-gray-600">Projected (1 Year)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Improvement Trends */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📊 Daily Improvement Rate
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={compoundingData.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="dailyImprovement"
              fill="#10b981"
              name="Daily Improvement %"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compounding Simulator */}
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-6">
        <h4 className="font-bold text-blue-900 mb-3">
          🧮 Compounding Effect Simulator
        </h4>
        <p className="text-sm text-blue-800 mb-4">
          See how different daily improvement rates compound over time. Even 1%
          daily improvement leads to massive gains!
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            Daily Improvement Rate: {todayImprovement}%
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={todayImprovement}
            onChange={(e) => setTodayImprovement(parseFloat(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-600">
              +{simulation.days30}%
            </p>
            <p className="text-sm text-gray-600">In 30 Days</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-2xl font-bold text-green-600">
              +{simulation.days90}%
            </p>
            <p className="text-sm text-gray-600">In 90 Days</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-600">
              +{simulation.days365}%
            </p>
            <p className="text-sm text-gray-600">In 1 Year</p>
          </div>
        </div>
      </div>

      {/* The Power of 1% */}
      <div className="bg-linear-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200 p-6">
        <h4 className="font-bold text-green-900 mb-3">
          💎 The Power of 1% Daily Improvement
        </h4>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-green-900">
              📚 The Math Behind It
            </p>
            <p className="text-sm text-green-800 mt-1">
              If you improve by 1% every day for a year: 1.01³⁶⁵ = 37.78x better
              than when you started!
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-green-900">
              🎯 How to Achieve 1% Daily
            </p>
            <ul className="text-sm text-green-800 mt-1 space-y-1">
              <li>• Add 1 more rep to your workout</li>
              <li>• Increase weight by 1-2 pounds</li>
              <li>• Walk 100 more steps than yesterday</li>
              <li>• Improve form on one exercise</li>
              <li>• Sleep 5 minutes earlier</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-green-900">
              ⚠️ The Reverse Effect
            </p>
            <p className="text-sm text-green-800 mt-1">
              Getting 1% worse each day: 0.99³⁶⁵ = 0.03 (97% decline). Small
              negative habits compound too!
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <h4 className="font-bold text-gray-800 mb-2">
          💡 Your Compounding Strategy
        </h4>
        <p className="text-gray-700">
          {stats.perDay >= 1.5 &&
            "Incredible! You're improving at an exceptional rate. This kind of consistency will transform you completely in a year."}
          {stats.perDay >= 1 &&
            stats.perDay < 1.5 &&
            "Perfect! You're hitting the 1% daily improvement sweet spot. Keep this up and you'll see exponential results."}
          {stats.perDay >= 0.5 &&
            stats.perDay < 1 &&
            "Good progress! Try to push just a bit harder each day. Small increases in effort lead to massive compounding effects."}
          {stats.perDay >= 0.2 &&
            stats.perDay < 0.5 &&
            "You're building consistency! Focus on adding one small improvement to your routine each day to boost your compounding rate."}
          {stats.perDay < 0.2 &&
            "Let's accelerate your growth! Pick one area (strength, endurance, or nutrition) and commit to improving it by 1% daily."}
        </p>
      </div>
    </div>
  );
};

export default CompoundingRate;
