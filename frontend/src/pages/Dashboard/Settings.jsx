import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { getUserData, updateUserData } from "../../Services/authService";
import toast from "react-hot-toast";
import ResetPasswordModal from "../../modals/ResetPasswordModal";
import api from "../../config/Api";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Profile Information State
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
    address: "",
    city: "",
    pin: "",
  });
  console.log(profileData);

  // Body Parameters State (from healthData.vitals)
  const [bodyData, setBodyData] = useState({
    height: "",
    heightUnit: "cm",
    currentWeight: "",
    goalWeight: "",
    bloodGroup: "",
    heartRate: "",
    bloodPressure: "",
    oxygenSaturation: "",
    temperature: "",
  });

  // Medical History State
  const [medicalHistory, setMedicalHistory] = useState({
    chronicDiseases: [],
    surgeries: [],
    allergies: [],
  });

  // Lifestyle State
  const [lifestyle, setLifestyle] = useState({
    smoking: false,
    alcohol: false,
    exerciseFrequency: "None",
    diet: "N/A",
  });

  // Emergency Contacts State
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Fitness Goals State
  const [fitnessGoals, setFitnessGoals] = useState({
    primaryGoal: "maintain",
    targetDate: "",
    weeklyWeightGoal: "0.5",
  });

  // Diet Preferences State
  const [dietPreferences, setDietPreferences] = useState({
    restrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      keto: false,
      noRestrictions: true,
    },
    allergies: "",
    foodsToAvoid: "",
    mealsPerDay: "4",
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    motivationMessages: false,
    emailSummaries: true,
    smsAlerts: false,
  });

  // Privacy & Security State
  const [privacy, setPrivacy] = useState({
    twoFactorAuth: false,
    medicalDisclaimer: true,
  });

  // App Preferences State
  const [appPreferences, setAppPreferences] = useState({
    units: "metric",
    language: "English",
    theme: "light",
    weeklyReportDay: "Monday",
  });

  // Documents State
  const [documents, setDocuments] = useState({
    gst: "",
    uidai: "",
    pan: "",
  });

  // UI State
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const deleteAccount = async () => {
    try {
      const response = await api.delete("/auth/delete-account");
      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      toast.success("Your account has been deleted. Redirecting...");
      localStorage.removeItem("healthnexus_user");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
      setLoading(false);
    } finally {
      setShowDeleteModal(false);
      setDeleteConfirmText("");
    }
  };

  const loadUserData = () => {
    try {
      const user = getUserData();
      if (user) {
        setUserData(user);

        // Set profile data
        setProfileData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          dateOfBirth: user.dob || "",
          gender: user.gender || "",
          profilePicture: user.photo?.url || null,
          address: user.address || "",
          city: user.city || "",
          pin: user.pin || "",
        });

        // Set body data from healthData.vitals
        if (user.healthData?.vitals) {
          const vitals = user.healthData.vitals;
          setBodyData({
            height: vitals.height || "",
            heightUnit: "cm",
            currentWeight: vitals.weight || "",
            goalWeight: "",
            bloodGroup: vitals.bloodGroup || "N/A",
            heartRate: vitals.heartRate || "",
            bloodPressure: vitals.bloodPressure || "N/A",
            oxygenSaturation: vitals.oxygenSaturation || "",
            temperature: vitals.temperature || "",
          });
        }

        // Set medical history
        if (user.healthData?.medicalHistory) {
          setMedicalHistory({
            chronicDiseases:
              user.healthData.medicalHistory.chronicDiseases || [],
            surgeries: user.healthData.medicalHistory.surgeries || [],
            allergies: user.healthData.medicalHistory.allergies || [],
          });
        }

        // Set lifestyle
        if (user.healthData?.lifestyle) {
          setLifestyle(user.healthData.lifestyle);
        }

        // Set emergency contacts
        if (user.healthData?.emergencyContacts) {
          setEmergencyContacts(user.healthData.emergencyContacts || []);
        }

        // Set documents
        if (user.documents) {
          setDocuments(user.documents);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.phone,
      profileData.dateOfBirth,
      profileData.gender,
      profileData.address,
      profileData.city,
      profileData.pin,
      bodyData.height,
      bodyData.currentWeight,
      bodyData.bloodGroup,
    ];
    const filledFields = fields.filter(
      (field) => field && field !== "N/A" && field !== "",
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    setHasChanges(true);
  };

  const handleBodyDataChange = (field, value) => {
    setBodyData({ ...bodyData, [field]: value });
    setHasChanges(true);
  };

  const handleMedicalHistoryChange = (field, value) => {
    setMedicalHistory({ ...medicalHistory, [field]: value });
    setHasChanges(true);
  };

  const handleLifestyleChange = (field, value) => {
    setLifestyle({ ...lifestyle, [field]: value });
    setHasChanges(true);
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
    setHasChanges(true);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: "", relationship: "", phone: "" },
    ]);
    setHasChanges(true);
  };

  const removeEmergencyContact = (index) => {
    const updated = emergencyContacts.filter((_, i) => i !== index);
    setEmergencyContacts(updated);
    setHasChanges(true);
  };

  const handleFitnessGoalsChange = (field, value) => {
    setFitnessGoals({ ...fitnessGoals, [field]: value });
    setHasChanges(true);
  };

  const handleDietRestrictionChange = (restriction) => {
    const updated = {
      ...dietPreferences,
      restrictions: {
        ...dietPreferences.restrictions,
        [restriction]: !dietPreferences.restrictions[restriction],
        ...(restriction === "noRestrictions"
          ? {
              vegetarian: false,
              vegan: false,
              glutenFree: false,
              dairyFree: false,
              keto: false,
            }
          : { noRestrictions: false }),
      },
    };
    setDietPreferences(updated);
    setHasChanges(true);
  };

  const handleDietPreferenceChange = (field, value) => {
    setDietPreferences({ ...dietPreferences, [field]: value });
    setHasChanges(true);
  };

  const handleNotificationToggle = (notification) => {
    setNotifications({
      ...notifications,
      [notification]: !notifications[notification],
    });
    setHasChanges(true);
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacy({ ...privacy, [setting]: !privacy[setting] });
    setHasChanges(true);
  };

  const handleAppPreferenceChange = (field, value) => {
    setAppPreferences({ ...appPreferences, [field]: value });
    setHasChanges(true);
  };

  const handleDocumentsChange = (field, value) => {
    setDocuments({ ...documents, [field]: value });
    setHasChanges(true);
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicture: reader.result });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      // Prepare updated user data
      const updatedUserData = {
        ...userData,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        dob: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        city: profileData.city,
        pin: profileData.pin,
        photo: {
          ...userData?.photo,
          url: profileData.profilePicture,
        },
        healthData: {
          ...userData?.healthData,
          vitals: {
            ...userData?.healthData?.vitals,
            height: bodyData.height,
            weight: bodyData.currentWeight,
            bloodGroup: bodyData.bloodGroup,
            heartRate: bodyData.heartRate,
            bloodPressure: bodyData.bloodPressure,
            oxygenSaturation: bodyData.oxygenSaturation,
            temperature: bodyData.temperature,
          },
          medicalHistory: medicalHistory,
          lifestyle: lifestyle,
          emergencyContacts: emergencyContacts,
        },
        documents: documents,
      };

      // Update in localStorage
      updateUserData(updatedUserData);

      toast.success("Settings saved successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  console.log(documents);

  const handleExportData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `healthnexus-data-${new Date().toISOString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.success("Data exported successfully!");
  };

  const handleResetProgress = () => {
    setShowResetModal(false);
    toast.success("Progress reset successfully");
  };

  const handleDeactivateAccount = () => {
    setShowDeactivateModal(false);
    toast.success("Account deactivated successfully");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Settings</h1>
            <div className="profile-completion">
              <span className="completion-label">Profile Completion</span>
              <div className="completion-bar">
                <div
                  className="completion-fill"
                  style={{ width: `${calculateProfileCompletion()}%` }}
                ></div>
              </div>
              <span className="completion-percentage">
                {calculateProfileCompletion()}%
              </span>
            </div>
          </div>
          <button
            className={`btn btn-primary ${!hasChanges ? "disabled" : ""}`}
            onClick={handleSaveChanges}
            disabled={!hasChanges || loading}
          >
            {loading ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>

        {/* Settings Tabs */}
        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "health" ? "active" : ""}`}
            onClick={() => setActiveTab("health")}
          >
            ❤️ Health Data
          </button>
          <button
            className={`tab-btn ${activeTab === "medical" ? "active" : ""}`}
            onClick={() => setActiveTab("medical")}
          >
            🏥 Medical History
          </button>
          <button
            className={`tab-btn ${activeTab === "emergency" ? "active" : ""}`}
            onClick={() => setActiveTab("emergency")}
          >
            🚨 Emergency
          </button>
          <button
            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            ⚙️ Preferences
          </button>
          <button
            className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            📄 Documents
          </button>
        </div>

        <div className="settings-container">
          {/* Tab 1: Profile Information */}
          {activeTab === "profile" && (
            <div className="settings-section">
              <h2>Personal Information</h2>

              <div className="profile-picture-section">
                <div className="current-picture">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Profile" />
                  ) : (
                    <div className="placeholder-avatar">
                      {profileData.fullName?.charAt(0) || "👤"}
                    </div>
                  )}
                </div>
                <div className="picture-actions">
                  <label htmlFor="profile-upload" className="btn btn-secondary">
                    📸 Upload Photo
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: "none" }}
                  />
                  <p className="upload-hint">JPG, PNG or GIF (MAX. 5MB)</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      handleProfileChange("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                    placeholder="your.email@example.com"
                    disabled
                    className="disabled-input"
                  />
                  <small className="field-note">Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      handleProfileChange("phone", e.target.value)
                    }
                    placeholder="+91 934 567 89**"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      handleProfileChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={(e) =>
                      handleProfileChange("gender", e.target.value)
                    }
                  >
                    <option value="N/A">Not Specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      handleProfileChange("address", e.target.value)
                    }
                    placeholder="Your address"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) =>
                      handleProfileChange("city", e.target.value)
                    }
                    placeholder="Your city"
                  />
                </div>

                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    value={profileData.pin}
                    onChange={(e) => handleProfileChange("pin", e.target.value)}
                    placeholder="PIN code"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Health Data */}
          {activeTab === "health" && (
            <div className="settings-section">
              <h2>Health Data</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={bodyData.height}
                    onChange={(e) =>
                      handleBodyDataChange("height", e.target.value)
                    }
                    placeholder="175"
                  />
                </div>

                <div className="form-group">
                  <label>Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyData.currentWeight}
                    onChange={(e) =>
                      handleBodyDataChange("currentWeight", e.target.value)
                    }
                    placeholder="82.5"
                  />
                </div>

                <div className="form-group">
                  <label>Goal Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyData.goalWeight}
                    onChange={(e) =>
                      handleBodyDataChange("goalWeight", e.target.value)
                    }
                    placeholder="75"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    value={bodyData.bloodGroup}
                    onChange={(e) =>
                      handleBodyDataChange("bloodGroup", e.target.value)
                    }
                  >
                    <option value="N/A">Not Specified</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={bodyData.heartRate}
                    onChange={(e) =>
                      handleBodyDataChange("heartRate", e.target.value)
                    }
                    placeholder="72"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Pressure</label>
                  <input
                    type="text"
                    value={bodyData.bloodPressure}
                    onChange={(e) =>
                      handleBodyDataChange("bloodPressure", e.target.value)
                    }
                    placeholder="120/80"
                  />
                </div>

                <div className="form-group">
                  <label>Oxygen Saturation (%)</label>
                  <input
                    type="number"
                    value={bodyData.oxygenSaturation}
                    onChange={(e) =>
                      handleBodyDataChange("oxygenSaturation", e.target.value)
                    }
                    placeholder="98"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label>Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyData.temperature}
                    onChange={(e) =>
                      handleBodyDataChange("temperature", e.target.value)
                    }
                    placeholder="36.5"
                  />
                </div>
              </div>

              <div className="form-group">
                <h3>Lifestyle</h3>
                <div className="checkbox-group">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={lifestyle.smoking}
                      onChange={(e) =>
                        handleLifestyleChange("smoking", e.target.checked)
                      }
                    />
                    <span className="checkbox-label">🚬 Smoking</span>
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={lifestyle.alcohol}
                      onChange={(e) =>
                        handleLifestyleChange("alcohol", e.target.checked)
                      }
                    />
                    <span className="checkbox-label">🍷 Alcohol</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Exercise Frequency</label>
                <select
                  value={lifestyle.exerciseFrequency}
                  onChange={(e) =>
                    handleLifestyleChange("exerciseFrequency", e.target.value)
                  }
                >
                  <option value="None">None</option>
                  <option value="Light">Light (1-2 days/week)</option>
                  <option value="Moderate">Moderate (3-4 days/week)</option>
                  <option value="Active">Active (5-6 days/week)</option>
                  <option value="Very Active">Very Active (Daily)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Diet Type</label>
                <select
                  value={lifestyle.diet}
                  onChange={(e) =>
                    handleLifestyleChange("diet", e.target.value)
                  }
                >
                  <option value="N/A">Not Specified</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Pescatarian">Pescatarian</option>
                  <option value="Keto">Keto</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab 3: Medical History */}
          {activeTab === "medical" && (
            <div className="settings-section">
              <h2>Medical History</h2>

              <div className="form-group">
                <label>Chronic Diseases</label>
                <input
                  type="text"
                  value={medicalHistory.chronicDiseases.join(", ")}
                  onChange={(e) =>
                    handleMedicalHistoryChange(
                      "chronicDiseases",
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="e.g., Diabetes, Hypertension (comma separated)"
                />
                <small className="field-note">
                  Separate multiple entries with commas
                </small>
              </div>

              <div className="form-group">
                <label>Surgeries</label>
                <input
                  type="text"
                  value={medicalHistory.surgeries.join(", ")}
                  onChange={(e) =>
                    handleMedicalHistoryChange(
                      "surgeries",
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="e.g., Appendectomy, Tonsillectomy (comma separated)"
                />
                <small className="field-note">
                  Separate multiple entries with commas
                </small>
              </div>

              <div className="form-group">
                <label>Allergies</label>
                <input
                  type="text"
                  value={medicalHistory.allergies.join(", ")}
                  onChange={(e) =>
                    handleMedicalHistoryChange(
                      "allergies",
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="e.g., Penicillin, Peanuts (comma separated)"
                />
                <small className="field-note">
                  Separate multiple entries with commas
                </small>
              </div>
            </div>
          )}

          {/* Tab 4: Emergency Contacts */}
          {activeTab === "emergency" && (
            <div className="settings-section">
              <h2>Emergency Contacts</h2>

              {emergencyContacts.map((contact, index) => (
                <div key={index} className="emergency-contact-card">
                  <div className="contact-header">
                    <h4>Contact {index + 1}</h4>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => removeEmergencyContact(index)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "relationship",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Spouse, Parent"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "phone",
                            e.target.value,
                          )
                        }
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn btn-secondary"
                onClick={addEmergencyContact}
              >
                ➕ Add Emergency Contact
              </button>
            </div>
          )}

          {/* Tab 5: Preferences */}
          {activeTab === "preferences" && (
            <>
              {/* Fitness Goals */}
              <div className="settings-section">
                <h2>Fitness Goals</h2>

                <div className="form-group">
                  <label>Primary Goal</label>
                  <div className="radio-group">
                    {[
                      { value: "weight-loss", label: "🔥 Weight Loss" },
                      { value: "muscle-gain", label: "💪 Muscle Gain" },
                      { value: "maintain", label: "✓ Maintain Weight" },
                    ].map((goal) => (
                      <label key={goal.value} className="radio-option">
                        <input
                          type="radio"
                          name="primaryGoal"
                          value={goal.value}
                          checked={fitnessGoals.primaryGoal === goal.value}
                          onChange={(e) =>
                            handleFitnessGoalsChange(
                              "primaryGoal",
                              e.target.value,
                            )
                          }
                        />
                        <span className="radio-label">{goal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Target Date (Optional)</label>
                    <input
                      type="date"
                      value={fitnessGoals.targetDate}
                      onChange={(e) =>
                        handleFitnessGoalsChange("targetDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Weekly Weight Goal</label>
                    <select
                      value={fitnessGoals.weeklyWeightGoal}
                      onChange={(e) =>
                        handleFitnessGoalsChange(
                          "weeklyWeightGoal",
                          e.target.value,
                        )
                      }
                    >
                      <option value="0.25">0.25 kg per week</option>
                      <option value="0.5">0.5 kg per week</option>
                      <option value="0.75">0.75 kg per week</option>
                      <option value="1">1 kg per week</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Diet Preferences */}
              <div className="settings-section">
                <h2>Diet Preferences</h2>

                <div className="form-group">
                  <label>Dietary Restrictions</label>
                  <div className="checkbox-group">
                    {[
                      { key: "vegetarian", label: "🥗 Vegetarian" },
                      { key: "vegan", label: "🌱 Vegan" },
                      { key: "glutenFree", label: "🌾 Gluten-free" },
                      { key: "dairyFree", label: "🥛 Dairy-free" },
                      { key: "keto", label: "🥑 Keto" },
                      { key: "noRestrictions", label: "✓ No restrictions" },
                    ].map((restriction) => (
                      <label key={restriction.key} className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={
                            dietPreferences.restrictions[restriction.key]
                          }
                          onChange={() =>
                            handleDietRestrictionChange(restriction.key)
                          }
                        />
                        <span className="checkbox-label">
                          {restriction.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Allergies</label>
                    <input
                      type="text"
                      value={dietPreferences.allergies}
                      onChange={(e) =>
                        handleDietPreferenceChange("allergies", e.target.value)
                      }
                      placeholder="e.g., Peanuts, Shellfish"
                    />
                  </div>

                  <div className="form-group">
                    <label>Foods to Avoid</label>
                    <input
                      type="text"
                      value={dietPreferences.foodsToAvoid}
                      onChange={(e) =>
                        handleDietPreferenceChange(
                          "foodsToAvoid",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Mushrooms, Olives"
                    />
                  </div>

                  <div className="form-group">
                    <label>Meals Per Day</label>
                    <select
                      value={dietPreferences.mealsPerDay}
                      onChange={(e) =>
                        handleDietPreferenceChange(
                          "mealsPerDay",
                          e.target.value,
                        )
                      }
                    >
                      <option value="3">3 meals</option>
                      <option value="4">4 meals</option>
                      <option value="5">5 meals</option>
                      <option value="6">6 meals</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="settings-section">
                <h2>Notifications</h2>

                <div className="toggle-list">
                  {[
                    {
                      key: "workoutReminders",
                      label: "Workout Reminders",
                      description: "Get notified when it's time to work out",
                    },
                    {
                      key: "mealReminders",
                      label: "Meal Reminders",
                      description: "Reminders for meal logging and prep",
                    },
                    {
                      key: "progressUpdates",
                      label: "Progress Updates",
                      description: "Weekly summary of your achievements",
                    },
                    {
                      key: "motivationMessages",
                      label: "Motivation Messages",
                      description: "Daily inspirational quotes and tips",
                    },
                    {
                      key: "emailSummaries",
                      label: "Email Summaries",
                      description: "Monthly progress reports via email",
                    },
                    {
                      key: "smsAlerts",
                      label: "SMS Alerts",
                      description: "Important notifications via SMS",
                    },
                  ].map((notification) => (
                    <div key={notification.key} className="toggle-item">
                      <div className="toggle-info">
                        <div className="toggle-label">{notification.label}</div>
                        <div className="toggle-description">
                          {notification.description}
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications[notification.key]}
                          onChange={() =>
                            handleNotificationToggle(notification.key)
                          }
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Preferences */}
              <div className="settings-section">
                <h2>App Settings</h2>

                <div className="form-group">
                  <label>Units</label>
                  <div className="radio-group horizontal">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="units"
                        value="metric"
                        checked={appPreferences.units === "metric"}
                        onChange={(e) =>
                          handleAppPreferenceChange("units", e.target.value)
                        }
                      />
                      <span className="radio-label">Metric (kg/cm)</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="units"
                        value="imperial"
                        checked={appPreferences.units === "imperial"}
                        onChange={(e) =>
                          handleAppPreferenceChange("units", e.target.value)
                        }
                      />
                      <span className="radio-label">Imperial (lbs/inches)</span>
                    </label>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={appPreferences.language}
                      onChange={(e) =>
                        handleAppPreferenceChange("language", e.target.value)
                      }
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Weekly Report Day</label>
                    <select
                      value={appPreferences.weeklyReportDay}
                      onChange={(e) =>
                        handleAppPreferenceChange(
                          "weeklyReportDay",
                          e.target.value,
                        )
                      }
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Theme</label>
                  <div className="radio-group horizontal">
                    {[
                      { value: "light", label: "☀️ Light" },
                      { value: "dark", label: "🌙 Dark" },
                      { value: "system", label: "💻 System" },
                    ].map((theme) => (
                      <label key={theme.value} className="radio-option">
                        <input
                          type="radio"
                          name="theme"
                          value={theme.value}
                          checked={appPreferences.theme === theme.value}
                          onChange={(e) =>
                            handleAppPreferenceChange("theme", e.target.value)
                          }
                        />
                        <span className="radio-label">{theme.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab 6: Documents */}
          {activeTab === "documents" && (
            <div className="settings-section">
              <h2>Documents</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>GST Number</label>
                  <input
                    type="text"
                    value={documents.gst}
                    onChange={(e) =>
                      handleDocumentsChange("gst", e.target.value)
                    }
                    placeholder="GST number"
                  />
                </div>

                <div className="form-group">
                  <label>UIDAI (Aadhaar)</label>
                  <input
                    type="text"
                    value={documents.uidai}
                    onChange={(e) =>
                      handleDocumentsChange("uidai", e.target.value)
                    }
                    placeholder="Aadhaar number"
                  />
                </div>

                <div className="form-group">
                  <label>PAN Card</label>
                  <input
                    type="text"
                    value={documents.pan}
                    onChange={(e) =>
                      handleDocumentsChange("pan", e.target.value)
                    }
                    placeholder="PAN number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          <div className="settings-section">
            <h2>Privacy & Security</h2>

            <div className="action-list">
              <div className="action-item">
                <div className="action-info">
                  <div className="action-label">🔒 Change Password</div>
                  <div className="action-description">
                    Update your account password
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(true)}
                  className="px-6 py-2 rounded-md bg-[#6626c0] text-white hover:scale-105 hover:shadow-2xl hover:bg-[#481b86] transition duration-300"
                >
                  Change
                </button>
              </div>

              <div className="action-item">
                <div className="action-info">
                  <div className="action-label">Two-Factor Authentication</div>
                  <div className="action-description">
                    Add an extra layer of security
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacy.twoFactorAuth}
                    onChange={() => handlePrivacyToggle("twoFactorAuth")}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="action-item">
                <div className="action-info">
                  <div className="action-label">📊 Export Data</div>
                  <div className="action-description">
                    Download all your data in JSON format
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handleExportData}
                >
                  Export
                </button>
              </div>

              <div className="action-item">
                <div className="action-info">
                  <div className="action-label">Medical Disclaimer</div>
                  <div className="action-description">
                    I acknowledge this app is not medical advice
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacy.medicalDisclaimer}
                    onChange={() => handlePrivacyToggle("medicalDisclaimer")}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-section danger-zone">
            <h2>⚠️ Danger Zone</h2>
            <p className="danger-warning">
              These actions are irreversible. Please be certain.
            </p>

            <div className="danger-actions">
              <div className="danger-item">
                <div className="danger-info">
                  <div className="danger-label">Reset All Progress</div>
                  <div className="danger-description">
                    Clear all workout and diet data, start fresh
                  </div>
                </div>
                <button
                  className="btn btn-danger-outline"
                  onClick={() => setShowResetModal(true)}
                >
                  Reset Progress
                </button>
              </div>

              <div className="danger-item">
                <div className="danger-info">
                  <div className="danger-label">Deactivate Account</div>
                  <div className="danger-description">
                    Temporarily disable your account (reversible)
                  </div>
                </div>
                <button
                  className="btn btn-danger-outline"
                  onClick={() => setShowDeactivateModal(true)}
                >
                  Deactivate
                </button>
              </div>

              <div className="danger-item">
                <div className="danger-info">
                  <div className="danger-label">Delete Account</div>
                  <div className="danger-description">
                    Permanently delete your account and all data
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteAccount()}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showResetModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowResetModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Reset All Progress?</h3>
              <p>
                This will permanently delete all your workout and diet data.
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleResetProgress}
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeactivateModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeactivateModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Deactivate Account?</h3>
              <p>
                Your account will be temporarily disabled. You can reactivate it
                anytime by logging in.
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeactivateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeactivateAccount}
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Account Permanently?</h3>
              <p>
                ⚠️ This action is irreversible. All your data will be
                permanently deleted.
              </p>
              <p className="danger-text">Type "DELETE" to confirm:</p>
              <input
                type="text"
                className="confirm-input"
                placeholder="Type DELETE"
              />
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isResetPasswordModalOpen && (
          <ResetPasswordModal
            onClose={() => setIsResetPasswordModalOpen(false)}
          />
        )}

        {showDeleteModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Account Permanently?</h3>
              <p>
                ⚠️ This action is irreversible. All your data will be
                permanently deleted.
              </p>
              <p className="danger-text">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                className="confirm-input"
                placeholder="Type DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={handleDeleteAccount}
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .settings-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f9fafb;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .profile-completion {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .completion-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .completion-bar {
          width: 150px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .completion-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          transition: width 0.6s ease;
        }

        .completion-percentage {
          font-size: 0.875rem;
          font-weight: 700;
          color: #10b981;
        }

        .settings-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          color: #4b5563;
          border: 2px solid transparent;
        }

        .tab-btn:hover {
          background: #f3f4f6;
        }

        .tab-btn.active {
          background: #4f46e5;
          color: white;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-primary:hover:not(.disabled) {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .btn-primary.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #4f46e5;
          border: 2px solid #4f46e5;
        }

        .btn-secondary:hover {
          background: #f5f3ff;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-danger-outline {
          background: white;
          color: #ef4444;
          border: 2px solid #ef4444;
        }

        .btn-danger-outline:hover {
          background: #fef2f2;
        }

        .btn-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .settings-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1.5rem 0;
        }

        .settings-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 1rem 0;
        }

        .profile-picture-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .current-picture {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e5e7eb;
        }

        .current-picture img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 3rem;
          font-weight: 600;
        }

        .picture-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .field-note {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .disabled-input {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .radio-group.horizontal {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .radio-option:hover {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .radio-option input[type="radio"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .checkbox-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkbox-option:hover {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .checkbox-option input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .toggle-item:hover {
          background: #f9fafb;
          border-color: #4f46e5;
        }

        .toggle-info {
          flex: 1;
        }

        .toggle-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .toggle-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
          flex-shrink: 0;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e5e7eb;
          transition: 0.3s;
          border-radius: 28px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #4f46e5;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .action-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .action-info {
          flex: 1;
        }

        .action-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .action-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .emergency-contact-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .contact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .contact-header h4 {
          margin: 0;
          color: #374151;
        }

        .danger-zone {
          border: 2px solid #fecaca;
          background: #fef2f2;
        }

        .danger-warning {
          color: #991b1b;
          font-size: 0.95rem;
          margin: 0 0 1.5rem 0;
          padding: 0.75rem 1rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .danger-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .danger-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }

        .danger-info {
          flex: 1;
        }

        .danger-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 0.25rem;
        }

        .danger-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s ease;
        }

        .modal-content h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #111827;
        }

        .modal-content p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
          line-height: 1.6;
        }

        .danger-text {
          color: #991b1b;
          font-weight: 600;
        }

        .confirm-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            width: 100%;
          }

          .completion-bar {
            width: 100px;
          }

          .btn {
            width: 100%;
          }

          .settings-section {
            padding: 1.5rem;
          }

          .profile-picture-section {
            flex-direction: column;
            text-align: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .radio-group.horizontal {
            flex-direction: column;
          }

          .settings-tabs {
            flex-direction: column;
          }

          .tab-btn {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Settings;
