import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { useNavigate } from "react-router-dom";

// Category interface - Dynamic data from backend
interface Category {
  id: number;
  name: string;
  description: string;
}

// Category table component
export default function CategoriesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // static data = empty state (dynamic data)
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // for navigation
  const navigate = useNavigate();

  // add,edit and delete modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "", description: "" });
  const itemsPerPage = 6;

  //  All the functions and logic for fetching, adding, editing, deleting, searching, and pagination of categories
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description ?? " ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      setCategories((prev) => [...prev, res.data]);
      closeModals();
      toast.success("Category added successfully!");
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowEditModal(true);
  };

  const handleUpdateCategory = async () => {
    if (!formData.name.trim() || !selectedCategory) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await updateCategory(selectedCategory.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      setCategories((prev) =>
        prev.map((cat) => (cat.id === res.data.id ? res.data : cat)),
      );

      closeModals();
      toast.success("Category updated successfully!");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory.id);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id),
      );
      setCurrentPage(1);
      closeModals();
      toast.success("Category deleted successfully!");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleViewExpenses = (category: Category) => {
    navigate(`/expenses?categoryId=${category.id}`);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteConfirm(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "" });
  };

  // User Interface
  return (
    <div>
      {/* Full outer Body */}
      <div className="pt-24 lg:ml-64 h-screen overflow-y-auto bg-gray-50">
        {/* Categories Header and Add Category button */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-black">
              Categories
            </h2>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Add/Edit Category Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-200">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {showAddModal ? "Add New Category" : "Edit Category"}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Food & Dining"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="e.g., Restaurants, groceries, and food delivery"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 md:p-6 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    showAddModal ? handleAddCategory : handleUpdateCategory
                  }
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  {showAddModal ? "Add Category" : "Update Category"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedCategory && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-200">
              {/* Header with close button */}
              <div className="flex items-center justify-end p-4 md:p-6 pb-0">
                <button
                  onClick={closeModals}
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
                <p className="text-sm md:text-base text-gray-900 text-center mb-2">
                  Are you sure you want to delete "{selectedCategory.name}"?
                </p>

                <p className="text-xs md:text-sm text-red-600 text-center mb-6 font-medium">
                  This will also permanently delete all expenses under this
                  category. This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm md:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          {/* Search Category Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* LOADING MESSAGE */}
          {loading && (
            <div className="text-center py-6 text-gray-500">
              Loading categories...
            </div>
          )}
          {/* Desktop Table View */}
          {!loading && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Category ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Category Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category, index) => {
                    const serialNumber = startIndex + index + 1;

                    return (
                      <tr
                        key={category.id}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-800">
                          {serialNumber}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {category.name}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {category.description}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteClick(category)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>

                            <button
                              onClick={() => handleViewExpenses(category)}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Expenses
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedCategories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      {startIndex + paginatedCategories.indexOf(category) + 1}
                    </p>

                    <h3 className="font-semibold text-gray-800 text-lg">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewExpenses(category)}
                      className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* filter categories */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm md:text-base">
              No categories found matching your search.
            </div>
          )}

          {/* Previous and Next Buttons */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
