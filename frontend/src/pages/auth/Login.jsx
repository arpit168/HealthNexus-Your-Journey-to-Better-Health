// Login.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Heart,
  Zap,
  Target,
} from "lucide-react";
import { loginUser } from "../../Services/authService";
import ForgetPasswordModal from "../../modals/ForgetPasswordModal";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const { login } = useAuth();

  const [isForgetPasswordModelOpen, setIsForgetPasswordModelOpen] =
    useState(false);

  // State management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Testimonials array
  const testimonials = useMemo(
    () => [
      {
        quote:
          "HealthNexus transformed my fitness approach. Achieved results I never thought possible!",
        author: "Sarah Johnson",
        initials: "SJ",
        achievement: "Lost 30lbs in 6 months",
      },
      {
        quote:
          "The AI-powered workouts are incredibly personalized. My strength increased by 40% in 3 months!",
        author: "Michael Chen",
        initials: "MC",
        achievement: "40% strength increase",
      },
      {
        quote:
          "Best investment for my health journey. The nutrition tracking feature alone is worth it!",
        author: "Emma Rodriguez",
        initials: "ER",
        achievement: "Consistent results",
      },
      {
        quote:
          "Finally found a fitness app that actually understands my goals. Highly recommended!",
        author: "James Wilson",
        initials: "JW",
        achievement: "Achieved all fitness goals",
      },
    ],
    [],
  );

  // Testimonial carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Auto-focus email field on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Memoized validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData.email, formData.password]);

  // Real-time validation with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      validateForm();
    }, 300);

    return () => clearTimeout(timer);
  }, [formData, validateForm]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError(false);
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid || isLoading) return;

    setIsLoading(true);
    setLoginError(false);

    try {
      // Use AuthContext login which handles token storage
      const result = await login(formData.email, formData.password);

      if (result?.success) {
        toast.success("Login successful! Redirecting...", {
          icon: "🎉",
          duration: 2000,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        const errMsg = result?.error || "Invalid email or password";
        toast.error(errMsg, { duration: 3000 });
        setLoginError(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login failed",
        { duration: 3000 },
      );
      setLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Optimized animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Memoized background elements
  const BackgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        />
      </div>
    ),
    [],
  );

  // Memoized feature list
  const features = useMemo(
    () => [
      { icon: Heart, text: "Personalized AI Workouts" },
      { icon: Zap, text: "Smart Nutrition Tracking" },
      { icon: Target, text: "Real-time Progress Analytics" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
      {BackgroundElements}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl xl:max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Branding */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 hidden lg:block bg-linear-to-br from-blue-600/90 to-purple-600/90 p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden"
          >
            {/* Animated background */}
            <motion.div
              {...floatingAnimation}
              className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              {...floatingAnimation}
              animate={{ ...floatingAnimation.animate, y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-purple-500/20 rounded-full blur-3xl"
            />

            {/* Logo */}
            <motion.div variants={itemVariants} className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-2 sm:space-x-3"
              >
                <div className="bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                  <Activity className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  HealthNexus
                </span>
              </motion.div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 mt-8 sm:mt-10 md:mt-12">
              <motion.h1
                variants={itemVariants}
                className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              >
                Your Journey to a{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300">
                  Healthier You
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-white/80 text-sm sm:text-base mt-4 sm:mt-6 leading-relaxed"
              >
                Experience AI-driven fitness intelligence with personalized
                workouts and real-time insights.
              </motion.p>

              {/* Features */}
              <motion.div
                variants={itemVariants}
                className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                      <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-white/90 text-xs sm:text-sm">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Testimonial Carousel - Hidden on mobile */}
            <motion.div
              variants={itemVariants}
              className="relative z-10 mt-8 sm:mt-10 md:mt-12 hidden sm:block"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 border border-white/20"
                >
                  <p className="text-white/90 text-xs sm:text-sm italic">
                    "{testimonials[currentTestimonialIndex].quote}"
                  </p>
                  <div className="flex items-center mt-3 sm:mt-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {testimonials[currentTestimonialIndex].initials}
                      </span>
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <p className="text-white font-semibold text-xs sm:text-sm">
                        {testimonials[currentTestimonialIndex].author}
                      </p>
                      <p className="text-white/60 text-xs">
                        {testimonials[currentTestimonialIndex].achievement}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 bg-white p-6 sm:p-8 md:p-10 lg:p-12"
          >
            <div className="max-w-md mx-auto">
              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="text-center lg:text-left"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Welcome Back!
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">
                  Sign in to continue your fitness journey
                </p>
              </motion.div>

              {/* Form */}
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
              >
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 outline-none text-sm sm:text-base
                        ${
                          touched.email && errors.email
                            ? "border-red-300 bg-red-50 focus:border-red-500"
                            : loginError
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                        }
                        hover:border-blue-300 focus:ring-2 focus:ring-blue-100`}
                      placeholder="you@example.com"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {touched.email && errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 sm:pl-10 pr-9 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all duration-200 outline-none text-sm sm:text-base
                        ${
                          touched.password && errors.password
                            ? "border-red-300 bg-red-50 focus:border-red-500"
                            : loginError
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                        }
                        hover:border-blue-300 focus:ring-2 focus:ring-blue-100`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {touched.password && errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs sm:text-sm mt-1 flex items-center"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Login Error */}
                <AnimatePresence mode="wait">
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                      <p className="text-xs sm:text-sm text-red-600">
                        Invalid email or password
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsForgetPasswordModelOpen(true)}
                      className="text-[#f97316] hover:text-[#fb923c] text-sm font-medium transition"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <motion.button
                  whileHover={isValid && !isLoading ? { scale: 1.01 } : {}}
                  whileTap={isValid && !isLoading ? { scale: 0.99 } : {}}
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`w-full py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200
                    ${
                      !isValid || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-500 to-purple-600 hover:shadow-md"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
                      Signing in...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
                    </span>
                  )}
                </motion.button>

                {/* Sign Up Link */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-xs sm:text-sm text-gray-600"
                >
                  Don't have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign up for free
                  </motion.button>
                </motion.p>

                {/* Demo Credentials */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-xs text-gray-500 mb-1.5 sm:mb-2 flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                    Demo Credentials:
                  </p>
                  <p className="text-xs text-gray-600">
                    Email: demo@HealthNexus.com
                    <br />
                    Password: demo123
                  </p>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {isForgetPasswordModelOpen && (
        <ForgetPasswordModal
          onClose={() => setIsForgetPasswordModelOpen(false)}
        />
      )}
    </div>
  );
};

export default Login;
