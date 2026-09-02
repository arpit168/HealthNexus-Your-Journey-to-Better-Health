import React, { useState, useMemo } from "react";
import { Scale, TrendingDown, TrendingUp, Trash2, Plus } from "lucide-react";

const WeightTracker = ({ logs = [], goal = 75, onSubmit, onDelete }) => {
  const [weight, setWeight] = useState("");
  const [showForm, setShowForm] = useState(false);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [logs]);

  const currentWeight = sortedLogs[0]?.weight || 0;
  const startWeight =
    sortedLogs[sortedLogs.length - 1]?.weight || currentWeight;
  const totalChange = currentWeight - startWeight;
  const goalRemaining = currentWeight - goal;
  const progress =
    startWeight !== goal
      ? ((startWeight - currentWeight) / (startWeight - goal)) * 100
      : 0;

  const weeklyChange = useMemo(() => {
    if (logs.length < 2) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentLogs = logs.filter((log) => new Date(log.date) >= oneWeekAgo);
    if (recentLogs.length < 2) return 0;
    const latest = recentLogs[0]?.weight || 0;
    const oldest = recentLogs[recentLogs.length - 1]?.weight || 0;
    return latest - oldest;
  }, [logs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (weight && parseFloat(weight) > 0) {
      onSubmit({ weight: parseFloat(weight) });
      setWeight("");
      setShowForm(false);
    }
  };

  const maxWeight = Math.max(...logs.map((l) => l.weight), goal) + 5;
  const minWeight = Math.min(...logs.map((l) => l.weight), goal) - 5;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Current Weight</span>
            <Scale className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {currentWeight.toFixed(1)} kg
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Goal Weight</span>
            <Scale className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{goal} kg</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Change</span>
            {totalChange < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p
            className={`text-3xl font-bold ${totalChange < 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalChange > 0 ? "+" : ""}
            {totalChange.toFixed(1)} kg
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Weekly Change</span>
            {weeklyChange < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <p
            className={`text-3xl font-bold ${weeklyChange < 0 ? "text-green-600" : "text-orange-600"}`}
          >
            {weeklyChange > 0 ? "+" : ""}
            {weeklyChange.toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Goal Progress</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Start: {startWeight.toFixed(1)} kg</span>
            <span>Current: {currentWeight.toFixed(1)} kg</span>
            <span>Goal: {goal} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            {Math.abs(goalRemaining).toFixed(1)} kg{" "}
            {goalRemaining > 0 ? "to lose" : "to gain"}
          </p>
        </div>
      </div>

      {/* Visual Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weight Trend</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {sortedLogs.length > 0 ? (
            sortedLogs
              .slice(0, 20)
              .reverse()
              .map((log, index) => {
                const height =
                  ((log.weight - minWeight) / (maxWeight - minWeight)) * 100;
                return (
                  <div
                    key={log.id || index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full bg-purple-100 rounded-t-lg relative group">
                      <div
                        className="w-full bg-linear-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                        style={{ height: `${height * 2}px` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {log.weight.toFixed(1)} kg
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left mt-2">
                      {new Date(log.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-400 text-center w-full">
              No weight entries yet
            </p>
          )}
        </div>
      </div>

      {/* Add Weight Entry */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Log Weight</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75.5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weight History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Weight
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Change
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.length > 0 ? (
                sortedLogs.map((log, index) => {
                  const prevWeight = sortedLogs[index + 1]?.weight;
                  const change = prevWeight ? log.weight - prevWeight : 0;
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-800">
                        {new Date(log.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {log.weight.toFixed(1)} kg
                      </td>
                      <td className="py-3 px-4">
                        {prevWeight ? (
                          <span
                            className={`font-semibold ${change < 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {change > 0 ? "+" : ""}
                            {change.toFixed(1)} kg
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDelete(log.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    No entries yet. Add your first weight entry above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
