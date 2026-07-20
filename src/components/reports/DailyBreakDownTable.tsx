import { useState } from "react";
import { format } from "date-fns";

interface ExpenseItem {
  title: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

interface DailyData {
  date: string;
  totalAmount: number;
  items: ExpenseItem[];
  dailyBudget?: number; // optional, only used if your backend actually sends this per day
}

interface DailyBreakDownTableProps {
  data: DailyData[];
  // Optional: pass the user's real monthly budget (e.g. from Report.tsx's `summary`)
  // so the daily limit is meaningful instead of a guessed flat number.
  monthlyBudget?: number;
}


// DailyBreakDownTable component to display daily breakdown of expenses
export default function DailyBreakDownTable({
  data,
  monthlyBudget,
}: DailyBreakDownTableProps) {
  const safeData = Array.isArray(data) ? data : [];

  const [showAllDays, setShowAllDays] = useState(false);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  const displayedDays = showAllDays ? safeData : safeData.slice(0, 3);

  const DAILY_BUDGET_FALLBACK = 600;

  // If a real monthly budget was passed in, spread it evenly across the days in that month.
  const daysInMonth =
    safeData.length > 0
      ? new Date(
          new Date(safeData[0].date).getFullYear(),
          new Date(safeData[0].date).getMonth() + 1,
          0,
        ).getDate()
      : 30;

  const budgetDerivedFromMonthly =
    monthlyBudget && monthlyBudget > 0 ? monthlyBudget / daysInMonth : null;

  // If there's no real budget available at all, fall back to the average spend across
  // the days we actually have, so KPI colors reflect *relative* spending for this user
  // instead of everyone being compared against one flat, disconnected ₹600.
  const averageDailySpend =
    safeData.length > 0
      ? safeData.reduce((sum, d) => sum + (d.totalAmount || 0), 0) / safeData.length
      : 0;

  const fallbackDailyBudget =
    budgetDerivedFromMonthly ??
    (averageDailySpend > 0 ? averageDailySpend * 1.2 : DAILY_BUDGET_FALLBACK);

  const getKPIStatus = (percentageUsed: number) => {
    if (percentageUsed >= 100) return "Critical";
    if (percentageUsed >= 70) return "Moderate";
    return "Healthy";
  };

  // Pill badge styling (bg + text + border together) instead of plain colored text
  const getKPIBadge = (percentageUsed: number) => {
    if (percentageUsed >= 100) return "bg-red-50 text-red-700 border border-red-200";
    if (percentageUsed >= 70) return "bg-orange-50 text-orange-700 border border-orange-200";
    return "bg-green-50 text-green-700 border border-green-200";
  };

  const getAmountColor = (percentageUsed: number) => {
    if (percentageUsed >= 100) return "text-red-600";
    if (percentageUsed >= 70) return "text-orange-500";
    return "text-gray-800";
  };

  const getProgressColor = (percentageUsed: number) => {
    if (percentageUsed >= 100) return "bg-red-500";
    if (percentageUsed >= 70) return "bg-orange-400";
    return "bg-green-500";
  };


  // DailyBreakDownTable Interface
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Daily Breakdown</h3>
        {safeData.length > 3 && (
          <button
            onClick={() => setShowAllDays((v) => !v)}
            className="text-sm px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition flex-shrink-0"
          >
            {showAllDays ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {displayedDays.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No records found for this month
        </div>
      ) : (
        // Single flat list, rows separated by a thin divider — not boxes inside boxes.
        <div className="divide-y divide-gray-100">
          {displayedDays.map((day, dayIndex) => {
            const items = Array.isArray(day.items) ? day.items : [];
            const total = day.totalAmount || 0;
            const dailyBudget =
              typeof day.dailyBudget === "number" && day.dailyBudget > 0
                ? day.dailyBudget
                : fallbackDailyBudget;
            const percentageUsed = dailyBudget > 0 ? (total / dailyBudget) * 100 : 0;

            const isExpanded = expandedDayIndex === dayIndex;
            const displayedItems = isExpanded ? items : items.slice(0, 3);

            let runningTotal = 0;

            return (
              <div key={dayIndex} className="py-4 sm:py-5 first:pt-4 last:pb-0">
                {/* Date + KPI badge + amount */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {format(new Date(day.date), "dd MMM yyyy")}
                    </h4>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${getKPIBadge(percentageUsed)}`}
                    >
                      {getKPIStatus(percentageUsed)}
                    </span>
                  </div>

                  <div className="text-right sm:text-right flex-shrink-0">
                    <p className={`text-lg sm:text-xl font-bold ${getAmountColor(percentageUsed)}`}>
                      ₹{total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-800">
                      of ₹{dailyBudget.toFixed(0)} daily budget
                    </p>
                  </div>
                </div>

                {percentageUsed >= 100 && (
                  <div className="bg-red-50 text-red-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg mt-2 border border-red-100">
                    🚨 Budget exceeded for this day
                  </div>
                )}

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[11px] mb-1 text-gray-800">
                    <span>Daily budget usage</span>
                    <span>{percentageUsed.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`${getProgressColor(percentageUsed)} h-1.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Item list — plain rows with a left accent, no filled boxes */}
                {displayedItems.length > 0 && (
                  <div className="mt-3 border-l-2 border-gray-100 pl-3 space-y-2">
                    {displayedItems.map((item, i) => {
                      runningTotal += item.amount;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.categoryName} · Running ₹{runningTotal.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-gray-800">₹{item.amount}</p>
                            <p className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {items.length > 3 && (
                  <button
                    onClick={() => setExpandedDayIndex((v) => (v === dayIndex ? null : dayIndex))}
                    className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    {isExpanded ? "Show less" : `+${items.length - 3} more`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}