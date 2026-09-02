import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Target, Plus, CheckCircle, TrendingUp } from "lucide-react";
import { sustainabilityService } from "../../../Services/sustainabilityService";

const MicroAdjustmentCount = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [newAdjustment, setNewAdjustment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("nutrition");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdjustments();
  }, []);

  const loadAdjustments = async () => {
    try {
      const response = await sustainabilityService.getSustainabilityData();
      if (response?.data?.microAdjustments) {
        // Sort descending by timestamp
        const data = response.data.microAdjustments.sort(
          (a, b) => b.timestamp - a.timestamp,
        );
        setAdjustments(data);
      }
    } catch (error) {
      console.error("Failed to load micro-adjustments", error);
    } finally {
      setLoading(false);
    }
  };

  const addAdjustment = async () => {
    if (!newAdjustment.trim()) return;

    const adjustment = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      category: selectedCategory,
      description: newAdjustment,
      impact: 3, // Default medium impact
      timestamp: Date.now(),
    };

    const updated = [adjustment, ...adjustments];
    setAdjustments(updated);
    setNewAdjustment("");

    try {
      await sustainabilityService.updateSustainabilityData({
        microAdjustments: updated,
      });
    } catch (error) {
      console.error("Failed to save micro-adjustment", error);
    }
  };

  const calculateStats = () => {
    const today = new Date();
    const last7Days = adjustments.filter((a) => {
      const adjDate = new Date(a.date);
      const diffDays = Math.floor((today - adjDate) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    const last30Days = adjustments.filter((a) => {
      const adjDate = new Date(a.date);
      const diffDays = Math.floor((today - adjDate) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });

    const totalCount = adjustments.length;
    const weeklyAvg = last7Days.length / 7;
    const monthlyAvg = last30Days.length / 30;

    // Category breakdown
    const categoryCount = {};
    adjustments.forEach((a) => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
    });

    return {
      total: totalCount,
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      weeklyAvg: Math.round(weeklyAvg * 10) / 10,
      monthlyAvg: Math.round(monthlyAvg * 10) / 10,
      categoryCount,
    };
  };

  const getWeeklyTrend = () => {
    const weeks = {};
    const today = new Date();

    adjustments.forEach((adj) => {
      const adjDate = new Date(adj.date);
      const diffDays = Math.floor((today - adjDate) / (1000 * 60 * 60 * 24));
      const weekNum = Math.floor(diffDays / 7);

      if (weekNum < 8) {
        const weekKey = `Week ${8 - weekNum}`;
        weeks[weekKey] = (weeks[weekKey] || 0) + 1;
      }
    });

    return Object.entries(weeks)
      .map(([week, count]) => ({ week, count }))
      .reverse();
  };

  const getCategoryData = (categoryCount) => {
    const categories = [
      { name: "Nutrition", key: "nutrition", color: "#10b981" },
      { name: "Workout", key: "workout", color: "#3b82f6" },
      { name: "Sleep", key: "sleep", color: "#8b5cf6" },
      { name: "Mindset", key: "mindset", color: "#f59e0b" },
      { name: "Recovery", key: "recovery", color: "#ef4444" },
    ];

    return categories.map((cat) => ({
      name: cat.name,
      value: categoryCount[cat.key] || 0,
      color: cat.color,
    }));
  };

  const getAdjustmentLevel = (weeklyAvg) => {
    if (weeklyAvg >= 5)
      return {
        level: "Micro-Master",
        color: "green",
        emoji: "🏆",
        description: "Excellent tiny changes!",
      };
    if (weeklyAvg >= 3)
      return {
        level: "Adjustment Pro",
        color: "blue",
        emoji: "🎯",
        description: "Great consistency!",
      };
    if (weeklyAvg >= 2)
      return {
        level: "Making Progress",
        color: "yellow",
        emoji: "⚡",
        description: "Keep it up!",
      };
    if (weeklyAvg >= 1)
      return {
        level: "Getting Started",
        color: "orange",
        emoji: "🌱",
        description: "Good start!",
      };
    return {
      level: "Begin Journey",
      color: "gray",
      emoji: "🔨",
      description: "Every small step counts!",
    };
  };

  const stats = calculateStats();
  const weeklyTrend = getWeeklyTrend();
  const categoryData = getCategoryData(stats.categoryCount);
  const status = getAdjustmentLevel(stats.weeklyAvg);

  const categories = [
    { id: "nutrition", name: "🥗 Nutrition", color: "green" },
    { id: "workout", name: "💪 Workout", color: "blue" },
    { id: "sleep", name: "😴 Sleep", color: "purple" },
    { id: "mindset", name: "🧠 Mindset", color: "yellow" },
    { id: "recovery", name: "🔄 Recovery", color: "red" },
  ];

  return (
    <div className="space-y-6">
      {/* Current Stats Header */}
      <div
        className={`bg-linear-to-br from-${status.color}-50 to-${status.color}-100 rounded-xl p-6 border-2 border-${status.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {status.emoji} Total Micro-Adjustments
            </h3>
            <p className="text-5xl font-bold text-gray-900">{stats.total}</p>
            <p
              className={`text-lg font-semibold text-${status.color}-700 mt-2`}
            >
              {status.level}
            </p>
            <p className="text-gray-600 mt-1">{status.description}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-3xl font-bold text-blue-600">
                {stats.weeklyAvg}
              </p>
              <p className="text-sm text-gray-600">Per Day (7-day avg)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.last7Days}
              </p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Adjustment */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          ➕ Log Today's Micro-Adjustment
        </h4>

        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? `bg-${cat.color}-500 text-white`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newAdjustment}
            onChange={(e) => setNewAdjustment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addAdjustment()}
            placeholder="What tiny change did you make today?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={addAdjustment}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          💡 Examples: "Added 1 more rep", "Drank 1 extra glass of water",
          "Slept 10 min earlier"
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Adjustments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.last7Days}
              </p>
              <p className="text-sm text-gray-600">Last 7 Days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.last30Days}
              </p>
              <p className="text-sm text-gray-600">Last 30 Days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.weeklyAvg}
              </p>
              <p className="text-sm text-gray-600">Daily Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📊 8-Week Adjustment Trend
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="#10b981" name="Adjustments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-800 mb-4">
            🎯 Category Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-800 mb-4">
            📝 Recent Adjustments
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {adjustments.slice(0, 10).map((adj) => (
              <div
                key={adj.id}
                className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <CheckCircle className="text-green-500 mt-1" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {adj.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {categories.find((c) => c.id === adj.category)?.name} •{" "}
                    {new Date(adj.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Micro-Adjustment Philosophy */}
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-6">
        <h4 className="font-bold text-blue-900 mb-3">
          🧠 The Philosophy of Micro-Adjustments
        </h4>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-blue-900">Why Tiny Changes Work</p>
            <p className="text-sm text-blue-800 mt-1">
              Big transformations come from tiny, consistent improvements.
              Instead of overwhelming yourself with massive changes, focus on
              1-3 micro-adjustments daily. They're easy to do, hard to fail at,
              and compound over time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-blue-900 text-sm">
                🥗 Nutrition Examples
              </p>
              <ul className="text-xs text-blue-800 mt-1 space-y-1">
                <li>• Add 1 serving of vegetables</li>
                <li>• Drink 1 more glass of water</li>
                <li>• Reduce portion by 10%</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-blue-900 text-sm">
                💪 Workout Examples
              </p>
              <ul className="text-xs text-blue-800 mt-1 space-y-1">
                <li>• Add 1 more rep per set</li>
                <li>• Increase weight by 2-5 lbs</li>
                <li>• Hold plank 5 seconds longer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <h4 className="font-bold text-gray-800 mb-2">
          💡 Your Micro-Adjustment Strategy
        </h4>
        <p className="text-gray-700">
          {stats.weeklyAvg >= 5 &&
            "Amazing! You're making multiple tiny improvements daily. This consistent approach will lead to massive long-term results."}
          {stats.weeklyAvg >= 3 &&
            stats.weeklyAvg < 5 &&
            "Great job! You're building the habit of continuous improvement. Try to maintain at least 3 adjustments per day."}
          {stats.weeklyAvg >= 2 &&
            stats.weeklyAvg < 3 &&
            "Good progress! Challenge yourself to find one more tiny improvement each day. Start with the easiest categories first."}
          {stats.weeklyAvg >= 1 &&
            stats.weeklyAvg < 2 &&
            "You're on the right track! Focus on making at least 2-3 micro-adjustments daily. They should be so small they feel effortless."}
          {stats.weeklyAvg < 1 &&
            "Let's build momentum! Start with just one tiny change per day. Pick the easiest category and make it a habit before adding more."}
        </p>
      </div>
    </div>
  );
};

export default MicroAdjustmentCount;
