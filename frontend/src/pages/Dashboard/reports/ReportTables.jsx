import React, { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Download,
  Printer,
  Eye,
  EyeOff,
  Search,
  X,
} from "lucide-react";

export default function ReportTables({
  data,
  type = "workout",
  onExport,
  pageSize = 10,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    exercise: true,
    sets: true,
    reps: true,
    weight: true,
    duration: true,
    calories: true,
  });
  const [showPrint, setShowPrint] = useState(false);

  // Mock workout data
  const workoutData = [
    {
      id: 1,
      date: "2024-02-26",
      exercise: "Bench Press",
      sets: 4,
      reps: 8,
      weight: 100,
      duration: 15,
      calories: 120,
    },
    {
      id: 2,
      date: "2024-02-25",
      exercise: "Squats",
      sets: 5,
      reps: 5,
      weight: 150,
      duration: 20,
      calories: 180,
    },
    {
      id: 3,
      date: "2024-02-24",
      exercise: "Deadlifts",
      sets: 3,
      reps: 5,
      weight: 180,
      duration: 12,
      calories: 150,
    },
    {
      id: 4,
      date: "2024-02-23",
      exercise: "Rows",
      sets: 4,
      reps: 8,
      weight: 90,
      duration: 14,
      calories: 110,
    },
    {
      id: 5,
      date: "2024-02-22",
      exercise: "Pull-ups",
      sets: 5,
      reps: 8,
      weight: 0,
      duration: 10,
      calories: 85,
    },
    {
      id: 6,
      date: "2024-02-21",
      exercise: "Leg Press",
      sets: 4,
      reps: 10,
      weight: 250,
      duration: 16,
      calories: 160,
    },
    {
      id: 7,
      date: "2024-02-20",
      exercise: "Lat Pulldown",
      sets: 3,
      reps: 10,
      weight: 80,
      duration: 11,
      calories: 90,
    },
    {
      id: 8,
      date: "2024-02-19",
      exercise: "Dumbbell Curls",
      sets: 3,
      reps: 12,
      weight: 30,
      duration: 9,
      calories: 75,
    },
  ];

  const mealData = [
    {
      id: 1,
      date: "2024-02-26",
      meal: "Breakfast",
      food: "Oatmeal + Banana",
      calories: 350,
      protein: 12,
      carbs: 55,
      fats: 8,
    },
    {
      id: 2,
      date: "2024-02-26",
      meal: "Lunch",
      food: "Chicken Rice",
      calories: 650,
      protein: 45,
      carbs: 70,
      fats: 12,
    },
    {
      id: 3,
      date: "2024-02-26",
      meal: "Snack",
      food: "Protein Bar",
      calories: 220,
      protein: 20,
      carbs: 25,
      fats: 5,
    },
    {
      id: 4,
      date: "2024-02-26",
      meal: "Dinner",
      food: "Salmon + Vegetables",
      calories: 550,
      protein: 50,
      carbs: 40,
      fats: 18,
    },
    {
      id: 5,
      date: "2024-02-25",
      meal: "Breakfast",
      food: "Eggs + Toast",
      calories: 400,
      protein: 25,
      carbs: 35,
      fats: 15,
    },
    {
      id: 6,
      date: "2024-02-25",
      meal: "Lunch",
      food: "Tuna Salad",
      calories: 480,
      protein: 35,
      carbs: 25,
      fats: 20,
    },
  ];

  const measurementData = [
    {
      id: 1,
      date: "2024-02-26",
      chest: 102,
      waist: 78,
      hips: 95,
      thigh: 58,
      arm: 35,
      weight: 76.1,
    },
    {
      id: 2,
      date: "2024-02-19",
      chest: 101.5,
      waist: 79,
      hips: 96,
      thigh: 59,
      arm: 34.8,
      weight: 76.5,
    },
    {
      id: 3,
      date: "2024-02-12",
      chest: 101,
      waist: 80,
      hips: 97,
      thigh: 60,
      arm: 34.5,
      weight: 76.8,
    },
    {
      id: 4,
      date: "2024-02-05",
      chest: 100.5,
      waist: 81,
      hips: 98,
      thigh: 61,
      arm: 34,
      weight: 77.2,
    },
  ];

  const tableData = {
    workout: {
      data: workoutData,
      columns: [
        "date",
        "exercise",
        "sets",
        "reps",
        "weight",
        "duration",
        "calories",
      ],
    },
    meal: {
      data: mealData,
      columns: ["date", "meal", "food", "calories", "protein", "carbs", "fats"],
    },
    measurement: {
      data: measurementData,
      columns: ["date", "chest", "waist", "hips", "thigh", "arm", "weight"],
    },
  };

  const currentTableData = tableData[type] || tableData.workout;

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = currentTableData.data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase()),
      ),
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const comparison = String(aVal).localeCompare(String(bVal));
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [filterText, sortConfig, type]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const toggleColumn = (col) => {
    setVisibleColumns({ ...visibleColumns, [col]: !visibleColumns[col] });
  };

  const exportToCSV = () => {
    const headers = currentTableData.columns.filter((c) => visibleColumns[c]);
    const csv = [
      headers.join(","),
      ...processedData.map((row) =>
        headers.map((col) => `"${row[col]}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_report.csv`;
    a.click();
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <div className="w-4" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800">
            {currentTableData.columns.map((col) =>
              visibleColumns[col] ? (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-6 py-3 text-left font-semibold text-white cursor-pointer hover:bg-gray-700 capitalize"
                >
                  <div className="flex items-center gap-2">
                    {col}
                    <SortIcon col={col} />
                  </div>
                </th>
              ) : null,
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-700 hover:bg-gray-800/50"
            >
              {currentTableData.columns.map((col) =>
                visibleColumns[col] ? (
                  <td
                    key={`${row.id}-${col}`}
                    className="px-6 py-3 text-gray-300"
                  >
                    {typeof row[col] === "number"
                      ? row[col].toFixed(2)
                      : row[col]}
                  </td>
                ) : null,
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search table..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          {filterText && (
            <button
              onClick={() => {
                setFilterText("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition transform hover:scale-105"
            title="Download as CSV"
          >
            <Download size={18} />
            <span className="whitespace-nowrap">CSV</span>
          </button>
          <button
            onClick={() => setShowPrint(!showPrint)}
            className="flex-1 md:flex-none flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition transform hover:scale-105"
            title="Print table"
          >
            <Printer size={18} />
            <span className="whitespace-nowrap">Print</span>
          </button>
        </div>
      </div>

      {/* Column Visibility */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-sm font-medium w-full mb-1">
          Visible Columns:
        </p>
        {currentTableData.columns.map((col) => (
          <button
            key={col}
            onClick={() => toggleColumn(col)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
              visibleColumns[col]
                ? "bg-blue-600/50 text-blue-200 border border-blue-400"
                : "bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600"
            }`}
          >
            {visibleColumns[col] ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="capitalize">{col}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/10 transition-shadow">
        {showPrint ? (
          <div className="p-6 print:block hidden">
            <TableView />
          </div>
        ) : (
          <TableView />
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <p className="text-gray-400 text-sm font-medium">
          Showing{" "}
          <span className="text-white font-bold">
            {paginatedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="text-white font-bold">
            {Math.min(currentPage * pageSize, processedData.length)}
          </span>{" "}
          of{" "}
          <span className="text-white font-bold">{processedData.length}</span>{" "}
          results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition transform hover:scale-105"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition transform hover:scale-110 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition transform hover:scale-105"
          >
            Next
          </button>
        </div>
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
