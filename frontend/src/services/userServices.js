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

export const markOnboardingStep = async (step) => {
  const response = await axiosInstance.patch("/user/onboarding-step", { step });
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

export const updateAsset = async (id, data) => {
  const response = await axiosInstance.put(`/user/asset/${id}`, data);
  return response.data;
};

export const deleteAsset = async (id) => {
  const response = await axiosInstance.delete(`/user/asset/${id}`);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await axiosInstance.put(`/user/expense/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axiosInstance.delete(`/user/expense/${id}`);
  return response.data;
};

export const updateFinancialGoal = async (id, data) => {
  const response = await axiosInstance.put(`/user/financial-goal/${id}`, data);
  return response.data;
};

export const deleteFinancialGoal = async (id) => {
  const response = await axiosInstance.delete(`/user/financial-goal/${id}`);
  return response.data;
};

export const updateIncome = async (id, data) => {
  const response = await axiosInstance.put(`/user/income/${id}`, data);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await axiosInstance.delete(`/user/income/${id}`);
  return response.data;
};

export const updateInsurance = async (id, data) => {
  const response = await axiosInstance.put(`/user/insurance/${id}`, data);
  return response.data;
};

export const deleteInsurance = async (id) => {
  const response = await axiosInstance.delete(`/user/insurance/${id}`);
  return response.data;
};

export const updateLiability = async (id, data) => {
  const response = await axiosInstance.put(`/user/liability/${id}`, data);
  return response.data;
};

export const deleteLiability = async (id) => {
  const response = await axiosInstance.delete(`/user/liability/${id}`);
  return response.data;
};
