import axiosInstance from "../config/Api";

export const workoutService = {
  // Get workout history with optional pagination
  getWorkoutHistory: async ({ limit = 50, skip = 0 } = {}) => {
    const response = await axiosInstance.get(
      `/userData/workout-history?limit=${limit}&skip=${skip}`,
    );
    return response.data;
  },

  // Save a new workout entry
  saveWorkout: async (workoutData) => {
    const response = await axiosInstance.post("/userData/workout", workoutData);
    return response.data;
  },

  // Get health data
  getHealthData: async () => {
    const response = await axiosInstance.get("/userData/health-data");
    return response.data;
  },

  // Save health data
  saveHealthData: async (healthData) => {
    const response = await axiosInstance.patch(
      "/userData/health-data",
      healthData,
    );
    return response.data;
  },

  getWorkoutPlan: async () => {
    const response = await axiosInstance.get("/userData/workout-plan");
    return response.data;
  },

  saveWorkoutPlan: async (planData) => {
    const response = await axiosInstance.post(
      "/userData/workout-plan",
      planData,
    );
    return response.data;
  },
};

export default workoutService;
