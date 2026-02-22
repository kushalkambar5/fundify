import express from "express";
import {
  verifyEmail,
  verifyOtp,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPasswordSendOtp,
  forgotPasswordVerifyOtp,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Pre-registration email verification
router.post("/verify-email", verifyEmail); // Step 1: enter email → receive OTP
router.post("/verify-otp", verifyOtp); // Step 2: submit OTP → tempUser.isVerified = true

// Auth
router.post("/register", registerUser); // Step 3: fill form → creates User (needs verified email)
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Forgot password (public — 3-step OTP flow)
router.post("/forgot-password", forgotPasswordSendOtp); // Step 1: enter email → receive OTP
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtp); // Step 2: verify OTP
router.post("/forgot-password/reset", resetPassword); // Step 3: set new password

// Protected
router.get("/me", verifyUserAuth, getUserProfile);
router.post("/change-password", verifyUserAuth, changePassword); // Authenticated password change

export default router;
