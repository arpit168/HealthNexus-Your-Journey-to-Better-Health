import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "../config/Api";
import { loginUser } from "./authService";

vi.mock("../config/Api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loginUser", () => {
    it("should throw error if email or password missing", async () => {
      await expect(loginUser({ email: "test@test.com" })).rejects.toThrow(
        "Email and password are required",
      );
      await expect(loginUser({ password: "password123" })).rejects.toThrow(
        "Email and password are required",
      );
    });

    it("should successfully login and return formatted user data", async () => {
      const mockResponse = {
        status: 200,
        data: {
          user: { id: 1, email: "test@test.com", isActive: "active" },
          accessToken: "fake-token",
          message: "Login successful",
        },
      };

      axiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await loginUser({
        email: "test@test.com",
        password: "password123",
      });

      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/auth/login",
        { email: "test@test.com", password: "password123", rememberMe: false },
        { withCredentials: true },
      );

      expect(result).toEqual({
        success: true,
        user: mockResponse.data.user,
        accessToken: "fake-token",
        message: "Login successful",
        isActive: true,
      });
    });

    it("should handle network errors properly", async () => {
      const networkError = new Error("Network Error");
      networkError.message = "Network Error";
      axiosInstance.post.mockRejectedValueOnce(networkError);

      await expect(
        loginUser({ email: "test@test.com", password: "password123" }),
      ).rejects.toThrow("Unable to connect to server.");
    });
  });
});
