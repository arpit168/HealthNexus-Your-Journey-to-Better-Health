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
import { TrendingUp, TrendingDown, Minus, Calendar, Award } from "lucide-react";
import { sustainabilityService } from "../../../Services/sustainabilityService";

const MomentumScore = () => {
  const [momentumData, setMomentumData] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeRange, setTimeRange] = useState("30days");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMomentumData();
  }, []);

  const loadMomentumData = async () => {
    try {
      const response = await sustainabilityService.getSustainabilityData();
      if (response?.data?.momentumScore?.length > 0) {
        const data = response.data.momentumScore;
        setMomentumData(data);
        setCurrentScore(data[data.length - 1].score);
      }
    } catch (error) {
      console.error("Failed to load momentum data", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    return momentumData.slice(-days);
  };

  const getMomentumLevel = (score) => {
    if (score >= 80)
      return {
        level: "High Momentum",
        color: "green",
        emoji: "🚀",
        description: "Excellent! You're on fire!",
      };
    if (score >= 60)
      return {
        level: "Building Momentum",
        color: "blue",
        emoji: "📈",
        description: "Keep up the great work!",
      };
    if (score >= 40)
      return {
        level: "Steady Progress",
        color: "yellow",
        emoji: "⚡",
        description: "Good consistency, aim higher!",
      };
    if (score >= 20)
      return {
        level: "Starting Out",
        color: "orange",
        emoji: "🌱",
        description: "Building habits takes time",
      };
    return {
      level: "Needs Attention",
      color: "red",
      emoji: "⚠️",
      description: "Let's get back on track!",
    };
  };

  const calculateStats = () => {
    const filtered = getFilteredData();
    const avgScore =
      filtered.reduce((sum, d) => sum + d.score, 0) / filtered.length;
    const trend =
      filtered.length > 1
        ? filtered[filtered.length - 1].score - filtered[0].score
        : 0;
    const totalWorkouts = filtered.reduce(
      (sum, d) => sum + d.workoutsCompleted,
      0,
    );
    const streak = calculateStreak(filtered);

    return {
      average: Math.round(avgScore),
      trend: Math.round(trend),
      totalWorkouts,
      streak,
    };
  };

  const calculateStreak = (data) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].workoutsCompleted > 0 || data[i].mealsLogged >= 3) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const status = getMomentumLevel(currentScore);
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Momentum Score */}
      <div
        className={`bg-linear-to-br from-${status.color}-50 to-${status.color}-100 rounded-xl p-6 border-2 border-${status.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {status.emoji} Current Momentum Score
            </h3>
            <p className="text-5xl font-bold text-gray-900">{currentScore}</p>
            <p
              className={`text-lg font-semibold text-${status.color}-700 mt-2`}
            >
              {status.level}
            </p>
            <p className="text-gray-600 mt-1">{status.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              {stats.trend > 0 ? (
                <>
                  <TrendingUp className="text-green-600" size={24} />
                  <span className="text-green-600 font-bold">
                    +{stats.trend}
                  </span>
                </>
              ) : stats.trend < 0 ? (
                <>
                  <TrendingDown className="text-red-600" size={24} />
                  <span className="text-red-600 font-bold">{stats.trend}</span>
                </>
              ) : (
                <>
                  <Minus className="text-gray-600" size={24} />
                  <span className="text-gray-600 font-bold">0</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">vs. start of period</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {["7days", "30days", "90days"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeRange === range
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {range === "7days"
              ? "7 Days"
              : range === "30days"
                ? "30 Days"
                : "90 Days"}
          </button>
        ))}
      </div>

      {/* Momentum Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📊 Momentum Trend Over Time
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getFilteredData()}>
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
            <YAxis domain={[0, 100]} />
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
            <ReferenceLine
              y={60}
              stroke="#10b981"
              strokeDasharray="5 5"
              label="Target"
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#059669"
              strokeWidth={3}
              name="Momentum Score"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="consistency"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Consistency"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.average}
              </p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.streak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalWorkouts}
              </p>
              <p className="text-sm text-gray-600">Workouts Done</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 bg-${status.color}-100 rounded-lg`}>
              <TrendingUp className={`text-${status.color}-600`} size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.trend > 0 ? "+" : ""}
                {stats.trend}
              </p>
              <p className="text-sm text-gray-600">Trend Change</p>
            </div>
          </div>
        </div>
      </div>

      {/* Momentum Builders */}
      <div className="bg-linear-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200 p-6">
        <h4 className="font-bold text-green-900 mb-3">
          🎯 How to Build Momentum
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-green-900 mb-2">
              ✅ Momentum Builders
            </p>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Complete workouts consistently (even if short)</li>
              <li>• Log meals daily to stay accountable</li>
              <li>• Hit daily step goals</li>
              <li>• Track progress weekly</li>
              <li>• Celebrate small wins</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-green-900 mb-2">
              ⚠️ Momentum Killers
            </p>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Skipping 2+ consecutive days</li>
              <li>• All-or-nothing thinking</li>
              <li>• Ignoring small progress</li>
              <li>• Comparing to others</li>
              <li>• Perfectionism over consistency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Personalized Recommendation */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <h4 className="font-bold text-gray-800 mb-2">💡 Your Next Steps</h4>
        <p className="text-gray-700">
          {currentScore >= 80 &&
            "You're crushing it! Maintain this momentum by keeping your routine consistent. Consider setting a new challenge to keep things exciting."}
          {currentScore >= 60 &&
            currentScore < 80 &&
            "Great progress! Focus on not breaking your streak. Even on busy days, do a quick 10-minute workout to keep momentum alive."}
          {currentScore >= 40 &&
            currentScore < 60 &&
            "You're building consistency! Try to increase your workout frequency by just one session per week to boost your momentum."}
          {currentScore >= 20 &&
            currentScore < 40 &&
            "Starting is the hardest part, and you're doing it! Focus on showing up every day, even for 5 minutes. Consistency beats intensity."}
          {currentScore < 20 &&
            "Let's rebuild momentum together! Start with just 2-3 short workouts this week. Small steps lead to big changes."}
        </p>
      </div>
    </div>
  );
};

export default MomentumScore;
