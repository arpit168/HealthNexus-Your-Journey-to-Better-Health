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
import { Calendar, TrendingUp } from "lucide-react";
import { overtrainingService } from "../../../Services/overtrainingService";

const RecoveryDayFrequency = () => {
  const [recoveryData, setRecoveryData] = useState([]);
  const [stats, setStats] = useState({
    totalRecoveryDays: 0,
    recommended: 0,
    compliance: 0,
    streak: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecoveryData();
  }, []);

  const loadRecoveryData = async () => {
    try {
      const response = await overtrainingService.getOvertrainingData();
      if (response?.data?.recoveryDayFrequency?.length > 0) {
        const data = response.data.recoveryDayFrequency;
        setRecoveryData(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error("Failed to load recovery day data", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalRecovery = data.filter((d) => d.isRecoveryDay).length;
    const days = data.length;
    const recommended = Math.ceil((days / 7) * 2.5); // 2-3 days per week
    const compliance = ((totalRecovery / recommended) * 100).toFixed(1);

    // Calculate current streak
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].isRecoveryDay) {
        streak++;
      } else {
        break;
      }
    }

    setStats({
      totalRecoveryDays: totalRecovery,
      recommended,
      compliance,
      streak,
    });
  };

  const addRecoveryDay = async () => {
    const today = new Date().toISOString().split("T")[0];
    const existingIndex = recoveryData.findIndex((d) => d.date === today);

    let updated = recoveryData;
    if (existingIndex !== -1) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        isRecoveryDay: true,
        activity: "Rest",
      };
    } else {
      updated = [
        ...recoveryData,
        {
          date: today,
          dayOfWeek: new Date().toLocaleDateString("en-US", {
            weekday: "short",
          }),
          isRecoveryDay: true,
          activity: "Rest",
        },
      ];
    }

    setRecoveryData(updated);
    calculateStats(updated);

    try {
      await overtrainingService.updateOvertrainingData({
        recoveryDayFrequency: updated,
      });
    } catch (error) {
      console.error("Failed to save recovery day", error);
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 100) return "from-green-500 to-emerald-500";
    if (compliance >= 75) return "from-blue-500 to-cyan-500";
    if (compliance >= 50) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getComplianceEmoji = (compliance) => {
    if (compliance >= 100) return "⭐";
    if (compliance >= 75) return "✅";
    if (compliance >= 50) return "⚠️";
    return "❌";
  };

  const complianceLevel = getComplianceColor(stats.compliance);
  const complianceEmoji = getComplianceEmoji(stats.compliance);

  // Weekly breakdown
  const weeklyData = [];
  for (let week = 0; week < 4; week++) {
    const weekStart = week * 7;
    const weekEnd = weekStart + 7;
    const weekDays = recoveryData.slice(weekStart, weekEnd);
    const recoveryDays = weekDays.filter((d) => d.isRecoveryDay).length;

    weeklyData.push({
      week: `Week ${week + 1}`,
      recoveryDays,
      trainingDays: 7 - recoveryDays,
      recommended: 2.5,
    });
  }

  // Distribution data for pie chart
  const distributionData = [
    { name: "Recovery Days", value: stats.totalRecoveryDays, color: "#10b981" },
    {
      name: "Training Days",
      value: recoveryData.length - stats.totalRecoveryDays,
      color: "#3b82f6",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Score */}
      <div
        className={`bg-linear-to-br ${complianceLevel} rounded-2xl shadow-lg p-8 text-white`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold opacity-90">
              Recovery Compliance
            </p>
            <h2 className="text-6xl font-bold mt-2">{stats.compliance}%</h2>
            <p className="text-lg opacity-90 mt-2">
              {stats.totalRecoveryDays} of {stats.recommended} recommended
              recovery days
            </p>
          </div>
          <div className="text-7xl opacity-90">{complianceEmoji}</div>
        </div>

        {/* Compliance Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(stats.compliance, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <button
        onClick={addRecoveryDay}
        className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Mark Today as Recovery Day
      </button>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <p className="text-sm font-semibold text-gray-600">Current Streak</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.streak}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Consecutive recovery days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <p className="text-sm font-semibold text-gray-600">
            Target vs Actual
          </p>
          <p className="text-lg font-bold text-blue-600 mt-2">
            {stats.totalRecoveryDays}/{stats.recommended} days
          </p>
          <p className="text-xs text-gray-500 mt-2">30-day period</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Training vs Recovery Split
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Recommendations
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-blue-900">
                ✅ Ideal Recovery Frequency
              </p>
              <p className="text-sm text-blue-800 mt-1">
                2-3 recovery days per week (29-43% of days)
              </p>
            </div>

            <div
              className={`${stats.compliance >= 75 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"} rounded-lg p-4 border`}
            >
              <p
                className={`font-semibold ${stats.compliance >= 75 ? "text-green-900" : "text-orange-900"}`}
              >
                📊 Your Status
              </p>
              <p
                className={`text-sm mt-1 ${stats.compliance >= 75 ? "text-green-800" : "text-orange-800"}`}
              >
                {stats.compliance >= 100
                  ? "Excellent! You're meeting and exceeding recovery targets."
                  : stats.compliance >= 75
                    ? "Good! You're close to your recovery targets."
                    : stats.compliance >= 50
                      ? "Fair. Consider increasing recovery days to prevent overtraining."
                      : "Low. You need more recovery days to optimize performance."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Weekly Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklyData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#9ca3af" />
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
            <Bar
              dataKey="recoveryDays"
              stackId="days"
              fill="#10b981"
              name="Recovery Days"
            />
            <Bar
              dataKey="trainingDays"
              stackId="days"
              fill="#3b82f6"
              name="Training Days"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recovery Day Calendar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          📅 Recovery Day Calendar (Last 30 Days)
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-bold text-gray-600 text-sm py-2"
            >
              {day}
            </div>
          ))}
          {recoveryData.map((day) => (
            <div
              key={day.date}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition-all ${
                day.isRecoveryDay
                  ? "bg-linear-to-br from-green-400 to-emerald-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={`${day.date}: ${day.activity}`}
            >
              <span className="text-xs">{new Date(day.date).getDate()}</span>
              <span className={day.isRecoveryDay ? "text-lg" : "text-xs"}>
                {day.isRecoveryDay ? "💤" : "💪"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
        <h4 className="font-bold text-purple-900 mb-3">
          💡 Recovery Day Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-purple-900 mb-2">
              Active Recovery
            </p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>✓ Light walking (30-45 min)</li>
              <li>✓ Easy stretching & mobility</li>
              <li>✓ Yoga or tai chi</li>
              <li>✓ Swimming at low intensity</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-purple-900 mb-2">Complete Rest</p>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>✓ Sleep 8-9 hours</li>
              <li>✓ Meditation (15-20 min)</li>
              <li>✓ Massage or foam rolling</li>
              <li>✓ Adequate nutrition & hydration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryDayFrequency;
