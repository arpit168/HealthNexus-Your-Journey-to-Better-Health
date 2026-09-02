import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./Common/Loaders";

/**
 * ProtectedRouteGuard - Handles route protection and redirects based on auth state
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render when access is allowed
 * @param {string} props.type - Route type: "protected" (requires auth) or "public" (blocks authenticated users)
 * @returns {React.ReactNode} Protected component, redirect, or loader
 */
export const ProtectedRouteGuard = ({ children, type = "protected" }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loader while auth state is being determined
  if (loading) {
    return <PageLoader />;
  }

  // Protected routes: require authentication
  if (type === "protected") {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  // Public routes: block authenticated users
  if (type === "public") {
    if (isAuthenticated) {
      // Redirect authenticated users to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // Fallback (should not reach here)
  return children;
};

export default ProtectedRouteGuard;
