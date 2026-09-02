import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Check,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
} from "lucide-react";
import WorkoutDetail from "./WorkoutDetail";

const WorkoutPlan = ({ plan, weekOffset = 0, onUpdate }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [expandedDays, setExpandedDays] = useState([0]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock workout plan data
  const workoutPlan = plan || {
    level: "Intermediate",
    goal: "Muscle Building",
    weeks: [
      {
        weekNumber: 1,
        startDate: "March 3, 2026",
        endDate: "March 9, 2026",
        days: [
          {
            id: 1,
            day: "Monday",
            date: "Mar 3",
            focus: "Chest & Triceps",
            duration: "60 min",
            completed: false,
            exercises: [
              {
                id: 1,
                name: "Barbell Bench Press",
                sets: 4,
                reps: "8-10",
                rest: "90s",
                equipment: "Barbell",
                muscleGroup: "Chest",
                difficulty: "Intermediate",
                notes: "Keep back flat, squeeze chest at top",
                videoUrl: "#",
              },
              {
                id: 2,
                name: "Incline Dumbbell Press",
                sets: 3,
                reps: "10-12",
                rest: "60s",
                equipment: "Dumbbells",
                muscleGroup: "Chest",
                difficulty: "Intermediate",
                notes: "Set bench at 30-45 degrees",
                videoUrl: "#",
              },
              {
                id: 3,
                name: "Cable Flyes",
                sets: 3,
                reps: "12-15",
                rest: "60s",
                equipment: "Cable",
                muscleGroup: "Chest",
                difficulty: "Beginner",
                notes: "Focus on stretch and contraction",
                videoUrl: "#",
              },
              {
                id: 4,
                name: "Tricep Dips",
                sets: 3,
                reps: "10-12",
                rest: "60s",
                equipment: "Bodyweight",
                muscleGroup: "Triceps",
                difficulty: "Intermediate",
                notes: "Lean forward for chest emphasis",
                videoUrl: "#",
              },
              {
                id: 5,
                name: "Tricep Pushdown",
                sets: 3,
                reps: "12-15",
                rest: "45s",
                equipment: "Cable",
                muscleGroup: "Triceps",
                difficulty: "Beginner",
                notes: "Keep elbows tucked",
                videoUrl: "#",
              },
            ],
          },
          {
            id: 2,
            day: "Tuesday",
            date: "Mar 4",
            focus: "Back & Biceps",
            duration: "65 min",
            completed: false,
            exercises: [
              {
                id: 6,
                name: "Deadlift",
                sets: 4,
                reps: "6-8",
                rest: "120s",
                equipment: "Barbell",
                muscleGroup: "Back",
                difficulty: "Advanced",
                notes: "Maintain neutral spine throughout",
                videoUrl: "#",
              },
              {
                id: 7,
                name: "Pull-ups",
                sets: 4,
                reps: "8-10",
                rest: "90s",
                equipment: "Pull-up Bar",
                muscleGroup: "Back",
                difficulty: "Intermediate",
                notes: "Full range of motion",
                videoUrl: "#",
              },
              {
                id: 8,
                name: "Barbell Row",
                sets: 3,
                reps: "10-12",
                rest: "60s",
                equipment: "Barbell",
                muscleGroup: "Back",
                difficulty: "Intermediate",
                notes: "Pull to lower chest",
                videoUrl: "#",
              },
              {
                id: 9,
                name: "Barbell Curl",
                sets: 3,
                reps: "10-12",
                rest: "60s",
                equipment: "Barbell",
                muscleGroup: "Biceps",
                difficulty: "Beginner",
                notes: "No swinging, controlled motion",
                videoUrl: "#",
              },
              {
                id: 10,
                name: "Hammer Curls",
                sets: 3,
                reps: "12-15",
                rest: "45s",
                equipment: "Dumbbells",
                muscleGroup: "Biceps",
                difficulty: "Beginner",
                notes: "Keep wrists neutral",
                videoUrl: "#",
              },
            ],
          },
          {
            id: 3,
            day: "Wednesday",
            date: "Mar 5",
            focus: "Legs",
            duration: "70 min",
            completed: false,
            exercises: [
              {
                id: 11,
                name: "Barbell Squat",
                sets: 4,
                reps: "8-10",
                rest: "120s",
                equipment: "Barbell",
                muscleGroup: "Legs",
                difficulty: "Intermediate",
                notes: "Depth to parallel or below",
                videoUrl: "#",
              },
              {
                id: 12,
                name: "Romanian Deadlift",
                sets: 3,
                reps: "10-12",
                rest: "90s",
                equipment: "Barbell",
                muscleGroup: "Hamstrings",
                difficulty: "Intermediate",
                notes: "Feel stretch in hamstrings",
                videoUrl: "#",
              },
              {
                id: 13,
                name: "Leg Press",
                sets: 3,
                reps: "12-15",
                rest: "60s",
                equipment: "Machine",
                muscleGroup: "Legs",
                difficulty: "Beginner",
                notes: "Full range of motion",
                videoUrl: "#",
              },
              {
                id: 14,
                name: "Calf Raises",
                sets: 4,
                reps: "15-20",
                rest: "45s",
                equipment: "Machine",
                muscleGroup: "Calves",
                difficulty: "Beginner",
                notes: "Pause at top",
                videoUrl: "#",
              },
            ],
          },
          {
            id: 4,
            day: "Thursday",
            date: "Mar 6",
            focus: "Shoulders & Abs",
            duration: "55 min",
            completed: false,
            exercises: [
              {
                id: 15,
                name: "Military Press",
                sets: 4,
                reps: "8-10",
                rest: "90s",
                equipment: "Barbell",
                muscleGroup: "Shoulders",
                difficulty: "Intermediate",
                notes: "Press straight up",
                videoUrl: "#",
              },
              {
                id: 16,
                name: "Lateral Raises",
                sets: 3,
                reps: "12-15",
                rest: "60s",
                equipment: "Dumbbells",
                muscleGroup: "Shoulders",
                difficulty: "Beginner",
                notes: "Control the weight, no swinging",
                videoUrl: "#",
              },
              {
                id: 17,
                name: "Face Pulls",
                sets: 3,
                reps: "15-20",
                rest: "45s",
                equipment: "Cable",
                muscleGroup: "Shoulders",
                difficulty: "Beginner",
                notes: "Pull to face level",
                videoUrl: "#",
              },
              {
                id: 18,
                name: "Plank",
                sets: 3,
                reps: "60s",
                rest: "45s",
                equipment: "Bodyweight",
                muscleGroup: "Abs",
                difficulty: "Beginner",
                notes: "Keep body straight",
                videoUrl: "#",
              },
            ],
          },
          {
            id: 5,
            day: "Friday",
            date: "Mar 7",
            focus: "Full Body",
            duration: "60 min",
            completed: false,
            exercises: [
              {
                id: 19,
                name: "Squat",
                sets: 3,
                reps: "10-12",
                rest: "90s",
                equipment: "Barbell",
                muscleGroup: "Legs",
                difficulty: "Intermediate",
                notes: "Lighter weight, focus on form",
                videoUrl: "#",
              },
              {
                id: 20,
                name: "Bench Press",
                sets: 3,
                reps: "10-12",
                rest: "90s",
                equipment: "Barbell",
                muscleGroup: "Chest",
                difficulty: "Intermediate",
                notes: "Moderate weight",
                videoUrl: "#",
              },
              {
                id: 21,
                name: "Rows",
                sets: 3,
                reps: "10-12",
                rest: "60s",
                equipment: "Barbell",
                muscleGroup: "Back",
                difficulty: "Intermediate",
                notes: "Squeeze at top",
                videoUrl: "#",
              },
            ],
          },
          {
            id: 6,
            day: "Saturday",
            date: "Mar 8",
            focus: "Active Recovery",
            duration: "30 min",
            completed: false,
            exercises: [
              {
                id: 22,
                name: "Light Cardio",
                sets: 1,
                reps: "20-30 min",
                rest: "N/A",
                equipment: "Cardio Machine",
                muscleGroup: "Full Body",
                difficulty: "Beginner",
                notes: "Keep heart rate moderate",
                videoUrl: "#",
              },
              {
                id: 23,
                name: "Stretching",
                sets: 1,
                reps: "10 min",
                rest: "N/A",
                equipment: "None",
                muscleGroup: "Full Body",
                difficulty: "Beginner",
                notes: "Focus on tight areas",
                videoUrl: "#",
              },
            ],
          },
          {
            id: 7,
            day: "Sunday",
            date: "Mar 9",
            focus: "Rest Day",
            duration: "0 min",
            completed: false,
            exercises: [],
          },
        ],
      },
    ],
  };

  const currentPlan =
    workoutPlan.weeks[selectedWeek + weekOffset] || workoutPlan.weeks[0];

  const toggleDay = (dayId) => {
    setExpandedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId],
    );
  };

  const handleExerciseClick = (exercise, dayData) => {
    setSelectedExercise({ ...exercise, dayData });
    setShowDetailModal(true);
  };

  const handleComplete = (exerciseData) => {
    if (onUpdate) {
      onUpdate(exerciseData);
    }
    setShowDetailModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Weekly Workout Plan
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {currentPlan.startDate} - {currentPlan.endDate} • Week{" "}
            {currentPlan.weekNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() =>
              setSelectedWeek(
                Math.min(workoutPlan.weeks.length - 1, selectedWeek + 1),
              )
            }
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Plan Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Goal</p>
          <p className="text-lg font-bold text-gray-800">{workoutPlan.goal}</p>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Level</p>
          <p className="text-lg font-bold text-gray-800">{workoutPlan.level}</p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 col-span-2 md:col-span-1">
          <p className="text-sm text-gray-600 mb-1">Completion</p>
          <p className="text-lg font-bold text-gray-800">
            {currentPlan.days.filter((d) => d.completed).length}/
            {currentPlan.days.length} days
          </p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-3">
        {currentPlan.days.map((dayPlan) => {
          const isExpanded = expandedDays.includes(dayPlan.id);
          const isRestDay = dayPlan.focus === "Rest Day";

          return (
            <motion.div
              key={dayPlan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                dayPlan.completed
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* Day Header */}
              <button
                onClick={() => !isRestDay && toggleDay(dayPlan.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {dayPlan.completed ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="text-left">
                    <h3 className="font-bold text-gray-800">
                      {dayPlan.day} - {dayPlan.focus}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span>{dayPlan.date}</span>
                      {!isRestDay && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dayPlan.duration}
                          </div>
                          <span>•</span>
                          <span>{dayPlan.exercises.length} exercises</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!isRestDay && (
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                )}
              </button>

              {/* Exercises List */}
              {isExpanded && !isRestDay && (
                <div className="px-4 pb-4 space-y-2">
                  {dayPlan.exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleExerciseClick(exercise, dayPlan)}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {exercise.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>
                              {exercise.sets} × {exercise.reps}
                            </span>
                            <span>•</span>
                            <span>Rest: {exercise.rest}</span>
                            <span>•</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {exercise.difficulty}
                            </span>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-blue-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Workout Detail Modal */}
      {showDetailModal && selectedExercise && (
        <WorkoutDetail
          exercise={selectedExercise}
          dayData={selectedExercise.dayData}
          onComplete={handleComplete}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default WorkoutPlan;
