import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    weightAnalysisData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    workoutByDayData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    workoutTypesData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    nutritionData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    macroDistributionData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    sleepWorkoutData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    dietWeightData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    weightForecastData: { type: [mongoose.Schema.Types.Mixed], default: [] },
    overviewStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    weightAnalysis: { type: mongoose.Schema.Types.Mixed, default: {} },
    workoutPatterns: { type: mongoose.Schema.Types.Mixed, default: {} },
    nutritionStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    predictions: { type: mongoose.Schema.Types.Mixed, default: {} },
    heatMapData: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Analytics", analyticsSchema);
