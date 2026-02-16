import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sourceType: {
            type: String,
            required: true,
            enum: ["salary", "freelance", "investment", "rental", "business", "other"],
        },
        monthlyAmount: {
            type: Number,
            required: true,
        },
        growthRate: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
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

export default mongoose.model("Income", incomeSchema);