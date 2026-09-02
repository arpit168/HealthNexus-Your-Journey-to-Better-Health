import React, { useState } from "react";
import { Camera, Clock, CheckCircle2 } from "lucide-react";

const MealLogger = ({ meal, onSubmit, date }) => {
  const [portion, setPortion] = useState(1);
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = () => {
    onSubmit &&
      onSubmit({
        meal,
        portion,
        notes,
        time: time || new Date().toLocaleTimeString(),
        date: date || new Date().toISOString(),
        photo,
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-800">Quick Meal Log</h3>
        <p className="text-sm text-gray-500">Track your meal in seconds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Ate as planned", "Half portion", "Skipped meal"].map((label) => (
          <button
            key={label}
            className="py-2 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 text-sm font-semibold text-gray-700"
            onClick={() => setNotes(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">
          Portion Size
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.25"
          value={portion}
          onChange={(event) => setPortion(parseFloat(event.target.value))}
          className="w-full mt-2"
        />
        <p className="text-sm text-gray-500">{portion}x serving</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Meal Time
          </label>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Upload Photo
          </label>
          <div className="mt-2 flex items-center gap-2">
            <label className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Add Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setPhoto(event.target.files?.[0] || null)}
              />
            </label>
            {photo && (
              <span className="text-xs text-gray-500">{photo.name}</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
          rows="3"
          placeholder="How did it feel?"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-linear-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        Save Meal Log
      </button>
    </div>
  );
};

export default MealLogger;
