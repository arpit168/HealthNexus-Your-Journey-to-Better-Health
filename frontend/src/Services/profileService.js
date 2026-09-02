import axiosInstance from "../config/Api";

export const profileService = {
  // Get full user profile from backend
  getProfile: async () => {
    const response = await axiosInstance.get("/userData/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (updatedFields) => {
    const response = await axiosInstance.patch(
      "/user/update-profile",
      updatedFields,
    );
    return response.data;
  },

  // Change profile photo (multipart form)
  changePhoto: async (formData) => {
    const response = await axiosInstance.patch("/user/changePhoto", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Reset password
  resetPassword: async ({ oldPassword, newPassword }) => {
    const response = await axiosInstance.patch("/user/resetPassword", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export default profileService;
