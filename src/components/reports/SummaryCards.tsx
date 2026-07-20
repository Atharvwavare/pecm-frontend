import { Wallet, Tags, TrendingUp, Star, LucideIcon } from "lucide-react";

interface SummaryData {
  totalExpense?: number;
  totalCategories?: number;
  highestSpendingDay?: number;
  mostUsedCategory?: string;
}

interface SummaryCardsProps {
  summary: SummaryData;
}

// SummaryCards component to display summary cards for the dashboard
export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Expense",
      value: `₹${(summary.totalExpense || 0).toLocaleString("en-IN")}`,
      gradient: "from-red-500 to-orange-500",
      icon: Wallet,
    },
    {
      title: "Categories Used",
      value: summary.totalCategories || 0,
      gradient: "from-blue-500 to-cyan-500",
      icon: Tags,
    },
    {
      title: "Highest Day",
      value: `₹${(summary.highestSpendingDay || 0).toLocaleString("en-IN")}`,
      gradient: "from-emerald-500 to-green-600",
      icon: TrendingUp,
    },
    {
      title: "Most Used",
      value: summary.mostUsedCategory || "N/A",
      gradient: "from-purple-500 to-indigo-600",
      icon: Star,
    },
  ];

  // SummaryCards Interface
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          value={card.value}
          gradient={card.gradient}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

interface CardProps {
  title: string;
  value: string | number;
  gradient: string;
  icon: LucideIcon;
}

// Card component to display individual summary card
function Card({ title, value, gradient, icon: Icon }: CardProps) {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} text-white p-4 sm:p-6 rounded-2xl shadow-md
      hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-0`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
       <h4 className="text-xs sm:text-sm text-white/90 tracking-wide truncate">{title}</h4>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 flex-shrink-0" />
      </div>
      <p className="text-xl sm:text-3xl font-bold truncate">{value}</p>
    </div>
  );
}