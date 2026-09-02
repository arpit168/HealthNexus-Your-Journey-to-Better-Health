import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    adherenceLogs: [
      {
        id: String,
        date: String,
        workoutCompleted: Boolean,
        caloriesTracked: Boolean,
        proteinGoalHit: Boolean,
        sleepGoalHit: Boolean,
        waterGoalHit: Boolean,
        notes: String,
      },
    ],
    measurements: [
      {
        id: String,
        date: String,
        chest: Number,
        waist: Number,
        arms: Number,
        thighs: Number,
        bodyFatPercentage: Number,
      },
    ],
    weightHistory: [
      {
        id: String,
        date: String,
        weight: Number,
        bodyFat: Number,
      },
    ],
    progressPhotos: [
      {
        id: String,
        date: String,
        frontUrl: String,
        sideUrl: String,
        backUrl: String,
        weight: Number,
        notes: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Tracking", trackingSchema);
