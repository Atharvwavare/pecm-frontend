import api from "./api";


// Category service to manage categories
// Category API endpoints
// getCategories: Fetches all categories
export const getCategories = () =>
  api.get("/categories");

// getCategoryById: Fetches a single category by its ID
export const createCategory = (data: { name: string; description: string }) =>
  api.post("/categories", data);

// updateCategory: Updates a category by its ID
export const updateCategory = (id: number, data: { name: string; description: string }) =>
  api.put(`/categories/${id}`, data);

// deleteCategory: Deletes a category by its ID
export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`);
