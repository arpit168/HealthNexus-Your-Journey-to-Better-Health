import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Check,
  X,
  Info,
  Activity,
  Zap,
  Award,
  Calendar,
} from "lucide-react";

const ProgressOverload = ({ workoutData = [], onAdjust, suggestions = [] }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Mock workout data if none provided
  const mockWorkoutData =
    workoutData.length > 0
      ? workoutData
      : [
          {
            exerciseName: "Barbell Bench Press",
            history: [
              {
                date: "2024-01-01",
                volume: 1200,
                sets: 4,
                avgReps: 10,
                avgWeight: 30,
              },
              {
                date: "2024-01-08",
                volume: 1280,
                sets: 4,
                avgReps: 10,
                avgWeight: 32,
              },
              {
                date: "2024-01-15",
                volume: 1350,
                sets: 4,
                avgReps: 10,
                avgWeight: 33.75,
              },
              {
                date: "2024-01-22",
                volume: 1400,
                sets: 4,
                avgReps: 10,
                avgWeight: 35,
              },
            ],
          },
          {
            exerciseName: "Barbell Squats",
            history: [
              {
                date: "2024-01-02",
                volume: 2000,
                sets: 5,
                avgReps: 8,
                avgWeight: 50,
              },
              {
                date: "2024-01-09",
                volume: 2120,
                sets: 5,
                avgReps: 8,
                avgWeight: 53,
              },
              {
                date: "2024-01-16",
                volume: 2200,
                sets: 5,
                avgReps: 8,
                avgWeight: 55,
              },
              {
                date: "2024-01-23",
                volume: 2300,
                sets: 5,
                avgReps: 8,
                avgWeight: 57.5,
              },
            ],
          },
          {
            exerciseName: "Pull-Ups",
            history: [
              {
                date: "2024-01-03",
                volume: 600,
                sets: 4,
                avgReps: 8,
                avgWeight: 0,
              },
              {
                date: "2024-01-10",
                volume: 720,
                sets: 4,
                avgReps: 9,
                avgWeight: 0,
              },
              {
                date: "2024-01-17",
                volume: 800,
                sets: 4,
                avgReps: 10,
                avgWeight: 0,
              },
              {
                date: "2024-01-24",
                volume: 840,
                sets: 4,
                avgReps: 10,
                avgWeight: 2.5,
              },
            ],
          },
        ];

  // Mock suggestions if none provided
  const mockSuggestions =
    suggestions.length > 0
      ? suggestions
      : [
          {
            exercise: "Barbell Bench Press",
            currentVolume: 1400,
            suggestedVolume: 1470,
            reason: "Consistent 5% weekly increase",
            adjustmentType: "increase",
            recommendations: [
              { type: "weight", value: 36.75, change: "+1.75kg" },
              { type: "reps", value: 11, change: "+1 rep" },
            ],
          },
          {
            exercise: "Barbell Squats",
            currentVolume: 2300,
            suggestedVolume: 2415,
            reason: "5% progressive overload",
            adjustmentType: "increase",
            recommendations: [{ type: "weight", value: 60, change: "+2.5kg" }],
          },
          {
            exercise: "Pull-Ups",
            currentVolume: 840,
            suggestedVolume: 840,
            reason: "Maintain current volume (recent jump in weight)",
            adjustmentType: "maintain",
            recommendations: [
              { type: "form", value: "Focus on tempo and form" },
            ],
          },
        ];

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    return mockWorkoutData.map((exercise) => {
      const history = exercise.history;
      const latestWorkout = history[history.length - 1];
      const previousWorkout = history[history.length - 2];

      const volumeChange = previousWorkout
        ? ((latestWorkout.volume - previousWorkout.volume) /
            previousWorkout.volume) *
          100
        : 0;

      const totalVolumeGain =
        ((latestWorkout.volume - history[0].volume) / history[0].volume) * 100;

      return {
        name: exercise.exerciseName,
        currentVolume: latestWorkout.volume,
        volumeChange,
        totalVolumeGain,
        weekCount: history.length,
        avgWeeklyGain: totalVolumeGain / history.length,
        history,
      };
    });
  }, [mockWorkoutData]);

  const handleAcceptSuggestion = (suggestion) => {
    onAdjust && onAdjust({ action: "accept", suggestion });
  };

  const handleRejectSuggestion = (suggestion) => {
    onAdjust && onAdjust({ action: "reject", suggestion });
  };

  const getAdjustmentColor = (type) => {
    switch (type) {
      case "increase":
        return "from-green-500 to-emerald-500";
      case "decrease":
        return "from-orange-500 to-red-500";
      case "maintain":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getAdjustmentIcon = (type) => {
    switch (type) {
      case "increase":
        return <TrendingUp className="w-6 h-6" />;
      case "decrease":
        return <TrendingDown className="w-6 h-6" />;
      case "maintain":
        return <Target className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Volume Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Total Volume</h3>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {performanceMetrics
              .reduce((sum, metric) => sum + metric.currentVolume, 0)
              .toLocaleString()}{" "}
            kg
          </p>
          <p className="text-sm text-gray-600 mt-2">Across all exercises</p>
        </div>

        {/* Average Weekly Gain */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Avg Weekly Gain</h3>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            +
            {(
              performanceMetrics.reduce((sum, m) => sum + m.avgWeeklyGain, 0) /
              performanceMetrics.length
            ).toFixed(1)}
            %
          </p>
          <p className="text-sm text-gray-600 mt-2">Per exercise per week</p>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Workout Weeks</h3>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {Math.max(...performanceMetrics.map((m) => m.weekCount))}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Consecutive weeks tracked
          </p>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Progressive Overload Suggestions
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Based on your recent performance, here are recommended adjustments to
          continue progressing
        </p>

        <div className="space-y-4">
          {mockSuggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {suggestion.exercise}
                  </h3>
                  <p className="text-sm text-gray-600">{suggestion.reason}</p>
                </div>
                <div
                  className={`bg-linear-to-r ${getAdjustmentColor(
                    suggestion.adjustmentType,
                  )} text-white p-3 rounded-lg`}
                >
                  {getAdjustmentIcon(suggestion.adjustmentType)}
                </div>
              </div>

              {/* Volume Change */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Current Volume</p>
                  <p className="text-xl font-bold text-gray-800">
                    {suggestion.currentVolume} kg
                  </p>
                </div>
                <div
                  className={`bg-linear-to-r ${getAdjustmentColor(
                    suggestion.adjustmentType,
                  )} bg-opacity-10 rounded-lg p-3`}
                >
                  <p className="text-xs text-gray-600 mb-1">Suggested Volume</p>
                  <p className="text-xl font-bold text-gray-800">
                    {suggestion.suggestedVolume} kg
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    +
                    {(
                      ((suggestion.suggestedVolume - suggestion.currentVolume) /
                        suggestion.currentVolume) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Recommended Adjustments
                </p>
                <ul className="space-y-1">
                  {suggestion.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="text-sm text-gray-700">
                      <span className="font-medium capitalize">
                        {rec.type}:
                      </span>{" "}
                      {rec.type === "weight" || rec.type === "reps"
                        ? `${rec.value} (${rec.change})`
                        : rec.value}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAcceptSuggestion(suggestion)}
                  className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Apply This Week
                </button>
                <button
                  onClick={() => handleRejectSuggestion(suggestion)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Skip
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance History */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Performance History
          </h2>
        </div>

        <div className="space-y-4">
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => setSelectedExercise(metric)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    metric.volumeChange > 0
                      ? "bg-green-100 text-green-700"
                      : metric.volumeChange < 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {metric.volumeChange > 0 ? "+" : ""}
                  {metric.volumeChange.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Current Volume</p>
                  <p className="font-bold text-gray-800">
                    {metric.currentVolume} kg
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Gain</p>
                  <p className="font-bold text-green-600">
                    +{metric.totalVolumeGain.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Weeks Tracked</p>
                  <p className="font-bold text-purple-600">
                    {metric.weekCount}
                  </p>
                </div>
              </div>

              {/* Mini Volume Chart */}
              <div className="mt-3 flex items-end gap-1 h-12">
                {metric.history.map((workout, idx) => {
                  const maxVolume = Math.max(
                    ...metric.history.map((w) => w.volume),
                  );
                  const height = (workout.volume / maxVolume) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-linear-to-t from-blue-600 to-purple-600 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${workout.date}: ${workout.volume}kg`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Progressive Overload Explained
            </h4>
            <p className="text-sm text-blue-800">
              Progressive overload means gradually increasing the stress on your
              muscles. This can be achieved by increasing weight, reps, sets, or
              reducing rest time. Our suggestions are based on a safe 5-10%
              weekly increase in total volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverload;
