import { useState, useEffect } from 'react';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import IncomeExpenseModal from '../ui/transactions/IncomeExpenseModel';
import { FetchUserCategoryData } from '../../api/SettingsApi';


const ActionButton = ({ icon, text, color, onClick }) => (
  <button
    className="flex items-center gap-3.5 px-6 py-1.5 rounded-lg border-0 bg-white shadow-customShadow cursor-pointer font-bold"
    onClick={onClick}
  >
    <span style={{ color: color }}>{icon}</span>
    <span className="text-black text-[14px]">{text}</span>
  </button>
);

export default function DashboardHeader({ onSuccess }) {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [categories, setCategories] = useState({ INCOME: [], EXPENSE: [] });
  const [loadingCategories, setLoadingCategories] = useState(true);

  const UserData = JSON.parse(localStorage.getItem("user"));

  // Fetch categories from API
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await FetchUserCategoryData();
      setCategories({
        INCOME: data.incomeCategories.map((c) => ({ value: c.category_name, label: c.category_name })),
        EXPENSE: data.expenseCategories.map((c) => ({ value: c.category_name, label: c.category_name })),
      });
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center m-1">
        <div>
          <h2 className="text-[20px] font-bold m-0">Finance Dashboard</h2>
          <p className="text-[14px] mt-0.5">
            Welcome back {UserData.name}! here’s your Financial summary
          </p>
        </div>
        <div className="flex gap-7 mt-2 justify-start">
          <ActionButton
            icon={<FaPlusCircle />}
            text="Record Income"
            color="#4CAF50"
            onClick={() => setShowIncomeModal(true)}
          />
          <ActionButton
            icon={<FaMinusCircle />}
            text="Record Expense"
            color="#FF4D4F"
            onClick={() => setShowExpenseModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showIncomeModal && (
        <IncomeExpenseModal
          type="INCOME"
          categories={loadingCategories ? [] : categories.INCOME}  // pass fetched categories
          onClose={() => setShowIncomeModal(false)}
          onSuccess={onSuccess} // trigger refresh
        />
      )}

      {showExpenseModal && (
        <IncomeExpenseModal
          type="EXPENSE"
          categories={loadingCategories ? [] : categories.EXPENSE} // pass fetched categories
          onClose={() => setShowExpenseModal(false)}
          onSuccess={onSuccess} // trigger refresh
        />
      )}
    </>
  );
}
