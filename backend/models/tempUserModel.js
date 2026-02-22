import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    otpExpire: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Auto-delete document 15 minutes after creation (TTL index)
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

export default mongoose.model("TempUser", tempUserSchema);
