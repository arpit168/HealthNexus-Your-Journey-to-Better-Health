import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import ReportSummary from "./ReportSummary";
import ReportCharts from "./ReportCharts";
import ReportInsights from "./ReportInsights";
import ReportTables from "./ReportTables";
import PDFDownloadButton from "./PDFDownloadButton";
import EmailReportButton from "./EmailReportButton";
import { reportsService } from "../../../Services/reportsService";

export default function MonthlyReport() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState(null);

  useEffect(() => {
    loadReportData();
  }, [month, year]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await reportsService.getMonthlyReport(month, year);
      setMockData(data);
    } catch (error) {
      console.error("Error loading monthly report:", error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  if (!mockData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-green-900/80 to-blue-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-green-500/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
              📆 Monthly Report
            </h2>
            <p className="text-green-100 text-lg">
              Monthly achievements and progress summary
            </p>
          </div>
          <div className="flex gap-3">
            <PDFDownloadButton reportData={mockData} />
            <EmailReportButton reportData={mockData} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-200 mb-2 font-semibold">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full bg-gray-800/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2 font-semibold">
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full bg-gray-800/80 backdrop-blur-sm text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Achievements with enhanced styling */}
      <div className="bg-linear-to-br from-yellow-900/80 to-orange-900/80 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/20 shadow-2xl">
        <h3 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
          🏆 Monthly Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockData.achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="bg-black/40 backdrop-blur-sm p-5 rounded-xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <p className="text-white font-semibold text-lg">{achievement}</p>
            </div>
          ))}
        </div>
        <p className="text-xl text-yellow-200 font-bold mt-6 text-center animate-pulse">
          {mockData.monthHighlight}
        </p>
      </div>

      <div className="flex gap-3 bg-gray-900/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-700/50">
        {["overview", "charts", "tables", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all capitalize ${
              activeTab === tab
                ? "bg-linear-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/30 scale-105"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && (
          <ReportSummary data={mockData} period={`${months[month]} ${year}`} />
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
