import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateNewBudget, DeleteBudgetData, FetchBudgetsRecords } from "../api/BudgetApi";
import DeleteConfirmationDialogBox from "../Components/ui/dialog-box/DeleteConfirmationDialogBox";
import EditBudgetModal from "../Components/ui/budget/EditBudgetModel";
import BudgetTable from "../Components/ui/budget/BudgetTable";
import { FetchUserCategoryData } from "../api/SettingsApi";
import BudgetForm from "../Components/budget/BudgetForm";

// Helper to get YYYY-MM from Date
const getMonthYear = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const currentMonth = getMonthYear(new Date());

export default function BudgetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [categories, setCategories] = useState([]); // dynamic categories
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch budgets
  const loadBudgets = async () => {
    try {
      const data = await FetchBudgetsRecords();
      setBudgets(data);
    } catch (err) {
      toast.error("Failed to fetch budgets!");
      console.error("Failed to fetch budgets:", err);
    }
  };

  // Fetch categories
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await FetchUserCategoryData();
      const mappedCategories = data.expenseCategories.map((c) => ({
        value: c.category_name,
        label: c.category_name,
      }));
      setCategories(mappedCategories);
    } catch (error) {
      toast.error("Failed to fetch categories!");
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadBudgets();
    loadCategories();
  }, []);

  // Create budget handler
  const handleCreateBudget = async (data) => {
    try {
      const payload = {
        category: data.category,
        budget_amount: Number(data.amount),
        month: data.date.slice(0, 7), // "YYYY-MM"
        description: data.description || "",
      };

      const response = await CreateNewBudget(payload);
      if (response.status === 201) {
        toast.success("Budget created successfully");
        await loadBudgets();
        setShowForm(false);
      }
    } catch (error) {
      toast.error("Failed to create budget!");
      console.error("❌ Error creating budget:", error);
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Budgets</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-customBlue text-white font-bold hover:bg-blue-600 cursor-pointer"
          >
            Create Budget
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <BudgetForm
          categories={loadingCategories ? [] : categories}
          onSubmit={handleCreateBudget}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Budget Table */}
      <BudgetTable
        budgets={budgets}
        currentMonth={currentMonth}
        onEdit={(budget) => setEditingBudget(budget)}
        onDelete={(budget) => setDeletingBudget(budget)}
      />

      {/* Edit Modal */}
      {editingBudget && (
        <EditBudgetModal
          categories={loadingCategories ? [] : categories}
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSuccess={loadBudgets}
        />
      )}

      {/* Delete Modal */}
      {deletingBudget && (
        <DeleteConfirmationDialogBox
          title="Delete Budget"
          message="Are you sure you want to permanently delete this budget? This action cannot be undone."
          resourceName={deletingBudget.category}
          onDelete={() => DeleteBudgetData(deletingBudget._id)}
          onClose={() => setDeletingBudget(null)}
          onSuccess={loadBudgets}
        />
      )}
    </div>
  );
}
