import handleError from "../utils/handleError.js";
import handleAsync from "../middlewares/handleAsyncError.js";
import User from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";

// Register a new user
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
  });

  sendToken(newUser, 201, res);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: newUser,
  });
});

// Login an existing user
export const loginUser = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(handleError(400, "All fields are required"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(handleError(401, "Invalid email or password"));
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(handleError(401, "Invalid email or password"));
  }
  sendToken(user, 200, res);
  res.status(200).json({ user, token });
});

// Logout a user
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

// Get user profile
export const getUserProfile = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(handleError(404, "User not found"));
  }
  res.status(200).json({ user });
});
