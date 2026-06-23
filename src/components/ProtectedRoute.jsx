import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const ProtectedRoute = ({ requireAdmin = false }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setIsAdmin(user.role === "admin");

      // IMPORTANT: Don't check subscription here
      // Let users stay logged in even if trial expired
      // Feature-level checks will handle the blocking
    } catch (error) {
      console.error("Access check error:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <motion.div
          className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Require admin but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user-panel" replace />;
  }

  // ALWAYS allow access if authenticated
  // Subscription checks happen at feature level
  return <Outlet />;
};

export default ProtectedRoute;
