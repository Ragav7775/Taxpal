import BudgetRow from "./BudgetRow";
import { FormatAmount } from "../../../utils/FormatAmount";

export default function BudgetTable({ budgets, currentMonth, onEdit, onDelete }) {
  const currencySymbol = localStorage.getItem("CurrencySymbol");
  const countryName = localStorage.getItem("Country");

  return (
    <div className="bg-white p-5 rounded-2xl shadow-customShadow">
      <h4 className="mb-2 font-bold">Your Budgets</h4>
      <table className="w-full border border-gray-800 rounded-2xl overflow-hidden border-collapse bg-white">
        <thead>
          <tr className="bg-white text-center">
            {["Category", "Month", "Budget", "Spent", "Remaining", "Status", "Actions", ""].map(
              (head, idx) => (
                <th
                  key={idx}
                  className="p-2 text-sm font-bold border-b border-gray-200"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {budgets.length > 0 ? (
            budgets.map((b) => (
              <BudgetRow
                key={b._id}
                category={b.category}
                month={b.month}
                budget_amount={`${currencySymbol}${FormatAmount(b.budget_amount, countryName)}`}
                spent={`${currencySymbol}${FormatAmount(b.spent_amount ?? 0, countryName)}`}
                remaining={`${currencySymbol}${FormatAmount(b.remaining_amount ?? 0, countryName)}`}
                status={b.month === currentMonth ? "current" : "closed"}
                onEdit={() => onEdit(b)}
                onDelete={() => onDelete(b)}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No budgets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
