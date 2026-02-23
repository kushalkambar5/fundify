import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, isOnboarded, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If authenticated and onboarded, or if accessing the onboarding page appropriately
  return <Outlet />;
};

export default ProtectedRoute;
