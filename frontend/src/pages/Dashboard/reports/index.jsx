import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, BarChart3, TrendingUp, Award } from "lucide-react";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import MultiWeekReport from "./MultiWeekReport";
import WeeklyReport from "./WeeklyReport";
import MonthlyReport from "./MonthlyReport";
import YearlyReport from "./YearlyReport";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("weekly");

  const tabs = [
    { id: "weekly", label: "Weekly Report", icon: Calendar, color: "indigo" },
    { id: "monthly", label: "Monthly Report", icon: BarChart3, color: "green" },
    {
      id: "multiweek",
      label: "Multi-Week Report",
      icon: TrendingUp,
      color: "blue",
    },
    { id: "yearly", label: "Yearly Report", icon: Award, color: "purple" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Progress Reports
              </h1>
            </div>
            <p className="text-gray-600">
              Comprehensive insights into your fitness journey with detailed
              analytics and trends.
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
                        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md"
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

          {/* Report Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "weekly" && <WeeklyReport />}
              {activeTab === "monthly" && <MonthlyReport />}
              {activeTab === "multiweek" && <MultiWeekReport />}
              {activeTab === "yearly" && <YearlyReport />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
