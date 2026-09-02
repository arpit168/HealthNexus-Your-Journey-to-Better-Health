import React, { useState } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const ResetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    cfNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch("/user/resetPassword", formData);
      toast.success(res.data.message);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Reset Password
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl transition"
          >
            <RxCross2 />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <InputField
            label="Old Password *"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleInputChange}
            error={errors.oldPassword}
            placeholder="Enter your old password"
          />

          <InputField
            label="New Password *"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange}
            error={errors.newPassword}
            placeholder="Enter your new password"
          />

          <InputField
            label="Confirm New Password *"
            name="cfNewPassword"
            type="password"
            value={formData.cfNewPassword}
            onChange={handleInputChange}
            error={errors.cfNewPassword}
            placeholder="Confirm new password"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 🔹 Reusable input field for light theme */
const InputField = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className={`w-full border rounded-lg p-2.5 bg-gray-50 text-gray-800
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
        ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
      `}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default ResetPasswordModal;
