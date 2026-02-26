import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const user = await User.findOne({});
      if (!user) {
        console.log("No user found");
        process.exit(1);
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const PORT = process.env.PORT || 5000;
      const API_URL = process.env.API_URL || `http://localhost:${PORT}/api/v1`;

      await axios.post(
        `${API_URL}/score/financial-health`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Success - but we expected an error!");
    } catch (e) {
      console.log("Failed as expected:", e.response?.data || e.message);
    }
    process.exit(0);
  })
  .catch(console.error);
