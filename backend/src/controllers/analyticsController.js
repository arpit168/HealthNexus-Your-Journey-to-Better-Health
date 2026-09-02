import Analytics from "../models/analyticsModel.js";

// Initialize mock data to ensure UI is preserved for demonstration
// In a real prod app, this would be computed from User workouts/meals
const getInitialAnalyticsData = () => ({
  weightAnalysisData: [
    { date: "Jan 1", weight: 85, movingAvg: 85, trend: 85 },
    { date: "Jan 8", weight: 84.5, movingAvg: 84.7, trend: 84.5 },
    { date: "Jan 15", weight: 84.2, movingAvg: 84.4, trend: 84 },
    { date: "Jan 22", weight: 83.8, movingAvg: 84.1, trend: 83.5 },
    { date: "Jan 29", weight: 83.5, movingAvg: 83.8, trend: 83 },
    { date: "Feb 5", weight: 83.1, movingAvg: 83.5, trend: 82.5 },
    { date: "Feb 12", weight: 82.8, movingAvg: 83.2, trend: 82 },
    { date: "Feb 19", weight: 82.5, movingAvg: 82.9, trend: 81.5 },
  ],
  workoutByDayData: [
    { day: "Mon", workouts: 12 },
    { day: "Tue", workouts: 15 },
    { day: "Wed", workouts: 10 },
    { day: "Thu", workouts: 14 },
    { day: "Fri", workouts: 13 },
    { day: "Sat", workouts: 8 },
    { day: "Sun", workouts: 6 },
  ],
  workoutTypesData: [
    { name: "Cardio", value: 35 },
    { name: "Strength", value: 40 },
    { name: "Yoga", value: 15 },
    { name: "HIIT", value: 10 },
  ],
  nutritionData: [
    {
      date: "Mon",
      protein: 150,
      carbs: 200,
      fats: 60,
      targetCalories: 2100,
      actualCalories: 2050,
    },
    {
      date: "Tue",
      protein: 160,
      carbs: 180,
      fats: 65,
      targetCalories: 2100,
      actualCalories: 2100,
    },
    {
      date: "Wed",
      protein: 145,
      carbs: 210,
      fats: 55,
      targetCalories: 2100,
      actualCalories: 2000,
    },
    {
      date: "Thu",
      protein: 155,
      carbs: 190,
      fats: 70,
      targetCalories: 2100,
      actualCalories: 2150,
    },
    {
      date: "Fri",
      protein: 150,
      carbs: 220,
      fats: 50,
      targetCalories: 2100,
      actualCalories: 2080,
    },
    {
      date: "Sat",
      protein: 140,
      carbs: 200,
      fats: 60,
      targetCalories: 2100,
      actualCalories: 2000,
    },
    {
      date: "Sun",
      protein: 135,
      carbs: 230,
      fats: 55,
      targetCalories: 2100,
      actualCalories: 2120,
    },
  ],
  macroDistributionData: [
    { name: "Protein", value: 30, color: "#ef4444" },
    { name: "Carbs", value: 50, color: "#3b82f6" },
    { name: "Fats", value: 20, color: "#f59e0b" },
  ],
  sleepWorkoutData: [
    { sleep: 5, performance: 60 },
    { sleep: 6, performance: 70 },
    { sleep: 6.5, performance: 75 },
    { sleep: 7, performance: 85 },
    { sleep: 7.5, performance: 90 },
    { sleep: 8, performance: 95 },
    { sleep: 8.5, performance: 92 },
  ],
  dietWeightData: [
    { adherence: 60, weightLoss: 0.2 },
    { adherence: 70, weightLoss: 0.3 },
    { adherence: 75, weightLoss: 0.35 },
    { adherence: 80, weightLoss: 0.4 },
    { adherence: 85, weightLoss: 0.45 },
    { adherence: 90, weightLoss: 0.5 },
    { adherence: 95, weightLoss: 0.55 },
  ],
  weightForecastData: [
    { week: "Current", actual: 82.5, forecast: 82.5, upper: 82.5, lower: 82.5 },
    { week: "Week +1", actual: null, forecast: 82.1, upper: 82.5, lower: 81.7 },
    { week: "Week +2", actual: null, forecast: 81.7, upper: 82.3, lower: 81.1 },
    { week: "Week +3", actual: null, forecast: 81.3, upper: 82.0, lower: 80.6 },
    { week: "Week +4", actual: null, forecast: 80.9, upper: 81.7, lower: 80.1 },
  ],
  overviewStats: {
    totalWorkouts: 78,
    totalMeals: 186,
    weightChange: -2.5,
    habitScoreAvg: 82,
  },
  weightAnalysis: {
    rateOfChange: -0.44,
    plateauDetected: false,
  },
  workoutPatterns: {
    mostConsistent: "Tuesday",
    leastConsistent: "Sunday",
  },
  nutritionStats: {
    mostConsistentMeal: "Breakfast",
  },
  predictions: {
    achievementProbability: 87,
    recommendedAdjustments: [
      "Increase protein intake by 10g on rest days",
      "Add one more cardio session on weekends",
      "Maintain current sleep schedule (7-8 hours)",
    ],
  },
  heatMapData: Array.from({ length: 8 * 7 }).map((_, i) => ({
    week: Math.floor(i / 7),
    day: i % 7,
    intensity: Math.floor(Math.random() * 5),
  })),
});

export const getAnalyticsData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      const initialData = getInitialAnalyticsData();
      analytics = new Analytics({ userId, ...initialData });
      await analytics.save();
    }

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};

export const generateAnalyticsReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Mocking report generation response
    res
      .status(200)
      .json({ success: true, message: "Report generated successfully" });
  } catch (error) {
    next(error);
  }
};
