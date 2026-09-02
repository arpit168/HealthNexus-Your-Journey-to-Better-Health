import axiosInstance from "../config/Api";

export const trackingService = {
  getData: async () => {
    const response = await axiosInstance.get("/tracking");
    return response.data;
  },
  updateData: async (data) => {
    const response = await axiosInstance.post("/tracking", data);
    return response.data;
  },
};
