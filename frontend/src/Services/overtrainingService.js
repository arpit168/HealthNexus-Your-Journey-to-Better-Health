import axiosInstance from "../config/Api";

export const overtrainingService = {
  getOvertrainingData: async () => {
    const response = await axiosInstance.get("/overtraining");
    return response.data;
  },

  updateOvertrainingData: async (data) => {
    const response = await axiosInstance.post("/overtraining", data);
    return response.data;
  },
};

export default overtrainingService;
