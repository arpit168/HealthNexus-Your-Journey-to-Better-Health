// services/authService.js
import axiosInstance from "../config/Api";

export const loginUser = async ({ email, password, rememberMe }) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const response = await axiosInstance.post(
      "/auth/login",
      {
        email: email.trim().toLowerCase(),
        password,
        rememberMe: rememberMe || false,
      },
      {
        withCredentials: true, // ⭐ refresh token cookie
      },
    );

    if (response.status !== 200 || !response.data) {
      throw new Error("Invalid response from server");
    }

    const { user, accessToken, message } = response.data;

    if (!user || !accessToken) {
      throw new Error("Invalid login response structure");
    }

    // ✅ RETURN DATA (AuthContext will store in memory)
    return {
      success: true,
      user,
      accessToken,
      message: message || "Login successful",
      isActive: user.isActive === "active",
    };
  } catch (error) {
    // ⏱ Timeout
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // 🌐 Network
    if (error.message === "Network Error") {
      throw new Error("Unable to connect to server.");
    }

    // 📡 Server response
    if (error.response) {
      const status = error.response.status;
      const serverMessage =
        error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          throw new Error(serverMessage || "Invalid request");
        case 401:
          throw new Error(serverMessage || "Invalid email or password");
        case 403:
          throw new Error(serverMessage || "Access denied");
        case 404:
          throw new Error(serverMessage || "Account not found");
        case 429:
          throw new Error("Too many attempts. Try later.");
        case 500:
          throw new Error("Server error. Try again later.");
        default:
          throw new Error(serverMessage || "Login failed");
      }
    }

    // ❌ No response
    if (error.request) {
      throw new Error("No response from server");
    }

    throw new Error(error.message || "Unexpected login error");
  }
};

export const verifyTwoFactorLogin = async (userId, code, tempToken) => {
  try {
    const response = await axiosInstance.post("/auth/2fa/verify-login", {
      userId,
      code,
      tempToken,
    });

    if (response.data.token) {
      localStorage.setItem("fitai_token", response.data.token);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Invalid 2FA code");
    }
    throw new Error("Failed to verify 2FA code");
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/resend-verification", {
      email: email.trim().toLowerCase(),
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to resend verification email",
      );
    }
    throw new Error("Network error. Please try again.");
  }
};

export const registerUser = async (userData) => {
  try {
    // Validate required fields
    const requiredFields = [
      "fullName",
      "email",
      "password",
      "confirmPassword",
      "age",
      "biologicalSex",
      "height",
      "weight",
      "activityLevel",
      "experienceLevel",
      "primaryGoal",
      "medicalDisclaimer",
      "termsAccepted",
    ];

    for (const field of requiredFields) {
      if (!userData[field] && field !== "confirmPassword") {
        throw new Error(`${field} is required`);
      }
    }

    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      throw new Error(
        "Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character",
      );
    }

    // Validate age range
    const age = parseInt(userData.age);
    if (age < 15 || age > 70) {
      throw new Error("Age must be between 15 and 70");
    }

    // Validate height range
    const height = parseInt(userData.height);
    if (height < 120 || height > 220) {
      throw new Error("Height must be between 120-220 cm");
    }

    // Validate weight range
    const weight = parseInt(userData.weight);
    if (weight < 30 || weight > 200) {
      throw new Error("Weight must be between 30-200 kg");
    }

    // Make API request
    const response = await axiosInstance.post("/auth/register", {
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      age: parseInt(userData.age),
      biologicalSex: userData.biologicalSex,
      height: parseInt(userData.height),
      weight: parseInt(userData.weight),
      activityLevel: userData.activityLevel,
      experienceLevel: userData.experienceLevel,
      primaryGoal: userData.primaryGoal,
      medicalDisclaimer: userData.medicalDisclaimer,
      termsAccepted: userData.termsAccepted,
      createdAt: new Date().toISOString(),
    });

    // Check response
    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    const { user, token, refreshToken, expiresIn } = response.data;

    // Store tokens
    if (token) {
      localStorage.setItem("fitai_token", token);

      if (refreshToken) {
        localStorage.setItem("fitai_refresh_token", refreshToken);
      }

      if (expiresIn) {
        const expiryTime = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem("fitai_token_expiry", expiryTime.toString());
      }
    }

    // Store user data
    if (user) {
      const safeUserData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        preferences: user.preferences || {
          theme: "light",
          notifications: true,
        },
      };
      localStorage.setItem("healthnexus_user", JSON.stringify(safeUserData));
    }

    return {
      success: true,
      user,
      message: response.data.message || "Login successful",
    };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const serverMessage =
        error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          throw new Error(serverMessage || "Invalid registration data");

        case 409:
          throw new Error(serverMessage || "Email already exists");

        case 422:
          throw new Error(serverMessage || "Validation failed");

        case 429:
          throw new Error(
            "Too many registration attempts. Please try again later.",
          );

        case 500:
        case 502:
        case 503:
          throw new Error("Server error. Please try again later.");

        default:
          throw new Error(
            serverMessage || `Registration failed with status ${status}`,
          );
      }
    }

    throw new Error(error.message || "Login failed");
  }
};

export const getUserData = () => {
  try {
    const raw = localStorage.getItem("healthnexus_user");

    if (!raw) return null;

    const user = JSON.parse(raw);

    return user;
  } catch (error) {
    console.error("Invalid user data in localStorage", error);

    // Optional hard reset
    localStorage.removeItem("healthnexus_user");

    return null; // ❗ DON'T throw here
  }
};

export const updateUserData = async (updatedFields = {}) => {
  try {
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      throw new Error("No fields to update");
    }

    const response = await axiosInstance.patch(
      "/user/update-profile",
      updatedFields,
    );

    if (!response.data?.data) {
      throw new Error("Invalid server response");
    }

    const updatedUser = response.data.data;

    console.log(updatedUser);

    return updatedUser;
  } catch (error) {
    console.error(
      "Update user failed:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem("healthnexus_user");
    return { success: true, message: "Logout successful" };
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Failed to logout. Please try again.");
  }
};
