import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Ruler,
  Weight,
  Activity,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const HealthProfile = ({ onChange, values, errors }) => {
  const [formData, setFormData] = useState({
    age: values?.age || "",
    sex: values?.sex || "",
    height: values?.height || "",
    heightUnit: values?.heightUnit || "cm",
    weight: values?.weight || "",
    activityLevel: values?.activityLevel || "",
  });

  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");

  // Activity level options
  const activityLevels = [
    {
      value: "sedentary",
      label: "Sedentary",
      description: "Little or no exercise",
    },
    {
      value: "light",
      label: "Lightly Active",
      description: "Exercise 1-3 days/week",
    },
    {
      value: "moderate",
      label: "Moderately Active",
      description: "Exercise 3-5 days/week",
    },
    {
      value: "active",
      label: "Very Active",
      description: "Exercise 6-7 days/week",
    },
    {
      value: "extreme",
      label: "Extremely Active",
      description: "Physical job or 2x training",
    },
  ];

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      let heightInMeters;
      if (formData.heightUnit === "cm") {
        heightInMeters = formData.height / 100;
      } else {
        // Convert feet to meters (assuming format is decimal, e.g., 5.8 feet)
        heightInMeters = formData.height * 0.3048;
      }

      const calculatedBmi = (
        formData.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBmi);

      // Determine BMI category
      if (calculatedBmi < 18.5) {
        setBmiCategory("Underweight");
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiCategory("Normal weight");
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    } else {
      setBmi(null);
      setBmiCategory("");
    }
  }, [formData.height, formData.weight, formData.heightUnit]);

  // Update parent component whenever form data changes
  useEffect(() => {
    if (onChange) {
      onChange({ ...formData, bmi, bmiCategory });
    }
  }, [formData, bmi, bmiCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBmiColor = () => {
    if (!bmi) return "text-gray-600";
    if (bmi < 18.5) return "text-blue-600";
    if (bmi >= 18.5 && bmi < 25) return "text-green-600";
    if (bmi >= 25 && bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Health Profile
        </h2>
        <p className="text-gray-600 text-sm">
          Tell us about your physical characteristics to personalize your
          experience
        </p>
      </div>

      {/* Age & Sex Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Age
            </div>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="10"
            max="120"
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
              errors?.age
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
            }`}
            placeholder="Enter your age"
          />
          {errors?.age && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.age}
            </p>
          )}
        </div>

        {/* Sex Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              Sex
            </div>
          </label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
              errors?.sex
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
            }`}
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors?.sex && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.sex}
            </p>
          )}
        </div>
      </div>

      {/* Height Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-green-600" />
            Height
          </div>
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            min="0"
            step="0.1"
            className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all outline-none ${
              errors?.height
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
            }`}
            placeholder={formData.heightUnit === "cm" ? "170" : "5.6"}
          />
          <select
            name="heightUnit"
            value={formData.heightUnit}
            onChange={handleInputChange}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-400 focus:bg-white transition-all outline-none"
          >
            <option value="cm">cm</option>
            <option value="ft">ft</option>
          </select>
        </div>
        {errors?.height && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.height}
          </p>
        )}
      </div>

      {/* Weight Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-orange-600" />
            Current Weight (kg)
          </div>
        </label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          min="0"
          step="0.1"
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
            errors?.weight
              ? "border-red-300 bg-red-50 focus:border-red-500"
              : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
          }`}
          placeholder="Enter your weight in kg"
        />
        {errors?.weight && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.weight}
          </p>
        )}
      </div>

      {/* Activity Level Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Activity Level
          </div>
        </label>
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
            errors?.activityLevel
              ? "border-red-300 bg-red-50 focus:border-red-500"
              : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
          }`}
        >
          <option value="">Select activity level</option>
          {activityLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </select>
        {errors?.activityLevel && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.activityLevel}
          </p>
        )}
      </div>

      {/* BMI Calculator Display */}
      {bmi && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Body Mass Index (BMI)
              </h3>
              <p className="text-sm text-gray-600">
                Based on your height and weight
              </p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${getBmiColor()}`}>{bmi}</p>
              <p className={`text-sm font-medium ${getBmiColor()}`}>
                {bmiCategory}
              </p>
            </div>
          </div>

          {/* BMI Scale */}
          <div className="mt-4">
            <div className="h-2 bg-linear-to-r from-blue-400 via-yellow-400 to-red-400 rounded-full"></div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>

          {/* BMI Information */}
          <div className="mt-4 p-3 bg-white/60 rounded-lg">
            <p className="text-xs text-gray-700">
              <strong>Note:</strong> BMI is a general indicator and may not
              account for muscle mass, bone density, and other factors. Consult
              with a healthcare professional for personalized advice.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HealthProfile;
