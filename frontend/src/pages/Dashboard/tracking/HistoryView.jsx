import React, { useState, useMemo } from "react";
import {
  History,
  Download,
  Printer,
  Search,
  Calendar,
  Filter,
} from "lucide-react";

const HistoryView = ({ data = {}, type = "all", onExport }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filterType, setFilterType] = useState("all");

  const { weight = [], measurements = [], photos = [], adherence = [] } = data;

  const allEntries = useMemo(() => {
    const entries = [];

    // Weight entries
    weight.forEach((entry) => {
      entries.push({
        ...entry,
        type: "weight",
        date: new Date(entry.date),
        displayText: `Weight: ${entry.weight.toFixed(1)} kg`,
      });
    });

    // Measurement entries
    measurements.forEach((entry) => {
      entries.push({
        ...entry,
        type: "measurement",
        date: new Date(entry.date),
        displayText: "Body Measurements Updated",
      });
    });

    // Photo entries
    photos.forEach((entry) => {
      entries.push({
        ...entry,
        type: "photo",
        date: new Date(entry.date),
        displayText: "Progress Photo Added",
      });
    });

    // Adherence entries
    adherence.forEach((entry) => {
      const checks = [
        entry.workoutCompleted && "Workout",
        entry.dietFollowed && "Diet",
        entry.waterIntake && "Water",
      ].filter(Boolean);
      entries.push({
        ...entry,
        type: "adherence",
        date: new Date(entry.date),
        displayText: `Daily Check-in: ${checks.join(", ")}`,
      });
    });

    return entries.sort((a, b) => b.date - a.date);
  }, [weight, measurements, photos, adherence]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      // Filter by type
      if (filterType !== "all" && entry.type !== filterType) return false;

      // Filter by search term
      if (
        searchTerm &&
        !entry.displayText.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by date range
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        if (entry.date < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59);
        if (entry.date > endDate) return false;
      }

      return true;
    });
  }, [allEntries, filterType, searchTerm, dateRange]);

  const summaryStats = useMemo(() => {
    return {
      totalEntries: allEntries.length,
      weight: weight.length,
      measurements: measurements.length,
      photos: photos.length,
      adherence: adherence.length,
    };
  }, [allEntries, weight, measurements, photos, adherence]);

  const handleExportCSV = () => {
    const csvContent = [
      ["Date", "Type", "Details"],
      ...filteredEntries.map((entry) => [
        entry.date.toLocaleDateString("en-GB"),
        entry.type,
        entry.displayText,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progress-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    onExport && onExport("csv");
  };

  const handlePrint = () => {
    window.print();
    onExport && onExport("print");
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "weight":
        return "bg-purple-100 text-purple-700";
      case "measurement":
        return "bg-blue-100 text-blue-700";
      case "photo":
        return "bg-pink-100 text-pink-700";
      case "adherence":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "weight":
        return "⚖️";
      case "measurement":
        return "📏";
      case "photo":
        return "📸";
      case "adherence":
        return "✅";
      default:
        return "📊";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Progress History
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Entries</p>
          <p className="text-3xl font-bold text-gray-800">
            {summaryStats.totalEntries}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-purple-600 mb-1">Weight Logs</p>
          <p className="text-3xl font-bold text-purple-700">
            {summaryStats.weight}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-blue-600 mb-1">Measurements</p>
          <p className="text-3xl font-bold text-blue-700">
            {summaryStats.measurements}
          </p>
        </div>
        <div className="bg-pink-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-pink-600 mb-1">Photos</p>
          <p className="text-3xl font-bold text-pink-700">
            {summaryStats.photos}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-lg p-4">
          <p className="text-sm text-green-600 mb-1">Check-ins</p>
          <p className="text-3xl font-bold text-green-700">
            {summaryStats.adherence}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entries..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Entry Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="weight">Weight</option>
              <option value="measurement">Measurements</option>
              <option value="photo">Photos</option>
              <option value="adherence">Adherence</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm ||
          filterType !== "all" ||
          dateRange.start ||
          dateRange.end) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setDateRange({ start: "", end: "" });
            }}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Entries List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          All Entries ({filteredEntries.length})
        </h3>

        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id || index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getTypeIcon(entry.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(entry.type)}`}
                        >
                          {entry.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {entry.date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {entry.displayText}
                      </p>

                      {/* Additional Details */}
                      {entry.type === "weight" && (
                        <p className="text-sm text-gray-600 mt-1">
                          Weight: {entry.weight.toFixed(1)} kg
                        </p>
                      )}
                      {entry.type === "adherence" && entry.notes && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          "{entry.notes}"
                        </p>
                      )}
                      {entry.type === "adherence" && (
                        <p className="text-sm text-gray-600 mt-1">
                          Sleep Quality: {entry.sleepQuality}/5
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {entry.date.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No entries found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ||
              filterType !== "all" ||
              dateRange.start ||
              dateRange.end
                ? "Try adjusting your filters"
                : "Start tracking your progress to see your history here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
