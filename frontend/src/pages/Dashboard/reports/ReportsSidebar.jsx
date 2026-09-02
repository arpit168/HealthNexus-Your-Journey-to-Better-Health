import React from "react";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Award,
  FileText,
  Download,
  Mail,
  Bookmark,
  Settings,
} from "lucide-react";

export default function ReportsSidebar({
  activeReport,
  onReportChange,
  bookmarkedReports = [],
}) {
  const reportMenuItems = [
    {
      id: "weekly",
      label: "Weekly Report",
      icon: Calendar,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      hoverBg: "hover:bg-indigo-500/20",
      description: "Last 7 days",
    },
    {
      id: "monthly",
      label: "Monthly Report",
      icon: BarChart3,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      hoverBg: "hover:bg-green-500/20",
      description: "Current month",
    },
    {
      id: "multiweek",
      label: "Multi-Week",
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      hoverBg: "hover:bg-blue-500/20",
      description: "Custom range",
    },
    {
      id: "yearly",
      label: "Yearly Report",
      icon: Award,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      hoverBg: "hover:bg-purple-500/20",
      description: "Annual summary",
    },
  ];

  const actionItems = [
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
      color: "text-yellow-400",
      badge: bookmarkedReports.length,
    },
    {
      id: "exports",
      label: "Exports",
      icon: Download,
      color: "text-blue-400",
    },
    {
      id: "scheduled",
      label: "Scheduled Reports",
      icon: Mail,
      color: "text-pink-400",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-linear-to-br from-gray-900 to-gray-800 backdrop-blur-xl border-r border-gray-700/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Reports</h2>
            <p className="text-xs text-gray-400">Analytics & Insights</p>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        <div className="px-3 mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Report Types
          </p>
        </div>

        {reportMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeReport === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onReportChange(item.id)}
              className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? `${item.bgColor} ${item.color} shadow-lg scale-105`
                  : `text-gray-400 ${item.hoverBg} hover:text-white hover:scale-102`
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-white/10 scale-110"
                    : "bg-gray-800 group-hover:bg-gray-700"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <p
                  className={`font-semibold text-sm ${isActive ? "text-white" : ""}`}
                >
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400">
                  {item.description}
                </p>
              </div>
              {isActive && (
                <div
                  className={`w-1.5 h-1.5 rounded-full ${item.color.replace("text-", "bg-")} animate-pulse`}
                />
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-gray-700/50" />

        {/* Quick Actions */}
        <div className="px-3 mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Quick Actions
          </p>
        </div>

        {actionItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-300 hover:scale-102"
            >
              <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-all">
                <Icon size={18} className={item.color} />
              </div>
              <span className="flex-1 text-left font-medium text-sm">
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer - Settings */}
      <div className="p-3 border-t border-gray-700/50">
        <button className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-300">
          <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-all">
            <Settings size={18} />
          </div>
          <span className="flex-1 text-left font-medium text-sm">
            Report Settings
          </span>
        </button>
      </div>

      <style>{`
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
