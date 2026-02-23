import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      // Get the profile. If this succeeds, the HTTP-only cookie is valid.
      const res = await axiosInstance.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);

        // Check onboarding status explicitly using the user's email
        const onboardingRes = await axiosInstance.get(
          `/user/onboarding-status/${res.data.user.email}`,
        );
        setIsOnboarded(onboardingRes.data.allSaved);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setIsOnboarded(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);

      // Also check if they finished onboarding upon login
      const onboardingRes = await axiosInstance.get(
        `/user/onboarding-status/${res.data.user.email}`,
      );
      setIsOnboarded(onboardingRes.data.allSaved);
      return res.data;
    }
    throw new Error("Invalid login");
  };

  const logout = async () => {
    await axiosInstance.get("/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  const value = {
    user,
    isAuthenticated,
    isOnboarded,
    loading,
    login,
    logout,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
