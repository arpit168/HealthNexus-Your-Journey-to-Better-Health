import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Calendar,
  Flame,
  Heart,
  Award,
  MessageSquare,
} from "lucide-react";

const AdherenceLog = ({ logs = [], onSubmit, date = new Date() }) => {
  const [todayLog, setTodayLog] = useState({
    workoutCompleted: false,
    dietFollowed: false,
    waterIntake: false,
    sleepQuality: 0,
    notes: "",
  });

  const todayString = useMemo(() => {
    return new Date(date).toISOString().split("T")[0];
  }, [date]);

  const existingLog = useMemo(() => {
    return logs.find((log) => {
      const logDate = new Date(log.date).toISOString().split("T")[0];
      return logDate === todayString;
    });
  }, [logs, todayString]);

  const currentStreak = useMemo(() => {
    if (logs.length === 0) return 0;

    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    let streak = 0;
    let currentDate = new Date();

    for (let log of sortedLogs) {
      const logDate = new Date(log.date);
      const diffDays = Math.floor(
        (currentDate - logDate) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak) {
        if (log.workoutCompleted && log.dietFollowed) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  }, [logs]);

  const weeklyStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekLogs = logs.filter((log) => new Date(log.date) >= oneWeekAgo);

    const workouts = weekLogs.filter((log) => log.workoutCompleted).length;
    const diet = weekLogs.filter((log) => log.dietFollowed).length;
    const water = weekLogs.filter((log) => log.waterIntake).length;
    const avgSleep =
      weekLogs.reduce((sum, log) => sum + (log.sleepQuality || 0), 0) /
      (weekLogs.length || 1);

    return {
      workouts,
      diet,
      water,
      avgSleep: avgSleep.toFixed(1),
      total: weekLogs.length,
    };
  }, [logs]);

  const handleCheckboxChange = (field) => {
    setTodayLog((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSleepChange = (rating) => {
    setTodayLog((prev) => ({ ...prev, sleepQuality: rating }));
  };

  const handleNotesChange = (e) => {
    setTodayLog((prev) => ({ ...prev, notes: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...todayLog,
      date: new Date(date),
    });

    setTodayLog({
      workoutCompleted: false,
      dietFollowed: false,
      waterIntake: false,
      sleepQuality: 0,
      notes: "",
    });
  };

  const isLoggedToday = !!existingLog;

  return (
    <div className="space-y-6">
      {/* Header with Streak */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-1">Daily Check-In</h2>
            <p className="text-purple-100">
              {new Date(date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <p className="text-4xl font-bold">{currentStreak}</p>
              <p className="text-sm text-purple-100">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Log */}
      {isLoggedToday ? (
        <div className="bg-green-50 rounded-2xl border-2 border-green-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">
              Today's Log Complete!
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">
                Workout:{" "}
                {existingLog.workoutCompleted ? "Completed" : "Skipped"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">
                Diet: {existingLog.dietFollowed ? "Followed" : "Not Followed"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">
                Water Intake:{" "}
                {existingLog.waterIntake ? "Met Goal" : "Below Goal"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-gray-700">
                Sleep Quality: {existingLog.sleepQuality}/5
              </span>
            </div>
            {existingLog.notes && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Notes:
                </p>
                <p className="text-gray-600">{existingLog.notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Log Today's Adherence
          </h3>

          {/* Checklist */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={todayLog.workoutCompleted}
                onChange={() => handleCheckboxChange("workoutCompleted")}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Workout Completed</p>
                <p className="text-sm text-gray-600">
                  Did you complete your workout today?
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={todayLog.dietFollowed}
                onChange={() => handleCheckboxChange("dietFollowed")}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Diet Followed</p>
                <p className="text-sm text-gray-600">
                  Did you stick to your meal plan?
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={todayLog.waterIntake}
                onChange={() => handleCheckboxChange("waterIntake")}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Water Intake Goal</p>
                <p className="text-sm text-gray-600">
                  Did you meet your water intake goal?
                </p>
              </div>
            </label>
          </div>

          {/* Sleep Quality */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-3">
              Sleep Quality
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleSleepChange(rating)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    todayLog.sleepQuality >= rating
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              1 = Poor, 5 = Excellent
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-3">
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Notes (Optional)
            </label>
            <textarea
              value={todayLog.notes}
              onChange={handleNotesChange}
              placeholder="How did you feel today? Any challenges or wins?"
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Save Today's Log
          </button>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Weekly Summary</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-purple-600 text-sm font-semibold mb-1">
              Workouts
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {weeklyStats.workouts}/7
            </p>
            <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.workouts / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-green-600 text-sm font-semibold mb-1">Diet</p>
            <p className="text-3xl font-bold text-gray-800">
              {weeklyStats.diet}/7
            </p>
            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.diet / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-600 text-sm font-semibold mb-1">Water</p>
            <p className="text-3xl font-bold text-gray-800">
              {weeklyStats.water}/7
            </p>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.water / 7) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-pink-50 rounded-xl p-4">
            <p className="text-pink-600 text-sm font-semibold mb-1">
              Avg Sleep
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {weeklyStats.avgSleep}/5
            </p>
            <div className="mt-2 w-full bg-pink-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all"
                style={{ width: `${(weeklyStats.avgSleep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Card */}
      <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200 p-6">
        <div className="flex items-start gap-4">
          <Award className="w-8 h-8 text-orange-600 shrink-0" />
          <div>
            <h4 className="font-bold text-orange-900 mb-2">Keep It Up!</h4>
            <p className="text-orange-800">
              {currentStreak > 0
                ? `You're on a ${currentStreak}-day streak! Consistency is the key to success.`
                : "Start your streak today! Small daily actions lead to big results."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdherenceLog;
