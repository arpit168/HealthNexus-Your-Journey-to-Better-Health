import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Heart, AlertTriangle, Activity, BarChart3 } from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import FatigueScore from "./overtraining/FatigueScore";
import RecoveryRate from "./overtraining/RecoveryRate";
import InjuryRiskLevel from "./overtraining/InjuryRiskLevel";
import OvertrainingAlertCount from "./overtraining/OvertrainingAlertCount";
import RecoveryDayFrequency from "./overtraining/RecoveryDayFrequency";

const Overtraining = () => {
  const [activeTab, setActiveTab] = useState("fatigue");

  const tabs = [
    { id: "fatigue", label: "Fatigue Score", icon: Zap, color: "orange" },
    { id: "recovery", label: "Recovery Rate", icon: Heart, color: "red" },
    {
      id: "injury",
      label: "Injury Risk",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      id: "alerts",
      label: "Overtraining Alerts",
      icon: Activity,
      color: "blue",
    },
    {
      id: "frequency",
      label: "Recovery Days",
      icon: BarChart3,
      color: "green",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-red-50 to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-10 h-10 text-orange-600" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Overtraining Metrics
              </h1>
            </div>
            <p className="text-gray-600">
              Monitor your fatigue, recovery rate, injury risk, and training
              load to prevent overtraining syndrome.
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
                        ? "bg-linear-to-r from-orange-600 to-red-600 text-white shadow-md"
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

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "fatigue" && <FatigueScore />}
              {activeTab === "recovery" && <RecoveryRate />}
              {activeTab === "injury" && <InjuryRiskLevel />}
              {activeTab === "alerts" && <OvertrainingAlertCount />}
              {activeTab === "frequency" && <RecoveryDayFrequency />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overtraining;
