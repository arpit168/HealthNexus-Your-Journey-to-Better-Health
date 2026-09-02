import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axiosInstance from "./Api";

describe("Api configuration", () => {
  let originalToken;

  beforeEach(() => {
    originalToken = window.__accessToken;
  });

  afterEach(() => {
    window.__accessToken = originalToken;
    vi.restoreAllMocks();
  });

  it("should have correct default config", () => {
    expect(axiosInstance.defaults.baseURL).toBe("/api");
    expect(axiosInstance.defaults.withCredentials).toBe(true);
    expect(axiosInstance.defaults.timeout).toBe(15000);
    expect(axiosInstance.defaults.headers["Content-Type"]).toBe(
      "application/json",
    );
  });

  it("should attach Authorization header if access token exists", async () => {
    window.__accessToken = "test-token";
    const config = { headers: {} };

    // Get the request interceptor
    const requestInterceptor =
      axiosInstance.interceptors.request.handlers[0].fulfilled;
    const result = await requestInterceptor(config);

    expect(result.headers.Authorization).toBe("Bearer test-token");
  });

  it("should not attach Authorization header if no access token", async () => {
    window.__accessToken = undefined;
    const config = { headers: {} };

    const requestInterceptor =
      axiosInstance.interceptors.request.handlers[0].fulfilled;
    const result = await requestInterceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});
