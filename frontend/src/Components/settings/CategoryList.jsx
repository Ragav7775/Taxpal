import { FaPencilAlt, FaTimes } from "react-icons/fa";
import DeleteConfirmationDialogBox from "../ui/dialog-box/DeleteConfirmationDialogBox";


export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  deletingCategory,
  setDeletingCategory,
}) {
  return (
    <div className="space-y-3">
      {categories.map((cat, idx) => (
        <div
          key={cat.name + idx}
          className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:shadow-sm transition"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: cat.category_color }}
            ></span>
            <span className="text-gray-700 font-medium">
              {cat.category_name}
            </span>
          </div>
          <div className="flex gap-3 text-gray-500">
            <FaPencilAlt
              className="cursor-pointer hover:text-blue-500"
              onClick={() => onEdit(cat)}
            />
            <FaTimes
              className="cursor-pointer hover:text-red-500"
              onClick={() => setDeletingCategory(cat)}
            />
          </div>
        </div>
      ))}

      {/* Delete Confirmation */}
      {deletingCategory && (
        <DeleteConfirmationDialogBox
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
          resourceName={deletingCategory.category_name}
          onDelete={() => onDelete(deletingCategory)}
          onClose={() => setDeletingCategory(null)}
          onSuccess={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
}
