import User from "../models/userModel.js";

// ======================== GET ENDPOINTS ========================

// Get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get user health data
export const getUserHealthData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("healthData");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: user.healthData || {},
    });
  } catch (error) {
    next(error);
  }
};

// Get workout history
export const getWorkoutHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { limit = 50, skip = 0 } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // If workouts array doesn't exist yet
    const workouts = user.workouts || [];
    const totalWorkouts = workouts.length;
    const paginatedWorkouts = workouts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: {
        workouts: paginatedWorkouts,
        total: totalWorkouts,
        hasMore: skip + limit < totalWorkouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get meal history
export const getMealHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { limit = 50, skip = 0 } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // If meals array doesn't exist yet
    const meals = user.meals || [];
    const totalMeals = meals.length;
    const paginatedMeals = meals
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: {
        meals: paginatedMeals,
        total: totalMeals,
        hasMore: skip + limit < totalMeals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get tracking data
export const getTrackingData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type = "all" } = req.query; // weight, measurements, photos, adherence

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const trackingData = {
      weight: user.weightTracking || [],
      measurements: user.measurements || [],
      photos: user.progressPhotos || [],
      adherence: user.adherenceLogs || [],
    };

    let responseData = trackingData;
    if (type !== "all") {
      responseData = { [type]: trackingData[type] || [] };
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// ======================== POST ENDPOINTS (SAVE DATA) ========================

// Save workout
export const saveWorkout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { exercise, duration, sets, reps, weight, date, notes } = req.body;

    // Validation
    if (!exercise || exercise.trim().length === 0) {
      const error = new Error("Exercise name is required");
      error.statusCode = 400;
      return next(error);
    }

    if (!duration || parseInt(duration) <= 0) {
      const error = new Error(
        "Duration must be a positive number (in minutes)",
      );
      error.statusCode = 400;
      return next(error);
    }

    if (sets && parseInt(sets) < 0) {
      const error = new Error("Sets cannot be negative");
      error.statusCode = 400;
      return next(error);
    }

    if (reps && parseInt(reps) < 0) {
      const error = new Error("Reps cannot be negative");
      error.statusCode = 400;
      return next(error);
    }

    if (weight && parseFloat(weight) < 0) {
      const error = new Error("Weight cannot be negative");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Initialize workouts array if not exists
    if (!user.workouts) {
      user.workouts = [];
    }

    const newWorkout = {
      exercise: exercise.trim(),
      duration: parseInt(duration),
      sets: sets ? parseInt(sets) : null,
      reps: reps ? parseInt(reps) : null,
      weight: weight ? parseFloat(weight) : null,
      date: date ? new Date(date) : new Date(),
      notes: notes ? notes.trim() : "",
      createdAt: new Date(),
    };

    user.workouts.push(newWorkout);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Workout saved successfully",
      data: newWorkout,
    });
  } catch (error) {
    next(error);
  }
};

// Save meal
export const saveMeal = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { mealName, calories, protein, carbs, fat, date, mealType, notes } =
      req.body;

    // Validation
    if (!mealName || mealName.trim().length === 0) {
      const error = new Error("Meal name is required");
      error.statusCode = 400;
      return next(error);
    }

    if (!calories || parseFloat(calories) <= 0) {
      const error = new Error("Calories must be a positive number");
      error.statusCode = 400;
      return next(error);
    }

    const validMealTypes = ["breakfast", "lunch", "dinner", "snack", "other"];
    if (mealType && !validMealTypes.includes(mealType)) {
      const error = new Error("Invalid meal type");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Initialize meals array if not exists
    if (!user.meals) {
      user.meals = [];
    }

    const newMeal = {
      mealName: mealName.trim(),
      calories: parseFloat(calories),
      protein: protein ? parseFloat(protein) : 0,
      carbs: carbs ? parseFloat(carbs) : 0,
      fat: fat ? parseFloat(fat) : 0,
      date: date ? new Date(date) : new Date(),
      mealType: mealType || "other",
      notes: notes ? notes.trim() : "",
      createdAt: new Date(),
    };

    user.meals.push(newMeal);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Meal saved successfully",
      data: newMeal,
    });
  } catch (error) {
    next(error);
  }
};

// Save tracking data (weight, measurements, etc)
export const saveTracking = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, value, date, notes } = req.body;

    // Validation
    if (!type || typeof type !== "string") {
      const error = new Error("Type is required");
      error.statusCode = 400;
      return next(error);
    }

    if (!value || parseFloat(value) <= 0) {
      const error = new Error("Value must be a positive number");
      error.statusCode = 400;
      return next(error);
    }

    const validTypes = ["weight", "measurement", "photo", "adherence"];
    if (!validTypes.includes(type)) {
      const error = new Error(
        "Invalid tracking type. Must be: weight, measurement, photo, or adherence",
      );
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const trackingEntry = {
      value: parseFloat(value),
      date: date ? new Date(date) : new Date(),
      notes: notes ? notes.trim() : "",
      createdAt: new Date(),
    };

    // Save to appropriate array based on type
    switch (type) {
      case "weight":
        if (!user.weightTracking) user.weightTracking = [];
        user.weightTracking.push(trackingEntry);
        break;
      case "measurement":
        if (!user.measurements) user.measurements = [];
        user.measurements.push(trackingEntry);
        break;
      case "photo":
        if (!user.progressPhotos) user.progressPhotos = [];
        user.progressPhotos.push(trackingEntry);
        break;
      case "adherence":
        if (!user.adherenceLogs) user.adherenceLogs = [];
        user.adherenceLogs.push(trackingEntry);
        break;
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: `${type} tracking saved successfully`,
      data: trackingEntry,
    });
  } catch (error) {
    next(error);
  }
};

// Save health data
export const saveHealthData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const healthDataUpdates = req.body;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Initialize healthData if not exists
    if (!user.healthData) {
      user.healthData = {};
    }

    // Merge new health data
    user.healthData = {
      ...user.healthData,
      ...healthDataUpdates,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Health data updated successfully",
      data: user.healthData,
    });
  } catch (error) {
    next(error);
  }
};

export const getDietPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: user.dietPlan || {} });
  } catch (error) {
    next(error);
  }
};

export const saveDietPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    user.dietPlan = req.body;
    await user.save();
    res.status(200).json({ success: true, data: user.dietPlan });
  } catch (error) {
    next(error);
  }
};

export const getWorkoutPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: user.workoutPlan || {} });
  } catch (error) {
    next(error);
  }
};

export const saveWorkoutPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    user.workoutPlan = req.body;
    await user.save();
    res.status(200).json({ success: true, data: user.workoutPlan });
  } catch (error) {
    next(error);
  }
};
