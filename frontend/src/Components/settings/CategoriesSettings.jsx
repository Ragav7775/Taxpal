import { useState, useEffect } from "react";
import {
  CreateNewUserCategory,
  DeleteUserCategory,
  FetchUserCategoryData,
  UpdateUserCategory,
} from "../../api/SettingsApi";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import { toast } from "sonner";

export default function CategoriesSettings() {
  const [activeTab, setActiveTab] = useState("Expense");
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#4970E4");
  const [deletingCategory, setDeletingCategory] = useState(null);

  const categories =
    activeTab === "Expense" ? expenseCategories : incomeCategories;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await FetchUserCategoryData();
      setExpenseCategories(data.expenseCategories);
      setIncomeCategories(data.incomeCategories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      if (editingCategory) {
        await UpdateUserCategory(
          activeTab.toLowerCase(),
          editingCategory.category_name,
          newCategoryName.trim(),
          newCategoryColor
        );
        toast.success("Category updated successfully!");
      } else {
        await CreateNewUserCategory(
          newCategoryName.trim(),
          newCategoryColor,
          activeTab.toLowerCase()
        );
        toast.success("Category created successfully!");
      }

      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.category_name);
    setNewCategoryColor(category.category_color);
    setShowForm(true);
  };

  const handleDeleteCategory = async (category) => {
    try {
      await DeleteUserCategory(activeTab.toLowerCase(), category.category_name);
      await fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryColor("#4970E4");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Category Management</h3>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-4">
        {["Expense", "Income"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              resetForm();
            }}
            className={`pb-2 font-medium hover:cursor-pointer ${
              activeTab === tab
                ? "text-customBlue border-b-2 border-customBlue"
                : "text-gray-500"
            }`}
          >
            {tab} Categories
          </button>
        ))}
      </div>

      {/* Add/Edit Category Form */}
      {showForm ? (
        <CategoryForm
          editingCategory={editingCategory}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          newCategoryColor={newCategoryColor}
          setNewCategoryColor={setNewCategoryColor}
          onSave={handleSaveCategory}
          onCancel={resetForm}
        />
      ) : (
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-customBlue text-white rounded-md mb-4 hover:bg-blue-600 hover:cursor-pointer"
        >
          + Add New Category
        </button>
      )}

      <CategoryList
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        deletingCategory={deletingCategory}
        setDeletingCategory={setDeletingCategory}
      />
    </div>
  );
}
