import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiArrowRight,
  FiActivity,
  FiChevronUp,
} from "react-icons/fi";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/";

  // Dashboard routes where footer should not appear
  const dashboardRoutes = [
    "/dashboard",
    "/profile",
    "/tracking",
    "/workout",
    "/diet",
    "/progress",
    "/analytics",
    "/chat",
    "/settings",
  ];
  const isDashboardPage = dashboardRoutes.includes(location.pathname);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  // Show scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Don't render footer on dashboard pages
  if (isDashboardPage) {
    return null;
  }

  return (
    <footer
      className={`${isLandingPage ? "bg-linear-to-b from-white to-blue-50" : "bg-linear-to-b from-white to-gray-50"} border-t border-gray-200 ${isLandingPage ? "mt-20" : "mt-12"} relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow ${
            isLandingPage ? "bg-blue-200" : "bg-blue-100"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000 ${
            isLandingPage ? "bg-indigo-200" : "bg-purple-100"
          }`}
        ></div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 bg-linear-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-500 z-50 ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        } hover:scale-110 active:scale-95`}
      >
        <FiChevronUp className="w-5 h-5 animate-bounce-subtle" />
      </button>

      {/* Landing Page Footer */}
      {isLandingPage ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1 animate-fadeInLeft">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 mb-4 group cursor-pointer"
              >
                <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-2 rounded-lg transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
                  <FiActivity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  HealthNexus
                </span>
              </button>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Your integrated health companion. Making wellness simple,
                accessible, and personalized for everyone.
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center group hover:text-blue-600 transition-colors">
                  <FiMapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span>123 Health Ave, NY 10001</span>
                </div>
                <div className="flex items-center group hover:text-blue-600 transition-colors">
                  <FiPhone className="w-4 h-4 mr-2 text-blue-600" />
                  <span>+1 (555) 789-0123</span>
                </div>
                <div className="flex items-center group hover:text-blue-600 transition-colors">
                  <FiMail className="w-4 h-4 mr-2 text-blue-600" />
                  <span>hello@healthnexus.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div
              className="animate-fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-4 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Product
              </h3>
              <ul className="space-y-3 text-sm">
                {["Features", "Pricing", "Security", "Status"].map(
                  (link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group"
                      >
                        <FiArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div
              className="animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                Company
              </h3>
              <ul className="space-y-3 text-sm">
                {["About", "Blog", "Careers", "Contact"].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center group"
                    >
                      <FiArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div
              className="animate-fadeInRight"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Stay Updated
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get wellness tips and health insights delivered to your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    setIsSubscribed(true);
                    setEmail("");
                    setTimeout(() => setIsSubscribed(false), 3000);
                  }
                }}
                className="flex flex-col space-y-2"
              >
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {isSubscribed && (
                  <p className="text-xs text-green-600">
                    ✓ Thanks for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Social & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-blue-600 transition-all duration-300 hover:scale-125 hover:-translate-y-1"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ),
              )}
            </div>

            <p className="text-sm text-gray-500 flex items-center">
              © {currentYear} HealthNexus. Made with
              <FiHeart className="w-4 h-4 text-red-500 mx-1 animate-heartbeat" />
              for your health
            </p>

            <div className="flex space-x-4 mt-4 md:mt-0 text-gray-500 text-xs">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      ) : (
        // Dashboard Footer
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { number: "500K+", label: "Users" },
              { number: "10K+", label: "Plans" },
              { number: "98%", label: "Happy" },
              { number: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 text-center shadow-sm"
              >
                <p className="text-xl font-bold text-blue-600">{stat.number}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Dashboard", "Health", "Reports", "Settings"].map(
                  (link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Help Center", "Contact Us", "FAQ", "Security"].map(
                  (link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Privacy", "Terms", "Cookies", "HIPAA"].map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-sm text-gray-500">
            <p>
              © {currentYear} HealthNexus. Made with{" "}
              <FiHeart className="w-3 h-3 text-red-500 inline mx-1" /> for
              health
            </p>
            <p>Version 2.5.0 | Last updated: February 2026</p>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">⚕️ Disclaimer:</span> HealthNexus
              provides informational purposes only. Always consult with your
              healthcare provider before making any health decisions.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
