import mongoose from "mongoose";

const liabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["loan", "credit_card", "mortgage", "other"],
    },
    principalAmount: {
      type: Number,
      required: true,
    },
    outstandingAmount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    emiAmount: {
      type: Number,
      required: true,
    },
    tenureRemaining: {
      type: Number,
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

export default mongoose.model("Liability", liabilitySchema);
