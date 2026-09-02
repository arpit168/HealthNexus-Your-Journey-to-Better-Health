import React, { useState, useMemo } from "react";
import { Ruler, TrendingDown, TrendingUp, Camera } from "lucide-react";

const MeasurementTracker = ({ measurements = [], photos = [], onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    chest: "",
    waist: "",
    hips: "",
    thighs: "",
    arms: "",
    calves: "",
  });

  const latestMeasurement = useMemo(() => {
    if (measurements.length === 0) return null;
    return [...measurements].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )[0];
  }, [measurements]);

  const previousMeasurement = useMemo(() => {
    if (measurements.length < 2) return null;
    const sorted = [...measurements].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    return sorted[1];
  }, [measurements]);

  const calculateChange = (current, previous) => {
    if (!previous || !current) return null;
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { change: change.toFixed(1), percentage };
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasValues = Object.values(formData).some((val) => val !== "");
    if (hasValues) {
      const measurement = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          acc[key] = value ? parseFloat(value) : null;
          return acc;
        },
        {},
      );
      onSubmit(measurement);
      setFormData({
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: "",
        calves: "",
      });
      setShowForm(false);
    }
  };

  const bodyParts = [
    { key: "chest", label: "Chest", icon: "💪" },
    { key: "waist", label: "Waist", icon: "⚡" },
    { key: "hips", label: "Hips", icon: "🔥" },
    { key: "thighs", label: "Thighs", icon: "🦵" },
    { key: "arms", label: "Arms", icon: "💪" },
    { key: "calves", label: "Calves", icon: "🦿" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Body Measurements
            </h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showForm ? "Cancel" : "Add Measurement"}
          </button>
        </div>
      </div>

      {/* Add Measurement Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            New Measurement Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bodyParts.map((part) => (
                <div key={part.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {part.icon} {part.label} (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData[part.key]}
                    onChange={(e) =>
                      handleInputChange(part.key, e.target.value)
                    }
                    placeholder="0.0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Measurements
            </button>
          </form>
        </div>
      )}

      {/* Current Measurements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bodyParts.map((part) => {
          const current = latestMeasurement?.[part.key];
          const previous = previousMeasurement?.[part.key];
          const change = calculateChange(current, previous);

          return (
            <div key={part.key} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{part.icon}</span>
                  <span className="font-semibold text-gray-700">
                    {part.label}
                  </span>
                </div>
                {change &&
                  (change.change < 0 ? (
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  ))}
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {current ? `${current.toFixed(1)} cm` : "-"}
              </p>
              {change && (
                <p
                  className={`text-sm font-semibold ${change.change < 0 ? "text-green-600" : "text-orange-600"}`}
                >
                  {change.change > 0 ? "+" : ""}
                  {change.change} cm ({change.percentage}%)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Before/After Comparison */}
      {latestMeasurement && previousMeasurement && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Before vs After Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Body Part
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Before
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Current
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Change
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {bodyParts.map((part) => {
                  const current = latestMeasurement[part.key];
                  const before = previousMeasurement[part.key];
                  const change = calculateChange(current, before);

                  return (
                    <tr
                      key={part.key}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {part.icon} {part.label}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {before ? `${before.toFixed(1)} cm` : "-"}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-800">
                        {current ? `${current.toFixed(1)} cm` : "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {change ? (
                          <span
                            className={`font-semibold ${change.change < 0 ? "text-green-600" : "text-orange-600"}`}
                          >
                            {change.change > 0 ? "+" : ""}
                            {change.change} cm
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {change ? (
                          <span
                            className={`font-semibold ${change.change < 0 ? "text-green-600" : "text-orange-600"}`}
                          >
                            {change.percentage}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress Photos Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Progress Photos</h3>
        </div>
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.slice(0, 4).map((photo, index) => (
              <div
                key={photo.id || index}
                className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square"
              >
                <img
                  src={photo.url || "/placeholder.jpg"}
                  alt={`Progress ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs font-semibold">
                    {new Date(photo.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No progress photos yet. Switch to the Photos tab to add some!
          </p>
        )}
      </div>

      {/* Empty State */}
      {measurements.length === 0 && (
        <div className="bg-purple-50 rounded-2xl border-2 border-dashed border-purple-300 p-12 text-center">
          <Ruler className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Measurements Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start tracking your body measurements to see your transformation
            over time!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add First Measurement
          </button>
        </div>
      )}
    </div>
  );
};

export default MeasurementTracker;
