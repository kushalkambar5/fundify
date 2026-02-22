import express from "express";
import {
  verifyEmail,
  verifyOtp,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
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

// Protected
router.get("/me", verifyUserAuth, getUserProfile);

export default router;
