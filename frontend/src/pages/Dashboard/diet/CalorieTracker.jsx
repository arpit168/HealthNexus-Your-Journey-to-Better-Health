import React, { useMemo, useState } from "react";
import { Droplet, Flame, PieChart } from "lucide-react";

const CalorieTracker = ({ logs = [], target = {}, onLog }) => {
  const [water, setWater] = useState(5);

  // Extract targets with defaults
  const calorieTarget = target.calories || 2200;
  const proteinTarget = target.protein || 180;
  const carbsTarget = target.carbs || 250;
  const fatTarget = target.fat || 70;

  const totals = useMemo(() => {
    const totalsData = logs.reduce(
      (acc, entry) => {
        acc.calories += entry.calories || 0;
        acc.protein += entry.protein || 0;
        acc.carbs += entry.carbs || 0;
        acc.fats += entry.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );

    return totalsData;
  }, [logs]);

  const remaining = Math.max(calorieTarget - totals.calories, 0);
  const caloriePercent = Math.min(
    Math.round((totals.calories / calorieTarget) * 100),
    100,
  );

  const logWater = () => {
    const nextWater = Math.min(water + 1, 10);
    setWater(nextWater);
    onLog && onLog({ type: "water", value: nextWater });
  };

  const macroRing = (label, value, color) => (
    <div className="text-center">
      <div
        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${value}%, #e5e7eb 0)`,
        }}
      >
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold">{value}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-800">Daily Calories</h3>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Consumed</p>
            <p className="text-2xl font-bold text-emerald-700">
              {totals.calories} kcal
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-blue-700">{remaining} kcal</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Target</p>
            <p className="text-2xl font-bold text-amber-700">
              {calorieTarget} kcal
            </p>
          </div>
        </div>

        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-green-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Macro Balance</h3>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {macroRing(
            "Protein",
            Math.min(Math.round((totals.protein / proteinTarget) * 100), 100),
            "#10b981",
          )}
          {macroRing(
            "Carbs",
            Math.min(Math.round((totals.carbs / carbsTarget) * 100), 100),
            "#3b82f6",
          )}
          {macroRing(
            "Fats",
            Math.min(Math.round((totals.fats / fatTarget) * 100), 100),
            "#f59e0b",
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">Water Tracking</h3>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold"
            onClick={logWater}
          >
            Add Glass
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`w-6 h-10 rounded-md ${index < water ? "bg-blue-500" : "bg-blue-100"}`}
            />
          ))}
          <span className="text-sm text-gray-500">{water}/10</span>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
