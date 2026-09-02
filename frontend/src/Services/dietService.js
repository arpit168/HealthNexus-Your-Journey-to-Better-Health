import axiosInstance from "../config/Api";

export const dietService = {
  getDietPlan: async () => {
    const response = await axiosInstance.get("/userData/diet-plan");
    return response.data;
  },

  saveDietPlan: async (planData) => {
    const response = await axiosInstance.post("/userData/diet-plan", planData);
    return response.data;
  },

  getMealHistory: async ({ limit = 50, skip = 0 } = {}) => {
    const response = await axiosInstance.get(
      `/userData/meal-history?limit=${limit}&skip=${skip}`,
    );
    return response.data;
  },

  saveMeal: async (mealData) => {
    const response = await axiosInstance.post("/userData/meal", mealData);
    return response.data;
  },
};

export default dietService;
