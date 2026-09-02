import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiHome,
  FiUser,
  FiSettings,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const userData = user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileMenuOpen && !e.target.closest(".profile-menu")) {
        setIsProfileMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileMenuOpen, isMobileMenuOpen]);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData?.fullName) return "U";
    return userData.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 shadow-xl shadow-gray-400 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-white/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section - Always visible */}
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-2 group"
            >
              <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-1.5 rounded-xl transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
                <FiActivity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HealthNexus
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                  Your Health Companion
                </span>
              </div>
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isAuthenticated ? (
              <>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 flex items-center gap-1"
                  >
                    <FiLogIn className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-1 sm:gap-2"
                  >
                    <FiUserPlus className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Get Started</span>
                  </button>
                </div>
              </>
            ) : (
              /* Logged In - Show User Menu */
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* User Menu */}
                <div className="flex gap-4 relative profile-menu">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-linear-to-r from-blue-50 to-indigo-50 p-1 rounded-xl hover:bg-blue-100 transition-all duration-300 group"
                    aria-label="User menu"
                  >
                    {/* User Avatar */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center overflow-hidden">
                      {userData?.photo?.url ? (
                        <img
                          src={userData.photo.url}
                          alt={userData.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>

                    {/* User Info - Hidden on mobile */}
                    <div className="hidden md:block text-left">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">
                        {userData?.fullName?.split(" ")[0] || "User"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {userData?.role || "Member"}
                      </p>
                    </div>

                    <FiChevronDown
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-300 mr-1 ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown z-50">
                      {/* User Info Header */}
                      <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-3 sm:p-4 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                            {getUserInitials()}
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-sm sm:text-base truncate">
                              {userData?.fullName || "User"}
                            </p>
                            <p className="text-[10px] sm:text-xs opacity-90 truncate">
                              {userData?.email || "user@email.com"}
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-xs mt-2 opacity-75">
                          {getGreeting()}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={() => handleNavigation("/profile")}
                          className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                        >
                          <FiUser className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600" />
                          <span className="group-hover:text-blue-600">
                            My Profile
                          </span>
                        </button>

                        <button
                          onClick={() => handleNavigation("/dashboard")}
                          className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                        >
                          <FiHome className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600" />
                          <span className="group-hover:text-blue-600">
                            Dashboard
                          </span>
                        </button>

                        <button
                          onClick={() => handleNavigation("/settings")}
                          className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                        >
                          <FiSettings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600" />
                          <span className="group-hover:text-blue-600">
                            Settings
                          </span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={() => {
                            (logout(), navigate("/"));
                          }}
                          className="flex items-center space-x-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                        >
                          <FiLogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only visible when menu is open and user is not authenticated */}
        {isMobileMenuOpen && !isAuthenticated && (
          <div className="lg:hidden mt-4 pb-3 border-t border-gray-100 animate-slideDown mobile-menu">
            <div className="flex flex-col space-y-1 pt-3">
              <button
                onClick={() => handleNavigation("/")}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 text-left ${
                  location.pathname === "/"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
