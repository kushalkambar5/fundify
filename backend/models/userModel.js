import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    dependents: {
      type: Number,
      required: true,
    },
    employmentType: {
      type: String,
      required: true,
    },
    annualIncome: {
      type: Number,
      required: true,
    },
    riskProfile: {
      type: String,
      default: "conservative",
      enum: ["conservative", "moderate", "aggressive"],
    },
    history: {
      type: String,
      default: "",
    },
    infoStatus: {
      assets: {
        type: Boolean,
        default: false,
      },
      liabilities: {
        type: Boolean,
        default: false,
      },
      incomes: {
        type: Boolean,
        default: false,
      },
      expenses: {
        type: Boolean,
        default: false,
      },
      goals: {
        type: Boolean,
        default: false,
      },
      insurance: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default mongoose.model("User", userSchema);
