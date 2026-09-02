import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiMessageSquare,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoRestaurant } from "react-icons/io5";
import { GiFlexibleLamp } from "react-icons/gi";
import { GiTreeGrowth } from "react-icons/gi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 0,
      label: "Profile",
      icon: FiUser,
      path: "/profile",
      color: "text-pink-600",
    },
    {
      id: 1,
      label: "Tracking",
      icon: FiTrendingUp,
      path: "/tracking",
      color: "text-purple-600",
    },
    {
      id: 2,
      label: "Analytics",
      icon: FiBarChart2,
      path: "/analytics",
      color: "text-blue-600",
    },
    {
      id: 2.5,
      label: "Reports",
      icon: FiBarChart2,
      path: "/reports",
      color: "text-green-600",
    },
    {
      id: 3,
      label: "Chat",
      icon: FiMessageSquare,
      path: "/chat",
      color: "text-purple-600",
    },
    {
      id: 4,
      label: "Diet",
      icon: IoRestaurant,
      path: "/diet",
      color: "text-orange-600",
    },
    {
      id: 5,
      label: "Workout",
      icon: GiWeightLiftingUp,
      path: "/workout",
      color: "text-indigo-600",
    },
    {
      id: 5.5,
      label: "Overtraining",
      icon: GiFlexibleLamp,
      path: "/overtraining",
      color: "text-red-600",
    },
    {
      id: 5.75,
      label: "Sustainability",
      icon: GiTreeGrowth,
      path: "/sustainability",
      color: "text-teal-600",
    },
    {
      id: 6,
      label: "Settings",
      icon: FiSettings,
      path: "/settings",
      color: "text-red-600",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Mobile Hamburger Button - positioned below navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-18 left-2 z-50 bg-white/50 p-2  rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-gray-900" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {/* Sidebar - Fixed positioning starting below navbar */}
      <aside
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-linear-to-b from-white to-gray-50 shadow-lg lg:shadow-xl border-r border-gray-200 transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-64 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Navigation Menu */}
        <nav className="p-5 mt-5 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  active
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-white" : item.color
                  } transition-colors group-hover:scale-110 duration-300`}
                />
                <span className="font-semibold text-sm">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
