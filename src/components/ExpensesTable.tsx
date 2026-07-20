import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService";
import { getCategories } from "../services/categoryService";
import { useSearchParams } from "react-router-dom";

// Category Color Map
import { buildCategoryColorMap } from "../utils/CategoryColors";

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: {
    id: number;
    name: string;
  };
  date: string;
}

interface Category {
  id: number;
  name: string;
  color?: string;
}

// ExpenseTable Component
export default function ExpensesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const itemsPerPage = 6;

  // month-filter
  // const [monthFilter, setMonthFilter] = useState<string>(""); // 0 = Jan, 1 = Feb ...
  // const [yearFilter, setYearFilter] = useState("");
  // Replace monthFilter + yearFilter
  const [yearMonthFilter, setYearMonthFilter] = useState(""); // format "YYYY-MM"
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate =
      yearMonthFilter === "" ||
      new Date(exp.date).toISOString().slice(0, 7) === yearMonthFilter; // YYYY-MM

    return matchesSearch && matchesDate;
  });
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [categoryId]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();

      let filteredData = res.data;

      // FILTER IF categoryId EXISTS
      if (categoryId) {
        filteredData = res.data.filter(
          (exp: any) => exp.categoryId === Number(categoryId),
        );
      }

      const formattedExpenses: Expense[] = filteredData.map((exp: any) => {
        return {
          id: exp.id,
          title: exp.title,
          amount: exp.amount,
          date: exp.expenseDate,
          category: {
            id: exp.categoryId,
            name: exp.categoryName,
          },
        };
      });

      setExpenses(formattedExpenses);
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const [categoryColorMap, setCategoryColorMap] = useState<
    Record<string, string>
  >({});

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
      setCategoryColorMap(
        buildCategoryColorMap(res.data.map((c: any) => c.name)),
      );
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleAddExpense = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter title");
      return;
    }
    if (
      !formData.amount ||
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    try {
      await createExpense({
        title: formData.title,
        amount: parseFloat(formData.amount),
        expenseDate: formData.date,
        categoryId: Number(formData.category),
      });

      toast.success("Expense added successfully!");
      fetchExpenses(); // 🔥 refresh table
      closeModals();
    } catch {
      toast.error("Failed to add expense");
    }
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category?.id.toString() || "",
      date: expense.date,
    });
    setShowEditModal(true);
  };

  const handleUpdateExpense = async () => {
    if (!selectedExpense) return;

    try {
      await updateExpense(selectedExpense.id, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        expenseDate: formData.date,
        categoryId: Number(formData.category),
      });

      toast.success("Expense updated successfully!");
      fetchExpenses();
      closeModals();
    } catch {
      toast.error("Failed to update expense");
    }
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense) return;

    try {
      await deleteExpense(selectedExpense.id);
      toast.success("Expense deleted successfully!");
      fetchExpenses(); // refresh
      closeModals();
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const handleViewDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteConfirm(false);
    setShowViewModal(false);
    setSelectedExpense(null);
    setFormData({ title: "", amount: "", category: "", date: "" });
  };

  return (
    <div>
      <div className="pt-24 lg:ml-64 h-screen overflow-y-auto bg-gray-50">
        {/* Expenses ,Filter By Date, Add Expense */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Heading and Add Expense Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-3xl font-semibold text-black">
              Expenses
            </h2>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>

          {/* Month & Year Filter */}
          {/* Date Filter */}
         <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 mt-2">
  <span className="text-sm md:text-base font-medium text-gray-700">
    Filter by Date:
  </span>

  <div className="flex gap-2 w-full sm:w-auto">
    <div className="relative flex-1 sm:flex-none sm:w-44">
      <input
        type="month"
        value={yearMonthFilter}
        onChange={(e) => {
          setYearMonthFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ colorScheme: "light" }}
      />
      <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white flex items-center justify-between pointer-events-none">
        <span className={yearMonthFilter ? "text-gray-800 font-medium" : "text-gray-400"}>
          {yearMonthFilter
            ? new Date(yearMonthFilter + "-01").toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "Select month"}
        </span>
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    </div>

    <button
      onClick={() => setYearMonthFilter("")}
      className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm md:text-base font-medium transition-colors flex-shrink-0"
    >
      Clear
    </button>
  </div>
</div>
        </div>

        {/* Add/Edit Expense Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-black-500">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {showAddModal ? "Add New Expense" : "Edit Expense"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Lunch at Restaurant"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="e.g., 450"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
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
                    showAddModal ? handleAddExpense : handleUpdateExpense
                  }
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  {showAddModal ? "Add Expense" : "Update Expense"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && selectedExpense && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-black-500">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  Expense Details
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
                  <p className="text-xs text-gray-500 mb-1">Expense ID</p>
                  <p className="text-base font-medium text-gray-800">
                    #{selectedExpense.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="text-base font-medium text-gray-800">
                    {selectedExpense.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{selectedExpense.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${
                      categoryColorMap[
                        selectedExpense.category?.name?.trim() || ""
                      ] || "bg-gray-400"
                    }`}
                  >
                    {selectedExpense.category.name}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-base font-medium text-gray-800">
                    {new Date(selectedExpense.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 md:p-6 border-t border-gray-200">
                <button
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedExpense && (
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
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center mb-2">
                  Delete Expense?
                </h3>
                <p className="text-sm md:text-base text-gray-600 text-center mb-2">
                  Are you sure you want to delete "{selectedExpense.title}"?
                </p>
                <p className="text-xs md:text-sm text-gray-500 text-center mb-6">
                  This action cannot be undone. Amount: ₹
                  {selectedExpense.amount.toFixed(2)}
                </p>
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

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* loading state */}
          {loading && (
            <div className="text-center py-6 text-gray-500">
              Loading expenses...
            </div>
          )}
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Expense ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense, index) => {
                  const serialNumber = startIndex + index + 1;

                  return (
                    <tr
                      key={expense.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {/* Serial Number Column */}
                      <td className="py-3 px-4 text-gray-600">
                        {serialNumber}
                      </td>

                      <td className="py-3 px-4 font-medium text-gray-800">
                        {expense.title}
                      </td>

                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₹{expense.amount.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${
                            categoryColorMap[
                              expense.category?.name?.trim() || ""
                            ] || "bg-gray-400"
                          }`}
                        >
                          {expense.category?.name}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-600">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(expense)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>

                          <button
                            onClick={() => handleViewDetails(expense)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          {!loading && (
            <div className="md:hidden space-y-4">
              {paginatedExpenses.map((expense, index) => {
                const serialNumber = startIndex + index + 1;

                return (
                  <div
                    key={expense.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          {serialNumber}
                        </p>

                        <h3 className="font-semibold text-gray-800 text-lg">
                          {expense.title}
                        </h3>

                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          ₹{expense.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${
                          categoryColorMap[
                            expense.category?.name?.trim() || ""
                          ] || "bg-gray-400"
                        }`}
                      >
                        {expense.category?.name}
                      </span>

                      <span className="text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDeleteClick(expense)}
                          className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>

                        <button
                          onClick={() => handleViewDetails(expense)}
                          className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* filter expenses */}
          {!loading && filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm md:text-base">
              No expenses found matching your search.
            </div>
          )}

          {/* total pages */}
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
