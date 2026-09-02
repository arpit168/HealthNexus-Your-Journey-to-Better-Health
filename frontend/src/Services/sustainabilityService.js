import axiosInstance from "../config/Api";

export const sustainabilityService = {
  getSustainabilityData: async () => {
    const response = await axiosInstance.get("/sustainability");
    return response.data;
  },

  updateSustainabilityData: async (data) => {
    const response = await axiosInstance.post("/sustainability", data);
    return response.data;
  },
};

export default sustainabilityService;
