import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "housing",
        "transportation",
        "food",
        "utilities",
        "insurance",
        "healthcare",
        "debt",
        "entertainment",
        "rent",
        "emi",
        "enterainment",
        "other",
      ],
    },
    monthlyAmount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["fixed", "variable"],
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

export default mongoose.model("Expense", expenseSchema);
