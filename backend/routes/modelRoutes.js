import express from "express";
import {
  healthCheck,
  ragAsk,
  ragRetrieve,
  financialHealthScore,
  netWorthAnalysis,
  goalFeasibility,
  portfolioAlignment,
  stressTest,
  userBasedRetrieval,
} from "../controllers/modelController.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Health
router.get("/health", healthCheck);

// RAG
router.post("/rag/ask", verifyUserAuth, ragAsk);
router.post("/rag/retrieve", verifyUserAuth, ragRetrieve);

// Score
router.post("/score/financial-health", verifyUserAuth, financialHealthScore);

// Analytics
router.post("/analytics/net-worth", verifyUserAuth, netWorthAnalysis);
router.post("/analytics/goal-feasibility", verifyUserAuth, goalFeasibility);
router.post(
  "/analytics/portfolio-alignment",
  verifyUserAuth,
  portfolioAlignment,
);

// Simulation
router.post("/simulate/stress-test", verifyUserAuth, stressTest);

// User-based retrieval
router.post("/user-based-retrieval", verifyUserAuth, userBasedRetrieval);

export default router;
