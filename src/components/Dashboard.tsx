import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { getDashboardData } from "../services/dashboardService";



// Backend Dynamic Data
type RecentExpense = {
  id: number;
  title: string;
  amount: number;
  expenseDate: string;
  categoryName: string;
};

type CategorySummary = {
  name: string;
  total: number;
};

type DashboardResponse = {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryCount: number;
  avgPerDay: number;
  recentExpenses: RecentExpense[];
  topCategories: CategorySummary[];
};


// dashboard component
export default function Dashboard() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(() => today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => today.getFullYear());
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async (month: number, year: number) => {
    setLoading(true);

    try {
      const res = await getDashboardData(month, year);
      setDashboard(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // month naigation
  const changeMonth = (direction: "prev" | "next") => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (direction === "prev") {
      newMonth--;
      if (newMonth === 0) {
        newMonth = 12;
        newYear--;
      }
    } else {
      newMonth++;
      if (newMonth === 13) {
        newMonth = 1;
        newYear++;
      }
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  // ALL HOOKS MUST RUN ON EVERY RENDER — useMemo must sit above any early return,
  // otherwise React sees a different number/order of hooks between renders
  // (this was the cause of the "Rendered more hooks than during the previous render" crash).
  const maxCategory = useMemo(() => {
    if (!dashboard || dashboard.topCategories.length === 0) return 1;
    return Math.max(...dashboard.topCategories.map((c) => c.total));
  }, [dashboard]);

  //  Loading State
  // Loading/empty guards must be placed AFTER all hooks to avoid hook-order issues.
  if (loading) {
    return (
      <div className="pt-20 lg:ml-64 h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  // this are the stats for the total expenses, monthly expenses, category count, and average per day.
  const stats = [
    {
      title: "Total Expenses",
      value: `₹${dashboard.totalExpenses.toLocaleString("en-IN")}`,
      icon: DollarSign,
      gradient: "from-blue-500 to-blue-600",
    },

    {
      title: "This Month",
      value: `₹${dashboard.monthlyExpenses.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Categories",
      value: dashboard.categoryCount,
      icon: PieChart,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Avg. per Day",
      value: `₹${dashboard.avgPerDay.toLocaleString("en-IN")}`,
      icon: CreditCard,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  // User Interface
  return (
    <div className="pt-24 lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Overview for month option */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-900  font-semibold mt-1">
              Overview for{" "}
              {format(new Date(selectedYear, selectedMonth - 1), "MMMM yyyy")}
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex justify-center sm:justify-start items-center bg-white border shadow-sm rounded-xl px-4 py-2 space-x-4 w-full sm:w-auto hover:bg-slate-50">
            <Calendar className="w-5 h-5 text-gray-600" />

            <button onClick={() => changeMonth("prev")}>
              <ChevronLeft className="w-5 h-5 text-gray-800 hover:text-blue-600 transition" />
            </button>

            <span className="font-medium text-gray-700">
              {format(new Date(selectedYear, selectedMonth - 1), "MMM yyyy")}
            </span>

            <button onClick={() => changeMonth("next")}>
              <ChevronRight className="w-5 h-5 text-gray-800 hover:text-blue-600 transition" />
            </button>
          </div>
        </div>

        {/* All 4 STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`bg-gradient-to-br ${stat.gradient} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <p className="text-gray-800 text-md font-semibold">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>

                <div className={`h-1.5 bg-gradient-to-r ${stat.gradient}`} />
              </div>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* RECENT EXPENSES */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">

            <div className="p-4 md:p-5 lg:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Recent Expenses
                </h3>
                <span className="text-xs font-semibold text-black bg-gray-100 px-3 py-1 rounded-full">
                  Latest 4
                </span>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {dashboard.recentExpenses.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.recentExpenses
                    .slice(0, 4)
                    .map((expense, index) => {
                      const colors = [
                        "bg-orange-500",
                        "bg-blue-500",
                        "bg-purple-500",
                        "bg-pink-500",
                        "bg-green-500",
                        "bg-red-500",
                        "bg-yellow-500",
                        "bg-indigo-500",
                        "bg-teal-500",
                      ];

                      const color = colors[index % colors.length];

                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-200"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                              className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                            >
                              <span className="text-white font-bold text-sm">
                                ₹
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-black truncate">
                                {expense.title}
                              </p>

                              <p className="text-sm text-black mt-1">
                                {expense.categoryName} •{" "}
                                {new Date(
                                  expense.expenseDate,
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <p className="font-bold text-gray-900 whitespace-nowrap">
                            ₹{expense.amount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    No recent expenses found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* TOP 6 CATEGORIES */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Top Categories
              </h3>
              <span className="text-xs bg-gray-100 text-black px-3 py-1 rounded-full font-medium">
                Top {Math.min(dashboard.topCategories.length, 6)}
              </span>
            </div>

            {dashboard.topCategories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 text-sm">
                  No category data available.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {dashboard.topCategories
                  .slice(0, 6) // show only top 5-6 categories
                  .map((category, index) => {
                    const percentage = (category.total / maxCategory) * 100;

                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-pink-500",
                      "bg-red-500",
                    ];

                    const color = colors[index % colors.length];

                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color}`} />
                            <span className="text-sm font-medium text-bla">
                              {category.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-800">
                              ₹{category.total.toLocaleString("en-IN")}
                            </span>

                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`${color} h-full rounded-full transition-all duration-700`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}