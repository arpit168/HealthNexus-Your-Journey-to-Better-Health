import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Info,
  Video,
  Clock,
  Dumbbell,
} from "lucide-react";
import WorkoutLogger from "./WorkoutLogger";

const WorkoutDetail = ({ exercise, dayData, onComplete, onClose }) => {
  const [showTimer, setShowTimer] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [logData, setLogData] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    setShowTimer(true);
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleLogWorkout = () => {
    setShowLogger(true);
  };

  const handleSubmitLog = (data) => {
    setLogData(data);
    setShowLogger(false);
    if (onComplete) {
      onComplete(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {exercise.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {dayData?.day} - {dayData?.focus}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Exercise Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Sets</p>
              <p className="text-2xl font-bold text-blue-600">
                {exercise.sets}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Reps</p>
              <p className="text-2xl font-bold text-purple-600">
                {exercise.reps}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Rest</p>
              <p className="text-2xl font-bold text-green-600">
                {exercise.rest}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Equipment</p>
              <p className="text-sm font-bold text-orange-600">
                {exercise.equipment}
              </p>
            </div>
          </div>

          {/* Video Demonstration */}
          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Exercise demonstration video
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Watch Tutorial
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Form Guidance
                </h3>
                <p className="text-sm text-gray-700">{exercise.notes}</p>
              </div>
            </div>
          </div>

          {/* Timer/Stopwatch */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Timer
              </h3>
            </div>

            {showTimer ? (
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {formatTime(time)}
                </div>
                <div className="flex items-center justify-center gap-3">
                  {!isRunning ? (
                    <button
                      onClick={() => setIsRunning(true)}
                      className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseTimer}
                      className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  )}
                  <button
                    onClick={handleResetTimer}
                    className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartTimer}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Timer
              </button>
            )}
          </div>

          {/* Workout Logger */}
          {!showLogger ? (
            <button
              onClick={handleLogWorkout}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Dumbbell className="w-5 h-5" />
              Log This Workout
            </button>
          ) : (
            <WorkoutLogger
              exercise={exercise}
              onSubmit={handleSubmitLog}
              initialData={logData}
            />
          )}

          {/* Complete Button */}
          {logData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-2 border-green-500 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Workout Logged!
                    </p>
                    <p className="text-sm text-gray-600">
                      Great job completing this exercise
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutDetail;
