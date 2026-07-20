import API from "./api";

export const getExpenses = () => API.get(`/expenses`);

export const createExpense = (data: any) =>
  API.post(`/expenses`, data);

export const updateExpense = (id: number, data: any) =>
  API.put(`/expenses/${id}`, data);

export const deleteExpense = (id: number) =>
  API.delete(`/expenses/${id}`);