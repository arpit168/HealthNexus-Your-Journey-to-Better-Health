import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import ReportSummary from "./ReportSummary";
import ReportCharts from "./ReportCharts";
import ReportInsights from "./ReportInsights";
import ReportTables from "./ReportTables";
import PDFDownloadButton from "./PDFDownloadButton";
import EmailReportButton from "./EmailReportButton";
import { reportsService } from "../../../Services/reportsService";

export default function YearlyReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [year]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await reportsService.getYearlyReport(year);
      setMockData(data);
    } catch (error) {
      console.error("Error loading yearly report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (!mockData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available for this year.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
              🏆 Yearly Report
            </h2>
            <p className="text-purple-100 text-lg">
              Your annual fitness journey
            </p>
          </div>
          <div className="flex gap-3">
            <PDFDownloadButton reportData={mockData} />
            <EmailReportButton reportData={mockData} />
          </div>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="w-full md:w-56 bg-gray-800/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      {/* Annual Achievements with enhanced styling */}
      <div className="bg-linear-to-br from-yellow-900/80 to-orange-900/80 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/20 shadow-2xl">
        <h3 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
          🏆 Annual Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockData.achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="bg-black/40 backdrop-blur-sm p-6 rounded-xl text-center border border-yellow-500/20 hover:border-yellow-400/40 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20 duration-300"
            >
              <p className="text-yellow-300 text-4xl font-extrabold mb-2">✨</p>
              <p className="text-white font-bold text-xl">{achievement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Goals Progress with enhanced styling */}
      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-600/30 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">
          🎯 Annual Goals Progress
        </h3>
        <div className="space-y-5">
          {mockData.annualGoals.map((goal, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all"
            >
              <div className="flex justify-between mb-3">
                <span className="text-white font-semibold text-lg">
                  {goal.name}
                </span>
                <span className="text-green-400 font-bold text-xl">
                  {goal.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner overflow-hidden">
                <div
                  className="bg-linear-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-700 shadow-lg"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Analysis with enhanced styling */}
      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-600/30 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">
          🍃 Seasonal Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(mockData.seasonAnalysis).map(([season, score]) => (
            <div
              key={season}
              className="bg-linear-to-br from-blue-900/60 to-purple-900/60 backdrop-blur-sm p-6 rounded-xl text-center border border-blue-500/20 hover:border-blue-400/40 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 duration-300"
            >
              <p className="text-blue-300 capitalize text-sm font-semibold">
                {season}
              </p>
              <p className="text-4xl font-extrabold text-white mt-3">
                {score}%
              </p>
              <p className="text-gray-400 text-xs mt-2">Avg Performance</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 bg-gray-900/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-700/50">
        {["overview", "charts", "tables", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all capitalize ${
              activeTab === tab
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && (
          <ReportSummary data={mockData} period={`Year ${year}`} />
        )}
        {activeTab === "charts" && <ReportCharts chartData={mockData} />}
        {activeTab === "tables" && (
          <ReportTables data={mockData} type="workout" pageSize={10} />
        )}
        {activeTab === "insights" && <ReportInsights reportData={mockData} />}
      </div>
    </div>
  );
}
