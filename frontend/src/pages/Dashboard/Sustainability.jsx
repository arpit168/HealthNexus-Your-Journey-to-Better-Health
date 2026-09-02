import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Target, Users, Home } from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import MomentumScore from "./sustainability/MomentumScore";
import CompoundingRate from "./sustainability/CompoundingRate";
import MicroAdjustmentCount from "./sustainability/MicroAdjustmentCount";
import DependencyScore from "./sustainability/DependencyScore";
import LifestyleIntegrationScore from "./sustainability/LifestyleIntegrationScore";

const Sustainability = () => {
  const [activeTab, setActiveTab] = useState("momentum");

  const tabs = [
    { id: "momentum", name: "Momentum Score", icon: TrendingUp },
    { id: "compounding", name: "Compounding Rate", icon: Zap },
    { id: "microadjustment", name: "Micro-Adjustment", icon: Target },
    { id: "dependency", name: "Dependency Score", icon: Users },
    { id: "lifestyle", name: "Lifestyle Integration", icon: Home },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "momentum":
        return <MomentumScore />;
      case "compounding":
        return <CompoundingRate />;
      case "microadjustment":
        return <MicroAdjustmentCount />;
      case "dependency":
        return <DependencyScore />;
      case "lifestyle":
        return <LifestyleIntegrationScore />;
      default:
        return <MomentumScore />;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Sustainability Metrics
          </h1>
          <p className="text-gray-600 mt-2">
            Track your long-term consistency, habits integration, and
            sustainable progress
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-green-600 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Sustainability;
