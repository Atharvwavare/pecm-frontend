import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface MonthlyTrendData {
  month: number;
  totalAmount: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
}


// MonthlyTrendChart component to display a line chart of monthly trends
export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  // MonthlyTrendChart Interface
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-black mb-4 sm:mb-6 text-md sm:text-base">
        Last 6 Months Trend
      </h3>

      {safeData.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">No data available</p>
      ) : (
        // Same responsive-height-wrapper pattern as CategoryPieChart, for consistency.
        <div className="h-56 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safeData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={(month: number) =>
                  new Date(0, month - 1).toLocaleString("en", { month: "short" })
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                width={45}
                className="text-gray-900"
                tickFormatter={(value: number) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
              
                formatter={(value: number) => [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"]}
                labelFormatter={(month: number) =>
                  new Date(0, month - 1).toLocaleString("en", { month: "long" })
                }
              />
              <Line
                type="monotone"
                dataKey="totalAmount"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}