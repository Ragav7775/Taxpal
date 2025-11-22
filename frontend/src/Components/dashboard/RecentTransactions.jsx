import { useEffect, useState } from "react";
import { fetchRecentTransactions } from "../../api/TransactionApi";
import { FormatAmount } from "../../utils/FormatAmount";




const TransactionRow = ({ date, description, category, amount, type, currencySymbol, countryName }) => (
  <tr className="border-b border-gray-200 text-gray-600 my-1">
    <td className="p-2 text-sm text-center">{date}</td>
    <td className="p-2 text-sm text-center line-clamp-1">{description}</td>
    <td className="p-2 text-sm text-center">{category}</td>
    <td className="p-2 text-sm text-center">{currencySymbol}{FormatAmount(amount, countryName)}</td>
    <td className={`p-2 text-sm text-center ${type == "EXPENSE" ? "text-[#f64949]" : "text-[#54c947]"}`}>{type}</td>
  </tr>
);

export default function RecentTransactions({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const countryName = localStorage.getItem("Country");
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  const loadTransactions = async () => {
    try {
      const data = await fetchRecentTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("❌ Failed to fetch recent transactions:", error);
    }
  };
 
  useEffect(() => {
    loadTransactions();
  }, [refresh]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-customShadow my-3">
      <h4 className="mb-2 font-bold">Recent Transactions</h4>
      <table className="w-full border border-gray-800 rounded-2xl overflow-hidden border-collapse bg-white">
        <thead>
          <tr className="bg-white text-left">
            <th className="p-2 text-sm font-bold text-center border-b border-gray-200">Date</th>
            <th className="p-2 text-sm font-bold text-center border-b border-gray-200">Description</th>
            <th className="p-2 text-sm font-bold text-center border-b border-gray-200">Category</th>
            <th className="p-2 text-sm font-bold text-center border-b border-gray-200">Amount</th>
            <th className="p-2 text-sm font-bold text-center border-b border-gray-200">Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn, idx) => (
              <TransactionRow key={idx} {...txn} currencySymbol={currencySymbol} countryName={countryName} />
            ))
          ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No Transactions found
                </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
