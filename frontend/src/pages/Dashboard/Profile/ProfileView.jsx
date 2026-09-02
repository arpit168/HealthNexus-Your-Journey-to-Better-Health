import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Activity,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Heart,
  Ruler,
  Weight,
} from "lucide-react";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import toast from "react-hot-toast";

const ProfileView = ({ userData: propUserData, onEdit, onDelete }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load user data from localStorage or props
    const loadUserData = () => {
      try {
        if (propUserData) {
          setUserData(propUserData);
        } else {
          const storedUser = localStorage.getItem("healthnexus_user");
          if (storedUser) {
            setUserData(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [propUserData]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      toast.success("Edit functionality coming soon!");
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast.error("Delete functionality not implemented");
    }
    setShowDeleteConfirm(false);
  };

  const calculateBMI = () => {
    if (
      userData?.healthData?.vitals?.height &&
      userData?.healthData?.vitals?.currentWeight
    ) {
      const heightInMeters = userData.healthData.vitals.height / 100;
      const bmi = (
        userData.healthData.vitals.currentWeight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      return bmi;
    }
    return "N/A";
  };

  const getMemberSince = () => {
    if (userData?.createdAt) {
      return new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "N/A";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  {userData?.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                  {userData?.fullName || "User Name"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Member since {getMemberSince()}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">
                      {userData?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Age</p>
                    <p className="text-sm font-medium text-gray-800">
                      {userData?.healthData?.profile?.age || "N/A"} years
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {userData?.healthData?.profile?.gender || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats and Health Data */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Stats Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Health Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-gray-600">Height</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.healthData?.vitals?.height || "N/A"}
                      <span className="text-sm text-gray-600 ml-1">cm</span>
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="w-5 h-5 text-purple-600" />
                      <p className="text-xs text-gray-600">Current Weight</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.healthData?.vitals?.currentWeight || "N/A"}
                      <span className="text-sm text-gray-600 ml-1">kg</span>
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <p className="text-xs text-gray-600">Goal Weight</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.healthData?.vitals?.goalWeight || "N/A"}
                      <span className="text-sm text-gray-600 ml-1">kg</span>
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-orange-600" />
                      <p className="text-xs text-gray-600">BMI</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {calculateBMI()}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Activity Level & Goals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Fitness Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Activity Level
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {userData?.healthData?.profile?.activityLevel ||
                        "Not Set"}
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Primary Goal
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {userData?.healthData?.goals?.primaryGoal || "Not Set"}
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Heart Rate
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {userData?.healthData?.vitals?.heartRate || "N/A"}
                      <span className="text-sm text-gray-600 ml-1">bpm</span>
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Experience Level
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {userData?.healthData?.goals?.experienceLevel ||
                        "Not Set"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Account Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border border-red-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Account Status
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your account is active and all features are available.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Download Data
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Privacy Settings
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfileView;
