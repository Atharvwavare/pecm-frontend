import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../services/categoryService";

import { buildCategoryColorMap } from "../utils/CategoryColors";

// TypeScript interface
interface Category {
  id: number;
  name: string;
  color: string;
}

export default function AddCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);
const fetchCategories = async () => {
  try {
    setLoading(true);
    const res = await getCategories();

    const colorMap = buildCategoryColorMap(res.data.map((cat: any) => cat.name));

    const mappedCategories: Category[] = res.data.map((cat: any) => ({
      id: Number(cat.id),
      name: cat.name,
      color: colorMap[cat.name.trim()] || "bg-gray-400",
    }));

    setCategories(mappedCategories);
  } catch {
    toast.error("Failed to load categories");
  } finally {
    setLoading(false);
  }
};

  // Add new category
  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return toast.error("Enter a category name!");
    if (
      categories.find((cat) => cat.name.toLowerCase() === trimmed.toLowerCase())
    )
      return toast.error("Category already exists!");

    try {
     const res = await createCategory({ name: trimmed, description: "" });
await fetchCategories(); // refetch so colors stay correctly assigned across the full, updated list
      setNewCategory("");
      toast.success(`Category "${trimmed}" added successfully!`);
    } catch {
      toast.error("Failed to add category");
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (cat: Category) => {
    setCategoryToDelete(cat);
  };

  // Confirm delete
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      toast.success(
        `Category "${categoryToDelete.name}" deleted successfully!`,
      );
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="pt-24 lg:ml-64 h-screen overflow-y-auto bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-black">
            Manage Categories
          </h2>
        </div>

        {/* Add New Category */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
          <button
            onClick={handleAddCategory}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {loading ? (
            <p className="text-gray-500 text-center col-span-full">
              Loading...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No categories found.
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-white text-sm md:text-base ${cat.color}`}
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => openDeleteModal(cat)}
                  className="bg-white text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/10"
            onClick={() => setCategoryToDelete(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-200">
            {/* Header with close button */}
            <div className="flex items-center justify-end p-4 md:p-6 pb-0">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 pt-0">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center mb-2">
                Delete Category?
              </h3>

              {/* Message */}
              <p className="text-sm md:text-base text-gray-600 text-center mb-2">
                Are you sure you want to delete "{categoryToDelete.name}"?
              </p>

              <p className="text-xs md:text-sm text-red-600 text-center mb-6 font-medium">
                This will also permanently delete all expenses under this
                category. This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteCategory}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
