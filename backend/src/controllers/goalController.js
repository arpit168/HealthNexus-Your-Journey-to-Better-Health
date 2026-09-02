import Goal from "../models/goalModel.js";

export const createGoal = async (req, res) => {
  try {
    const {
      goalType,
      currentWeight,
      targetWeight,
      timeline,
      experienceLevel,
      maintenanceCalories,
      calorieTarget,
      safetyWarnings,
    } = req.body;

    // Validation
    if (
      !goalType ||
      !timeline ||
      !experienceLevel ||
      !maintenanceCalories ||
      !calorieTarget
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const newGoal = await Goal.create({
      userId: req.user._id,

      goalType,

      currentWeight,

      targetWeight,

      timeline,

      experienceLevel,

      maintenanceCalories,

      calorieTarget,

      safetyWarnings,
    });

    return res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal: newGoal,
    });
  } catch (error) {
    console.log("Create Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================================
// GET USER GOALS
// ============================================

export const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      goals,
    });
  } catch (error) {
    console.log("Get Goals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================================
// GET SINGLE GOAL
// ============================================

export const getSingleGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      goal,
    });
  } catch (error) {
    console.log("Get Single Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================================
// UPDATE GOAL
// ============================================

export const updateGoal = async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedGoal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.log("Update Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================================
// DELETE GOAL
// ============================================

export const deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);

    if (!deletedGoal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.log("Delete Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
