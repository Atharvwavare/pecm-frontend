import { useEffect, useState } from "react";
import {
  getBudgetAnalytics,
  getBurnSavings,
  getCategoryComparison,
  getAnomalies,
  setIncome,
} from "../services/analyticsService";
import { toast } from "sonner";

import {
  BudgetAnalytics,
  BurnSavings,
  CategoryComparison,
  Anomaly,
} from "../services/analyticsData";

import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CalendarDays,
  IndianRupee,
  Wallet,
  Flame,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

const Analytics = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [budget, setBudgetData] = useState<BudgetAnalytics | null>(null);
  const [burn, setBurn] = useState<BurnSavings | null>(null);
  const [categories, setCategories] = useState<CategoryComparison[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [budgetRes, burnRes, categoryRes, anomalyRes] = await Promise.all([
        getBudgetAnalytics(month, year),
        getBurnSavings(month, year),
        getCategoryComparison(month, year),
        getAnomalies(month, year),
      ]);

      setBudgetData(budgetRes.data || null);
      setBurn(burnRes.data || null);
      setCategories(categoryRes.data || []);
      setAnomalies(anomalyRes.data || []);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [month, year]);

  const handleSetIncome = async () => {
    if (monthlyIncome <= 0) return toast.error("Enter a valid income amount");
    try {
      await setIncome(month, year, monthlyIncome);
      setMonthlyIncome(0);
      toast.success("Income saved successfully!");
      fetchAnalytics();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save income");
    }
  };

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const spent = budget?.totalSpent ?? 0;
  const total = budget?.totalBudget ?? 0;
  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  const riskColor =
    budget?.riskLevel === "SAFE"
      ? "bg-green-500"
      : budget?.riskLevel === "WARNING"
      ? "bg-yellow-500"
      : "bg-red-500";

  const riskBadge =
    budget?.riskLevel === "SAFE"
      ? "bg-green-50 text-green-700"
      : budget?.riskLevel === "WARNING"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-red-50 text-red-700";

  // Analytics Interface
  return (
    <div className="p-4 sm:p-6 lg:ml-64 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 space-y-6">
      {/* HEADER */}
      <div className="pt-20 sm:pt-24 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-200 flex-shrink-0">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm sm:text-base">
            Budget risk, burn rate, and spending patterns
          </p>
        </div>
      </div>

      {/* Month/Year Selector + Income */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:divide-x lg:divide-gray-100">
          {/* Filter by Date */}
          <div className="lg:pr-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Filter by Date
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="month"
                value={`${year}-${String(month).padStart(2, "0")}`}
                onChange={(e) => {
                  const value = e.target.value; // "YYYY-MM"
                  if (!value) return;
                  const [y, m] = value.split("-").map(Number);
                  setYear(y);
                  setMonth(m);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
              <button
                onClick={() => {
                  setMonth(currentMonth);
                  setYear(currentYear);
                }}
                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Income input */}
          <div className="lg:pl-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Monthly Income
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder="e.g. 50000"
                value={monthlyIncome || ""}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handleSetIncome()}
                className="border border-gray-200 rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              />
              <button
                onClick={handleSetIncome}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition text-sm font-medium flex-shrink-0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Analytics Sections */}
      <Tabs defaultValue="budget">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-transparent p-0 h-auto">
          <TabsTrigger
            value="budget"
            className="text-center rounded-xl py-2.5 px-2 font-medium text-xs sm:text-sm bg-white border border-gray-200 text-gray-600 truncate data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:border-purple-600 data-[state=active]:shadow-sm transition-colors"
          >
            Budget Risk
          </TabsTrigger>
          <TabsTrigger
            value="burn"
            className="text-center rounded-xl py-2.5 px-2 font-medium text-xs sm:text-sm bg-white border border-gray-200 text-gray-600 truncate data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600 data-[state=active]:shadow-sm transition-colors"
          >
            Burn & Savings
          </TabsTrigger>
          <TabsTrigger
            value="category"
            className="text-center rounded-xl py-2.5 px-2 font-medium text-xs sm:text-sm bg-white border border-gray-200 text-gray-600 truncate data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-sm transition-colors"
          >
            Category
          </TabsTrigger>
          <TabsTrigger
            value="anomaly"
            className="text-center rounded-xl py-2.5 px-2 font-medium text-xs sm:text-sm bg-white border border-gray-200 text-gray-600 truncate data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600 data-[state=active]:shadow-sm transition-colors"
          >
            Anomalies
          </TabsTrigger>
        </TabsList>

        {/* Budget Risk */}
        <TabsContent value="budget" className="mt-4">
          <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Budget Risk
                </h2>
                <p className="text-xs sm:text-sm text-purple-100">
                  Your budget progress for the selected month
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  {budget?.riskLevel && (
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${riskBadge}`}
                    >
                      {budget.riskLevel}
                    </span>
                  )}
                </div>
                <Progress
                  value={percentage}
                  className={`h-3 rounded-full ${riskColor}`}
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  {percentage.toFixed(0)}% used
                </p>
              </div>

              <p className="text-sm sm:text-base font-medium text-gray-800 border-t border-gray-100 pt-4">
                {total === 0
                  ? "No budget set for this month"
                  : `Spent ₹${spent.toLocaleString(
                      "en-IN",
                    )} of ₹${total.toLocaleString("en-IN")} budget`}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Burn & Savings */}
        <TabsContent value="burn" className="mt-4">
          <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Burn & Savings
                </h2>
                <p className="text-xs sm:text-sm text-green-100">
                  Income, spend rate, and what's left over
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Income</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    ₹{burn?.income?.toLocaleString("en-IN") ?? 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    ₹{burn?.totalSpent?.toLocaleString("en-IN") ?? 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Burn Rate</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    ₹{burn?.burnRate?.toFixed(2) ?? 0}/day
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 text-center ${
                    (burn?.savings ?? 0) < 0 ? "bg-red-50" : "bg-green-50"
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">Savings</p>
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      (burn?.savings ?? 0) < 0
                        ? "text-red-600"
                        : "text-green-700"
                    }`}
                  >
                    ₹{burn?.savings?.toLocaleString("en-IN") ?? 0}
                  </p>
                </div>
              </div>

              {burn && (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={[
                      { name: "Income", value: burn.income ?? 0 },
                      { name: "Spent", value: burn.totalSpent ?? 0 },
                      { name: "Savings", value: burn.savings ?? 0 },
                    ]}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f1f4"
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} width={45} />
                    <Tooltip
                      formatter={(value: number) => [
                        `₹${value.toLocaleString("en-IN")}`,
                        "",
                      ]}
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #f1f1f4",
                      }}
                    />
                    <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Comparison */}
        <TabsContent value="category" className="mt-4">
          <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Category Comparison
                </h2>
                <p className="text-xs sm:text-sm text-blue-100">
                  This month vs last month, by category
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6">
              {categories.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No category data available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <BarChart
                    width={Math.max(categories.length * 100, 600)}
                    height={300}
                    data={categories.map((c) => ({
                      name: c.category,
                      value: c.currentMonth,
                      previous: c.previousMonth,
                      change: c.percentageChange,
                    }))}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f1f4"
                    />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) =>
                        `₹${value.toLocaleString("en-IN")}`
                      }
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #f1f1f4",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="previous"
                      fill="#c7d2fe"
                      name="Last Month"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      name="This Month"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalies */}
        <TabsContent value="anomaly" className="mt-4">
          <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Anomalies
                </h2>
                <p className="text-xs sm:text-sm text-red-100">
                  Unusual or high-value transactions this month
                </p>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6">
              {anomalies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-green-600 font-semibold text-sm sm:text-base">
                    No unusual transactions
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {anomalies.map((a, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm sm:text-base"
                    >
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {a.message ||
                          `₹${
                            a.currentAmount?.toLocaleString("en-IN") ?? 0
                          } in ${a.category}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
