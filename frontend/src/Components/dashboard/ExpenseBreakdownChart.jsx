import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { fetchExpenseBreakdown } from "../../api/DashboardApi";

// Default data (fallback if API fails)
const defaultPieData = [
  { name: "Food", value: 10 },
  { name: "Business Expense", value: 10 },
  { name: "Utilities", value: 10 },
  { name: "Rent", value: 10 },
  { name: "Other", value: 10 },
];


const COLORS = [
  "#54c947", // green
  "#f64949", // red
  "#E8C547", // yellow
  "#60A2D5", // blue
  "#894BCA", // purple
  "#FFA500", // orange
  "#00C49F", // teal
  "#FF69B4", // pink
  "#FFD700", // gold
  "#1E90FF", // dodger blue
  "#8B0000", // dark red
  "#2E8B57", // sea green
  "#FF4500", // orange red
  "#DA70D6", // orchid
  "#40E0D0", // turquoise
  "#708090", // slate gray
  "#A0522D", // sienna
  "#00CED1", // dark turquoise
  "#C71585", // medium violet red
  "#B8860B", // dark goldenrod
];

export default function ExpenseBreakdownChart({ refresh }) {
  const [pieData, setPieData] = useState(defaultPieData);

  useEffect(() => {
    const loadData = async () => {
      const apiData = await fetchExpenseBreakdown();
      if (apiData.length > 0) {
        setPieData(apiData);
      }
    };
    loadData();
  }, [refresh]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-customShadow">
      <h4 className="text-lg font-bold mb-3">Expense Breakdown</h4>
      <div className="w-full h-60">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="focus:outline-none focus:ring-0"
                />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
