import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PublicLayout from "./Layout/PublicLayout";
import PrivateLayout from "./Layout/PrivateLayout";
import { PageLoader } from "./components/Common/Loaders";
import ProtectedRouteGuard from "./components/ProtectedRouteGuard";
import ScrollToTop from "./context/ScrollToTop";

// Layouts
// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Workout = lazy(() => import("./pages/Dashboard/Workout"));
const Diet = lazy(() => import("./pages/Dashboard/Diet"));
const Tracking = lazy(() => import("./pages/Dashboard/Tracking"));
// const Progress = lazy(() => import("./pages/Dashboard/Progress"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const Chat = lazy(() => import("./pages/Dashboard/Chat"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const Reports = lazy(() => import("./pages/Dashboard/reports"));
const Overtraining = lazy(() => import("./pages/Dashboard/Overtraining"));
const Sustainability = lazy(() => import("./pages/Dashboard/Sustainability"));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 max-w-md">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes - Protected from authenticated users */}
            <Route element={<PublicLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRouteGuard type="public">
                    <Home />
                  </ProtectedRouteGuard>
                }
              />
            </Route>

            {/* Auth & Protected Routes */}
            <Route element={<PrivateLayout />}>
              {/* Public Auth Routes */}
              <Route
                path="/login"
                element={
                  <ProtectedRouteGuard type="public">
                    <Login />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRouteGuard type="public">
                    <Register />
                  </ProtectedRouteGuard>
                }
              />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Dashboard />
                  </ProtectedRouteGuard>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Profile />
                  </ProtectedRouteGuard>
                }
              />

              <Route
                path="/workout"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Workout />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/diet"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Diet />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/tracking"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Tracking />
                  </ProtectedRouteGuard>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Analytics />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Chat />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Settings />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Reports />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/overtraining"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Overtraining />
                  </ProtectedRouteGuard>
                }
              />
              <Route
                path="/sustainability"
                element={
                  <ProtectedRouteGuard type="protected">
                    <Sustainability />
                  </ProtectedRouteGuard>
                }
              />
            </Route>

            {/* 404 Route - Catch all unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
