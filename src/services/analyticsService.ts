import api from "./api";

// Fetch budget analytics for a month/year
export const getBudgetAnalytics = (month: number, year: number) =>
  api.get("/analytics/budget", { params: { month, year } });

// Fetch burn & savings for a month/year
export const getBurnSavings = (month: number, year: number) =>
  api.get("/analytics/burn-savings", { params: { month, year } });

// Fetch category comparison for a month/year
export const getCategoryComparison = (month: number, year: number) =>
  api.get("/analytics/category-comparison", { params: { month, year } });

// Fetch anomalies for a month/year
export const getAnomalies = (month: number, year: number) =>
  api.get("/analytics/anomalies", { params: { month, year } });

// Set budget for a specific month/year
export const setBudget = (data: {
  amount: number;
  month: number;
  year: number;
}) => {
  return api.post("/analytics/budget/set", data);
};

// Set monthly income for a specific month/year
export const setIncome = (month: number, year: number, amount: number) =>
  api.post("/income/add", { month, year, amount });