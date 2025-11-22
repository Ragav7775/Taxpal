import { useState } from "react";
import { toast } from "sonner";
import { FaTimes } from "react-icons/fa";

export default function DeleteConfirmationDialogBox({
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  resourceName = "item",
  onDelete, // async function to delete API
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  // Handle Delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete();
      toast.success(`${resourceName} deleted successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(`Failed to delete ${resourceName}`, error);
      toast.error(`Failed to delete ${resourceName}!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[clamp(300px,80vw,400px)]">
        {/* Header */}
        <div className="flex justify-center items-center border-b border-gray-200 pb-3 mb-4">
          <h4 className="text-lg font-bold">{title}</h4>
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          {message} <br />
          <span className="font-semibold">{resourceName}</span>
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
