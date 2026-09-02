import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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
import { Home, Coffee, Briefcase, Users, Moon, TrendingUp } from "lucide-react";
import { sustainabilityService } from "../../../Services/sustainabilityService";

const LifestyleIntegrationScore = () => {
  const [integrationData, setIntegrationData] = useState([]);
  const [overallScore, setOverallScore] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    try {
      const response = await sustainabilityService.getSustainabilityData();
      if (response?.data?.lifestyleIntegration?.length > 0) {
        const data = response.data.lifestyleIntegration;
        setIntegrationData(data);
        setOverallScore(data[data.length - 1].overallScore);
      }
    } catch (error) {
      console.error("Failed to load lifestyle integration data", error);
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationLevel = (score) => {
    if (score >= 80)
      return {
        level: "Seamlessly Integrated",
        color: "green",
        emoji: "🌟",
        description: "Fitness is part of who you are!",
      };
    if (score >= 60)
      return {
        level: "Well Integrated",
        color: "blue",
        emoji: "💎",
        description: "Fitness fits your lifestyle!",
      };
    if (score >= 40)
      return {
        level: "Partially Integrated",
        color: "yellow",
        emoji: "🔄",
        description: "Making it work!",
      };
    if (score >= 20)
      return {
        level: "Finding Balance",
        color: "orange",
        emoji: "⚖️",
        description: "Still adjusting",
      };
    return {
      level: "Separate Activity",
      color: "gray",
      emoji: "🔨",
      description: "Fitness feels like work",
    };
  };

  const calculateAreaScores = () => {
    if (integrationData.length === 0) return [];

    const latest = integrationData[integrationData.length - 1];

    return [
      {
        area: "Morning Routine",
        score: latest.morningRoutine,
        icon: Coffee,
        color: "#f59e0b",
      },
      {
        area: "Work Integration",
        score: latest.workIntegration,
        icon: Briefcase,
        color: "#3b82f6",
      },
      {
        area: "Social Life",
        score: latest.socialLife,
        icon: Users,
        color: "#ec4899",
      },
      {
        area: "Family Time",
        score: latest.familyTime,
        icon: Home,
        color: "#10b981",
      },
      {
        area: "Evening Wind-Down",
        score: latest.eveningWind,
        icon: Moon,
        color: "#8b5cf6",
      },
    ];
  };

  const calculateStats = () => {
    if (integrationData.length === 0)
      return { avgScore: 0, avgMinutes: 0, avgStress: 0, trend: 0 };

    const last30Days = integrationData.slice(-30);
    const avgScore =
      last30Days.reduce((sum, d) => sum + d.overallScore, 0) /
      last30Days.length;
    const avgMinutes =
      last30Days.reduce((sum, d) => sum + d.fitnessMinutes, 0) /
      last30Days.length;
    const avgStress =
      last30Days.reduce((sum, d) => sum + d.stressLevel, 0) / last30Days.length;

    const firstWeek = integrationData.slice(0, 7);
    const lastWeek = integrationData.slice(-7);
    const firstAvg =
      firstWeek.reduce((sum, d) => sum + d.overallScore, 0) / firstWeek.length;
    const lastAvg =
      lastWeek.reduce((sum, d) => sum + d.overallScore, 0) / lastWeek.length;
    const trend = lastAvg - firstAvg;

    return {
      avgScore: Math.round(avgScore),
      avgMinutes: Math.round(avgMinutes),
      avgStress: Math.round(avgStress),
      trend: Math.round(trend),
    };
  };

  const getIntegrationTips = (score) => {
    if (score >= 80) {
      return [
        "You've mastered integration! Share your strategies with others.",
        "Consider coaching or mentoring friends to integrate fitness.",
        "Explore new fitness challenges that align with your lifestyle.",
      ];
    } else if (score >= 60) {
      return [
        "Great job! Try integrating fitness into one more daily routine.",
        "Look for ways to combine social activities with fitness.",
        "Share your favorite fitness-integrated activities with family.",
      ];
    } else if (score >= 40) {
      return [
        "Focus on making workouts convenient (home gym, short sessions).",
        "Batch fitness activities with existing habits (walk while calling).",
        "Find fitness activities your family/friends can join.",
      ];
    } else if (score >= 20) {
      return [
        "Start with micro-workouts during existing breaks (5-10 minutes).",
        "Replace one sedentary activity with a physical one.",
        "Schedule workouts like important meetings.",
      ];
    } else {
      return [
        "Begin with 10-minute morning stretches to build a routine.",
        "Walk during lunch breaks or phone calls.",
        "Find one fitness activity you genuinely enjoy.",
      ];
    }
  };

  const getPieData = (areaScores) => {
    return areaScores.map((area) => ({
      name: area.area,
      value: area.score,
      color: area.color,
    }));
  };

  const status = getIntegrationLevel(overallScore);
  const areaScores = calculateAreaScores();
  const stats = calculateStats();
  const tips = getIntegrationTips(overallScore);
  const pieData = getPieData(areaScores);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Integration Score */}
      <div
        className={`bg-linear-to-br from-${status.color}-50 to-${status.color}-100 rounded-xl p-6 border-2 border-${status.color}-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {status.emoji} Lifestyle Integration Score
            </h3>
            <p className="text-5xl font-bold text-gray-900">{overallScore}</p>
            <p
              className={`text-lg font-semibold text-${status.color}-700 mt-2`}
            >
              {status.level}
            </p>
            <p className="text-gray-600 mt-1">{status.description}</p>
          </div>
          <div className="text-right">
            <div className="mb-3">
              <p className="text-3xl font-bold text-blue-600">
                {stats.avgMinutes}
              </p>
              <p className="text-sm text-gray-600">Daily Fitness Minutes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {100 - stats.avgStress}%
              </p>
              <p className="text-sm text-gray-600">Life Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Trend */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📈 Integration Progress (60 Days)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={integrationData}>
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
              name="Overall Integration"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="stressLevel"
              stroke="#ef4444"
              strokeWidth={2}
              name="Stress Level"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Life Area Scores */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          🏡 Integration by Life Area
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {areaScores.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-2">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${area.color}20` }}
                  >
                    <Icon size={24} style={{ color: area.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">{area.score}</p>
                <p className="text-xs text-gray-600">{area.area}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${area.score}%`,
                      backgroundColor: area.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution Pie Chart & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-800 mb-4">
            📊 Integration Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) =>
                  `${entry.name.split(" ")[0]} (${entry.value})`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.avgScore}
                </p>
                <p className="text-sm text-gray-600">Average Score (30d)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Coffee className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.avgMinutes} min
                </p>
                <p className="text-sm text-gray-600">Daily Fitness Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home className="text-purple-600" size={24} />
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

      {/* Weekly Pattern */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          📅 Weekly Integration Pattern
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={integrationData.slice(-7)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", { weekday: "short" })
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
            <Legend />
            <Bar dataKey="morningRoutine" fill="#f59e0b" name="Morning" />
            <Bar dataKey="workIntegration" fill="#3b82f6" name="Work" />
            <Bar dataKey="eveningWind" fill="#8b5cf6" name="Evening" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* What is Lifestyle Integration? */}
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-6">
        <h4 className="font-bold text-blue-900 mb-3">
          🧠 What is Lifestyle Integration?
        </h4>
        <p className="text-sm text-blue-800 mb-4">
          Integration means fitness isn't a separate "task" you force into your
          day - it's woven seamlessly into your existing routines. When fitness
          is integrated, it feels natural, sustainable, and effortless.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">
              ❌ Not Integrated
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fitness feels like a chore</li>
              <li>• Workouts disrupt your schedule</li>
              <li>• You need extreme willpower</li>
              <li>• Social life conflicts with fitness</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">
              ✅ Well Integrated
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Exercise is part of your routine</li>
              <li>• Fitness enhances your lifestyle</li>
              <li>• Healthy choices feel natural</li>
              <li>• Friends join your activities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Integration Strategies */}
      <div className="bg-linear-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200 p-6">
        <h4 className="font-bold text-green-900 mb-3">
          🎯 Your Integration Strategies
        </h4>
        <div className="space-y-2">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 bg-white rounded-lg p-3"
            >
              <span className="text-green-600 font-bold">{idx + 1}.</span>
              <p className="text-sm text-green-800">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real Life Examples */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-bold text-gray-800 mb-4">
          💡 Real-Life Integration Examples
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              <Coffee size={18} className="text-yellow-600" />
              Morning Routine
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Do 10 push-ups while coffee brews. Stretch during breakfast. Walk
              while taking morning calls.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase size={18} className="text-blue-600" />
              Work Integration
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Walking meetings. Desk exercises during breaks. Stand while on
              calls. Stairs instead of elevator.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-pink-600" />
              Social Life
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Hiking with friends. Dance nights instead of bars. Active dates.
              Sports leagues. Walking catch-ups.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              <Home size={18} className="text-green-600" />
              Family Time
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Bike rides with kids. Backyard games. Dance parties. Active
              chores. Family walk after dinner.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <h4 className="font-bold text-gray-800 mb-2">
          💡 Your Integration Focus
        </h4>
        <p className="text-gray-700">
          {overallScore >= 80 &&
            "Amazing! Fitness is beautifully woven into your life. You're an inspiration - consider sharing your strategies with others who are struggling."}
          {overallScore >= 60 &&
            overallScore < 80 &&
            "Great job! Fitness fits well into your lifestyle. To reach the next level, focus on your lowest-scoring life area and find creative ways to add movement there."}
          {overallScore >= 40 &&
            overallScore < 60 &&
            "You're making good progress! Pick one daily routine (morning, work breaks, or evening) and commit to adding 5-10 minutes of movement for the next 2 weeks."}
          {overallScore >= 20 &&
            overallScore < 40 &&
            "You're building the foundation! Start small - replace one sedentary habit with a physical one. For example, walk while on phone calls or stretch while watching TV."}
          {overallScore < 20 &&
            "Let's start simple! This week, add just 5 minutes of movement to your morning routine. Once that feels natural, we'll add more integration points."}
        </p>
      </div>
    </div>
  );
};

export default LifestyleIntegrationScore;
