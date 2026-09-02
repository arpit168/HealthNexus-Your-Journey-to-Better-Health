import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Calendar, Library, TrendingUp } from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import WorkoutPlan from "./Workout/WorkoutPlan";
import ExerciseLibrary from "./Workout/ExerciseLibrary";
import ProgressOverload from "./Workout/ProgressOverload";
import { workoutService } from "../../Services/workoutService";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Workout = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planResponse = await workoutService.getWorkoutPlan();
        if (planResponse?.data && Object.keys(planResponse.data).length > 0) {
          setWorkoutPlan(planResponse.data);
        }
      } catch (error) {
        console.error("Failed to load workout plan", error);
        toast.error("Failed to load workout plan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: "plan", label: "Weekly Plan", icon: Calendar },
    { id: "library", label: "Exercise Library", icon: Library },
    { id: "progress", label: "Progress & Overload", icon: TrendingUp },
  ];

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise.id)
        ? prev.filter((id) => id !== exercise.id)
        : [...prev, exercise.id],
    );
  };

  const handleAdjustment = (adjustment) => {
    console.log("Adjustment:", adjustment);
    // TODO: Persist adjustment data when backend is ready.
  };

  const handleWorkoutLogSubmit = (logData) => {
    console.log("Workout Log:", logData);
    // TODO: Persist workout log when backend is ready.
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workout Center
              </h1>
            </div>
            <p className="text-gray-600">
              Plan your workouts, track progress, and build your perfect
              physique.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "plan" && (
                  <WorkoutPlan
                    plan={workoutPlan}
                    onWorkoutLogSubmit={handleWorkoutLogSubmit}
                  />
                )}

                {activeTab === "library" && (
                  <ExerciseLibrary
                    onSelect={handleExerciseSelect}
                    selected={selectedExercises}
                    favorites={favoriteExercises}
                  />
                )}

                {activeTab === "progress" && (
                  <ProgressOverload onAdjust={handleAdjustment} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Workout;
