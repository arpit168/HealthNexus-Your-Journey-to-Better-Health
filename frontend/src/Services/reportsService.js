// Reports Data Service - Handles fetching and managing report data
import axiosInstance from "../config/Api";

export const reportsService = {
  // Weekly Report Data
  async getWeeklyReport(weekStart) {
    try {
      const response = await axiosInstance.get(
        `/reports?type=weekly&weekStart=${weekStart}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch weekly report:", error.message);
      throw error;
    }
  },

  // Monthly Report Data
  async getMonthlyReport(month, year) {
    try {
      const response = await axiosInstance.get(
        `/reports?type=monthly&month=${month}&year=${year}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch monthly report:", error.message);
      throw error;
    }
  },

  // Multi-Week Report Data
  async getMultiWeekReport(weekCount, customStart, customEnd) {
    try {
      const params = new URLSearchParams({
        type: "multiweek",
        weekCount,
        customStart,
        customEnd,
      });
      const response = await axiosInstance.get(`/reports?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch multi-week report:", error.message);
      throw error;
    }
  },

  // Yearly Report Data
  async getYearlyReport(year) {
    try {
      const response = await axiosInstance.get(
        `/reports?type=yearly&year=${year}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch yearly report:", error.message);
      throw error;
    }
  },

  // Get all report data
  async getReportData() {
    try {
      const response = await axiosInstance.get("/reports");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch report data:", error.message);
      throw error;
    }
  },

  // Update report data
  async updateReportData(reportsData) {
    try {
      const response = await axiosInstance.post("/reports", { reportsData });
      return response.data;
    } catch (error) {
      console.error("Failed to update report data:", error.message);
      throw error;
    }
  },
};

export default reportsService;
