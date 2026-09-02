import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import ReportSummary from "./ReportSummary";
import ReportCharts from "./ReportCharts";
import ReportInsights from "./ReportInsights";
import ReportTables from "./ReportTables";
import PDFDownloadButton from "./PDFDownloadButton";
import EmailReportButton from "./EmailReportButton";
import { reportsService } from "../../../Services/reportsService";

export default function WeeklyReport() {
  const [weekStart, setWeekStart] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [weekStart]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await reportsService.getWeeklyReport(weekStart);
      setMockData(data);
    } catch (error) {
      console.error("Error loading weekly report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!mockData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available for this week.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-indigo-900/80 to-blue-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-indigo-500/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
              📅 Weekly Report
            </h2>
            <p className="text-indigo-100 text-lg">Your week at a glance</p>
          </div>
          <div className="flex gap-3">
            <PDFDownloadButton reportData={mockData} />
            <EmailReportButton reportData={mockData} />
          </div>
        </div>

        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          className="w-full md:w-56 bg-gray-800/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      {/* Daily Breakdown with enhanced cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div
            key={day}
            className={`p-5 rounded-xl text-center transition-all transform hover:scale-105 hover:shadow-xl duration-300 ${
              idx === 2
                ? "bg-linear-to-br from-green-500/80 to-green-700/80 shadow-lg shadow-green-500/30 border border-green-400/30"
                : idx < 5
                  ? "bg-linear-to-br from-blue-800/80 to-blue-900/80 border border-blue-500/20"
                  : "bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/30"
            }`}
          >
            <p className="text-white font-bold text-lg">{day}</p>
            <p className="text-white text-2xl font-extrabold mt-2">
              {100 - idx * 5}%
            </p>
            <p className="text-xs text-gray-300 mt-1">Complete</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 bg-gray-900/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-700/50">
        {["overview", "charts", "tables", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all capitalize ${
              activeTab === tab
                ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && (
          <div className="space-y-4">
            <ReportSummary data={mockData} period="This Week" />
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h4 className="text-white font-bold mb-3">Best Day Award 🏅</h4>
              <p className="text-gray-300">
                {mockData.bestDay} was your best day with 100% completion!
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h4 className="text-white font-bold mb-3">Analysis</h4>
              <p className="text-gray-300">{mockData.worstDayAnalysis}</p>
            </div>
          </div>
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
