import React, { useMemo } from "react";
import { X, Clock, Flame, Utensils } from "lucide-react";

const MealDetail = ({ meal, onCook, scale = 1 }) => {
  const ingredients = useMemo(() => {
    if (!meal) return [];
    return meal.items.map((item) => ({
      name: item,
      quantity: scale === 1 ? "1 serving" : `${scale} servings`,
    }));
  }, [meal, scale]);

  if (!meal) {
    return null;
  }

  const nutrition = {
    calories: meal.calories,
    protein: meal.macros?.protein || 0,
    carbs: meal.macros?.carbs || 0,
    fats: meal.macros?.fats || 0,
  };

  const steps = [
    "Prep all ingredients and wash produce.",
    "Cook the main protein with light seasoning.",
    "Prepare the carb source and vegetables.",
    "Combine components and finish with herbs or dressing.",
  ];

  const substitutes = [
    "Swap rice for quinoa",
    "Use tofu instead of chicken",
    "Add extra greens",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{meal.name}</h3>
            <p className="text-sm text-gray-500">
              {meal.time} · {meal.prepTime}
            </p>
          </div>
          <button onClick={onCook} className="p-2 rounded-full bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Calories</p>
              <p className="font-bold text-emerald-700 flex items-center gap-1">
                <Flame className="w-4 h-4" /> {nutrition.calories}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="font-bold text-blue-700">{nutrition.protein} g</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="font-bold text-amber-700">{nutrition.carbs} g</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Fats</p>
              <p className="font-bold text-purple-700">{nutrition.fats} g</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Ingredients
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {ingredients.map((ingredient) => (
                <li key={ingredient.name} className="bg-gray-50 rounded-lg p-2">
                  {ingredient.name} · {ingredient.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Cooking Steps
            </h4>
            <ol className="space-y-2 text-sm text-gray-600">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Substitute Suggestions
            </h4>
            <div className="flex flex-wrap gap-2 text-sm">
              {substitutes.map((sub) => (
                <span
                  key={sub}
                  className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" /> {meal.prepTime} total
            </div>
            <button
              onClick={onCook}
              className="px-5 py-2 bg-linear-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" /> Start Cooking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
