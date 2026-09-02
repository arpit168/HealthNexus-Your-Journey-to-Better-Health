import React, { useEffect, useState } from "react";

const Loader = ({
  fullScreen = true,
  text = "Loading your health data...",
}) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Health tips to show while loading
  const healthTips = [
    "Stay hydrated! Drink at least 8 glasses of water daily",
    "Regular exercise boosts your immune system",
    "Getting 7-8 hours of sleep improves heart health",
    "Meditation reduces stress and anxiety",
    "Take short breaks during work to stretch",
    "Eating colorful fruits provides essential vitamins",
    "Walking 10,000 steps daily improves fitness",
    "Deep breathing exercises lower blood pressure",
  ];

  // Simulate progress for visual appeal
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Rotate health tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 3000);

    return () => clearInterval(tipInterval);
  }, []);

  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Animated Logo */}
      <div className="relative">
        {/* Pulsing background */}
        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping" />

        {/* Main logo container */}
        <div className="relative bg-linear-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform duration-300">
          <svg
            className="w-12 h-12 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        {/* Floating hearts */}
        <div className="absolute -top-2 -right-2">
          <svg
            className="w-4 h-4 text-red-400 animate-bounce"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="absolute -bottom-2 -left-2">
          <svg
            className="w-3 h-3 text-pink-400 animate-bounce delay-150"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name with Animation */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
          HealthNexus
        </h2>
        <p className="text-gray-500 text-sm mt-1">Your Health Companion</p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Text */}
      <div className="flex items-center space-x-2 text-gray-600">
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium">{text}</span>
      </div>

      {/* Health Tips Carousel */}
      <div className="max-w-xs text-center">
        <p className="text-xs text-gray-400 mb-1">💡 Health Tip</p>
        <p className="text-sm text-gray-600 animate-[fadeIn_0.5s_ease-in-out]">
          {healthTips[tipIndex]}
        </p>
      </div>

      {/* Dots Indicator */}
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === tipIndex % 3 ? "w-4 bg-blue-600" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-[fadeIn_0.5s_ease-out]">{loaderContent}</div>
      </div>
    );
  }

  return (
    <div className="py-12 flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

// Minimal Loader
export const MinimalLoader = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const colorClasses = {
    blue: "border-blue-600",
    indigo: "border-indigo-600",
    purple: "border-purple-600",
    green: "border-green-600",
    red: "border-red-600",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
        />
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
        />
      </div>
      <div className="flex items-center space-x-1">
        <svg
          className={`w-4 h-4 text-${color}-600 animate-pulse`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="text-sm text-gray-600">HealthNexus</span>
      </div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 z-50 flex items-center justify-center">
    <div className="relative">
      {/* ECG Line Animation */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50 L50 50 L70 20 L90 80 L110 20 L130 80 L150 50 L400 50"
            stroke="#3B82F6"
            strokeWidth="2"
            fill="none"
            className="animate-draw"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-6 border border-gray-100">
        {/* Pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
          <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 p-5 rounded-2xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">HealthNexus</h2>

        {/* Medical cross animation */}
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-blue-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 100}ms`,
                height: `${16 + i * 4}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="h-10 w-10 bg-gray-200 rounded-full" />
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>

    {/* Chart Skeleton */}
    <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
      <div className="h-48 bg-gray-200 rounded" />
    </div>
  </div>
);

// Button Loader
export const ButtonLoader = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <span>{text}</span>
  </div>
);

// Add custom animations to Tailwind
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .delay-150 {
    animation-delay: 150ms;
  }
  
  .delay-300 {
    animation-delay: 300ms;
  }
`;
document.head.appendChild(style);

export default Loader;
