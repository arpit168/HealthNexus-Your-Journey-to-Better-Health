import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Flame,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import axiosInstance from "../../../config/Api";

const GoalSettings = ({
  onChange,
  values,

  maintenanceCalories,
}) => {
  const [formData, setFormData] = useState({
    goalType: "",
    targetWeight: "",
    timeline: "",
    experienceLevel: "",
  });

  const [calorieTarget, setCalorieTarget] = useState(null);

  const [safetyWarnings, setSafetyWarnings] = useState([]);

  const [loading, setLoading] = useState(false);

  // ===============================
  // GOAL TYPES
  // ===============================

  const goalTypes = [
    {
      value: "lose",
      label: "Lose Weight",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      border: "border-red-500",
    },
    {
      value: "maintain",
      label: "Maintain Weight",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      border: "border-blue-500",
    },
    {
      value: "gain",
      label: "Gain Weight",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      border: "border-green-500",
    },
    {
      value: "muscle",
      label: "Build Muscle",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      border: "border-purple-500",
    },
  ];

  // ===============================
  // TIMELINE OPTIONS
  // ===============================

  const timelineOptions = [
    {
      value: "1",
      label: "1 Month",
      description: "Aggressive",
    },
    {
      value: "2",
      label: "2 Months",
      description: "Moderate",
    },
    {
      value: "3",
      label: "3 Months",
      description: "Balanced",
    },
    {
      value: "6",
      label: "6 Months",
      description: "Sustainable",
    },
    {
      value: "12",
      label: "12 Months",
      description: "Long-term",
    },
  ];

  // ===============================
  // EXPERIENCE LEVELS
  // ===============================

  const experienceLevels = [
    {
      value: "beginner",
      label: "Beginner",
      description: "New to fitness",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "6 months - 2 years",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "2+ years experience",
    },
  ];

  // ===============================
  // FETCH EXISTING GOAL
  // ===============================

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await axiosInstance.get("/api/goals");

        if (res.data?.goal) {
          const goal = res.data.goal;

          setFormData({
            goalType: goal.goalType || "",
            targetWeight: goal.targetWeight || "",
            timeline: goal.timeline || "",
            experienceLevel: goal.experienceLevel || "",
          });

          setCalorieTarget(goal.calorieTarget || null);

          setSafetyWarnings(goal.safetyWarnings || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoal();
  }, []);

  // ===============================
  // CALCULATE CALORIES
  // ===============================

  useEffect(() => {
    const warnings = [];

    if (
      maintenanceCalories &&
      formData.goalType &&
      formData.targetWeight &&
      values?.currentWeight
    ) {
      const weightDiff = Math.abs(formData.targetWeight - values.currentWeight);

      const months = parseInt(formData.timeline);

      let calculatedCalories = maintenanceCalories;

      // LOSE
      if (formData.goalType === "lose") {
        const weeklyLoss = weightDiff / (months * 4);

        if (weeklyLoss > 1) {
          warnings.push("Your target exceeds 1kg/week.");
        }

        const dailyDeficit = (weightDiff * 7700) / (months * 30);

        calculatedCalories = Math.round(maintenanceCalories - dailyDeficit);

        if (calculatedCalories < 1200) {
          warnings.push("Calories below 1200/day are unsafe.");

          calculatedCalories = 1200;
        }
      }

      // GAIN
      else if (formData.goalType === "gain" || formData.goalType === "muscle") {
        const weeklyGain = weightDiff / (months * 4);

        if (weeklyGain > 0.5) {
          warnings.push("Weight gain exceeds 0.5kg/week.");
        }

        const dailySurplus = (weightDiff * 7700) / (months * 30);

        calculatedCalories = Math.round(maintenanceCalories + dailySurplus);

        if (calculatedCalories > maintenanceCalories + 500) {
          warnings.push("Large calorie surplus detected.");
        }
      }

      // MAINTAIN
      else {
        calculatedCalories = maintenanceCalories;
      }

      setCalorieTarget(calculatedCalories);

      setSafetyWarnings(warnings);
    }
  }, [formData, maintenanceCalories, values?.currentWeight]);

  // ===============================
  // SEND DATA TO PARENT
  // ===============================

  useEffect(() => {
    if (onChange) {
      onChange({
        ...formData,
        calorieTarget,
        safetyWarnings,
      });
    }
  }, [formData, calorieTarget, safetyWarnings, onChange]);

  // ===============================
  // INPUT HANDLER
  // ===============================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // SAVE GOAL
  // ===============================

  const handleSaveGoal = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        currentWeight: values?.currentWeight,
        maintenanceCalories,
        calorieTarget,
        safetyWarnings,
      };

      const res = await axiosInstance.post("/api/goals/save", payload);

      console.log(res.data);

      alert("Goal saved successfully");
    } catch (error) {
      console.log(error);

      alert("Failed to save goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goal Settings</h2>

        <p className="text-gray-600 text-sm">Define your fitness goals</p>
      </div>

      {/* GOAL TYPES */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What's your primary goal?
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goalTypes.map((goal) => {
            const Icon = goal.icon;

            const isSelected = formData.goalType === goal.value;

            return (
              <motion.button
                key={goal.value}
                type="button"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    goalType: goal.value,
                  }))
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${goal.bgColor} ${goal.border}`
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? goal.color : "text-gray-400"
                    }`}
                  />

                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    {goal.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* TARGET WEIGHT */}

      {formData.goalType !== "maintain" && formData.goalType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Weight (kg)
          </label>

          <input
            type="number"
            name="targetWeight"
            value={formData.targetWeight}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 outline-none"
            placeholder="Enter target weight"
          />
        </div>
      )}

      {/* TIMELINE */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeline
        </label>

        <select
          name="timeline"
          value={formData.timeline}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 outline-none"
        >
          <option value="">Select Timeline</option>

          {timelineOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* EXPERIENCE */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Experience Level
        </label>

        <div className="grid md:grid-cols-3 gap-4">
          {experienceLevels.map((level) => {
            const isSelected = formData.experienceLevel === level.value;

            return (
              <button
                key={level.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    experienceLevel: level.value,
                  }))
                }
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "bg-purple-50 border-purple-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <p className="font-semibold">{level.label}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {level.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CALORIES */}

      {calorieTarget && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Daily Calorie Target</h3>

              <p className="text-sm text-gray-600">Personalized calories</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-orange-600" />

                <p className="text-4xl font-bold text-orange-600">
                  {calorieTarget}
                </p>
              </div>

              <p className="text-sm text-gray-600">calories/day</p>
            </div>
          </div>
        </div>
      )}

      {/* WARNINGS */}

      {safetyWarnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />

            <div>
              <h4 className="font-semibold">Safety Warnings</h4>

              <ul className="mt-2 space-y-1">
                {safetyWarnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}

      {calorieTarget && safetyWarnings.length === 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />

            <p className="text-sm text-gray-700">
              Your goal setup looks safe and sustainable.
            </p>
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}

      <button
        type="button"
        onClick={handleSaveGoal}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all"
      >
        {loading ? "Saving..." : "Save Goal"}
      </button>
    </div>
  );
};

export default GoalSettings;
