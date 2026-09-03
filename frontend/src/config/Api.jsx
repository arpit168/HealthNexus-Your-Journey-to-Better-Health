import axios from "axios";

// In development, Vite proxy routes API calls to the backend, so baseURL is "".
// In production, VITE_API_URL is expected (e.g., https://api.yourdomain.com).
// We ensure it ends with /api if it doesn't already, so routes like /auth match backend expectations.
const envUrl = import.meta.env.VITE_API_URL;
const baseURL = envUrl
  ? envUrl.endsWith("/api") || envUrl.endsWith("/api/")
    ? envUrl
    : `${envUrl.replace(/\/$/, "")}/api`
  : "/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: attach Authorization header if access token is available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.__accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
