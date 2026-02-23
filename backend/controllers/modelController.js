import axios from "axios";
import handleAsync from "../middlewares/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import Asset from "../models/assetModel.js";
import Liability from "../models/liabilityModel.js";
import Income from "../models/incomeModel.js";
import Expense from "../models/expenseModel.js";
import FinancialGoal from "../models/financialGoalModel.js";
import Insurance from "../models/insuranceModel.js";
import FinancialHealthScore from "../models/financialHealthScoreModel.js";

const MODEL_URL = process.env.MODEL_URL?.replace(/\/+$/, ""); // strip trailing slash

// Helper — forwards a POST request to the model service
const forwardPost = async (endpoint, body, next) => {
  try {
    const { data } = await axios.post(`${MODEL_URL}${endpoint}`, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 120_000, // 2 minutes — some endpoints are slow
    });
    return data;
  } catch (err) {
    const status = err.response?.status || 502;
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Model service unavailable";
    return next(new HandleError(message, status));
  }
};

// ─── 1. GET /api/v1/health ────────────────────────────────────────────────────
export const healthCheck = handleAsync(async (req, res, next) => {
  try {
    const { data } = await axios.get(`${MODEL_URL}/api/v1/health`, {
      timeout: 10_000,
    });
    res.status(200).json(data);
  } catch (err) {
    return next(new HandleError("Model service unavailable", 502));
  }
});

// ─── 2. POST /api/v1/rag/ask ──────────────────────────────────────────────────
export const ragAsk = handleAsync(async (req, res, next) => {
  const { query, history = [] } = req.body;
  if (!query) return next(new HandleError("query is required", 400));

  const result = await forwardPost("/api/v1/rag/ask", { query, history }, next);
  if (result) res.status(200).json(result);
});

// ─── 3. POST /api/v1/rag/retrieve ─────────────────────────────────────────────
export const ragRetrieve = handleAsync(async (req, res, next) => {
  const { query, history = [] } = req.body;
  if (!query) return next(new HandleError("query is required", 400));

  const result = await forwardPost(
    "/api/v1/rag/retrieve",
    { query, history },
    next,
  );
  if (result) res.status(200).json(result);
});

// ─── 4. POST /api/v1/score/financial-health ───────────────────────────────────
export const financialHealthScore = handleAsync(async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user._id);
    const incomeDetails = await Income.find({ user: req.user._id });
    const expenseDetails = await Expense.find({ user: req.user._id });
    const assetDetails = await Asset.find({ user: req.user._id });
    const liabilityDetails = await Liability.find({ user: req.user._id });
    const insuranceDetails = await Insurance.find({ user: req.user._id });
    const goalDetails = await FinancialGoal.find({ user: req.user._id });

    if (!userDetails) return next(new HandleError("User not found", 404));

    const user = {
      name: userDetails.name,
      age: userDetails.age,
      gender: userDetails.gender,
      address: userDetails.address,
      city: userDetails.city,
      state: userDetails.state,
      zip: userDetails.zip,
      country: userDetails.country,
      maritalStatus: userDetails.maritalStatus,
      dependents: userDetails.dependents,
      employmentType: userDetails.employmentType,
      annualIncome: userDetails.annualIncome,
      riskProfile: userDetails.riskProfile,
    };

    const incomes = (incomeDetails || []).map((income) => ({
      sourceType: income.sourceType,
      monthlyAmount: income.monthlyAmount,
      growthRate: income.growthRate,
      isActive: income.isActive,
    }));

    const expenses = (expenseDetails || []).map((expense) => ({
      category: expense.category,
      monthlyAmount: expense.monthlyAmount,
      type: expense.type,
    }));

    const assets = (assetDetails || []).map((asset) => ({
      type: asset.type,
      name: asset.name,
      currentValue: asset.currentValue,
      investedAmount: asset.investedAmount,
      expectedReturnRate: asset.expectedReturnRate,
      liquidityLevel: asset.liquidityLevel,
    }));

    const liabilities = (liabilityDetails || []).map((liability) => ({
      type: liability.type,
      principalAmount: liability.principalAmount,
      outstandingAmount: liability.outstandingAmount,
      interestRate: liability.interestRate || 0,
      emiAmount: liability.emiAmount,
      tenureRemaining: liability.tenureRemaining,
    }));

    const insurances = (insuranceDetails || []).map((insurance) => ({
      type: insurance.type,
      provider: insurance.provider,
      coverageAmount: insurance.coverageAmount,
      premiumAmount: insurance.premiumAmount,
      maturityDate: insurance.maturityDate
        ? new Date(insurance.maturityDate).toISOString().split("T")[0]
        : null,
    }));

    const financialGoals = (goalDetails || []).map((goal) => ({
      goalType: goal.goalType,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate
        ? new Date(goal.targetDate).toISOString().split("T")[0]
        : null,
      priorityLevel: goal.priorityLevel,
      inflationRate: goal.inflationRate,
      currentSavingsForGoal: goal.currentSavingsForGoal,
      status: goal.status,
    }));

    const result = await forwardPost(
      "/api/v1/score/financial-health",
      {
        user,
        incomes,
        expenses,
        assets,
        liabilities,
        insurances,
        financialGoals,
      },
      next,
    );
    if (result) {
      const fhs = result.financial_health_score;
      await FinancialHealthScore.create({
        user: req.user._id,
        score: fhs.score,
        breakdown: {
          savingsRate: fhs.breakdown.savings_rate,
          emergencyFund: fhs.breakdown.emergency_fund,
          debtRatio: fhs.breakdown.debt_ratio,
          diversification: fhs.breakdown.diversification,
          insuranceCoverage: fhs.breakdown.insurance_coverage,
        },
      });
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("FINANCIAL_HEALTH_ERROR:", err);
    return next(new HandleError(err.message, 500));
  }
});

