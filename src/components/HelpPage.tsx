import {
  LayoutDashboard,
  FolderOpen,
  Receipt,
  BarChart3,
  LineChart,
  ScatterChart,
  FolderCog,
  Settings,
  Mail,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface HelpSection {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  steps: string[];
}

export default function HelpPage() {
  const sections: HelpSection[] = [
    {
      icon: LayoutDashboard,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Dashboard",
      steps: [
        "See your total expenses, this month's spending, category count, and average spend per day at a glance.",
        "Use the month selector at the top right to view stats for a different month.",
        "Recent Expenses shows your latest 4 transactions; Top Categories shows where most of your money goes.",
      ],
    },
    {
      icon: FolderOpen,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      title: "Categories",
      steps: [
        "Go to Categories to view, add, edit, or delete expense categories (e.g. Food, Transport, Shopping).",
        "Click 'Add Category' to create a new one with a name and description.",
        "Deleting a category also deletes all expenses under it — you'll be asked to confirm before this happens.",
      ],
    },
    {
      icon: Receipt,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      title: "Expenses",
      steps: [
        "Go to Expenses to add, edit, delete, or search your individual transactions.",
        "Use 'Filter by Date' to view expenses from a specific month.",
        "Click 'View' on any expense to see full details, or 'Edit' to update it.",
      ],
    },
    {
      icon: BarChart3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      title: "Reports",
      steps: [
        "See a monthly summary with charts: category breakdown, spending trend, and a daily budget breakdown.",
        "Change the month using the date filter at the top.",
        "Click 'Download PDF' to export the full report for record-keeping or sharing.",
      ],
    },
    {
      icon: LineChart,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      title: "Featured Reports",
      steps: [
        "Get smart insights, a budget forecast, and a financial health score for the selected month.",
        "Set a monthly budget to unlock forecast and score features.",
        "View the spending heatmap to see which days you spent the most.",
      ],
    },
    {
      icon: ScatterChart,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      title: "Analytics",
      steps: [
        "Set your monthly income to see burn rate and savings.",
        "Check Budget Risk to see if you're on track to exceed your budget.",
        "Compare spending across categories month-over-month, and review flagged anomalies.",
      ],
    },
    {
      icon: FolderCog,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
      title: "Add Categories",
      steps: [
        "A quick way to add or remove categories without leaving a simple list view.",
        "Type a category name and click 'Add' to create it instantly.",
      ],
    },
    {
      icon: Settings,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      title: "Settings",
      steps: [
        "Update your name and email under Profile Information.",
        "Change your password under Change Password.",
        "Delete your account permanently under the Danger Zone — this also removes all your data.",
      ],
    },
  ];

  return (
    <div className="pt-24 lg:ml-64 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Help & Support
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm sm:text-base">
            How to use PECM, and how to reach us
          </p>
        </div>
      </div>

      {/* HOW TO USE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${section.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${section.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* CONTACT */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Still have questions?
        </h3>
        <p className="text-blue-100 mb-5 text-sm sm:text-base">
          Reach out and we'll get back to you as soon as we can.
        </p>
        <a
          href="mailto:athrvtx@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md"
        >
          <Mail className="w-4 h-4" />
          athrvtx@gmail.com
        </a>
      </div>
    </div>
  );
}