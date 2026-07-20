import api from "./api";

export interface AdminUserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string | null;
  lastLoginAt: string | null;
  expenseCount: number;
}

export const getAllUsers = () => api.get<AdminUserSummary[]>("/admin/users");