import axiosInstance from "../config/Api";

export const analyticsService = {
  getAnalyticsData: async () => {
    const response = await axiosInstance.get("/analytics");
    return response.data;
  },
  generateReport: async () => {
    const response = await axiosInstance.post("/analytics/generate");
    return response.data;
  },
};
