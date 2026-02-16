import mongoose from "mongoose";

const financialHealthScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    breakdown: {
      savingsRate: {
        type: Number,
        required: true,
      },
      emergencyFund: {
        type: Number,
        required: true,
      },
      debtRatio: {
        type: Number,
        required: true,
      },
      diversification: {
        type: Number,
        required: true,
      },
      insuranceCoverage: {
        type: Number,
        required: true,
      },
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model(
  "FinancialHealthScore",
  financialHealthScoreSchema,
);
