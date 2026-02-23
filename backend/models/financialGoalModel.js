import mongoose from "mongoose";

const financialGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalType: {
      type: String,
      required: true,
      enum: [
        "house",
        "retirement",
        "car",
        "travel",
        "emergency_fund",
        "education",
        "other",
      ],
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    priorityLevel: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
    },
    inflationRate: {
      type: Number,
      required: true,
    },
    currentSavingsForGoal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "achieved"],
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

export default mongoose.model("FinancialGoal", financialGoalSchema);
