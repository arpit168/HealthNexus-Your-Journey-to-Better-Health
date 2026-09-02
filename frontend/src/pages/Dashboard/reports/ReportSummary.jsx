import React from "react";
import {
  TrendingDown,
  Activity,
  Flame,
  Target,
  BarChart3,
  Award,
} from "lucide-react";

export default function ReportSummary({ data, period, type = "summary" }) {
  const metrics = [
    {
      icon: Activity,
      label: "Total Workouts",
      value: data.totalWorkouts,
      change: "+2",
      color: "from-blue-600 to-blue-900",
    },
    {
      icon: Flame,
      label: "Total Calories",
      value: data.totalCalories,
      change: "+1200",
      color: "from-orange-600 to-orange-900",
    },
    {
      icon: BarChart3,
      label: "Adherence",
      value: `${data.avgAdherence}%`,
      change: "+5%",
      color: "from-green-600 to-green-900",
    },
    {
      icon: TrendingDown,
      label: "Weight Change",
      value: `${data.weightChange}kg`,
      change: "On track",
      color: "from-purple-600 to-purple-900",
    },
    {
      icon: Target,
      label: "Habit Score",
      value: data.habitScore || 85,
      change: "+3",
      color: "from-pink-600 to-pink-900",
    },
    {
      icon: Award,
      label: "Achievements",
      value: data.achievements?.length || 5,
      change: "New",
      color: "from-yellow-600 to-yellow-900",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-600/30 shadow-xl">
        <h3 className="text-gray-300 text-sm mb-2 font-semibold">
          Report Period
        </h3>
        <p className="text-3xl font-extrabold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {period}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className={`bg-linear-to-br ${metric.color} backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-white/20 hover:scale-105 transition-all transform duration-300 shadow-xl hover:shadow-2xl group cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-xs text-white font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-2 font-medium">
                {metric.label}
              </p>
              <p className="text-white text-3xl font-extrabold drop-shadow-lg">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary Text with enhanced styling */}
      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-600/30 shadow-xl">
        <h3 className="text-white font-extrabold text-2xl mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Performance Summary
        </h3>
        <p className="text-gray-300 leading-relaxed text-lg">
          During <span className="text-blue-400 font-bold">{period}</span>, you
          completed{" "}
          <strong className="text-green-400">
            {data.totalWorkouts} workouts
          </strong>{" "}
          with an impressive{" "}
          <strong className="text-green-400">
            {data.avgAdherence}% adherence rate
          </strong>
          . Your consistent efforts resulted in a weight change of{" "}
          <strong className="text-purple-400">{data.weightChange}kg</strong> and
          maintained a habit score of{" "}
          <strong className="text-yellow-400">
            {data.habitScore || 85}/100
          </strong>
          .
          <span className="text-green-400 font-semibold">
            Keep up the great work!
          </span>{" "}
          🎉
        </p>
      </div>

      {/* Grade Card with enhanced styling */}
      <div className="bg-linear-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-md p-8 rounded-2xl text-center border border-green-400/30 shadow-2xl hover:scale-105 transition-transform duration-300">
        <p className="text-green-100 text-sm mb-3 font-semibold tracking-wide uppercase">
          Overall Grade
        </p>
        <p className="text-8xl font-extrabold text-white drop-shadow-2xl animate-pulse">
          A-
        </p>
        <p className="text-green-50 mt-4 text-lg font-semibold">
          Excellent performance this period! 🌟
        </p>
      </div>
    </div>
  );
}
