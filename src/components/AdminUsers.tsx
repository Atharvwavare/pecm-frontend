import { useEffect, useState } from "react";
import { getAllUsers, AdminUserSummary } from "../services/adminService";
import { toast } from "sonner";
import { Users, Shield, Receipt, Calendar, Clock, Search } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "Never";
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
  const totalExpenses = users.reduce((sum, u) => sum + (u.expenseCount || 0), 0);

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="pt-20 sm:pt-24 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm sm:text-base">
            Overview of all registered users
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Users"
          value={totalUsers}
        />
        <StatCard
          icon={Shield}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Admins"
          value={totalAdmins}
        />
        <StatCard
          icon={Receipt}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Total Expenses Logged"
          value={totalExpenses}
        />
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            No users found
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 text-sm">Name</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 text-sm">Email</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 text-sm">Role</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 text-sm">Expenses</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 text-sm">Joined</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-600 text-sm">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {u.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600 text-sm">{u.email}</td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            u.role === "ADMIN"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-700 text-sm font-medium">{u.expenseCount}</td>
                      <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDate(u.createdAt)}</td>
                      <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDateTime(u.lastLoginAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <div key={u.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {u.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        u.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-gray-400 mb-0.5">Expenses</p>
                      <p className="font-semibold text-gray-800">{u.expenseCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center col-span-1">
                      <p className="text-gray-400 mb-0.5 flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined
                      </p>
                      <p className="font-medium text-gray-700">{formatDate(u.createdAt)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center col-span-1">
                      <p className="text-gray-400 mb-0.5 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> Last In
                      </p>
                      <p className="font-medium text-gray-700 text-[11px]">{formatDateTime(u.lastLoginAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}