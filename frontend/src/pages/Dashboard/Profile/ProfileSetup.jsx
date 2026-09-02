import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
} from "lucide-react";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import HealthProfile from "./HealthProfile";
import GoalSettings from "./GoalSettings";
import toast from "react-hot-toast";

const ProfileSetup = ({ onComplete, initialData, step: initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    // Health Profile data
    age: initialData?.age || "",
    sex: initialData?.sex || "",
    height: initialData?.height || "",
    heightUnit: initialData?.heightUnit || "cm",
    weight: initialData?.weight || "",
    activityLevel: initialData?.activityLevel || "",
    bmi: initialData?.bmi || null,
    bmiCategory: initialData?.bmiCategory || "",

    // Goal Settings data
    goalType: initialData?.goalType || "",
    targetWeight: initialData?.targetWeight || "",
    timeline: initialData?.timeline || "",
    experienceLevel: initialData?.experienceLevel || "",
    calorieTarget: initialData?.calorieTarget || null,
  });

  const [errors, setErrors] = useState({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const totalSteps = 2;

  // Calculate maintenance calories based on activity level and weight
  const calculateMaintenanceCalories = () => {
    if (
      !formData.weight ||
      !formData.age ||
      !formData.sex ||
      !formData.activityLevel
    ) {
      return null;
    }

    // Using Mifflin-St Jeor Equation
    let bmr;
    const weight = parseFloat(formData.weight);
    const age = parseInt(formData.age);
    let height = parseFloat(formData.height);

    // Convert height to cm if in feet
    if (formData.heightUnit === "ft") {
      height = height * 30.48;
    }

    if (formData.sex === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (formData.sex === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      // Average for 'other'
      bmr = 10 * weight + 6.25 * height - 5 * age - 78;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };

    const multiplier = activityMultipliers[formData.activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate Health Profile
      if (!formData.age) {
        newErrors.age = "Age is required";
      } else if (formData.age < 10 || formData.age > 120) {
        newErrors.age = "Please enter a valid age (10-120)";
      }

      if (!formData.sex) {
        newErrors.sex = "Sex is required";
      }

      if (!formData.height) {
        newErrors.height = "Height is required";
      } else if (formData.height <= 0) {
        newErrors.height = "Please enter a valid height";
      }

      if (!formData.weight) {
        newErrors.weight = "Weight is required";
      } else if (formData.weight <= 0 || formData.weight > 500) {
        newErrors.weight = "Please enter a valid weight (1-500 kg)";
      }

      if (!formData.activityLevel) {
        newErrors.activityLevel = "Activity level is required";
      }
    } else if (step === 2) {
      // Validate Goal Settings
      if (!formData.goalType) {
        newErrors.goalType = "Please select your primary goal";
      }

      if (formData.goalType !== "maintain" && !formData.targetWeight) {
        newErrors.targetWeight = "Target weight is required for this goal";
      }

      if (!formData.timeline) {
        newErrors.timeline = "Timeline is required";
      }

      if (!formData.experienceLevel) {
        newErrors.experienceLevel = "Experience level is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleComplete();
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handle skip (only for optional steps)
  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      toast.info("Step skipped. You can complete it later from settings.");
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    try {
      localStorage.setItem(
        "healthnexus_profile_draft",
        JSON.stringify(formData),
      );
      setIsDraftSaved(true);
      toast.success("Draft saved successfully!");

      setTimeout(() => {
        setIsDraftSaved(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("healthnexus_profile_draft");
    if (draft && !initialData) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData((prev) => ({ ...prev, ...parsedDraft }));
        toast.success("Draft loaded from previous session");
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Handle completion
  const handleComplete = () => {
    if (onComplete) {
      onComplete(formData);
    } else {
      // Default: save to localStorage and show success
      try {
        const existingUser = JSON.parse(
          localStorage.getItem("healthnexus_user") || "{}",
        );
        const updatedUser = {
          ...existingUser,
          healthData: {
            ...existingUser.healthData,
            profile: {
              age: formData.age,
              gender: formData.sex,
              activityLevel: formData.activityLevel,
            },
            vitals: {
              ...existingUser.healthData?.vitals,
              height: formData.height,
              currentWeight: formData.weight,
              goalWeight: formData.targetWeight || formData.weight,
            },
            goals: {
              primaryGoal: formData.goalType,
              experienceLevel: formData.experienceLevel,
              timeline: formData.timeline,
              calorieTarget: formData.calorieTarget,
            },
          },
        };

        localStorage.setItem("healthnexus_user", JSON.stringify(updatedUser));
        localStorage.removeItem("healthnexus_profile_draft");
        toast.success("Profile setup completed successfully!");
      } catch (error) {
        toast.error("Failed to save profile");
      }
    }
  };

  // Update form data from child components
  const handleHealthProfileChange = (data) => {
    setFormData((prev) => ({ ...prev, ...data, currentWeight: data.weight }));
  };

  const handleGoalSettingsChange = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const maintenanceCalories = calculateMaintenanceCalories();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Profile Setup</h1>
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isDraftSaved ? "Saved!" : "Save Draft"}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-blue-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-4">
              <div
                className={`flex items-center gap-2 ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}
              >
                {currentStep > 1 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentStep === 1
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-400"
                    }`}
                  >
                    <span className="text-xs text-white">1</span>
                  </div>
                )}
                <span className="text-sm font-medium">Health Profile</span>
              </div>

              <div
                className={`flex items-center gap-2 ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}
              >
                {currentStep > 2 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentStep === 2
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-400"
                    }`}
                  >
                    <span className="text-xs text-white">2</span>
                  </div>
                )}
                <span className="text-sm font-medium">Goal Settings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                Medical Disclaimer
              </h4>
              <p className="text-xs text-gray-700">
                The information provided here is for general guidance only.
                Always consult with a qualified healthcare professional before
                starting any new fitness or nutrition program, especially if you
                have pre-existing medical conditions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <HealthProfile
                onChange={handleHealthProfileChange}
                values={formData}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <GoalSettings
                onChange={handleGoalSettingsChange}
                values={formData}
                errors={errors}
                maintenanceCalories={maintenanceCalories}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {/* Skip button - only show on optional steps */}
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip for now
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {currentStep === totalSteps ? (
                <>
                  Complete
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSetup;
