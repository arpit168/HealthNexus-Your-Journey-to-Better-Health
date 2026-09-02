import axios from "axios";

// In development, Vite proxy routes API calls to the backend, so baseURL is "".
// In production, set VITE_API_URL to your deployed backend URL (e.g., https://api.yourdomain.com).
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
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
