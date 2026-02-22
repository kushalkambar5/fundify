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
} from "../controllers/userController.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

// Protected
router.get("/me", verifyUserAuth, getUserProfile);
router.get("/assets", verifyUserAuth, getAssets);
router.get("/expenses", verifyUserAuth, getExpenses);
router.get("/financial-goals", verifyUserAuth, getFinancialGoals);
router.get("/incomes", verifyUserAuth, getIncomes);
router.get("/insurances", verifyUserAuth, getInsurances);
router.get("/liabilities", verifyUserAuth, getLiabilities);
router.put("/me", verifyUserAuth, updateUserProfile);
router.post("/asset", verifyUserAuth, postAsset);
router.post("/expense", verifyUserAuth, postExpense);
router.post("/financial-goal", verifyUserAuth, postFinancialGoal);
router.post("/income", verifyUserAuth, postIncome);
router.post("/insurance", verifyUserAuth, postInsurance);
router.post("/liability", verifyUserAuth, postLiability);

export default router;
