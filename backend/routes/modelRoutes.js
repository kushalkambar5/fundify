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

const router = express.Router();

// Health
router.get("/health", healthCheck);

// RAG
router.post("/rag/ask", ragAsk);
router.post("/rag/retrieve", ragRetrieve);

// Score
router.post("/score/financial-health", financialHealthScore);

// Analytics
router.post("/analytics/net-worth", netWorthAnalysis);
router.post("/analytics/goal-feasibility", goalFeasibility);
router.post("/analytics/portfolio-alignment", portfolioAlignment);

// Simulation
router.post("/simulate/stress-test", stressTest);

// User-based retrieval
router.post("/user-based-retrieval", userBasedRetrieval);

export default router;
