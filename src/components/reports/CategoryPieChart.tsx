import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CategoryData {
  categoryName: string;
  totalAmount: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}


// CategoryPieChart component to display a pie chart of expenses by category
export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const safeData = Array.isArray(data) ? data : [];

  const COLORS = [
    "#6366f1", // Indigo
    "#22c55e", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#8b5cf6", // Violet
    "#14b8a6", // Teal
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
  ];


  // CategoryPieChart Interface
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-black mb-4 sm:mb-6 text-md sm:text-base">
        Category Wise Expense
      </h3>

      {safeData.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">No data available</p>
      ) : (
        // Fixed-height wrapper (not a fixed px prop on ResponsiveContainer) so the
        // chart actually shrinks on small screens instead of forcing 400px everywhere.
        <div className="h-64 sm:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeData}
                dataKey="totalAmount"
                nameKey="categoryName"
                outerRadius="75%"
                // No inline labels — on small screens they overlap into an unreadable
                // mess. Tooltip + Legend below give the same info more reliably.
              >
                {safeData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}