// ─── 5. POST /api/v1/analytics/net-worth ──────────────────────────────────────
export const netWorthAnalysis = handleAsync(async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user._id);
    const assetDetails = await Asset.find({ user: req.user._id });
    const liabilityDetails = await Liability.find({ user: req.user._id });

    if (!userDetails) return next(new HandleError("User not found", 404));

    const assets = (assetDetails || []).map((asset) => ({
      type: asset.type,
      name: asset.name,
      current_value: asset.currentValue,
      invested_amount: asset.investedAmount,
      expected_return_rate: asset.expectedReturnRate,
      liquidity_level: asset.liquidityLevel,
    }));

    const liabilities = (liabilityDetails || []).map((liability) => ({
      type: liability.type,
      principal_amount: liability.principalAmount,
      outstanding_amount: liability.outstandingAmount,
      interest_rate: liability.interestRate,
      emi_amount: liability.emiAmount,
      tenure_remaining: liability.tenureRemaining,
    }));

    const result = await forwardPost(
      "/api/v1/analytics/net-worth",
      {
        user_id: req.user._id.toString(),
        assets,
        liabilities,
      },
      next,
    );
    if (result) res.status(200).json(result);
  } catch (err) {
    return next(new HandleError(err.message, 500));
  }
});

// ─── 6. POST /api/v1/analytics/goal-feasibility ──────────────────────────────
export const goalFeasibility = handleAsync(async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user._id);
    const incomeDetails = await Income.find({ user: req.user._id });
    const expenseDetails = await Expense.find({ user: req.user._id });
    const financialGoalDetails = await FinancialGoal.find({
      user: req.user._id,
    });

    if (!userDetails) return next(new HandleError("User not found", 404));

    const incomes = (incomeDetails || []).map((income) => ({
      source_type: income.sourceType,
      monthly_amount: income.monthlyAmount,
      growth_rate: income.growthRate,
      is_active: income.isActive,
    }));

    const expenses = (expenseDetails || []).map((expense) => ({
      category: expense.category,
      monthly_amount: expense.monthlyAmount,
      type: expense.type,
    }));

    const financial_goals = (financialGoalDetails || []).map((goal) => ({
      goal_type: goal.goalType,
      target_amount: goal.targetAmount,
      target_date: goal.targetDate
        ? new Date(goal.targetDate).toISOString().split("T")[0]
        : null,
      priority_level: goal.priorityLevel,
      inflation_rate: goal.inflationRate,
      current_savings_for_goal: goal.currentSavingsForGoal,
      status: goal.status,
    }));

    const result = await forwardPost(
      "/api/v1/analytics/goal-feasibility",
      {
        user_id: req.user._id.toString(),
        incomes,
        expenses,
        financial_goals,
      },
      next,
    );
    if (result) res.status(200).json(result);
  } catch (err) {
    return next(new HandleError(err.message, 500));
  }
});

// ─── 7. POST /api/v1/analytics/portfolio-alignment ───────────────────────────
export const portfolioAlignment = handleAsync(async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user._id);
    const assetDetails = await Asset.find({ user: req.user._id });

    if (!userDetails) return next(new HandleError("User not found", 404));

    const assets = (assetDetails || []).map((asset) => ({
      type: asset.type,
      name: asset.name,
      current_value: asset.currentValue,
      invested_amount: asset.investedAmount,
      expected_return_rate: asset.expectedReturnRate,
      liquidity_level: asset.liquidityLevel,
    }));

    const result = await forwardPost(
      "/api/v1/analytics/portfolio-alignment",
      {
        user_id: req.user._id.toString(),
        risk_profile: userDetails.riskProfile,
        assets,
      },
      next,
    );
    if (result) res.status(200).json(result);
  } catch (err) {
    return next(new HandleError(err.message, 500));
  }
});

