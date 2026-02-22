import axios from "axios";
import handleAsync from "../middlewares/handleAsyncError.js";
import HandleError from "../utils/handleError.js";

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
  const { query } = req.body;
  const history = req.user.history;
  if (!query) return next(new HandleError("query is required", 400));

  const result = await forwardPost("/api/v1/rag/ask", { query, history }, next);
  if (result) res.status(200).json(result);
});

// ─── 3. POST /api/v1/rag/retrieve ─────────────────────────────────────────────
export const ragRetrieve = handleAsync(async (req, res, next) => {
  const { query } = req.body;
  const history = req.user.history;
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
  const userDetails = User.findById(req.user._id);
  const incomeDetails = Income.find({ user: req.user._id });
  const expenseDetails = Expense.find({ user: req.user._id });
  const assetDetails = Asset.find({ user: req.user._id });
  const liabilityDetails = Liability.find({ user: req.user._id });
  const insuranceDetails = Insurance.find({ user: req.user._id });
  const financialGoalDetails = FinancialGoal.find({ user: req.user._id });

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

  const expenses = (expenseDetails || []).map((expense) => {
    return {
      category: expense.category,
      monthlyAmount: expense.monthlyAmount,
      type: expense.type,
    };
  });

  const assets = (assetDetails || []).map((asset) => {
    return {
      type: asset.type,
      name: asset.name,
      currentValue: asset.currentValue,
      investedAmount: asset.investedAmount,
      expectedReturnRate: asset.expectedReturnRate,
      liquidityLevel: asset.liquidityLevel,
    };
  });

  const liabilities = (liabilityDetails || []).map((liability) => {
    return {
      type: liability.type,
      principalAmount: liability.principalAmount,
      outstandingAmount: liability.outstandingAmount,
      interestRate: liability.interestRate,
      emiAmount: liability.emiAmount,
      tenureRemaining: liability.tenureRemaining,
    };
  });

  const insurances = (insuranceDetails || []).map((insurance) => {
    return {
      type: insurance.type,
      provider: insurance.provider,
      coverageAmount: insurance.coverageAmount,
      premiumAmount: insurance.premiumAmount,
      maturityDate: insurance.maturityDate,
    };
  });

  const financialGoals = (financialGoalDetails || []).map((goal) => {
    return {
      goalType: goal.goalType,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      priorityLevel: goal.priorityLevel,
      inflationRate: goal.inflationRate,
      currentSavingsForGoal: goal.currentSavingsForGoal,
      status: goal.status,
    };
  });

  if (!user) return next(new HandleError("user is required", 400));

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
  if (result) res.status(200).json(result);
});

// ─── 5. POST /api/v1/analytics/net-worth ──────────────────────────────────────
export const netWorthAnalysis = handleAsync(async (req, res, next) => {
  const userDetails = User.findById(req.user._id);
  const assetDetails = Asset.find({ user: req.user._id });
  const liabilityDetails = Liability.find({ user: req.user._id });

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

  const assets = (assetDetails || []).map((asset) => {
    return {
      type: asset.type,
      name: asset.name,
      currentValue: asset.currentValue,
      investedAmount: asset.investedAmount,
      expectedReturnRate: asset.expectedReturnRate,
      liquidityLevel: asset.liquidityLevel,
    };
  });

  const liabilities = (liabilityDetails || []).map((liability) => {
    return {
      type: liability.type,
      principalAmount: liability.principalAmount,
      outstandingAmount: liability.outstandingAmount,
      interestRate: liability.interestRate,
      emiAmount: liability.emiAmount,
      tenureRemaining: liability.tenureRemaining,
    };
  });

  if (!user) return next(new HandleError("user is required", 400));

  const result = await forwardPost(
    "/api/v1/analytics/net-worth",
    { userId, assets, liabilities },
    next,
  );
  if (result) res.status(200).json(result);
});

