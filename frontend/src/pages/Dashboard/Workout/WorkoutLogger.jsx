import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Square, CheckSquare, Plus, Minus, Save } from "lucide-react";

const WorkoutLogger = ({ exercise, onSubmit, initialData }) => {
  const [sets, setSets] = useState([]);
  const [notes, setNotes] = useState(initialData?.notes || "");

  useEffect(() => {
    // Initialize sets based on exercise
    const initialSets = [];
    for (let i = 0; i < exercise.sets; i++) {
      initialSets.push({
        setNumber: i + 1,
        completed: initialData?.sets?.[i]?.completed || false,
        weight: initialData?.sets?.[i]?.weight || "",
        reps: initialData?.sets?.[i]?.reps || "",
        rpe: initialData?.sets?.[i]?.rpe || 5,
      });
    }
    setSets(initialSets);
  }, [exercise, initialData]);

  const toggleSetComplete = (index) => {
    const newSets = [...sets];
    newSets[index].completed = !newSets[index].completed;
    setSets(newSets);
  };

  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const addSet = () => {
    setSets([
      ...sets,
      {
        setNumber: sets.length + 1,
        completed: false,
        weight: "",
        reps: "",
        rpe: 5,
      },
    ]);
  };

  const removeSet = () => {
    if (sets.length > 1) {
      setSets(sets.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    const logData = {
      exercise: exercise.name,
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      sets: sets,
      notes: notes,
      totalVolume: sets.reduce(
        (acc, set) =>
          acc + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0),
        0,
      ),
    };
    onSubmit(logData);
  };

  const allSetsCompleted = sets.every((set) => set.completed);
  const completedSets = sets.filter((set) => set.completed).length;

  return (
    <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">Log Your Sets</h3>
        <div className="text-sm text-gray-600">
          {completedSets}/{sets.length} completed
        </div>
      </div>

      {/* Sets Table */}
      <div className="space-y-3 mb-4">
        {sets.map((set, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg p-4 ${
              set.completed ? "ring-2 ring-green-500" : "border border-gray-200"
            }`}
          >
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Checkbox */}
              <button
                onClick={() => toggleSetComplete(index)}
                className="col-span-1 flex items-center justify-center"
              >
                {set.completed ? (
                  <CheckSquare className="w-6 h-6 text-green-600" />
                ) : (
                  <Square className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Set Number */}
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-700">
                  Set {set.setNumber}
                </p>
              </div>

              {/* Weight Input */}
              <div className="col-span-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(index, "weight", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0"
                  step="0.5"
                />
              </div>

              {/* Reps Input */}
              <div className="col-span-3">
                <label className="block text-xs text-gray-600 mb-1">Reps</label>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0"
                />
              </div>

              {/* RPE Rating */}
              <div className="col-span-3">
                <label className="block text-xs text-gray-600 mb-1">RPE</label>
                <select
                  value={set.rpe}
                  onChange={(e) =>
                    updateSet(index, "rpe", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
                    <option key={rpe} value={rpe}>
                      {rpe}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Remove Set Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={addSet}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Set
        </button>
        {sets.length > 1 && (
          <button
            onClick={removeSet}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Minus className="w-4 h-4" />
            Remove Set
          </button>
        )}
      </div>

      {/* RPE Guide */}
      <div className="bg-white rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          RPE Guide (Rate of Perceived Exertion)
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>1-3: Very easy</div>
          <div>4-6: Moderate</div>
          <div>7-8: Hard</div>
          <div>9-10: Maximum effort</div>
        </div>
      </div>

      {/* Notes Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows="3"
          placeholder="How did it feel? Any issues or achievements?"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!allSetsCompleted}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          allSetsCompleted
            ? "bg-linear-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <Save className="w-5 h-5" />
        {allSetsCompleted
          ? "Submit Workout Log"
          : "Complete All Sets to Submit"}
      </button>

      {/* Volume Summary */}
      {sets.some((s) => s.weight && s.reps) && (
        <div className="mt-4 bg-white rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-blue-600">
            {sets
              .reduce(
                (acc, set) =>
                  acc +
                  (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0),
                0,
              )
              .toFixed(1)}{" "}
            kg
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;
