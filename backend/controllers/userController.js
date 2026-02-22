import handleAsync from "../middlewares/handleAsyncError.js";
import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";
import Expense from "../models/expenseModel.js";
import FinancialGoal from "../models/financialGoalModel.js";
import Income from "../models/incomeModel.js";
import Insurance from "../models/insuranceModel.js";
import Liability from "../models/liabilityModel.js";

// Get Assets
export const getAssets = handleAsync(async (req, res, next) => {
  const assets = await Asset.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    assets,
  });
});

// Get Expenses
export const getExpenses = handleAsync(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    expenses,
  });
});

// Get Financial Goals
export const getFinancialGoals = handleAsync(async (req, res, next) => {
  const financialGoals = await FinancialGoal.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    financialGoals,
  });
});

// Get Incomes
export const getIncomes = handleAsync(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    incomes,
  });
});

// Get Insurances
export const getInsurances = handleAsync(async (req, res, next) => {
  const insurances = await Insurance.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    insurances,
  });
});

// Get Liabilities
export const getLiabilities = handleAsync(async (req, res, next) => {
  const liabilities = await Liability.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    liabilities,
  });
});

// Get User Profile
export const getUserProfile = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Profile
export const updateUserProfile = handleAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Post Asset
export const postAsset = handleAsync(async (req, res, next) => {
  const asset = await Asset.create({ ...req.body, user: req.user.id });
  res.status(201).json({
    success: true,
    asset,
  });
});

// Post Expense
export const postExpense = handleAsync(async (req, res, next) => {
  const expense = await Expense.create({ ...req.body, user: req.user.id });
  res.status(201).json({
    success: true,
    expense,
  });
});

// Post Financial Goal
export const postFinancialGoal = handleAsync(async (req, res, next) => {
  const financialGoal = await FinancialGoal.create({
    ...req.body,
    user: req.user.id,
  });
  res.status(201).json({
    success: true,
    financialGoal,
  });
});

// Post Income
export const postIncome = handleAsync(async (req, res, next) => {
  const income = await Income.create({ ...req.body, user: req.user.id });
  res.status(201).json({
    success: true,
    income,
  });
});

// Post Insurance
export const postInsurance = handleAsync(async (req, res, next) => {
  const insurance = await Insurance.create({ ...req.body, user: req.user.id });
  res.status(201).json({
    success: true,
    insurance,
  });
});

// Post Liability
export const postLiability = handleAsync(async (req, res, next) => {
  const liability = await Liability.create({ ...req.body, user: req.user.id });
  res.status(201).json({
    success: true,
    liability,
  });
});
