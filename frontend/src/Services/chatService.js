import axiosInstance from "../config/Api";

export const chatService = {
  getData: async () => {
    const response = await axiosInstance.get("/chat");
    return response.data;
  },
  updateData: async (data) => {
    const response = await axiosInstance.post("/chat", data);
    return response.data;
  },
  clearData: async () => {
    const response = await axiosInstance.delete("/chat");
    return response.data;
  },
};
