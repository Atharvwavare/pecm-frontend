import api from "./api";

// 🔹 Monthly Summary
export const getReportSummary = (params: any) => {
  return api.get("/reports/monthly-summary", { params });
};

// 🔹 Category Wise Pie Chart
export const getCategoryReport = (params: any) => {
  return api.get("/reports/category-wise", { params });
};

// 🔹 Monthly Trend (NO month/year needed)
export const getMonthlyTrend = () => {
  return api.get("/reports/monthly-trend");
};

// 🔹 Daily Breakdown (needs date param ONLY)
export const getDailyBreakDown = (params: any) => {
  return api.get("/reports/daily", { params });
};

export const getMonthlySpending = () =>
  api.get("/reports/monthly-spending");



// featured reports
export const getSmartInsights = (month:number, year:number) =>
  api.get("/reports/featured/insights", {
    params: { month, year }
  });
export const getBudgetForecast = (month:number, year:number) =>
  api.get("/reports/featured/forecast", {
    params: { month, year }
  });

export const getFinancialScore = (month:number,year:number) =>
  api.get("/reports/featured/score",{
    params:{month,year}
  });

export const getHeatmapData = (month:number,year:number) =>
  api.get("/reports/featured/heatmap",{
    params:{month,year}
  });

export const setBudget = (params:any) =>
  api.post("/reports/featured/budget", params);

export const getCategoryWise = (month: number, year: number) =>
  api.get("/reports/featured/category", { params: { month, year } });