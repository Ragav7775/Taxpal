import { Trash2 } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function BudgetRow({
  category,
  month,
  budget_amount,
  spent,
  remaining,
  status,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b border-gray-200">
      <td className="p-2 text-sm text-center">{category}</td>
      <td className="p-2 text-sm text-center">{month}</td>
      <td className="p-2 text-sm text-center">{budget_amount}</td>
      <td className="p-2 text-sm text-center">{spent}</td>
      <td className="p-2 text-sm text-center">{remaining}</td>
      <td className="p-2 text-sm text-center font-semibold">
        {status === "current" ? (
          <span className="text-green-600">Current</span>
        ) : (
          <span className="text-gray-500">Closed</span>
        )}
      </td>
      <td className="p-2 text-sm flex justify-around">
        <button
          onClick={onEdit}
          className=" text-customBlue font-bold hover:text-blue-600 cursor-pointer"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={onDelete}
          className="text-customRed font-bold hover:text-red-600 cursor-pointer"
        >
          <FaTrash size={18} />
        </button>
      </td>
    </tr>
  );
};
