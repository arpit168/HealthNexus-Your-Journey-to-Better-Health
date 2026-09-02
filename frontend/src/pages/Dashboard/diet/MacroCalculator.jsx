import React, { useMemo, useState } from "react";
import { Calculator, SlidersHorizontal } from "lucide-react";

const MacroCalculator = ({
  weight = 70,
  goal = "Maintain",
  calories = 2200,
  onCalculate,
}) => {
  const [preset, setPreset] = useState("balanced");
  const [proteinPercent, setProteinPercent] = useState(30);

  const ratios = useMemo(() => {
    if (preset === "high-protein") {
      return { protein: 35, carbs: 35, fats: 30 };
    }
    if (preset === "low-carb") {
      return { protein: 35, carbs: 25, fats: 40 };
    }
    if (preset === "cut") {
      return { protein: 40, carbs: 30, fats: 30 };
    }
    return { protein: 30, carbs: 40, fats: 30 };
  }, [preset]);

  const customRatios = useMemo(() => {
    const carbs = Math.max(100 - proteinPercent - 25, 20);
    const fats = 100 - proteinPercent - carbs;
    return { protein: proteinPercent, carbs, fats };
  }, [proteinPercent]);

  const calculateMacros = (ratio) => {
    const protein = Math.round((calories * (ratio.protein / 100)) / 4);
    const carbs = Math.round((calories * (ratio.carbs / 100)) / 4);
    const fats = Math.round((calories * (ratio.fats / 100)) / 9);
    return { protein, carbs, fats };
  };

  const target =
    preset === "custom"
      ? calculateMacros(customRatios)
      : calculateMacros(ratios);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-emerald-600" />
        <h3 className="text-xl font-bold text-gray-800">Macro Calculator</h3>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Based on {goal} goal · {weight} kg · {calories} kcal
      </p>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {["balanced", "high-protein", "low-carb", "cut", "custom"].map(
          (option) => (
            <button
              key={option}
              onClick={() => setPreset(option)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                preset === option
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {option.replace("-", " ")}
            </button>
          ),
        )}
      </div>

      {preset === "custom" && (
        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <p className="text-sm font-semibold text-gray-700">Custom Split</p>
          </div>
          <label className="text-sm text-gray-600">
            Protein {proteinPercent}%
          </label>
          <input
            type="range"
            min="25"
            max="45"
            value={proteinPercent}
            onChange={(event) =>
              setProteinPercent(parseInt(event.target.value, 10))
            }
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Carbs {customRatios.carbs}% · Fats {customRatios.fats}%
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Protein</p>
          <p className="text-lg font-bold text-emerald-700">
            {target.protein} g
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Carbs</p>
          <p className="text-lg font-bold text-blue-700">{target.carbs} g</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Fats</p>
          <p className="text-lg font-bold text-amber-700">{target.fats} g</p>
        </div>
      </div>

      <button
        onClick={() => onCalculate && onCalculate(target)}
        className="mt-4 w-full bg-linear-to-r from-emerald-600 to-green-600 text-white py-2 rounded-lg font-semibold"
      >
        Apply Macro Targets
      </button>
    </div>
  );
};

export default MacroCalculator;
