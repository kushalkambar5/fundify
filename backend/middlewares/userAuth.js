import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import handleAsyncError from "./handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(
      new HandleError(
        401,
        "Authentication is missing! Please login to access resource",
      ),
    );
  }
  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new HandleError(401, "Invalid or expired token"));
  }
  const user = await User.findById(decodedData.id);
  if (!user) {
    return next(new HandleError(404, "User not found"));
  }

  req.user = user;
  next();
});

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandleError(
          403,
          `Role - ${req.user.role} is not allowed to access the resource`,
        ),
      );
    }
    next();
  };
};
