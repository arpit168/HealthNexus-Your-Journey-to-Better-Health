import React, { useState, useMemo } from "react";
import {
  Camera,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";

const ProgressPhotos = ({ photos = [], onUpload, onDelete }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState({
    before: null,
    after: null,
  });
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [privacyMode, setPrivacyMode] = useState(true);

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [photos]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          url: reader.result,
          filename: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Placeholder for camera functionality
    alert(
      "Camera access would be implemented here using navigator.mediaDevices.getUserMedia()",
    );
  };

  const selectForComparison = (photo, position) => {
    setComparePhotos((prev) => ({ ...prev, [position]: photo }));
  };

  const nextPhoto = () => {
    if (timelineIndex < sortedPhotos.length - 1) {
      setTimelineIndex(timelineIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (timelineIndex > 0) {
      setTimelineIndex(timelineIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Progress Photos
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              {privacyMode ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              {privacyMode ? "Private" : "Public"}
            </button>
            <button
              onClick={handleCameraCapture}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Comparison Mode Toggle */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Comparison Mode</span>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              comparisonMode
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {comparisonMode ? "Exit Comparison" : "Compare Photos"}
          </button>
        </div>
      </div>

      {/* Comparison View */}
      {comparisonMode && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Before & After Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Photo */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Before</h4>
              {comparePhotos.before ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-3/4">
                  <img
                    src={comparePhotos.before.url}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => selectForComparison(null, "before")}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-semibold">
                      {new Date(comparePhotos.before.date).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-3/4 flex items-center justify-center">
                  <p className="text-gray-400">Select a before photo</p>
                </div>
              )}
            </div>

            {/* After Photo */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">After</h4>
              {comparePhotos.after ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-3/4">
                  <img
                    src={comparePhotos.after.url}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => selectForComparison(null, "after")}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                    <p className="text-white font-semibold">
                      {new Date(comparePhotos.after.date).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-3/4 flex items-center justify-center">
                  <p className="text-gray-400">Select an after photo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Slider */}
      {sortedPhotos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Timeline</h3>
            <span className="text-sm text-gray-600">
              Photo {timelineIndex + 1} of {sortedPhotos.length}
            </span>
          </div>

          {/* Main Photo Display */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-3/4 max-w-md mx-auto">
              <img
                src={sortedPhotos[timelineIndex]?.url || "/placeholder.jpg"}
                alt={`Progress ${timelineIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                <p className="text-white font-semibold text-lg">
                  {new Date(
                    sortedPhotos[timelineIndex]?.date,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevPhoto}
              disabled={timelineIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextPhoto}
              disabled={timelineIndex === sortedPhotos.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Timeline Dots */}
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
            {sortedPhotos.map((photo, index) => (
              <button
                key={photo.id || index}
                onClick={() => setTimelineIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === timelineIndex
                    ? "bg-purple-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Photos</h3>
        {sortedPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedPhotos.map((photo, index) => (
              <div key={photo.id || index} className="relative group">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={photo.url || "/placeholder.jpg"}
                    alt={`Progress ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => onDelete(photo.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold">
                      {new Date(photo.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                {/* Comparison Select Buttons */}
                {comparisonMode && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => selectForComparison(photo, "before")}
                      className="flex-1 py-1 px-2 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200"
                    >
                      Before
                    </button>
                    <button
                      onClick={() => selectForComparison(photo, "after")}
                      className="flex-1 py-1 px-2 bg-green-100 text-green-700 text-xs font-semibold rounded hover:bg-green-200"
                    >
                      After
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-purple-50 rounded-2xl border-2 border-dashed border-purple-300 p-12 text-center">
            <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start documenting your transformation! Upload or take progress
              photos.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Privacy & Security
            </h4>
            <p className="text-sm text-blue-700">
              Your progress photos are private by default and stored securely.
              Only you can see them unless you choose to share.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPhotos;
