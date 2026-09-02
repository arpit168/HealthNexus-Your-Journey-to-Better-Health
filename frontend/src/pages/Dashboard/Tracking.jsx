import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Scale, Camera, CheckSquare, History } from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import WeightTracker from "./tracking/WeightTracker.jsx";
import MeasurementTracker from "./tracking/MeasurementTracker.jsx";
import ProgressPhotos from "./tracking/ProgressPhotos.jsx";
import AdherenceLog from "./tracking/AdherenceLog.jsx";
import HistoryView from "./tracking/HistoryView.jsx";
import { trackingService } from "../../Services/trackingService";

const Tracking = () => {
  const [activeTab, setActiveTab] = useState("weight");
  const [weightLogs, setWeightLogs] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);

  const tabs = [
    { id: "weight", label: "Weight", icon: Scale },
    { id: "measurements", label: "Measurements", icon: TrendingUp },
    { id: "photos", label: "Progress Photos", icon: Camera },
    { id: "adherence", label: "Adherence", icon: CheckSquare },
    { id: "history", label: "History", icon: History },
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await trackingService.getData();
        if (data) {
          setWeightLogs(data.weightHistory || []);
          setMeasurements(data.measurements || []);
          setPhotos(data.progressPhotos || []);
          setAdherenceLogs(data.adherenceLogs || []);
        }
      } catch (error) {
        console.error("Failed to load tracking data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveTrackingData = async (updatedData) => {
    try {
      await trackingService.updateData(updatedData);
    } catch (error) {
      console.error("Failed to save tracking data:", error);
    }
  };

  const handleWeightSubmit = (entry) => {
    const newLogs = [
      ...weightLogs,
      { ...entry, id: Date.now(), date: new Date() },
    ];
    setWeightLogs(newLogs);
    saveTrackingData({ weightHistory: newLogs });
  };

  const handleWeightDelete = (id) => {
    const newLogs = weightLogs.filter((log) => log.id !== id);
    setWeightLogs(newLogs);
    saveTrackingData({ weightHistory: newLogs });
  };

  const handleMeasurementSubmit = (entry) => {
    const newLogs = [
      ...measurements,
      { ...entry, id: Date.now(), date: new Date() },
    ];
    setMeasurements(newLogs);
    saveTrackingData({ measurements: newLogs });
  };

  const handlePhotoUpload = (photo) => {
    const newLogs = [...photos, { ...photo, id: Date.now(), date: new Date() }];
    setPhotos(newLogs);
    saveTrackingData({ progressPhotos: newLogs });
  };

  const handlePhotoDelete = (id) => {
    const newLogs = photos.filter((photo) => photo.id !== id);
    setPhotos(newLogs);
    saveTrackingData({ progressPhotos: newLogs });
  };

  const handleAdherenceSubmit = (entry) => {
    const newLogs = [...adherenceLogs, { ...entry, id: Date.now() }];
    setAdherenceLogs(newLogs);
    saveTrackingData({ adherenceLogs: newLogs });
  };

  const handleExport = (type) => {
    console.log("Exporting data:", type);
    // TODO: Implement CSV export
  };

  const getAllData = () => {
    return {
      weight: weightLogs,
      measurements,
      photos,
      adherence: adherenceLogs,
    };
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Progress Tracking
              </h1>
            </div>
            <p className="text-gray-600">
              Monitor your weight, measurements, photos, and adherence to reach
              your goals.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "weight" && (
                <WeightTracker
                  logs={weightLogs}
                  goal={75}
                  onSubmit={handleWeightSubmit}
                  onDelete={handleWeightDelete}
                />
              )}

              {activeTab === "measurements" && (
                <MeasurementTracker
                  measurements={measurements}
                  photos={photos}
                  onSubmit={handleMeasurementSubmit}
                />
              )}

              {activeTab === "photos" && (
                <ProgressPhotos
                  photos={photos}
                  onUpload={handlePhotoUpload}
                  onDelete={handlePhotoDelete}
                />
              )}

              {activeTab === "adherence" && (
                <AdherenceLog
                  logs={adherenceLogs}
                  onSubmit={handleAdherenceSubmit}
                  date={new Date()}
                />
              )}

              {activeTab === "history" && (
                <HistoryView
                  data={getAllData()}
                  type="all"
                  onExport={handleExport}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tracking;
