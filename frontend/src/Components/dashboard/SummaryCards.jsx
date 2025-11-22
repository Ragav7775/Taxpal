import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaInfoCircle, FaPiggyBank } from "react-icons/fa";
import { FetchSummaryCardData } from "../../api/DashboardApi";
import { getCurrencySymbolByCountryName } from "../../utils/CountryCurrency";
import { FormatAmount } from "../../utils/FormatAmount";




const SummaryCard = ({ title, value, change, icon }) => (
  <div className="bg-white p-4 rounded-2xl shadow-customShadow">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
      <span className="text-black text-lg">{icon}</span>
    </div>
    <p className="text-base font-bold [word-spacing:-2px]">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{change}</p>
  </div>
);

export default function SummaryCards({ refresh }) {
  const countryName = localStorage.getItem("Country");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    taxDue: 0,
    savingsRate: 0,
    country: "India",
    changes: {
      income: "↑0% from last Month",
      expense: "↓0% from last Month",
      taxDue: "No upcoming tax",
      savings: "↑0% from your goal!",
    },
  });
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FetchSummaryCardData();
        // only update if data has required fields
        if (data && Object.keys(data).length > 0) {
          setSummary(data);
          const symbol = getCurrencySymbolByCountryName(data.country);
          setCurrencySymbol(symbol);
          localStorage.setItem("CurrencySymbol", symbol);
          localStorage.setItem("Country", data.country);
        }
      } catch (error) {
        console.error("❌ Error loading summary, falling back to defaults:", error);
      }
    };
    fetchData();
  }, [refresh]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
      <SummaryCard
        title="Monthly Income"
        value={`${currencySymbol} ${FormatAmount(summary.income, countryName)}`}
        change={summary.changes.income}
        icon={<FaArrowUp className="text-green-500" />}
      />
      <SummaryCard
        title="Monthly Expense"
        value={`${currencySymbol} ${FormatAmount(summary.expense, countryName)}`}
        change={summary.changes.expense}
        icon={<FaArrowDown className="text-red-500" />}
      />
      <SummaryCard
        title="Estimated Tax Due"
        value={`${currencySymbol} ${FormatAmount(summary.taxDue, countryName)}`}
        change={summary.changes.taxDue}
        icon={<FaInfoCircle className="text-customBlue" />}
      />
      <SummaryCard
        title="Savings Rate"
        value={`${summary.savingsRate}%`}
        change={summary.changes.savings}
        icon={<FaPiggyBank className="text-yellow-500" />}
      />
    </div>
  );
};
