import axios from "axios";

// In development, Vite proxy routes API calls to the backend, so baseURL is "".
// In production, we use the deployed Render backend URL.
const baseURL = import.meta.env.PROD 
  ? "https://healthnexus-your-journey-to-better.onrender.com/api" 
  : (import.meta.env.VITE_API_URL || "/api");

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
