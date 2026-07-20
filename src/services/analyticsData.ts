export interface BudgetAnalytics {
  totalBudget: number;
  totalSpent: number;
  riskLevel: string;
}

export interface BurnSavings {
  income: number;
  totalSpent: number;
  burnRate: number;
  savings: number;
}

export interface CategoryComparison {
  category: string;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
}
// services/analyticsData.ts

export interface Anomaly {
  category: string;         // Category name, e.g., "Shopping"
  currentAmount: number;    // Amount spent in the current month
  percentageIncrease: number; // % increase from previous month
  message: string;          // Informative message from backend
  date?: string;            // Optional, can be used if needed
}