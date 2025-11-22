import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchMonthlyIncomeExpense } from "../../api/DashboardApi";

// Default 12 months template
const defaultData = [
  { month: "Jan", income: 0, expense: 0 },
  { month: "Feb", income: 0, expense: 0 },
  { month: "Mar", income: 0, expense: 0 },
  { month: "Apr", income: 0, expense: 0 },
  { month: "May", income: 0, expense: 0 },
  { month: "Jun", income: 0, expense: 0 },
  { month: "Jul", income: 0, expense: 0 },
  { month: "Aug", income: 0, expense: 0 },
  { month: "Sep", income: 0, expense: 0 },
  { month: "Oct", income: 0, expense: 0 },
  { month: "Nov", income: 0, expense: 0 },
  { month: "Dec", income: 0, expense: 0 },
];

// Custom tooltip
const CustomTooltip = ({ active, payload, label, currencySymbol }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded text-sm shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${currencySymbol}${(entry.value / 1000).toFixed(1)}k`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function IncomeVsExpense({ refresh }) {
  const [data, setData] = useState(defaultData);

  const currencySymbol = localStorage.getItem("CurrencySymbol");
  console.log("in chart:", currencySymbol);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchMonthlyIncomeExpense();
        const apiData = response || [];

        // merge API data into default template
        const updatedData = defaultData.map((month) => {
          const found = apiData.find((item) => item.month === month.month);
          return found ? { ...month, ...found } : month;
        });

        setData(updatedData);
      } catch (error) {
        console.error("❌ Error loading chart data:", error);
        setData(defaultData); // fallback
      }
    };

    loadData();
  }, [refresh]);
  

  return (
    <div className="bg-white p-4 rounded-2xl shadow-customShadow">
      <h4 className="text-lg font-bold mb-3">Income vs Expense</h4>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={data} barCategoryGap="15%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              className="text-xs text-gray-600"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
              domain={[0, 60000]}
              ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000]}
              className="text-xs text-gray-600"
            />
             <Tooltip
              content={(props) => (
                <CustomTooltip {...props} currencySymbol={currencySymbol} />
              )}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "10px" }}
              iconType="square"
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#f64949"
              radius={[5, 5, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#54c947"
              radius={[5, 5, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