// ─── 8. POST /api/v1/simulate/stress-test ─────────────────────────────────────
export const stressTest = handleAsync(async (req, res, next) => {
  try {
    const incomeDetails = await Income.find({ user: req.user._id });
    const expenseDetails = await Expense.find({ user: req.user._id });
    const assetDetails = await Asset.find({ user: req.user._id });
    const liabilityDetails = await Liability.find({ user: req.user._id });

    const incomes = (incomeDetails || []).map((income) => ({
      source_type: income.sourceType,
      monthly_amount: income.monthlyAmount,
      growth_rate: income.growthRate,
      is_active: income.isActive,
    }));

    const expenses = (expenseDetails || []).map((expense) => ({
      category: expense.category,
      monthly_amount: expense.monthlyAmount,
      type: expense.type,
    }));

    const assets = (assetDetails || []).map((asset) => ({
      type: asset.type,
      name: asset.name,
      current_value: asset.currentValue,
      invested_amount: asset.investedAmount,
      expected_return_rate: asset.expectedReturnRate,
      liquidity_level: asset.liquidityLevel,
    }));

    const liabilities = (liabilityDetails || []).map((liability) => ({
      type: liability.type,
      principal_amount: liability.principalAmount,
      outstanding_amount: liability.outstandingAmount,
      interest_rate: liability.interestRate,
      emi_amount: liability.emiAmount,
      tenure_remaining: liability.tenureRemaining,
    }));

    const result = await forwardPost(
      "/api/v1/simulate/stress-test",
      {
        user_id: req.user._id.toString(),
        incomes,
        expenses,
        assets,
        liabilities,
      },
      next,
    );
    if (result) res.status(200).json(result);
  } catch (err) {
    return next(new HandleError(err.message, 500));
  }
});

// ─── 9. POST /api/v1/user-based-retrieval ─────────────────────────────────────
export const userBasedRetrieval = handleAsync(async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return next(new HandleError("query is required", 400));

    const userDetails = await User.findById(req.user._id);
    const incomeDetails = await Income.find({ user: req.user._id });
    const expenseDetails = await Expense.find({ user: req.user._id });
    const assetDetails = await Asset.find({ user: req.user._id });
    const liabilityDetails = await Liability.find({ user: req.user._id });
    const goalDetails = await FinancialGoal.find({ user: req.user._id });
    const insuranceDetails = await Insurance.find({ user: req.user._id });

    if (!userDetails) return next(new HandleError("User not found", 404));

    const user = {
      name: userDetails.name,
      age: userDetails.age,
      gender: userDetails.gender,
      address: userDetails.address,
      city: userDetails.city,
      state: userDetails.state,
      zip: userDetails.zip,
      country: userDetails.country,
      marital_status: userDetails.maritalStatus,
      dependents: userDetails.dependents,
      employment_type: userDetails.employmentType,
      annual_income: userDetails.annualIncome,
      risk_profile: userDetails.riskProfile,
    };

    const income = (incomeDetails || []).map((inc) => ({
      source_type: inc.sourceType,
      monthly_amount: inc.monthlyAmount,
      growth_rate: inc.growthRate,
      is_active: inc.isActive,
    }));

    const expense = (expenseDetails || []).map((exp) => ({
      category: exp.category,
      monthly_amount: exp.monthlyAmount,
      type: exp.type,
    }));

    const asset = (assetDetails || []).map((ast) => ({
      type: ast.type,
      name: ast.name,
      current_value: ast.currentValue,
      invested_amount: ast.investedAmount,
      expected_return_rate: ast.expectedReturnRate,
      liquidity_level: ast.liquidityLevel,
    }));

    const liability = (liabilityDetails || []).map((lib) => ({
      type: lib.type,
      principal_amount: lib.principalAmount,
      outstanding_amount: lib.outstandingAmount,
      interest_rate: lib.interestRate,
      emi_amount: lib.emiAmount,
      tenure_remaining: lib.tenureRemaining,
    }));

    const financial_goal = (goalDetails || []).map((goal) => ({
      goal_type: goal.goalType,
      target_amount: goal.targetAmount,
      target_date: goal.targetDate
        ? new Date(goal.targetDate).toISOString().split("T")[0]
        : null,
      priority_level: goal.priorityLevel,
      inflation_rate: goal.inflationRate,
      current_savings_for_goal: goal.currentSavingsForGoal,
      status: goal.status,
    }));

    const insurance = (insuranceDetails || []).map((ins) => ({
      type: ins.type,
      provider: ins.provider,
      coverage_amount: ins.coverageAmount,
      premium_amount: ins.premiumAmount,
      maturity_date: ins.maturityDate
        ? new Date(ins.maturityDate).toISOString().split("T")[0]
        : null,
    }));

    const history = req.user.history ? req.user.history : undefined;

    const latestScore = await FinancialHealthScore.findOne({
      user: req.user._id,
    }).sort({ generatedAt: -1 });

    const payload = {
      query,
      history,
      user,
      income,
      expense,
      asset,
      liability,
      financial_goal,
      insurance,
      financial_health_score: latestScore
        ? { score: latestScore.score, breakdown: latestScore.breakdown }
        : undefined,
    };

    const result = await forwardPost(
      "/api/v2/user-based-retrieval/",
      payload,
      next,
    );
    if (result) {
      // Persist compressed history for future conversational context
      if (result.history) {
        await User.findByIdAndUpdate(req.user._id, {
          history: result.history,
        });
      }
      res.status(200).json(result);
    }
  } catch (err) {
    return next(new HandleError(err.message, 500));
  }
});
