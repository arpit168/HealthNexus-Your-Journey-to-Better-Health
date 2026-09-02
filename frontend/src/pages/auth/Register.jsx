// Register.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Users,
  Ruler,
  Weight,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Heart,
  FileText,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Dumbbell,
  Shield,
  Award,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  validateForm,
  calculateBMI,
  getPasswordStrength,
} from "../../Utils/Validations";
import api from "../../config/Api";

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Health Profile
    age: "",
    biologicalSex: "",
    height: "",
    weight: "",
    activityLevel: "",
    experienceLevel: "",
    primaryGoal: "",

    // Legal
    medicalDisclaimer: false,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength indicator
  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password],
  );

  // BMI Calculation
  const bmi = useMemo(
    () => calculateBMI(formData.weight, formData.height),
    [formData.weight, formData.height],
  );

  // Real-time validation
  useEffect(() => {
    const validation = validateForm(formData);
    setErrors(validation.errors);
    setIsValid(validation.isValid);
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateStep = (step) => {
    const stepFields = {
      1: ["fullName", "email", "password", "confirmPassword"],
      2: [
        "age",
        "biologicalSex",
        "height",
        "weight",
        "activityLevel",
        "experienceLevel",
        "primaryGoal",
      ],
      3: ["medicalDisclaimer", "termsAccepted"],
    };

    const stepErrors = {};
    stepFields[step].forEach((field) => {
      if (errors[field]) {
        stepErrors[field] = errors[field];
      }
    });

    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Mark all fields in current step as touched to show errors
      const stepFields = {
        1: ["fullName", "email", "password", "confirmPassword"],
        2: [
          "age",
          "biologicalSex",
          "height",
          "weight",
          "activityLevel",
          "experienceLevel",
          "primaryGoal",
        ],
        3: ["medicalDisclaimer", "termsAccepted"],
      };

      const newTouched = { ...touched };
      stepFields[currentStep].forEach((field) => {
        newTouched[field] = true;
      });
      setTouched(newTouched);

      toast.error("Please fill all required fields correctly");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3) || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/register", formData);

      setIsSuccess(true);
      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/login", { state: { user: response.user } });
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Step configuration
  const steps = [
    {
      number: 1,
      title: "Personal Info",
      icon: User,
      description: "Basic details",
    },
    {
      number: 2,
      title: "Health Profile",
      icon: Heart,
      description: "Fitness metrics",
    },
    {
      number: 3,
      title: "Legal",
      icon: Shield,
      description: "Terms & agreements",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-300/5 rounded-full"
        />
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-linear-to-r from-green-400 to-blue-500 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, bounce: 0.5 }}
              className="text-center"
            >
              <CheckCircle className="w-24 h-24 text-white mx-auto mb-4" />
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white"
              >
                Welcome to HealthNexus!
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 mt-2"
              >
                Redirecting to your dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Header */}
        <div className="mb-8">
          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.number
                        ? "bg-green-500 text-white"
                        : currentStep === step.number
                          ? "bg-white text-blue-600 shadow-lg"
                          : "bg-white/20 text-white"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.number
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`text-[10px] ${
                      currentStep >= step.number
                        ? "text-white/80"
                        : "text-white/40"
                    }`}
                  >
                    {step.description}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 relative">
                    <div className="h-1 bg-white/20 rounded-full">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: currentStep > step.number ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-green-400 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Title */}
          <motion.h2
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white mb-2"
          >
            {steps[currentStep - 1].title}
          </motion.h2>
          <p className="text-white/80 text-sm">
            Step {currentStep} of {steps.length}:{" "}
            {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Personal Information */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                      />
                    </div>
                    {touched.fullName && errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-300 text-xs mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                      />
                    </div>
                    {touched.email && errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-300 text-xs mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-white/40 hover:text-white/60" />
                        ) : (
                          <Eye className="w-5 h-5 text-white/40 hover:text-white/60" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2"
                      >
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((level) => (
                            <motion.div
                              key={level}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: level * 0.1 }}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.level
                                  ? passwordStrength.level === 1
                                    ? "bg-red-400"
                                    : passwordStrength.level === 2
                                      ? "bg-yellow-400"
                                      : passwordStrength.level === 3
                                        ? "bg-blue-400"
                                        : "bg-green-400"
                                  : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs mt-1 text-white/60">
                          {passwordStrength.message}
                        </p>
                      </motion.div>
                    )}

                    {touched.password && errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-300 text-xs mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-white/40 hover:text-white/60" />
                        ) : (
                          <Eye className="w-5 h-5 text-white/40 hover:text-white/60" />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-300 text-xs mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Health Profile */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Age */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Age
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="25"
                          className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                        />
                      </div>
                      {touched.age && errors.age && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.age}
                        </p>
                      )}
                    </div>

                    {/* Biological Sex */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Gender
                      </label>
                      <select
                        name="biologicalSex"
                        value={formData.biologicalSex}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all"
                      >
                        <option value="" className="bg-gray-800">
                          Select
                        </option>
                        <option value="male" className="bg-gray-800">
                          Male
                        </option>
                        <option value="female" className="bg-gray-800">
                          Female
                        </option>
                        <option value="other" className="bg-gray-800">
                          Other
                        </option>
                      </select>
                      {touched.biologicalSex && errors.biologicalSex && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.biologicalSex}
                        </p>
                      )}
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Height (cm)
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="175"
                          className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                        />
                      </div>
                      {touched.height && errors.height && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.height}
                        </p>
                      )}
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="70"
                          className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                        />
                      </div>
                      {touched.weight && errors.weight && (
                        <p className="text-red-300 text-xs mt-1">
                          {errors.weight}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* BMI Preview */}
                  {bmi && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/20 p-3 rounded-lg"
                    >
                      <p className="text-sm text-white">
                        Your BMI: <span className="font-bold">{bmi.value}</span>
                        {" - "}
                        <span
                          className={`font-semibold ${
                            bmi.category === "Normal"
                              ? "text-green-300"
                              : bmi.category === "Overweight"
                                ? "text-yellow-300"
                                : bmi.category === "Obese"
                                  ? "text-red-300"
                                  : "text-blue-300"
                          }`}
                        >
                          {bmi.category}
                        </span>
                      </p>
                    </motion.div>
                  )}

                  {/* Activity Level */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all"
                    >
                      <option value="" className="bg-gray-800">
                        Select Activity Level
                      </option>
                      <option value="sedentary" className="bg-gray-800">
                        Sedentary (little or no exercise)
                      </option>
                      <option value="light" className="bg-gray-800">
                        Lightly Active (1-3 days/week)
                      </option>
                      <option value="moderate" className="bg-gray-800">
                        Moderately Active (3-5 days/week)
                      </option>
                      <option value="very" className="bg-gray-800">
                        Very Active (6-7 days/week)
                      </option>
                      <option value="extra" className="bg-gray-800">
                        Extra Active (athlete/physical job)
                      </option>
                    </select>
                    {touched.activityLevel && errors.activityLevel && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.activityLevel}
                      </p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all"
                    >
                      <option value="" className="bg-gray-800">
                        Select Experience Level
                      </option>
                      <option value="beginner" className="bg-gray-800">
                        Beginner (0-1 years)
                      </option>
                      <option value="intermediate" className="bg-gray-800">
                        Intermediate (1-3 years)
                      </option>
                      <option value="advanced" className="bg-gray-800">
                        Advanced (3+ years)
                      </option>
                    </select>
                    {touched.experienceLevel && errors.experienceLevel && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.experienceLevel}
                      </p>
                    )}
                  </div>

                  {/* Primary Goal */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Primary Goal
                    </label>
                    <select
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all"
                    >
                      <option value="" className="bg-gray-800">
                        Select Primary Goal
                      </option>
                      <option value="weight_loss" className="bg-gray-800">
                        Weight Loss
                      </option>
                      <option value="muscle_gain" className="bg-gray-800">
                        Muscle Gain
                      </option>
                      <option value="maintenance" className="bg-gray-800">
                        Maintenance
                      </option>
                      <option value="endurance" className="bg-gray-800">
                        Endurance
                      </option>
                      <option value="strength" className="bg-gray-800">
                        Strength
                      </option>
                    </select>
                    {touched.primaryGoal && errors.primaryGoal && (
                      <p className="text-red-300 text-xs mt-1">
                        {errors.primaryGoal}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Legal */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Medical Disclaimer */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        name="medicalDisclaimer"
                        checked={formData.medicalDisclaimer}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 mr-3"
                      />
                      <label className="text-sm text-white">
                        I confirm that I have consulted with a healthcare
                        professional before starting any fitness program
                      </label>
                    </div>
                    {touched.medicalDisclaimer && errors.medicalDisclaimer && (
                      <p className="text-red-300 text-xs flex items-center mt-2">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.medicalDisclaimer}
                      </p>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 mr-3"
                      />
                      <label className="text-sm text-white">
                        I agree to the Terms & Conditions and Privacy Policy
                      </label>
                    </div>
                    {touched.termsAccepted && errors.termsAccepted && (
                      <p className="text-red-300 text-xs flex items-center mt-2">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.termsAccepted}
                      </p>
                    )}
                  </div>

                  {/* Summary Card */}
                  <div className="bg-linear-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Registration Summary
                    </h4>
                    <div className="space-y-2 text-sm text-white/80">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.fullName || "Not provided"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.email || "Not provided"}
                      </p>
                      <p>
                        <span className="font-medium">Age:</span>{" "}
                        {formData.age || "Not provided"}
                      </p>
                      <p>
                        <span className="font-medium">Goal:</span>{" "}
                        {formData.primaryGoal?.replace("_", " ") ||
                          "Not selected"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </motion.button>
              )}

              {currentStep < steps.length ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center ml-auto"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!validateStep(3) || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center ml-auto ${
                    !validateStep(3) || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed text-gray-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Login Link */}
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-white/80 mt-6"
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-white font-semibold hover:text-white/80 transition-colors underline"
              >
                Sign In
              </button>
            </motion.p>
          </form>
        </motion.div>

        {/* Features Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: Zap, text: "AI-Powered" },
            { icon: TrendingUp, text: "Track Progress" },
            { icon: Award, text: "Expert Guidance" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-center space-x-2 text-white/80"
            >
              <feature.icon className="w-4 h-4" />
              <span className="text-xs">{feature.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
