import React from "react";
import Landing from "./pages/Landing";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Signup3 from "./pages/Signup3";
import LegalPrivacy from "./pages/LegalPrivacy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy-policy" element={<LegalPrivacy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* If authenticated but missing onboarding details, ProtectedRoute redirects here */}
            {/* But we don't put it tightly *inside* ProtectedRoute wrapper since ProtectedRoute requires full onboarding */}
            <Route path="/onboarding" element={<Signup3 />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
