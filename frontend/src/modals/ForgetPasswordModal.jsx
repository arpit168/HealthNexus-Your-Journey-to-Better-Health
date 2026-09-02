import React, { useState } from "react";
import {
  BsArrowClockwise,
  BsEnvelope,
  BsShieldLock,
  BsLock,
} from "react-icons/bs";
import api from "../config/Api";
import toast from "react-hot-toast";

const ForgetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    cfNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (step === 1) {
        if (!formData.email) {
          toast.error("Email is required");
          return;
        }

        const res = await api.post("/auth/genOtp", {
          email: formData.email,
        });

        toast.success(res.data.message);
        setStep(2);
      } else if (step === 2) {
        if (!formData.otp) {
          toast.error("OTP is required");
          return;
        }

        const res = await api.post("/auth/verifyOtp", {
          email: formData.email,
          otp: formData.otp,
        });

        toast.success(res.data.message);
        setStep(3);
      } else if (step === 3) {
        if (!formData.newPassword || !formData.cfNewPassword) {
          toast.error("Both password fields are required");
          return;
        }

        if (formData.newPassword !== formData.cfNewPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const res = await api.post("/auth/forgetPassword", {
          email: formData.email,
          newPassword: formData.newPassword,
        });

        toast.success(res.data.message);
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: "Email" },
      { id: 2, label: "OTP" },
      { id: 3, label: "Password" },
    ];
    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= s.id
                    ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= s.id ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  step > s.id
                    ? "bg-linear-to-r from-blue-500 to-indigo-600"
                    : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center px-4 z-50 animate-fadeIn">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Modal Card */}
      <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-300 scale-100 hover:scale-[1.01]">
        {/* Header with linear */}
        <div className="relative px-6 py-5 border-b border-gray-200/50 bg-linear-to-r from-blue-600 to-indigo-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BsShieldLock className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Reset Password
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-200 hover:rotate-90"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-6">{renderStepIndicator()}</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <BsEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1 mt-1">
                We'll send a 6-digit OTP to this email
              </p>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                One-Time Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <BsShieldLock />
                </div>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1 mt-1">
                Check your inbox for the OTP
              </p>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <BsLock />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <BsLock />
                  </div>
                  <input
                    type="password"
                    name="cfNewPassword"
                    value={formData.cfNewPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <span className="animate-spin">
                  <BsArrowClockwise />
                </span>
                Processing...
              </>
            ) : step === 1 ? (
              "Send OTP"
            ) : step === 2 ? (
              "Verify OTP"
            ) : (
              "Update Password"
            )}
          </button>

          {/* Hint for step 1 to go back? (optional, but we don't want to change logic) */}
          {step > 1 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none"
              >
                ← Back
              </button>
            </p>
          )}
        </form>
      </div>

      {/* Add custom keyframes for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ForgetPasswordModal;
