import axiosInstance from "./axiosInstance";

// Fetch Operations
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data;
};

export const getAssets = async () => {
  const response = await axiosInstance.get("/user/assets");
  return response.data;
};

export const getExpenses = async () => {
  const response = await axiosInstance.get("/user/expenses");
  return response.data;
};

export const getFinancialGoals = async () => {
  const response = await axiosInstance.get("/user/financial-goals");
  return response.data;
};

export const getIncomes = async () => {
  const response = await axiosInstance.get("/user/incomes");
  return response.data;
};

export const getInsurances = async () => {
  const response = await axiosInstance.get("/user/insurances");
  return response.data;
};

export const getLiabilities = async () => {
  const response = await axiosInstance.get("/user/liabilities");
  return response.data;
};

export const checkOnboardingStatus = async (email) => {
  const response = await axiosInstance.get(`/user/onboarding-status/${email}`);
  return response.data;
};

// Modification Operations
export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put("/user/me", data);
  return response.data;
};

export const addAsset = async (data) => {
  const response = await axiosInstance.post("/user/asset", data);
  return response.data;
};

export const addExpense = async (data) => {
  const response = await axiosInstance.post("/user/expense", data);
  return response.data;
};

export const addFinancialGoal = async (data) => {
  const response = await axiosInstance.post("/user/financial-goal", data);
  return response.data;
};

export const addIncome = async (data) => {
  const response = await axiosInstance.post("/user/income", data);
  return response.data;
};

export const addInsurance = async (data) => {
  const response = await axiosInstance.post("/user/insurance", data);
  return response.data;
};

export const addLiability = async (data) => {
  const response = await axiosInstance.post("/user/liability", data);
  return response.data;
};
