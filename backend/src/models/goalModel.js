import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalType: {
      type: String,
      enum: ["lose", "maintain", "gain", "muscle"],
      required: true,
    },

    currentWeight: {
      type: Number,
      required: true,
    },

    targetWeight: {
      type: Number,
      default: null,
    },

    timeline: {
      type: Number,
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    maintenanceCalories: {
      type: Number,
      required: true,
    },

    calorieTarget: {
      type: Number,
      required: true,
    },

    safetyWarnings: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
