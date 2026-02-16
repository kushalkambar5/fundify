import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["stock", "mutual_fund", "crypto", "fd", "real_estate", "gold"],
    },
    name: {
      type: String,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    investedAmount: {
      type: Number,
      required: true,
    },
    expectedReturnRate: {
      type: Number,
      required: true,
    },
    liquidityLevel: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Asset", assetSchema);
