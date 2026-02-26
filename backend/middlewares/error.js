import HandleError from "../utils/handleError.js";

export default (err, req, res, next) => {
  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0], // or return `messages` if you want all
    });
  }

  // Cast Error
  if (err.name === "CastError") {
    err = new HandleError(400, `Invalid ${err.path}`);
  }

  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new HandleError(
      400,
      `${field} already exists, please Login to continue`,
    );
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
