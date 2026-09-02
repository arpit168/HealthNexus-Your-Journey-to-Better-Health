import React, { useState, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Users, Brain, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { sustainabilityService } from "../../../Services/sustainabilityService";

const DependencyScore = () => {
  const [dependencyData, setDependencyData] = useState([]);
  const [independenceScore, setIndependenceScore] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDependencyData();
  }, []);

  const loadDependencyData = async () => {
    try {
      const response = await sustainabilityService.getSustainabilityData();
      if (response?.data?.dependencyScore?.length > 0) {
        const data = response.data.dependencyScore;
        setDependencyData(data);
        setIndependenceScore(data[data.length - 1].overallScore);
      }
    } catch (error) {
      console.error("Failed to load dependency data", error);
    } finally {
      setLoading(false);
    }
  };

  const getDependencyLevel = (score) => {
    if (score >= 80)
      return {
        level: "Fully Independent",
        color: "green",
        emoji: "🎓",
        description: "You make confident decisions!",
      };
    if (score >= 60)
      return {
        level: "Growing Independence",
        color: "blue",
        emoji: "🌟",
        description: "Building confidence!",
      };
    if (score >= 40)
      return {
        level: "Learning Phase",
        color: "yellow",
        emoji: "📚",
        description: "Still learning the ropes",
      };
    if (score >= 20)
      return {
        level: "Guided Progress",
        color: "orange",
        emoji: "🤝",
        description: "Guidance is helpful",
      };
    return {
      level: "Starting Journey",
      color: "gray",
      emoji: "🌱",
      description: "Beginning to learn",
    };
  };

  const getRadarData = () => {
    if (dependencyData.length === 0) return [];

    const latest = dependencyData[dependencyData.length - 1];

    return [
      {
        category: "Workout Decisions",
        score: latest.workoutDecisions,
        fullMark: 100,
      },
      {
        category: "Nutrition Choices",
        score: latest.nutritionChoices,
        fullMark: 100,
      },
      {
        category: "Problem Solving",
        score: latest.problemSolving,
        fullMark: 100,
      },
      {
        category: "Self-Awareness",
        score: latest.selfAwareness,
        fullMark: 100,
      },
      { category: "Adaptability", score: latest.adaptability, fullMark: 100 },
    ];
  };

  const calculateStats = () => {
    if (dependencyData.length === 0)
      return { avgScore: 0, appChecks: 0, selfDecisions: 0, trend: 0 };

    const last30Days = dependencyData.slice(-30);
    const avgScore =
      last30Days.reduce((sum, d) => sum + d.overallScore, 0) /
      last30Days.length;
    const appChecks = last30Days.reduce((sum, d) => sum + d.appCheckIns, 0);
    const selfDecisions = last30Days.reduce(
      (sum, d) => sum + d.selfDecisions,
      0,
    );

    const firstWeek = dependencyData.slice(0, 7);
    const lastWeek = dependencyData.slice(-7);
    const firstAvg =
      firstWeek.reduce((sum, d) => sum + d.overallScore, 0) / firstWeek.length;
    const lastAvg =
      lastWeek.reduce((sum, d) => sum + d.overallScore, 0) / lastWeek.length;
    const trend = lastAvg - firstAvg;

    return {
      avgScore: Math.round(avgScore),
      appChecks,
      selfDecisions,
      trend: Math.round(trend),
    };
  };

  const getIndependenceIndicators = (score) => {
    const indicators = {
      low: [
        { text: "Checks app before every workout", achieved: score < 40 },
        { text: "Needs meal plans to eat healthy", achieved: score < 40 },
        { text: "Uncertain about exercise form", achieved: score < 40 },
        { text: "Relies on app for motivation", achieved: score < 40 },
      ],
      medium: [
        {
          text: "Makes workout adjustments independently",
          achieved: score >= 40 && score < 70,
        },
        {
          text: "Chooses healthy foods intuitively",
          achieved: score >= 40 && score < 70,
        },
        {
          text: "Troubleshoots minor issues alone",
          achieved: score >= 40 && score < 70,
        },
        {
          text: "Creates own workout variations",
          achieved: score >= 40 && score < 70,
        },
      ],
      high: [
        { text: "Designs own workout programs", achieved: score >= 70 },
        { text: "Knows nutrition needs by intuition", achieved: score >= 70 },
        { text: "Adapts plans to changing conditions", achieved: score >= 70 },
        { text: "Mentors others confidently", achieved: score >= 70 },
      ],
    };

    return indicators;
  };

  const status = getDependencyLevel(independenceScore);
  const radarData = getRadarData();
  const stats = calculateStats();
  const indicators = getIndependenceIndicators(independenceScore);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Independence Score */}
      <div
        className={`bg-linear-to-br from-${status.color}-50 to-${status.color}-100 rounded-xl p-6 border-2 border-${status.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {status.emoji} Independence Score
            </h3>
            <p className="text-5xl font-bold text-gray-900">
              {independenceScore}
            </p>
            <p
              className={`text-lg font-semibold text-${status.color}-700 mt-2`}
            >
              {status.level}
            </p>
            <p className="text-gray-600 mt-1">{status.description}</p>
          </div>
          <div className="text-right">
            <div className="mb-3">
              <p className="text-3xl font-bold text-green-600">
                {stats.selfDecisions}
              </p>
              <p className="text-sm text-gray-600">Self-Directed Decisions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.appChecks}
              </p>
              <p className="text-sm text-gray-600">App Check-ins (30d)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Independence Progress Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📈 Independence Journey (60 Days)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dependencyData}>
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
            <Line
              type="monotone"
              dataKey="overallScore"
              stroke="#10b981"
              strokeWidth={3}
              name="Overall Independence"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="selfAwareness"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Self-Awareness"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Skills Radar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-800 mb-4">
            🎯 Independence Skills Profile
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} />
              <Tooltip />
              <Radar
                name="Current Level"
                dataKey="score"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.avgScore}
                </p>
                <p className="text-sm text-gray-600">30-Day Average Score</p>
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
                  {stats.selfDecisions}
                </p>
                <p className="text-sm text-gray-600">Independent Decisions</p>
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
                  {stats.trend > 0 ? "+" : ""}
                  {stats.trend}
                </p>
                <p className="text-sm text-gray-600">Growth Trend</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Independence Indicators */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          🎖️ Independence Milestones
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700 mb-2">
              🌱 Beginner (0-40)
            </p>
            <div className="space-y-2">
              {indicators.low.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {indicator.achieved ? (
                    <CheckCircle className="text-green-500" size={18} />
                  ) : (
                    <XCircle className="text-gray-300" size={18} />
                  )}
                  <p
                    className={`text-sm ${indicator.achieved ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {indicator.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-2">
              📚 Intermediate (40-70)
            </p>
            <div className="space-y-2">
              {indicators.medium.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {indicator.achieved ? (
                    <CheckCircle className="text-green-500" size={18} />
                  ) : (
                    <XCircle className="text-gray-300" size={18} />
                  )}
                  <p
                    className={`text-sm ${indicator.achieved ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {indicator.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-2">
              🎓 Advanced (70-100)
            </p>
            <div className="space-y-2">
              {indicators.high.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {indicator.achieved ? (
                    <CheckCircle className="text-green-500" size={18} />
                  ) : (
                    <XCircle className="text-gray-300" size={18} />
                  )}
                  <p
                    className={`text-sm ${indicator.achieved ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {indicator.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The Goal of This App */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <h4 className="font-bold text-purple-900 mb-3">🎯 The Ultimate Goal</h4>
        <p className="text-purple-800 mb-3">
          Our mission isn't to make you dependent on this app forever. The goal
          is to teach you the principles, build your confidence, and develop
          your intuition so that you can eventually thrive{" "}
          <strong>without</strong> constant guidance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">
              📖 From App-Dependent to Self-Sufficient
            </p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Start: Follow meal plans exactly</li>
              <li>• Grow: Understand macros and portions</li>
              <li>• Master: Intuitively eat for your goals</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">
              💪 From Guided to Confident
            </p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Start: Need workout instructions</li>
              <li>• Grow: Modify exercises yourself</li>
              <li>• Master: Design your own programs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <h4 className="font-bold text-gray-800 mb-2">
          💡 Your Next Independence Step
        </h4>
        <p className="text-gray-700">
          {independenceScore >= 80 &&
            "Excellent! You've developed strong fitness intuition. Consider mentoring others or exploring advanced programming. You're ready to fly solo!"}
          {independenceScore >= 60 &&
            independenceScore < 80 &&
            "Great progress! Start experimenting with your own workout variations. Trust your instincts more when making nutrition choices."}
          {independenceScore >= 40 &&
            independenceScore < 60 &&
            "You're in the learning phase. Focus on understanding why you do certain exercises and eat certain foods. Ask yourself questions before checking the app."}
          {independenceScore >= 20 &&
            independenceScore < 40 &&
            "Keep following guidance but start paying attention to patterns. Notice what works for your body. Try making small decisions independently."}
          {independenceScore < 20 &&
            "You're at the beginning! It's perfectly fine to rely on the app now. Focus on learning the basics and building confidence one day at a time."}
        </p>
      </div>
    </div>
  );
};

export default DependencyScore;
