/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axiosInstance from "../config/Api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prevent multiple refresh calls on mount
  const refreshAttempted = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  // Store access token globally so the shared axiosInstance interceptor can use it
  useEffect(() => {
    window.__accessToken = accessToken;
  }, [accessToken]);

  // 🔁 REFRESH TOKEN FUNCTION
  const refreshAuth = useCallback(async (isRetry = false) => {
    if (refreshAttempted.current && !isRetry) return;

    try {
      refreshAttempted.current = true;
      setError(null);

      if (import.meta.env.DEV) {
        console.log("🔄 Attempting to refresh session...");
      }

      const res = await axiosInstance.get("/auth/refresh");

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user || null);
        setIsAuthenticated(true);

        if (import.meta.env.DEV) {
          console.log("✅ Session refreshed successfully");
        }
      } else {
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        if (import.meta.env.DEV) {
          console.log("ℹ️ No active session found (expected on first load)");
        }
      } else if (err.code === "ECONNABORTED") {
        console.error("Refresh request timeout");
        setError("Connection timeout. Please check your network.");
      } else {
        // 500, proxy errors, network errors — treat silently on first load
        if (import.meta.env.DEV) {
          console.warn("Could not refresh session:", err.message);
        }
      }

      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial refresh on mount
  useEffect(() => {
    refreshAuth();
    return () => {
      refreshAttempted.current = false;
    };
  }, [refreshAuth]);

  // 🔐 LOGIN
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const res = await axiosInstance.post("/auth/login", { email, password });

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user || null);
        setIsAuthenticated(true);

        if (import.meta.env.DEV) {
          console.log("✅ Login successful");
        }

        return { success: true, data: res.data };
      }

      throw new Error("Invalid response from server");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      let userMessage = "Login failed";

      if (status === 401) {
        userMessage = "Invalid email or password";
      } else if (status === 400) {
        userMessage = message || "Please provide email and password";
      } else if (status === 429) {
        userMessage = "Too many attempts. Please try again later";
      } else if (err.code === "ECONNABORTED") {
        userMessage = "Connection timeout. Please try again";
      } else if (!err.response) {
        userMessage = "Network error. Please check your connection";
      }

      setError(userMessage);

      if (import.meta.env.DEV) {
        console.error("❌ Login failed:", { status, message });
      }

      return { success: false, error: userMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // 📝 REGISTER
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const res = await axiosInstance.post("/auth/register", userData);

      // Registration returns a success message (no accessToken on register)
      if (res.data) {
        if (import.meta.env.DEV) {
          console.log("✅ Registration successful");
        }

        return { success: true, data: res.data };
      }

      throw new Error("Invalid response from server");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      let userMessage = "Registration failed";

      if (status === 400) {
        userMessage = message || "Invalid registration data";
      } else if (status === 409) {
        userMessage = "Email already registered";
      } else if (err.code === "ECONNABORTED") {
        userMessage = "Connection timeout. Please try again";
      } else if (!err.response) {
        userMessage = "Network error. Please check your connection";
      }

      setError(userMessage);

      if (import.meta.env.DEV) {
        console.error("❌ Registration failed:", { status, message });
      }

      return { success: false, error: userMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚪 LOGOUT
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/auth/logout", {}).catch(() => {
        // Silently fail — we always want to clear local state
      });

      if (import.meta.env.DEV) {
        console.log("👋 Logged out successfully");
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.log("Logout warning:", err.message);
      }
    } finally {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
      window.__accessToken = null;
      refreshAttempted.current = false;
    }
  }, []);

  // ✏️ UPDATE USER (local state only)
  const updateUser = useCallback((updatedUser) => {
    setUser((prevUser) => {
      if (!prevUser) return updatedUser;
      return { ...prevUser, ...updatedUser };
    });
  }, []);

  // 🔄 AXIOS INTERCEPTOR — auto-refresh on 401
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/refresh")
        ) {
          originalRequest._retry = true;

          try {
            await refreshAuth(true);
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [refreshAuth, logout]);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
    clearError,
    axios: axiosInstance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div className="auth-loading">Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};

export const useProtectedAxios = () => {
  const { accessToken, isAuthenticated, logout } = useAuth();

  const protectedAxios = useCallback(
    async (config) => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      try {
        const response = await axiosInstance({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    [accessToken, isAuthenticated, logout],
  );

  return protectedAxios;
};

export default AuthProvider;
