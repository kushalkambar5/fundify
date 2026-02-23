import handleAsync from "../middlewares/handleAsyncError.js";
import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";
import Expense from "../models/expenseModel.js";
import FinancialGoal from "../models/financialGoalModel.js";
import Income from "../models/incomeModel.js";
import Insurance from "../models/insuranceModel.js";
import Liability from "../models/liabilityModel.js";
import FinancialHealthScore from "../models/financialHealthScoreModel.js";

export const getAssets = handleAsync(async (req, res, next) => {
  const assets = await Asset.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    assets,
  });
});

// Check completely saved onboarding status explicitly from user.infoStatus
export const checkOnboardingStatus = handleAsync(async (req, res, next) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const assetCount = await Asset.countDocuments({ user: user._id });
  const incomeCount = await Income.countDocuments({ user: user._id });
  const expenseCount = await Expense.countDocuments({ user: user._id });
  const liabilityCount = await Liability.countDocuments({ user: user._id });
  const insuranceCount = await Insurance.countDocuments({ user: user._id });
  const goalCount = await FinancialGoal.countDocuments({ user: user._id });

  const completedSectionsCount = [
    assetCount > 0,
    incomeCount > 0,
    expenseCount > 0,
    liabilityCount > 0,
    insuranceCount > 0,
    goalCount > 0,
  ].filter(Boolean).length;

  const allSaved = completedSectionsCount >= 2;

  res.status(200).json({ success: true, allSaved });
});

export const markOnboardingStep = handleAsync(async (req, res, next) => {
  const { step } = req.body;
  const validSteps = [
    "assets",
    "liabilities",
    "incomes",
    "expenses",
    "goals",
    "insurance",
  ];
  if (!validSteps.includes(step))
    return res.status(400).json({ success: false, message: "Invalid step" });

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.infoStatus[step] = true;
  await user.save();

  res.status(200).json({ success: true, user });
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
  const user = await User.findById(req.user.id);
  user.infoStatus.assets = true;
  await user.save();
  res.status(201).json({
    success: true,
    asset,
  });
});

// Update Asset
export const updateAsset = handleAsync(async (req, res, next) => {
  let asset = await Asset.findById(req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found" });
  }
  if (asset.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to update this asset" });
  }
  asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, asset });
});

// Delete Asset
export const deleteAsset = handleAsync(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found" });
  }
  if (asset.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to delete this asset" });
  }
  await asset.deleteOne();
  res.status(200).json({ success: true, message: "Asset deleted" });
});

// Post Expense
export const postExpense = handleAsync(async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user.id });
    const user = await User.findById(req.user.id);
    user.infoStatus.expenses = true;
    await user.save();
    res.status(201).json({
      success: true,
      expense,
    });
  } catch (err) {
    console.error("EXPENSE_ERROR:", err);
    next(err);
  }
});

// Update Expense
export const updateExpense = handleAsync(async (req, res, next) => {
  let expense = await Expense.findById(req.params.id);
  if (!expense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found" });
  }
  if (expense.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to update this expense",
    });
  }
  expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, expense });
});

// Delete Expense
export const deleteExpense = handleAsync(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found" });
  }
  if (expense.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to delete this expense",
    });
  }
  await expense.deleteOne();
  res.status(200).json({ success: true, message: "Expense deleted" });
});

// Post Financial Goal
export const postFinancialGoal = handleAsync(async (req, res, next) => {
  const financialGoal = await FinancialGoal.create({
    ...req.body,
    user: req.user.id,
  });
  const user = await User.findById(req.user.id);
  user.infoStatus.goals = true;
  await user.save();
  res.status(201).json({
    success: true,
    financialGoal,
  });
});

// Update Financial Goal
export const updateFinancialGoal = handleAsync(async (req, res, next) => {
  let goal = await FinancialGoal.findById(req.params.id);
  if (!goal) {
    return res.status(404).json({ success: false, message: "Goal not found" });
  }
  if (goal.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to update this goal" });
  }
  goal = await FinancialGoal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, goal });
});

