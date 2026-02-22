import handleError from "../utils/handleError.js";
import handleAsync from "../middlewares/handleAsyncError.js";
import User from "../models/userModel.js";
import TempUser from "../models/tempUserModel.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import generateOtp from "../utils/generateOtp.js";

// ─── Step 1: Verify Email — Send OTP ─────────────────────────────────────────
// POST /api/v1/user/verify-email   body: { email }
export const verifyEmail = handleAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(handleError(400, "Email is required"));
  }

  // Prevent re-registration with an existing account
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(handleError(409, "An account with this email already exists"));
  }

  // Generate OTP
  const { otp, otpExpire } = generateOtp(6);

  // Upsert TempUser — reset OTP if called again for same email
  await TempUser.findOneAndUpdate(
    { email },
    { otpCode: otp, otpExpire, isVerified: false },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // Build HTML email
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="color:#2563eb;margin-bottom:8px;">Fundify — Email Verification</h2>
      <p style="color:#374151;margin-bottom:24px;">Use the OTP below to verify your email. It expires in <strong>10 minutes</strong>.</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:10px;text-align:center;color:#1e40af;background:#eff6ff;padding:20px;border-radius:8px;">${otp}</div>
      <p style="color:#6b7280;font-size:12px;margin-top:24px;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  try {
    await sendEmail({
      email,
      subject: "Fundify — Verify Your Email",
      message: `Your Fundify OTP is: ${otp}. It expires in 10 minutes.`,
      html,
    });
  } catch (err) {
    await TempUser.deleteOne({ email });
    return next(handleError(500, "Failed to send OTP. Please try again."));
  }

  res.status(200).json({
    success: true,
    message: `OTP sent to ${email}. Please check your inbox.`,
  });
});

// ─── Step 2: Verify OTP ───────────────────────────────────────────────────────
// POST /api/v1/user/verify-otp   body: { email, otp }
export const verifyOtp = handleAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(handleError(400, "Email and OTP are required"));
  }

  const tempUser = await TempUser.findOne({ email });
  if (!tempUser) {
    return next(
      handleError(
        404,
        "No verification request found. Please request a new OTP.",
      ),
    );
  }

  if (tempUser.otpExpire < Date.now()) {
    await TempUser.deleteOne({ email });
    return next(handleError(400, "OTP has expired. Please request a new one."));
  }

  if (tempUser.otpCode !== otp.toString()) {
    return next(handleError(400, "Invalid OTP. Please try again."));
  }

  // Mark as verified — user can now complete registration
  tempUser.isVerified = true;
  await tempUser.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You may now complete registration.",
  });
});

// ─── Step 3: Register ─────────────────────────────────────────────────────────
// POST /api/v1/user/register   body: { email, password, name, phone, ... }
export const registerUser = handleAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    age,
    gender,
    address,
    city,
    state,
    zip,
    country,
    maritalStatus,
    dependents,
    employmentType,
    annualIncome,
    riskProfile,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !age ||
    !gender ||
    !address ||
    !city ||
    !state ||
    !zip ||
    !country ||
    !maritalStatus ||
    !dependents ||
    !employmentType ||
    !annualIncome ||
    !riskProfile
  ) {
    return next(handleError(400, "All fields are required"));
  }

  // Guard: email must be OTP-verified first
  const tempUser = await TempUser.findOne({ email });
  if (!tempUser || !tempUser.isVerified) {
    return next(
      handleError(
        403,
        "Email not verified. Please verify your email before registering.",
      ),
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    age,
    gender,
    address,
    city,
    state,
    zip,
    country,
    maritalStatus,
    dependents,
    employmentType,
    annualIncome,
    riskProfile,
    isVerified: true, // carries forward the verified status
  });

  // Clean up temp document
  await TempUser.deleteOne({ email });

  sendToken(newUser, 201, res);
});

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/v1/user/login   body: { email, password }
export const loginUser = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(handleError(400, "All fields are required"));
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    return next(handleError(401, "Invalid email or password"));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(handleError(401, "Invalid email or password"));
  }

  sendToken(user, 200, res);
});

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logoutUser = handleAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getUserProfile = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(handleError(404, "User not found"));
  }
  res.status(200).json({ success: true, user });
});
