import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Target,
  Settings,
  Save,
  Mail,
  Calendar,
  Activity,
  Ruler,
  Weight,
  TrendingUp,
  Shield,
} from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import HealthProfile from "./Profile/HealthProfile";
import GoalSettings from "./Profile/GoalSettings";
import toast from "react-hot-toast";
import profileService from "../../Services/profileService";
import PhotoUpload from "./Profile/PhotoUpload";
import ResponsiveSlider from "../../components/Common/ResponsiveSlider";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form data for health profile
  const [healthFormData, setHealthFormData] = useState({
    age: "",
    sex: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    activityLevel: "",
    bmi: null,
    bmiCategory: "",
  });

  // Form data for goal settings
  const [goalFormData, setGoalFormData] = useState({
    goalType: "",
    targetWeight: "",
    timeline: "",
    experienceLevel: "",
    calorieTarget: null,
  });

  const [errors, setErrors] = useState({});

  // Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "health", label: "Health Profile", icon: Heart },
    { id: "goals", label: "Goals & Targets", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: parsedUser } = await profileService.getProfile();
        if (parsedUser) {
          setUserData(parsedUser);

          // Populate form data from user data
          setHealthFormData({
            age: parsedUser?.healthData?.profile?.age || "",
            sex: parsedUser?.healthData?.profile?.gender || "",
            height: parsedUser?.healthData?.vitals?.height || "",
            heightUnit: "cm",
            weight: parsedUser?.healthData?.vitals?.currentWeight || "",
            activityLevel: parsedUser?.healthData?.profile?.activityLevel || "",
            bmi: null,
            bmiCategory: "",
          });

          setGoalFormData({
            goalType: parsedUser?.healthData?.goals?.primaryGoal || "",
            targetWeight: parsedUser?.healthData?.vitals?.goalWeight || "",
            timeline: parsedUser?.healthData?.goals?.timeline || "",
            experienceLevel:
              parsedUser?.healthData?.goals?.experienceLevel || "",
            calorieTarget: parsedUser?.healthData?.goals?.calorieTarget || null,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Calculate BMI
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

  // Calculate maintenance calories
  const calculateMaintenanceCalories = () => {
    if (
      !healthFormData.weight ||
      !healthFormData.age ||
      !healthFormData.sex ||
      !healthFormData.activityLevel
    ) {
      return null;
    }

    let bmr;
    const weight = parseFloat(healthFormData.weight);
    const age = parseInt(healthFormData.age);
    let height = parseFloat(healthFormData.height);

    if (healthFormData.heightUnit === "ft") {
      height = height * 30.48;
    }

    if (healthFormData.sex === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (healthFormData.sex === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 78;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };

    const multiplier = activityMultipliers[healthFormData.activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };

  // Get member since date
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

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      const updatedHealthData = {
        profile: {
          age: Number(healthFormData.age),
          gender: healthFormData.sex,
          activityLevel: healthFormData.activityLevel,
        },
        vitals: {
          height: Number(healthFormData.height),
          currentWeight: Number(healthFormData.weight),
          goalWeight:
            Number(goalFormData.targetWeight) || Number(healthFormData.weight),
        },
        goals: {
          primaryGoal: goalFormData.goalType,
          experienceLevel: goalFormData.experienceLevel,
          timeline: goalFormData.timeline,
          calorieTarget: Number(goalFormData.calorieTarget),
        },
      };

      const updatedFields = {
        healthData: updatedHealthData,
      };

      const { user } = await profileService.updateProfile(updatedFields);
      setUserData(user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  // Handle health profile changes
  const handleHealthProfileChange = (data) => {
    setHealthFormData((prev) => ({ ...prev, ...data }));
  };

  const handlePhotoUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (userData?._id) {
        formData.append("id", userData._id);
      }

      const response = await profileService.changePhoto(formData);
      if (response.data) {
        setUserData(response.data);
      }
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update profile photo");
    }
  };

  const handlePhotoRemove = async () => {
    try {
      const response = await profileService.updateProfile({
        photo: { url: "", publicID: "" },
      });
      if (response.data) {
        setUserData(response.data);
      }
      toast.success("Profile photo removed successfully!");
    } catch (error) {
      console.error("Error removing photo:", error);
      toast.error("Failed to remove profile photo");
    }
  };

  // Handle goal settings changes
  const handleGoalSettingsChange = (data) => {
    setGoalFormData((prev) => ({ ...prev, ...data }));
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800  mb-2">
            Profile Management
          </h1>
          <p className="text-gray-600 ">
            Manage your health profile, goals, and settings
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white  rounded-xl shadow-sm border border-gray-200  mb-6 overflow-x-auto">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600  hover:bg-gray-100 "
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-1">
                  <div className="bg-white  rounded-xl shadow-lg p-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                      <PhotoUpload
                        currentPhoto={
                          userData?.photo?.url || userData?.profilePicture
                        }
                        onPhotoUpdate={handlePhotoUpdate}
                        onPhotoRemove={handlePhotoRemove}
                      />
                      <h2 className="text-2xl font-bold text-gray-800  text-center mt-4">
                        {userData?.fullName || "User Name"}
                      </h2>
                      <p className="text-gray-500  text-sm mt-1">
                        Member since {getMemberSince()}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50  rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500 ">Email</p>
                          <p className="text-sm font-medium text-gray-800 ">
                            {userData?.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50  rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500 ">Age</p>
                          <p className="text-sm font-medium text-gray-800 ">
                            {userData?.healthData?.profile?.age || "N/A"} years
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50  rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500 ">Gender</p>
                          <p className="text-sm font-medium text-gray-800  capitalize">
                            {userData?.healthData?.profile?.gender || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Health Statistics */}
                  <div className="bg-white  rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800  mb-4">
                      Health Statistics
                    </h3>
                    <ResponsiveSlider>
                      <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg min-w-[140px]">
                        <div className="flex items-center gap-2 mb-2">
                          <Ruler className="w-5 h-5 text-blue-600" />
                          <p className="text-xs text-gray-600 ">Height</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">
                          {userData?.healthData?.vitals?.height || "N/A"}
                          <span className="text-sm text-gray-600  ml-1">
                            cm
                          </span>
                        </p>
                      </div>

                      <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Weight className="w-5 h-5 text-purple-600" />
                          <p className="text-xs text-gray-600 ">Weight</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">
                          {userData?.healthData?.vitals?.currentWeight || "N/A"}
                          <span className="text-sm text-gray-600  ml-1">
                            kg
                          </span>
                        </p>
                      </div>

                      <div className="p-4 bg-linear-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-green-600" />
                          <p className="text-xs text-gray-600 ">Goal</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">
                          {userData?.healthData?.vitals?.goalWeight || "N/A"}
                          <span className="text-sm text-gray-600  ml-1">
                            kg
                          </span>
                        </p>
                      </div>

                      <div className="p-4 bg-linear-to-br from-orange-50 to-orange-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-orange-600" />
                          <p className="text-xs text-gray-600 ">BMI</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 ">
                          {calculateBMI()}
                        </p>
                      </div>
                    </ResponsiveSlider>
                  </div>

                  {/* Fitness Profile */}
                  <div className="bg-white  rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800  mb-4">
                      Fitness Profile
                    </h3>
                    <ResponsiveSlider>
                      <div className="p-4 border border-gray-200  rounded-lg min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <p className="text-sm font-medium text-gray-700 ">
                            Activity Level
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-800  capitalize">
                          {userData?.healthData?.profile?.activityLevel ||
                            "Not Set"}
                        </p>
                      </div>

                      <div className="p-4 border border-gray-200  rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <p className="text-sm font-medium text-gray-700 ">
                            Primary Goal
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-800  capitalize">
                          {userData?.healthData?.goals?.primaryGoal ||
                            "Not Set"}
                        </p>
                      </div>

                      <div className="p-4 border border-gray-200  rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-red-600" />
                          <p className="text-sm font-medium text-gray-700 ">
                            Heart Rate
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-800 ">
                          {userData?.healthData?.vitals?.heartRate || "N/A"}
                          <span className="text-sm text-gray-600  ml-1">
                            bpm
                          </span>
                        </p>
                      </div>

                      <div className="p-4 border border-gray-200  rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-gray-700 ">
                            Experience
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-800  capitalize">
                          {userData?.healthData?.goals?.experienceLevel ||
                            "Not Set"}
                        </p>
                      </div>
                    </ResponsiveSlider>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Health Profile Tab */}
          {activeTab === "health" && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white  rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 ">
                    Health Profile
                  </h2>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>

                <HealthProfile
                  onChange={handleHealthProfileChange}
                  values={healthFormData}
                  errors={errors}
                />
              </div>
            </motion.div>
          )}

          {/* Goals & Targets Tab */}
          {activeTab === "goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white  rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 ">
                    Goals & Targets
                  </h2>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>

                <GoalSettings
                  onChange={handleGoalSettingsChange}
                  values={{
                    ...goalFormData,
                    currentWeight: healthFormData.weight,
                  }}
                  errors={errors}
                  maintenanceCalories={calculateMaintenanceCalories()}
                />
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white  rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800  mb-6">
                  Profile Settings
                </h2>

                {/* Medical Disclaimer */}
                <div className="bg-blue-50  border-l-4 border-blue-400 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800  text-sm mb-1">
                        Medical Disclaimer
                      </h4>
                      <p className="text-xs text-gray-700 ">
                        The information provided here is for general guidance
                        only. Always consult with a qualified healthcare
                        professional before starting any new fitness or
                        nutrition program.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-4">
                  <div className="border border-gray-200  rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800  mb-2">
                      Data Management
                    </h3>
                    <p className="text-sm text-gray-600  mb-4">
                      Download or manage your personal health data
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Download Data
                      </button>
                      <button className="px-4 py-2 border border-gray-300  text-gray-700  rounded-lg hover:bg-gray-50  transition-colors text-sm">
                        Export Profile
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200  rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800  mb-2">
                      Privacy Settings
                    </h3>
                    <p className="text-sm text-gray-600  mb-4">
                      Control your privacy and data sharing preferences
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 ">
                          Share progress with trainers
                        </span>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 ">
                          Allow data analytics
                        </span>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded"
                          defaultChecked
                        />
                      </label>
                    </div>
                  </div>

                  <div className="border border-red-200 bg-red-50  rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-600 mb-4">
                      Irreversible actions - proceed with caution
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
