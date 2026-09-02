import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiActivity,
  FiHeart,
  FiTarget,
  FiArrowRight,
  FiUsers,
  FiShield,
  FiZap,
  FiTrendingUp,
  FiChevronRight,
  FiLogOut,
  FiCpu,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMenu,
  FiX,
  FiAward,
  FiClock,
  FiCalendar,
  FiDroplet,
  FiWind,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Rotating metrics for preview
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Features with enhanced icons
  const features = [
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description:
        "Get personalized workout recommendations based on your performance data",
      linear: "from-emerald-500 to-teal-500",
      delay: "100",
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: "Health Monitoring",
      description: "Track heart rate, calories, and vital metrics in real-time",
      linear: "from-blue-500 to-indigo-500",
      delay: "200",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Goal Tracking",
      description:
        "Set and achieve fitness milestones with smart progress tracking",
      linear: "from-purple-500 to-pink-500",
      delay: "300",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Visualize your progress with detailed charts and insights",
      linear: "from-orange-500 to-red-500",
      delay: "400",
    },
  ];

  // Metrics for rotating display
  const metrics = [
    {
      label: "Heart Rate",
      value: "142",
      unit: "bpm",
      change: "+8",
      icon: <FiHeart className="w-4 h-4" />,
      color: "rose",
    },
    {
      label: "Power Output",
      value: "285",
      unit: "W",
      change: "+15",
      icon: <FiZap className="w-4 h-4" />,
      color: "amber",
    },
    {
      label: "Duration",
      value: "45",
      unit: "min",
      change: "--",
      icon: <FiClock className="w-4 h-4" />,
      color: "blue",
    },
    {
      label: "Calories",
      value: "520",
      unit: "kcal",
      change: "+12",
      icon: <FiActivity className="w-4 h-4" />,
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-blue-100/10 to-indigo-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className={`space-y-8 transition-all duration-1000 transform ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-linear-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-100/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  AI-POWERED FITNESS
                </span>
                <FiCpu className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
              </div>

              {/* Main Heading with Animation */}
              <h1 className="relative">
                <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Your personal
                </span>
                <span className="relative inline-block mt-2">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-linear">
                    AI fitness coach
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-linear-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Track workouts, monitor health metrics, and get personalized
                insights to achieve your fitness goals faster with our
                intelligent coaching system.
              </p>

              {/* Enhanced CTA Buttons */}
              {isAuthenticated && user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="group relative px-8 py-4 bg-linear-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Go to Dashboard
                      <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => navigate("/profile")}
                    className="group relative px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">View Profile</span>
                    <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="group relative px-8 py-4 bg-linear-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="group relative px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>

            {/* Right Content - Enhanced Dashboard Preview */}
            <div
              className={`relative transition-all duration-1000 delay-300 transform ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-emerald-400 to-blue-400 rounded-2xl rotate-12 opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-float-delayed"></div>

              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Card Header with Pulse Effect */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse-slow">
                        <FiActivity className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white "></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Session</p>
                      <p className="font-semibold text-gray-900 text-lg">
                        Morning Workout
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    LIVE
                  </span>
                </div>

                {/* Animated Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className={`relative bg-linear-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                        activeMetric === idx
                          ? "ring-2 ring-emerald-500 ring-opacity-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-${metric.color}-500`}>
                          {metric.icon}
                        </span>
                        <span
                          className={`text-xs font-medium text-${metric.color}-600 bg-${metric.color}-50 px-2 py-0.5 rounded-full`}
                        >
                          {metric.change !== "--" ? metric.change : "steady"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {metric.label}
                      </p>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.value}
                        </span>
                        <span className="text-xs text-gray-400">
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Progress Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Daily Goal Progress
                    </span>
                    <span className="text-sm font-bold bg-linear-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                      78% Complete
                    </span>
                  </div>

                  {/* Animated Progress Bar
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-linear-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full animate-progress"
                      style={{ width: '78%' }}
                    >
                      <div className="absolute top-0 right-0 w-2 h-full bg-white opacity-30 animate-shimmer"></div>
                    </div>
                  </div> */}

                  {/* Milestone Indicators */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiAward className="w-3 h-3" /> 0%
                    </span>
                    <span className="flex items-center gap-1">
                      <FiTarget className="w-3 h-3" /> 50%
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <FiAward className="w-3 h-3" /> 100%
                    </span>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      45
                    </div>
                    <div className="text-xs text-gray-500">Workouts</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      12.5
                    </div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      3.2k
                    </div>
                    <div className="text-xs text-gray-500">Calories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-6 mb-4">
              Everything you need to
              <span className="bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                reach your goals
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides all the tools you need to track,
              analyze, and improve your fitness journey.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.linear} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                ></div>

                <div
                  className={`w-14 h-14 bg-linear-to-br ${feature.linear} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-emerald-600 group-hover:to-blue-600 transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiArrowRight className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide-in {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes linear {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-linear {
          background-size: 200% 200%;
          animation: linear 3s ease infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-out;
        }
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 78%; }
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
        
        .hover\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Home;
