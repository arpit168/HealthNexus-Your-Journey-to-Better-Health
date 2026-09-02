import mongoose from "mongoose";

const sustainabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    microAdjustments: [
      {
        id: String,
        date: String,
        category: String,
        description: String,
        impact: Number,
        timestamp: Number,
      },
    ],
    momentumScore: [
      {
        date: String,
        score: Number,
        workoutsCompleted: Number,
        mealsLogged: Number,
        goalsHit: Number,
        consistency: Number,
        progress: Number,
      },
    ],
    dependencyScore: [
      {
        date: String,
        supplementReliance: Number,
        trainerDependency: Number,
        motivationScore: Number,
        knowledgeLevel: Number,
        overallScore: Number,
      },
    ],
    lifestyleIntegration: [
      {
        date: String,
        sleepQuality: Number,
        stressLevel: Number,
        workLifeBalance: Number,
        energyLevel: Number,
        overallScore: Number,
      },
    ],
    compoundingRate: [
      {
        date: String,
        habitStrength: Number,
        skillAcquisition: Number,
        resultsMultiplier: Number,
        overallRate: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Sustainability", sustainabilitySchema);
