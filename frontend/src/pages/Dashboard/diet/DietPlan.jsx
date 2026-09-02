import React, { useMemo, useState } from "react";
import {
  Calendar,
  RefreshCw,
  Printer,
  ShoppingBag,
  ArrowRightLeft,
} from "lucide-react";
import MealDetail from "./MealDetail.jsx";
import MacroCalculator from "./MacroCalculator.jsx";

const DietPlan = ({ plan, dayOffset = 0, onSwap }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [macroTargets, setMacroTargets] = useState(null);

  const currentPlan = plan || {
    dayName: "Tuesday",
    calories: 2200,
    goal: "Lean Muscle",
    meals: [
      {
        id: "breakfast",
        name: "Breakfast",
        time: "8:00 AM",
        calories: 480,
        macros: { protein: 35, carbs: 55, fats: 12 },
        items: ["Greek yogurt", "Oats", "Blueberries", "Almond butter"],
        prepTime: "10 min",
      },
      {
        id: "lunch",
        name: "Lunch",
        time: "1:00 PM",
        calories: 650,
        macros: { protein: 45, carbs: 70, fats: 18 },
        items: ["Chicken breast", "Brown rice", "Vegetables", "Olive oil"],
        prepTime: "20 min",
      },
      {
        id: "snack",
        name: "Snack",
        time: "4:00 PM",
        calories: 260,
        macros: { protein: 20, carbs: 25, fats: 8 },
        items: ["Protein shake", "Banana"],
        prepTime: "5 min",
      },
      {
        id: "dinner",
        name: "Dinner",
        time: "7:30 PM",
        calories: 620,
        macros: { protein: 40, carbs: 50, fats: 20 },
        items: ["Salmon", "Sweet potato", "Broccoli", "Lemon"],
        prepTime: "25 min",
      },
    ],
    shoppingList: [
      "Chicken breast",
      "Salmon",
      "Oats",
      "Greek yogurt",
      "Blueberries",
    ],
  };

  const planDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [dayOffset]);

  const totalCalories = currentPlan.meals.reduce(
    (sum, meal) => sum + meal.calories,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{planDate}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              {currentPlan.goal} Plan
            </h2>
            <p className="text-sm text-gray-500">
              Target {currentPlan.calories} kcal
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        <div className="mt-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Planned Calories</p>
              <p className="text-2xl font-bold text-emerald-700">
                {totalCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.max(currentPlan.calories - totalCalories, 0)} kcal
              </p>
            </div>
          </div>
        </div>
      </div>

      <MacroCalculator
        weight={72}
        goal="Lean Muscle"
        calories={currentPlan.calories}
        onCalculate={setMacroTargets}
      />

      {macroTargets && (
        <div className="bg-white rounded-xl p-4 border border-emerald-200">
          <p className="text-sm text-gray-600">Daily Macro Targets</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-gray-500">Protein</p>
              <p className="font-bold text-emerald-700">
                {macroTargets.protein} g
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-gray-500">Carbs</p>
              <p className="font-bold text-blue-700">{macroTargets.carbs} g</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-gray-500">Fats</p>
              <p className="font-bold text-amber-700">{macroTargets.fats} g</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentPlan.meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {meal.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {meal.time} · {meal.prepTime}
                </p>
              </div>
              <button
                className="text-sm text-emerald-600 font-semibold flex items-center gap-1"
                onClick={() => onSwap && onSwap(meal)}
              >
                <ArrowRightLeft className="w-4 h-4" />
                Swap
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-emerald-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Protein</p>
                <p className="font-bold text-emerald-700">
                  {meal.macros.protein}g
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Carbs</p>
                <p className="font-bold text-blue-700">{meal.macros.carbs}g</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 text-center">
                <p className="text-gray-500">Fats</p>
                <p className="font-bold text-amber-700">{meal.macros.fats}g</p>
              </div>
            </div>

            <ul className="mt-4 text-sm text-gray-600 space-y-1">
              {meal.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              className="mt-4 w-full bg-linear-to-r from-emerald-600 to-green-600 text-white py-2 rounded-lg font-semibold"
              onClick={() => setSelectedMeal(meal)}
            >
              View Meal Details
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">Shopping List</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
          {currentPlan.shoppingList.map((item) => (
            <div key={item} className="bg-emerald-50 rounded-lg p-2">
              {item}
            </div>
          ))}
        </div>
      </div>

      {selectedMeal && (
        <MealDetail
          meal={selectedMeal}
          onCook={() => setSelectedMeal(null)}
          scale={1}
        />
      )}
    </div>
  );
};

export default DietPlan;
