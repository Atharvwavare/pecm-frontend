import {
  LayoutDashboard,
  FolderOpen,
  Receipt,
  BarChart3,
  Settings,
  X,
  LineChart,
  ScatterChart,
  FolderCog,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShieldCheck } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/categories", label: "Categories", icon: FolderOpen },
    { path: "/expenses", label: "Expenses", icon: Receipt },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/featured_reports", label: "Featured Reports", icon: LineChart },
    { path: "/analytics", label: "Analytics", icon: ScatterChart },
    { path: "/addcategories", label: "Add Categories", icon: FolderCog },
    { path: "/settings", label: "Settings", icon: Settings },
    ...(user?.role === "ADMIN"
      ? [{ path: "/admin", label: "User Management", icon: ShieldCheck }]
      : []),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed lg:fixed
    top-16 left-0
    h-[calc(100vh-4rem)]
    w-64
    bg-white border-r border-gray-200
    flex flex-col shadow-sm
    transform transition-transform duration-300 ease-in-out
    z-40
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 pt-2">PECM</h2>
            <p className="text-xs text-gray-500 mt-1">Expense Manager</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-800 hover:bg-gray-50"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}
