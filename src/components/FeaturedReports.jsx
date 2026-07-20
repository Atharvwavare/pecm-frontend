import { useEffect, useState, useRef } from "react";
import {
  getSmartInsights,
  getBudgetForecast,
  getFinancialScore,
  getHeatmapData,
  getMonthlySpending,
  getCategoryWise,
  setBudget,
} from "../services/reportService";

import { toast } from "sonner";
import { Cell } from "recharts";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  StopCircle,
  Sparkles,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  Gauge,
  Wallet,
  X,
} from "lucide-react";


// FeaturedReports component

export default function FeaturedReports() {
  const [insights, setInsights] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [score, setScore] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const trendData = monthlyData.map((item, index) => ({
    ...item,
    cumulative: monthlyData
      .slice(0, index + 1)
      .reduce((sum, i) => sum + Number(i.amount || 0), 0),
  }));

  const [budget, setBudgetValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef([]);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const monthColors = [
    "#4f46e5",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#0ea5e9",
    "#9333ea",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#22c55e",
    "#6366f1",
    "#ef4444",
  ];

  const handleSetBudget = async () => {
    const amount = Number(budget);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid budget amount");
      return;
    }

    try {
      await setBudget({
        amount,
        month: selectedMonth,
        year: selectedYear,
      });

      toast.success("Budget saved successfully");
      setBudgetValue("");

      // 🔄 Refresh forecast + insights
      fetchData();
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error saving budget");
      }
    }
  };

