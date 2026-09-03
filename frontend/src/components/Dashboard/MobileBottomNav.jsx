import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUser,
  FiTrendingUp,
  FiBarChart2,
  FiMessageSquare,
} from "react-icons/fi";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If we scroll down more than 10px, hide. If we scroll up, show.
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      id: "profile",
      label: "Profile",
      icon: FiUser,
      path: "/profile",
    },
    {
      id: "tracking",
      label: "Tracking",
      icon: FiTrendingUp,
      path: "/tracking",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: FiBarChart2,
      path: "/analytics",
    },
    {
      id: "chat",
      label: "Chat",
      icon: FiMessageSquare,
      path: "/chat",
    },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div
      className={`lg:hidden fixed bottom-1 left-2 right-2 bg-gray-100  rounded-full border border-gray-200  shadow-lg z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-[150%]"
      }`}
    >
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-1 w-full space-y-1"
            >
              <div
<<<<<<< Updated upstream
                className={`p-2 rounded-xl transition-all duration-300 ${
                  active ? "bg-indigo-50" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    active ? "text-indigo-600" : "text-gray-500"
=======
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  active ? "bg-indigo-50 " : "bg-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-indigo-600" : "text-gray-500 "
>>>>>>> Stashed changes
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  active ? "text-indigo-600" : "text-gray-500 "
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