// ─── 6. POST /api/v1/analytics/goal-feasibility ──────────────────────────────
export const goalFeasibility = handleAsync(async (req, res, next) => {
  const userDetails = User.findById(req.user._id);
  const incomeDetails = Income.find({ user: req.user._id });
  const expenseDetails = Expense.find({ user: req.user._id });
  const financialGoalDetails = FinancialGoal.find({ user: req.user._id });

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

  const incomes = (incomeDetails || []).map((income) => {
    return {
      sourceType: income.sourceType,
      monthlyAmount: income.monthlyAmount,
      growthRate: income.growthRate,
      isActive: income.isActive,
    };
  });

  const expenses = (expenseDetails || []).map((expense) => {
    return {
      category: expense.category,
      monthlyAmount: expense.monthlyAmount,
      type: expense.type,
    };
  });

  const financialGoals = (financialGoalDetails || []).map((goal) => {
    return {
      goalType: goal.goalType,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      priorityLevel: goal.priorityLevel,
      inflationRate: goal.inflationRate,
      currentSavingsForGoal: goal.currentSavingsForGoal,
      status: goal.status,
    };
  });

  if (!user) return next(new HandleError("user is required", 400));

  const result = await forwardPost(
    "/api/v1/analytics/goal-feasibility",
    { userId, incomes, expenses, financialGoals },
    next,
  );
  if (result) res.status(200).json(result);
});

// ─── 7. POST /api/v1/analytics/portfolio-alignment ───────────────────────────
export const portfolioAlignment = handleAsync(async (req, res, next) => {
  const userDetails = User.findById(req.user._id);
  const assetDetails = Asset.find({ user: req.user._id });

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

  const riskProfile = userDetails.riskProfile;

  const assets = (assetDetails || []).map((asset) => {
    return {
      type: asset.type,
      name: asset.name,
      currentValue: asset.currentValue,
      investedAmount: asset.investedAmount,
      expectedReturnRate: asset.expectedReturnRate,
      liquidityLevel: asset.liquidityLevel,
    };
  });

  if (!user) return next(new HandleError("user is required", 400));

  const result = await forwardPost(
    "/api/v1/analytics/portfolio-alignment",
    { userId, riskProfile, assets },
    next,
  );
  if (result) res.status(200).json(result);
});

// ─── 8. POST /api/v1/simulate/stress-test ─────────────────────────────────────
export const stressTest = handleAsync(async (req, res, next) => {
  const userDetails = User.findById(req.user._id);
  const incomeDetails = Income.find({ user: req.user._id });
  const expenseDetails = Expense.find({ user: req.user._id });
  const assetDetails = Asset.find({ user: req.user._id });
  const liabilityDetails = Liability.find({ user: req.user._id });

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

  const incomes = (incomeDetails || []).map((income) => {
    return {
      sourceType: income.sourceType,
      monthlyAmount: income.monthlyAmount,
      growthRate: income.growthRate,
      isActive: income.isActive,
    };
  });

  const expenses = (expenseDetails || []).map((expense) => {
    return {
      category: expense.category,
      monthlyAmount: expense.monthlyAmount,
      type: expense.type,
    };
  });

  const assets = (assetDetails || []).map((asset) => {
    return {
      type: asset.type,
      name: asset.name,
      currentValue: asset.currentValue,
      investedAmount: asset.investedAmount,
      expectedReturnRate: asset.expectedReturnRate,
      liquidityLevel: asset.liquidityLevel,
    };
  });

  const liabilities = (liabilityDetails || []).map((liability) => {
    return {
      type: liability.type,
      principalAmount: liability.principalAmount,
      outstandingAmount: liability.outstandingAmount,
      interestRate: liability.interestRate,
      emiAmount: liability.emiAmount,
      tenureRemaining: liability.tenureRemaining,
    };
  });

  if (!user) return next(new HandleError("user is required", 400));

  const result = await forwardPost(
    "/api/v1/simulate/stress-test",
    { userId, incomes, expenses, assets, liabilities },
    next,
  );
  if (result) res.status(200).json(result);
});

// ─── 9. POST /api/v1/user-based-retrieval ─────────────────────────────────────
export const userBasedRetrieval = handleAsync(async (req, res, next) => {
  const { query } = req.body;
  if (!query) return next(new HandleError("query is required", 400));

  // Forward the entire body — it contains the full financial profile
  const result = await forwardPost(
    "/api/v1/user-based-retrieval/",
    req.body,
    next,
  );
  if (result) res.status(200).json(result);
});
