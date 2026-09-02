import React, { useState } from "react";
import { Download, X, CheckCircle } from "lucide-react";
import reportsService from "../../../Services/reportsService";

export default function PDFDownloadButton({ reportData, onComplete }) {
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState({
    pageSize: "A4",
    orientation: "portrait",
    quality: "standard",
    includeCharts: true,
    includeTables: true,
    includeInsights: true,
    includeNotes: false,
    customNotes: "",
    watermark: false,
  });
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    try {
      // In a real scenario, this would use a PDF library or backend service
      const filename = `fitness_report_${new Date().toISOString().split("T")[0]}.pdf`;

      // Mock implementation - replace with actual PDF generation
      const content = `
      FITNESS REPORT
      ==============
      
      Generated: ${new Date().toLocaleDateString()}
      
      Report Details:
      - Page Size: ${options.pageSize}
      - Orientation: ${options.orientation}
      - Quality: ${options.quality}
      
      Included Sections:
      - Charts: ${options.includeCharts ? "Yes" : "No"}
      - Tables: ${options.includeTables ? "Yes" : "No"}
      - Insights: ${options.includeInsights ? "Yes" : "No"}
      ${options.customNotes ? `\nNotes:\n${options.customNotes}` : ""}
      ${options.watermark ? "\n[PREMIUM WATERMARK]" : ""}
      `;

      const blob = new Blob([content], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        if (onComplete) onComplete(true);
      }, 1500);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition"
      >
        <Download size={18} />
        Download PDF
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                Download PDF Report
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Page Size */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Page Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["A4", "Letter", "A3"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setOptions({ ...options, pageSize: size })}
                      className={`py-2 px-4 rounded-lg font-medium transition ${
                        options.pageSize === size
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Orientation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["portrait", "landscape"].map((orient) => (
                    <button
                      key={orient}
                      onClick={() =>
                        setOptions({ ...options, orientation: orient })
                      }
                      className={`py-2 px-4 rounded-lg font-medium capitalize transition ${
                        options.orientation === orient
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {orient}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["draft", "standard", "high"].map((qual) => (
                    <button
                      key={qual}
                      onClick={() => setOptions({ ...options, quality: qual })}
                      className={`py-2 px-4 rounded-lg font-medium capitalize transition ${
                        options.quality === qual
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {qual}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Sections */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Include Sections
                </label>
                <div className="space-y-2">
                  {[
                    { key: "includeCharts", label: "Charts & Graphs" },
                    { key: "includeTables", label: "Data Tables" },
                    {
                      key: "includeInsights",
                      label: "AI Insights & Recommendations",
                    },
                    { key: "includeNotes", label: "Custom Notes Section" },
                  ].map((section) => (
                    <label
                      key={section.key}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={options[section.key]}
                        onChange={(e) =>
                          setOptions({
                            ...options,
                            [section.key]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded accent-blue-600"
                      />
                      <span className="text-gray-300">{section.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Notes */}
              {options.includeNotes && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Add Custom Notes
                  </label>
                  <textarea
                    value={options.customNotes}
                    onChange={(e) =>
                      setOptions({ ...options, customNotes: e.target.value })
                    }
                    placeholder="Add any additional notes to include in the PDF..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
                  />
                </div>
              )}

              {/* Watermark */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.watermark}
                  onChange={(e) =>
                    setOptions({ ...options, watermark: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-blue-600"
                />
                <span className="text-gray-300">Add Premium Watermark</span>
                <span className="text-xs text-gray-500">(Premium only)</span>
              </label>

              {/* Preview */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm font-semibold mb-2">
                  Download Preview
                </p>
                <p className="text-gray-300 text-sm">
                  📄 fitness_report_{new Date().toISOString().split("T")[0]}.pdf
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Size:{" "}
                  {options.quality === "high"
                    ? "~5-8 MB"
                    : options.quality === "standard"
                      ? "~2-4 MB"
                      : "~1-2 MB"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                disabled={success}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={success}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition transform hover:scale-105"
              >
                {success ? (
                  <>
                    <CheckCircle size={18} />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