// Delete Financial Goal
export const deleteFinancialGoal = handleAsync(async (req, res, next) => {
  const goal = await FinancialGoal.findById(req.params.id);
  if (!goal) {
    return res.status(404).json({ success: false, message: "Goal not found" });
  }
  if (goal.user.toString() !== req.user.id) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to delete this goal" });
  }
  await goal.deleteOne();
  res.status(200).json({ success: true, message: "Goal deleted" });
});

// Post Income
export const postIncome = handleAsync(async (req, res, next) => {
  try {
    const income = await Income.create({ ...req.body, user: req.user.id });
    const user = await User.findById(req.user.id);
    user.infoStatus.incomes = true;
    await user.save();
    res.status(201).json({
      success: true,
      income,
    });
  } catch (err) {
    console.error("INCOME_ERROR:", err);
    next(err);
  }
});

// Update Income
export const updateIncome = handleAsync(async (req, res, next) => {
  let income = await Income.findById(req.params.id);
  if (!income) {
    return res
      .status(404)
      .json({ success: false, message: "Income not found" });
  }
  if (income.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to update this income",
    });
  }
  income = await Income.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, income });
});

// Delete Income
export const deleteIncome = handleAsync(async (req, res, next) => {
  const income = await Income.findById(req.params.id);
  if (!income) {
    return res
      .status(404)
      .json({ success: false, message: "Income not found" });
  }
  if (income.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to delete this income",
    });
  }
  await income.deleteOne();
  res.status(200).json({ success: true, message: "Income deleted" });
});

// Post Insurance
export const postInsurance = handleAsync(async (req, res, next) => {
  const insurance = await Insurance.create({ ...req.body, user: req.user.id });
  const user = await User.findById(req.user.id);
  user.infoStatus.insurance = true;
  await user.save();
  res.status(201).json({
    success: true,
    insurance,
  });
});

// Update Insurance
export const updateInsurance = handleAsync(async (req, res, next) => {
  let insurance = await Insurance.findById(req.params.id);
  if (!insurance) {
    return res
      .status(404)
      .json({ success: false, message: "Insurance not found" });
  }
  if (insurance.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to update this insurance",
    });
  }
  insurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, insurance });
});

// Delete Insurance
export const deleteInsurance = handleAsync(async (req, res, next) => {
  const insurance = await Insurance.findById(req.params.id);
  if (!insurance) {
    return res
      .status(404)
      .json({ success: false, message: "Insurance not found" });
  }
  if (insurance.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to delete this insurance",
    });
  }
  await insurance.deleteOne();
  res.status(200).json({ success: true, message: "Insurance deleted" });
});

// Post Liability
export const postLiability = handleAsync(async (req, res, next) => {
  const liability = await Liability.create({ ...req.body, user: req.user.id });
  const user = await User.findById(req.user.id);
  user.infoStatus.liabilities = true;
  await user.save();
  res.status(201).json({
    success: true,
    liability,
  });
});

// Update Liability
export const updateLiability = handleAsync(async (req, res, next) => {
  let liability = await Liability.findById(req.params.id);
  if (!liability) {
    return res
      .status(404)
      .json({ success: false, message: "Liability not found" });
  }
  if (liability.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to update this liability",
    });
  }
  liability = await Liability.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, liability });
});

// Delete Liability
export const deleteLiability = handleAsync(async (req, res, next) => {
  const liability = await Liability.findById(req.params.id);
  if (!liability) {
    return res
      .status(404)
      .json({ success: false, message: "Liability not found" });
  }
  if (liability.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to delete this liability",
    });
  }
  await liability.deleteOne();
  res.status(200).json({ success: true, message: "Liability deleted" });
});

// Get Financial Health Score
export const getFinancialHealthScore = handleAsync(async (req, res, next) => {
  const score = await FinancialHealthScore.findOne({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    score,
  });
});
