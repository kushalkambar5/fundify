import axiosInstance from "./axiosInstance";

// ─── Financial Health Score ─────────────────────────────────────────────
export const calculateHealthScore = async () => {
  const response = await axiosInstance.post("/score/financial-health");
  return response.data;
};

export const getHealthScore = async () => {
  const response = await axiosInstance.get("/user/financial-health-score");
  return response.data;
};

// ─── Analytics ──────────────────────────────────────────────────────────
export const getNetWorth = async () => {
  const response = await axiosInstance.post("/analytics/net-worth");
  return response.data;
};

export const getGoalFeasibility = async () => {
  const response = await axiosInstance.post("/analytics/goal-feasibility");
  return response.data;
};

export const getPortfolioAlignment = async () => {
  const response = await axiosInstance.post("/analytics/portfolio-alignment");
  return response.data;
};

// ─── Simulation ─────────────────────────────────────────────────────────
export const getStressTest = async () => {
  const response = await axiosInstance.post("/simulate/stress-test");
  return response.data;
};

// ─── Chatbot (User-Based Retrieval) ─────────────────────────────────────
export const askChatbot = async (query) => {
  const response = await axiosInstance.post("/user-based-retrieval", { query });
  return response.data;
};

// ─── RAG (Document Q&A) ─────────────────────────────────────────────────
export const ragAsk = async (query, history = []) => {
  const response = await axiosInstance.post("/rag/ask", { query, history });
  return response.data;
};

// ─── Health Check ───────────────────────────────────────────────────────
export const checkModelHealth = async () => {
  const response = await axiosInstance.get("/health");
  return response.data;
};
