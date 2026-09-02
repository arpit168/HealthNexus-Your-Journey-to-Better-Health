import React, { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Loader,
} from "lucide-react";
import ReportSummary from "./ReportSummary";
import ReportCharts from "./ReportCharts";
import ReportInsights from "./ReportInsights";
import ReportTables from "./ReportTables";
import PDFDownloadButton from "./PDFDownloadButton";
import EmailReportButton from "./EmailReportButton";
import reportsService from "../../../Services/reportsService";

export default function MultiWeekReport() {
  const [weekCount, setWeekCount] = useState(4);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [reportType, setReportType] = useState("summary");
  const [activeTab, setActiveTab] = useState("overview");
  const [compareMode, setCompareMode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState(null);

  // Load report data
  useEffect(() => {
    loadReportData();
  }, [weekCount, customStart, customEnd]);

  const loadReportData = async () => {
    setLoading(true);
    const data = await reportsService.getMultiWeekReport(
      weekCount,
      customStart,
      customEnd,
    );
    setMockData(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with enhanced linear and glass effect */}
      <div className="bg-linear-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-500/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
              📈 Multi-Week Report
            </h2>
            <p className="text-blue-100 text-lg">
              Comprehensive fitness analytics and insights over time
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 duration-300 ${
                bookmarked
                  ? "bg-linear-to-br from-yellow-500 to-yellow-600 text-white shadow-xl shadow-yellow-500/40 hover:shadow-yellow-500/60"
                  : "bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:bg-gray-700 hover:shadow-lg"
              }`}
              title={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark size={20} />
            </button>
            {mockData && (
              <>
                <PDFDownloadButton
                  reportData={mockData}
                  options={{ quality: "standard" }}
                />
                <EmailReportButton reportData={mockData} />
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Week Count Selector */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Week Range
            </label>
            <select
              value={weekCount}
              onChange={(e) => setWeekCount(parseInt(e.target.value))}
              className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600"
            >
              <option value={2}>Last 2 Weeks</option>
              <option value={4}>Last 4 Weeks</option>
              <option value={8}>Last 8 Weeks</option>
              <option value={12}>Last 12 Weeks</option>
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600"
            >
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
              <option value="comparison">Comparison</option>
            </select>
          </div>

          {/* Custom Date Range */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-600"
            />
          </div>
        </div>

        {/* Options */}
        <div className="mt-4 flex gap-2">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="rounded"
            />
            Compare with previous period
          </label>
        </div>
      </div>

      {/* Tab Navigation with enhanced styling */}
      <div className="flex gap-3 bg-gray-900/50 backdrop-blur-sm p-2 rounded-2xl border border-gray-700/50">
        {["overview", "charts", "tables", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all capitalize ${
              activeTab === tab
                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader
                className="animate-spin text-blue-400 mx-auto mb-4"
                size={40}
              />
              <p className="text-gray-400">Loading your multi-week report...</p>
            </div>
          </div>
        ) : mockData ? (
          <>
            {activeTab === "overview" && (
              <ReportSummary
                data={mockData}
                period={`${weekCount} weeks`}
                type={reportType}
              />
            )}
            {activeTab === "charts" && (
              <ReportCharts
                chartData={mockData}
                chartTypes={["line", "bar", "area"]}
                height={500}
              />
            )}
            {activeTab === "tables" && (
              <ReportTables data={mockData} type="workout" pageSize={10} />
            )}
            {activeTab === "insights" && (
              <ReportInsights
                userData={{}}
                reportData={mockData}
                aiEnabled={true}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No data available. Please try again.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
