import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["health", "term", "life", "vehicle", "property", "other"],
    },
    provider: {
      type: String,
      required: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    premiumAmount: {
      type: Number,
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
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

export default mongoose.model("Insurance", insuranceSchema);
