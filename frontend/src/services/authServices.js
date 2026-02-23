import axiosInstance from "./axiosInstance";

// Pre-registration email verification
export const verifyEmail = async (email) => {
  const response = await axiosInstance.post("/auth/verify-email", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return response.data;
};

// Auth
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.get("/auth/logout");
  return response.data;
};

// Forgot password (public — 3-step OTP flow)
export const forgotPasswordSendOtp = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const forgotPasswordVerifyOtp = async (email, otp) => {
  const response = await axiosInstance.post(
    "/auth/forgot-password/verify-otp",
    { email, otp },
  );
  return response.data;
};

export const resetPassword = async (email, password, confirmPassword) => {
  const response = await axiosInstance.post("/auth/forgot-password/reset", {
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

// Protected Auth Profile
export const getAuthProfile = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
