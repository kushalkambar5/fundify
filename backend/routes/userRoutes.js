import express from "express";
import {
  getAssets,
  getExpenses,
  getFinancialGoals,
  getIncomes,
  getInsurances,
  getLiabilities,
  getUserProfile,
  updateUserProfile,
  postAsset,
  postExpense,
  postFinancialGoal,
  postIncome,
  postInsurance,
  postLiability,
  checkOnboardingStatus,
  markOnboardingStep,
  updateAsset,
  deleteAsset,
  updateExpense,
  deleteExpense,
  updateFinancialGoal,
  deleteFinancialGoal,
  updateIncome,
  deleteIncome,
  updateInsurance,
  deleteInsurance,
  updateLiability,
  deleteLiability,
  getFinancialHealthScore,
} from "../controllers/userController.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Public / Semi-Public
router.get("/onboarding-status/:email", checkOnboardingStatus);

// Protected
router.patch("/onboarding-step", verifyUserAuth, markOnboardingStep);
router.get("/me", verifyUserAuth, getUserProfile);
router.get("/assets", verifyUserAuth, getAssets);
router.get("/expenses", verifyUserAuth, getExpenses);
router.get("/financial-goals", verifyUserAuth, getFinancialGoals);
router.get("/incomes", verifyUserAuth, getIncomes);
router.get("/insurances", verifyUserAuth, getInsurances);
router.get("/liabilities", verifyUserAuth, getLiabilities);
router.get("/financial-health-score", verifyUserAuth, getFinancialHealthScore);
router.put("/me", verifyUserAuth, updateUserProfile);
router.post("/asset", verifyUserAuth, postAsset);
router.put("/asset/:id", verifyUserAuth, updateAsset);
router.delete("/asset/:id", verifyUserAuth, deleteAsset);

router.post("/expense", verifyUserAuth, postExpense);
router.put("/expense/:id", verifyUserAuth, updateExpense);
router.delete("/expense/:id", verifyUserAuth, deleteExpense);

router.post("/financial-goal", verifyUserAuth, postFinancialGoal);
router.put("/financial-goal/:id", verifyUserAuth, updateFinancialGoal);
router.delete("/financial-goal/:id", verifyUserAuth, deleteFinancialGoal);

router.post("/income", verifyUserAuth, postIncome);
router.put("/income/:id", verifyUserAuth, updateIncome);
router.delete("/income/:id", verifyUserAuth, deleteIncome);

router.post("/insurance", verifyUserAuth, postInsurance);
router.put("/insurance/:id", verifyUserAuth, updateInsurance);
router.delete("/insurance/:id", verifyUserAuth, deleteInsurance);

router.post("/liability", verifyUserAuth, postLiability);
router.put("/liability/:id", verifyUserAuth, updateLiability);
router.delete("/liability/:id", verifyUserAuth, deleteLiability);

export default router;