// LOAD VOICES FOR SPEECH SYNTHESIS
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [i, f, s, h, m, c] = await Promise.all([
        getSmartInsights(selectedMonth, selectedYear),
        getBudgetForecast(selectedMonth, selectedYear),
        getFinancialScore(selectedMonth, selectedYear),
        getHeatmapData(selectedMonth, selectedYear),
        getMonthlySpending(),
        getCategoryWise(selectedMonth, selectedYear),
      ]);

      setCategoryData(
        Object.entries(c.data).map(([name, amount]) => ({
          name,
          amount,
        })),
      );

      setInsights(i.data || []);
      setForecast(f.data || null);
      setScore(s.data || null);
      setHeatmap(
        (h.data || []).map((item) => ({
          date: item.date,
          amount: Number(item.amount || 0),
        })),
      );
      setMonthlyData(m.data || []);
    } catch (err) {
      console.error("Featured report error:", err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const totalSpending = monthlyData.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  // LOAD VOICES FOR SPEECH SYNTHESIS
  const speakInsights = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("Voice not supported in this browser");
      return;
    }

    if (!insights.length) return;

    window.speechSynthesis.cancel();

    const text = insights.join(". ");
    const speech = new SpeechSynthesisUtterance(text);

    const voices = voicesRef.current;

    speech.voice =
      voices.find((v) => v.lang === "en-IN") ||
      voices.find((v) => v.lang.includes("en")) ||
      voices[0];

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);

    setTimeout(() => {
      window.speechSynthesis.speak(speech);
    }, 200);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...heatmap.map((d) => d.amount), 1);

  const getHeatColor = (value) => {
    if (value === 0) return "#e5e7eb";

    const intensity = value / maxAmount;

    if (intensity < 0.25) return "#bbf7d0"; // light
    if (intensity < 0.5) return "#4ade80"; // medium
    if (intensity < 0.75) return "#22c55e"; // strong
    return "#15803d"; // very strong
  };

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  const heatmapDataMap = {};
  heatmap.forEach((item) => {
    const day = new Date(item.date).getDate();
    heatmapDataMap[day] = item.amount;
  });

  const fullMonthData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { day, amount: heatmapDataMap[day] || 0 };
  });

  const budgetUsedPct =
    forecast && forecast.budget > 0
      ? Math.min((forecast.currentSpend / forecast.budget) * 100, 100)
      : 0;

  const isOverBudget =
    forecast &&
    forecast.projectedSpend > forecast.budget &&
    forecast.budget > 0;


    // FEATURED REPORTS INTERFACE
  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="pt-20 sm:pt-24 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
          <Gauge className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Advanced Financial Report
          </h1>
          <p className="text-gray-600 mt-0.5 text-sm sm:text-base">
            Smart analytics & insights for your spending
          </p>
        </div>
      </div>

      {/* TOOLBAR: Period + Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:divide-x lg:divide-gray-100">
          {/* Period */}
          <div className="flex-1 min-w-0 lg:pr-4">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              Filter by Date
            </label>
            <div className="flex gap-2">
              <input
                type="month"
                value={`${selectedYear}-${String(selectedMonth).padStart(
                  2,
                  "0",
                )}`}
                onChange={(e) => {
                  const value = e.target.value; // "YYYY-MM"
                  if (!value) return;
                  const [y, m] = value.split("-").map(Number);
                  setSelectedYear(y);
                  setSelectedMonth(m);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2.5 bg-white text-sm flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />

              <button
                onClick={() => {
                  setSelectedMonth(currentDate.getMonth() + 1);
                  setSelectedYear(currentDate.getFullYear());
                }}
                className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Budget */}
          <div className="flex-1 min-w-0 lg:px-4">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
              <IndianRupee className="w-4 h-4 text-green-600" />
              Monthly Budget
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder="e.g. 50000"
                value={budget}
                onChange={(e) => setBudgetValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetBudget()}
                className="border border-gray-200 rounded-lg px-3 py-2.5 flex-1 min-w-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              />
              <button
                onClick={handleSetBudget}
                className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 active:scale-95 transition text-sm font-semibold flex-shrink-0 shadow-sm shadow-green-200"
              >
                Save
              </button>
            </div>
          </div>

          {/* Insights button */}
          <button
            onClick={() => setShowInsightsModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:brightness-110 active:scale-95 transition text-sm font-semibold flex-shrink-0 shadow-sm shadow-indigo-200 lg:pl-4"
          >
            <Sparkles className="w-4 h-4" />
            View Insights
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {forecast && (
          <Card
            title="Budget Forecast"
            icon={Wallet}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          >
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-sm text-gray-900">
                <span>Budget</span>
                <span className="font-medium text-gray-900">
                  ₹{(forecast.budget || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-900">
                <span>Current Spend</span>
                <span className="font-medium text-black">
                  ₹{(forecast.currentSpend || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {forecast.budget > 0 && (
              <div className="mb-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isOverBudget ? "bg-red-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${budgetUsedPct}%` }}
                  />
                </div>
                <p className="[text-12px] text-gray-600 mt-1">
                  {budgetUsedPct.toFixed(0)}% of budget used so far
                </p>
              </div>
            )}

            <p className="font-semibold text-base sm:text-lg text-gray-900 border-t border-gray-100 pt-3">
              Expected End of Month: ₹
              {(forecast.projectedSpend || 0).toLocaleString("en-IN")}
            </p>
            <p
              className={`mt-2 text-sm font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${
                isOverBudget
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {isOverBudget
                ? "⚠️ You may exceed your budget"
                : "✓ You are within budget"}
            </p>
          </Card>
        )}

        {score && (
          <Card
            title="Financial Score"
            icon={Gauge}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
            center
          >
            <div className="text-4xl sm:text-5xl font-bold text-gray-900">
              {score.score}
            </div>
            <p
              className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                score.status === "Excellent"
                  ? "bg-green-50 text-green-700"
                  : score.status === "Good"
                  ? "bg-blue-50 text-blue-700"
                  : score.status === "Moderate"
                  ? "bg-orange-50 text-orange-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {score.status}
            </p>
          </Card>
        )}

        <Card
          title="Total Spend"
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          center
        >
          <div className="text-3xl sm:text-4xl font-bold text-gray-900">
            ₹{totalSpending.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Across all recorded months
          </p>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Monthly Spending" isEmpty={monthlyData.length === 0}>
          <BarChart data={monthlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f1f4"
            />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={45}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => [
                `₹${Number(v).toLocaleString("en-IN")}`,
                "Spent",
              ]}
              contentStyle={{ borderRadius: 10, border: "1px solid #f1f1f4" }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {monthlyData.map((_, i) => (
                <Cell key={i} fill={monthColors[i % 12]} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>

        <ChartCard
          title="Spending Trend (Cumulative)"
          isEmpty={trendData.length === 0}
        >
          <LineChart data={trendData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f1f4"
            />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={45}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => [
                `₹${Number(v).toLocaleString("en-IN")}`,
                "Cumulative",
              ]}
              contentStyle={{ borderRadius: 10, border: "1px solid #f1f1f4" }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartCard>
      </div>

      {/*HEATMAP */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-semibold text-black text-md sm:text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Spending Heatmap
          </h3>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5 sm:gap-2">
          {fullMonthData.map((day, index) => (
            <div
              key={index}
              className="aspect-square rounded-md flex items-center justify-center text-[10px] sm:text-xs font-bold hover:scale-110 hover:shadow-md transition-all cursor-default"
              style={{
                backgroundColor: getHeatColor(day.amount),
                color: day.amount === 0 ? "#9ca3af" : "#ffffff",
              }}
              title={`Date: ${day.day} | ₹${day.amount.toLocaleString(
                "en-IN",
              )}`}
            >
              {day.day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          {["#e5e7eb", "#bbf7d0", "#4ade80", "#22c55e", "#15803d"].map(
            (c, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: c }}
              />
            ),
          )}
          <span>More</span>
        </div>
      </div>

      {/* INSIGHTS MODAL */}
      <AnimatePresence>
        {showInsightsModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowInsightsModal(false);
              stopSpeech();
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl p-5 sm:p-6 rounded-2xl shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => {
                  setShowInsightsModal(false);
                  stopSpeech();
                }}
                aria-label="Close"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-between items-center mb-5 pr-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Smart Insights
                </h3>

                <div className="flex gap-3">
                  <button
                    onClick={speakInsights}
                    aria-label="Play insights"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={stopSpeech}
                    aria-label="Stop speaking"
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <StopCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isSpeaking && (
                <p className="text-xs text-indigo-500 mb-3 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Speaking...
                </p>
              )}

              <div className="space-y-3">
                {insights.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">
                    No insights available
                  </p>
                ) : (
                  insights.map((item, i) => {
                    const type = getInsightType(item);

                    return (
                      <motion.div
                        key={i}
                        className={`p-4 rounded-xl border text-sm leading-relaxed ${type.bg}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {type.icon} {item}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// Helpers

function Card({ title, children, center, icon: Icon, iconColor, iconBg }) {
  return (
    <div
      className={`bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${
        center ? "text-center" : ""
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-3 ${
          center ? "justify-center" : ""
        }`}
      >
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function ChartCard({ title, children, isEmpty }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="mb-4 font-semibold text-gray-800 text-sm sm:text-base">
        {title}
      </h3>
      <div className="h-64 sm:h-72">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
            <TrendingUp className="w-8 h-8 text-gray-200" />
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function getInsightType(text) {
  const t = text.toLowerCase();

  if (t.includes("high") || t.includes("exceed")) {
    return { icon: "🚨", bg: "bg-red-50 border-red-200" };
  }

  if (t.includes("increase") || t.includes("saving")) {
    return { icon: "📈", bg: "bg-green-50 border-green-200" };
  }

  return { icon: "💡", bg: "bg-blue-50 border-blue-200" };
}
