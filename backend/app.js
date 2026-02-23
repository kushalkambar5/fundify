import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", modelRoutes);

app.use(errorMiddleware);

export default app;
