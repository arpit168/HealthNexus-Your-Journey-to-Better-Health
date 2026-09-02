import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Heart,
  Play,
  Dumbbell,
  Target,
  TrendingUp,
  Star,
  Clock,
} from "lucide-react";

const ExerciseLibrary = ({ onSelect, selected = [], favorites = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesState, setFavoritesState] = useState(favorites);

  // Exercise database
  const exerciseDatabase = [
    // Chest Exercises
    {
      id: 1,
      name: "Barbell Bench Press",
      muscleGroup: "chest",
      equipment: "barbell",
      difficulty: "intermediate",
      description: "Compound movement for chest, shoulders, and triceps",
      videoUrl: "/videos/bench-press.mp4",
      primaryMuscles: ["Pectoralis Major"],
      secondaryMuscles: ["Anterior Deltoid", "Triceps"],
      instructions: [
        "Lie flat on bench with feet on floor",
        "Grip bar slightly wider than shoulder width",
        "Lower bar to chest with control",
        "Press back up to starting position",
      ],
    },
    {
      id: 2,
      name: "Dumbbell Chest Press",
      muscleGroup: "chest",
      equipment: "dumbbell",
      difficulty: "beginner",
      description: "Effective chest builder with greater range of motion",
      videoUrl: "/videos/db-press.mp4",
      primaryMuscles: ["Pectoralis Major"],
      secondaryMuscles: ["Anterior Deltoid", "Triceps"],
      instructions: [
        "Lie on bench with dumbbells at chest level",
        "Press dumbbells up until arms extended",
        "Lower with control to starting position",
      ],
    },
    {
      id: 3,
      name: "Push-Ups",
      muscleGroup: "chest",
      equipment: "bodyweight",
      difficulty: "beginner",
      description: "Classic bodyweight chest exercise",
      videoUrl: "/videos/pushups.mp4",
      primaryMuscles: ["Pectoralis Major"],
      secondaryMuscles: ["Triceps", "Core"],
      instructions: [
        "Start in plank position",
        "Lower body until chest nearly touches floor",
        "Push back up to starting position",
      ],
    },

    // Back Exercises
    {
      id: 4,
      name: "Pull-Ups",
      muscleGroup: "back",
      equipment: "bodyweight",
      difficulty: "intermediate",
      description: "Compound pulling movement for back and biceps",
      videoUrl: "/videos/pullups.mp4",
      primaryMuscles: ["Latissimus Dorsi"],
      secondaryMuscles: ["Biceps", "Rear Deltoid"],
      instructions: [
        "Hang from bar with overhand grip",
        "Pull body up until chin over bar",
        "Lower with control to starting position",
      ],
    },
    {
      id: 5,
      name: "Barbell Rows",
      muscleGroup: "back",
      equipment: "barbell",
      difficulty: "intermediate",
      description: "Essential back thickness builder",
      videoUrl: "/videos/barbell-row.mp4",
      primaryMuscles: ["Latissimus Dorsi", "Rhomboids"],
      secondaryMuscles: ["Biceps", "Lower Back"],
      instructions: [
        "Bend forward at hips with bar hanging",
        "Pull bar to lower chest",
        "Lower with control",
      ],
    },
    {
      id: 6,
      name: "Lat Pulldown",
      muscleGroup: "back",
      equipment: "machine",
      difficulty: "beginner",
      description: "Cable exercise for lat development",
      videoUrl: "/videos/lat-pulldown.mp4",
      primaryMuscles: ["Latissimus Dorsi"],
      secondaryMuscles: ["Biceps", "Rear Deltoid"],
      instructions: [
        "Sit at lat pulldown machine",
        "Pull bar down to upper chest",
        "Return to starting position slowly",
      ],
    },

    // Legs Exercises
    {
      id: 7,
      name: "Barbell Squats",
      muscleGroup: "legs",
      equipment: "barbell",
      difficulty: "intermediate",
      description: "King of all leg exercises",
      videoUrl: "/videos/squat.mp4",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings", "Core"],
      instructions: [
        "Bar on upper back, feet shoulder width",
        "Lower until thighs parallel to floor",
        "Drive through heels to stand",
      ],
    },
    {
      id: 8,
      name: "Leg Press",
      muscleGroup: "legs",
      equipment: "machine",
      difficulty: "beginner",
      description: "Machine-based quad and glute builder",
      videoUrl: "/videos/leg-press.mp4",
      primaryMuscles: ["Quadriceps", "Glutes"],
      secondaryMuscles: ["Hamstrings"],
      instructions: [
        "Sit in machine with feet on platform",
        "Lower weight until knees at 90 degrees",
        "Push back to starting position",
      ],
    },
    {
      id: 9,
      name: "Romanian Deadlift",
      muscleGroup: "legs",
      equipment: "barbell",
      difficulty: "intermediate",
      description: "Hamstring and glute focused deadlift variation",
      videoUrl: "/videos/rdl.mp4",
      primaryMuscles: ["Hamstrings", "Glutes"],
      secondaryMuscles: ["Lower Back"],
      instructions: [
        "Hold bar at hip level",
        "Hinge at hips keeping legs nearly straight",
        "Return to starting position",
      ],
    },

    // Shoulders Exercises
    {
      id: 10,
      name: "Overhead Press",
      muscleGroup: "shoulders",
      equipment: "barbell",
      difficulty: "intermediate",
      description: "Primary shoulder mass builder",
      videoUrl: "/videos/ohp.mp4",
      primaryMuscles: ["Anterior Deltoid"],
      secondaryMuscles: ["Triceps", "Upper Chest"],
      instructions: [
        "Bar at shoulder level",
        "Press overhead until arms locked",
        "Lower to starting position",
      ],
    },
    {
      id: 11,
      name: "Lateral Raises",
      muscleGroup: "shoulders",
      equipment: "dumbbell",
      difficulty: "beginner",
      description: "Side delt isolation exercise",
      videoUrl: "/videos/lateral-raise.mp4",
      primaryMuscles: ["Lateral Deltoid"],
      secondaryMuscles: [],
      instructions: [
        "Hold dumbbells at sides",
        "Raise arms to shoulder height",
        "Lower with control",
      ],
    },

    // Arms Exercises
    {
      id: 12,
      name: "Barbell Curl",
      muscleGroup: "arms",
      equipment: "barbell",
      difficulty: "beginner",
      description: "Classic bicep builder",
      videoUrl: "/videos/barbell-curl.mp4",
      primaryMuscles: ["Biceps"],
      secondaryMuscles: ["Forearms"],
      instructions: [
        "Hold bar with underhand grip",
        "Curl bar up to shoulders",
        "Lower with control",
      ],
    },
    {
      id: 13,
      name: "Tricep Dips",
      muscleGroup: "arms",
      equipment: "bodyweight",
      difficulty: "intermediate",
      description: "Compound tricep exercise",
      videoUrl: "/videos/dips.mp4",
      primaryMuscles: ["Triceps"],
      secondaryMuscles: ["Chest", "Shoulders"],
      instructions: [
        "Support body on parallel bars",
        "Lower until elbows at 90 degrees",
        "Push back up to starting position",
      ],
    },

    // Core Exercises
    {
      id: 14,
      name: "Plank",
      muscleGroup: "core",
      equipment: "bodyweight",
      difficulty: "beginner",
      description: "Isometric core strengthener",
      videoUrl: "/videos/plank.mp4",
      primaryMuscles: ["Rectus Abdominis", "Transverse Abdominis"],
      secondaryMuscles: ["Shoulders"],
      instructions: [
        "Hold body in straight line on forearms",
        "Keep core tight",
        "Maintain position for time",
      ],
    },
    {
      id: 15,
      name: "Russian Twists",
      muscleGroup: "core",
      equipment: "bodyweight",
      difficulty: "beginner",
      description: "Rotational core exercise",
      videoUrl: "/videos/russian-twist.mp4",
      primaryMuscles: ["Obliques"],
      secondaryMuscles: ["Rectus Abdominis"],
      instructions: [
        "Sit with knees bent, lean back slightly",
        "Rotate torso side to side",
        "Touch floor on each side",
      ],
    },
  ];

  const muscleGroups = [
    { value: "all", label: "All Muscles", icon: "💪" },
    { value: "chest", label: "Chest", icon: "🫀" },
    { value: "back", label: "Back", icon: "🔙" },
    { value: "legs", label: "Legs", icon: "🦵" },
    { value: "shoulders", label: "Shoulders", icon: "👔" },
    { value: "arms", label: "Arms", icon: "💪" },
    { value: "core", label: "Core", icon: "🎯" },
  ];

  const equipmentTypes = [
    { value: "all", label: "All Equipment" },
    { value: "barbell", label: "Barbell" },
    { value: "dumbbell", label: "Dumbbell" },
    { value: "machine", label: "Machine" },
    { value: "bodyweight", label: "Bodyweight" },
    { value: "cable", label: "Cable" },
  ];

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const toggleFavorite = (exerciseId) => {
    setFavoritesState((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  };

  // Filtered exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exerciseDatabase.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMuscle =
        selectedMuscleGroup === "all" ||
        exercise.muscleGroup === selectedMuscleGroup;

      const matchesEquipment =
        selectedEquipment === "all" || exercise.equipment === selectedEquipment;

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        exercise.difficulty === selectedDifficulty;

      const matchesFavorites =
        !showFavoritesOnly || favoritesState.includes(exercise.id);

      return (
        matchesSearch &&
        matchesMuscle &&
        matchesEquipment &&
        matchesDifficulty &&
        matchesFavorites
      );
    });
  }, [
    searchQuery,
    selectedMuscleGroup,
    selectedEquipment,
    selectedDifficulty,
    showFavoritesOnly,
    favoritesState,
  ]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
              showFavoritesOnly
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${showFavoritesOnly ? "fill-current" : ""}`}
            />
            Favorites
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Muscle Group Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Muscle Group
            </label>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {muscleGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.icon} {group.label}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Dumbbell className="w-4 h-4 inline mr-1" />
              Equipment
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {equipmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {difficulties.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredExercises.length} exercise
          {filteredExercises.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredExercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all cursor-pointer ${
                selected.includes(exercise.id)
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onSelect && onSelect(exercise)}
            >
              {/* Exercise Image/Video Placeholder */}
              <div className="relative h-40 bg-linear-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(exercise.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoritesState.includes(exercise.id)
                        ? "fill-pink-600 text-pink-600"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              </div>

              {/* Exercise Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {exercise.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                    {exercise.muscleGroup}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs capitalize">
                    {exercise.equipment}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${getDifficultyColor(
                      exercise.difficulty,
                    )}`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Primary Muscles */}
                <div className="text-xs text-gray-600">
                  <Target className="w-3 h-3 inline mr-1" />
                  {exercise.primaryMuscles.join(", ")}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 text-lg">No exercises found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
