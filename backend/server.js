import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const requiredEnvs = ["FRONTEND_URL", "JWT_SECRET", "MONGO_URI"];
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  console.error(
    `FATAL ERROR: Missing required environment variables: ${missingEnvs.join(", ")}`,
  );
  process.exit(1);
}

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
