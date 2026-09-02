import mongoose from "mongoose";

const overtrainingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fatigueMetrics: [
      {
        date: String,
        sorenessLevel: Number,
        sleepQuality: Number,
        hrvScore: Number,
        moodState: Number,
        overallFatigue: Number,
        injuryRisk: Number,
        recoveryRate: Number,
      },
    ],
    recoveryDayFrequency: [
      {
        date: String,
        recoveryDaysTaken: Number,
        recommendedDays: Number,
        adherenceRate: Number,
      },
    ],
    alerts: [
      {
        id: String,
        date: String,
        type: String,
        severity: String,
        message: String,
        resolved: Boolean,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Overtraining", overtrainingSchema);
