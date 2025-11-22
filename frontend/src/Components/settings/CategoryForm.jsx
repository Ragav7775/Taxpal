export default function CategoryForm({
  editingCategory,
  newCategoryName,
  setNewCategoryName,
  newCategoryColor,
  setNewCategoryColor,
  onSave,
  onCancel,
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
      <input
        type="text"
        placeholder="Category Name"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        className="flex-1 p-2 border rounded-md text-sm min-w-[200px]"
      />
      <div className="flex items-center gap-2">
        <label className="text-sm">Color:</label>
        <input
          type="color"
          value={newCategoryColor}
          onChange={(e) => setNewCategoryColor(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
        >
          {editingCategory ? "Update" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 hover:cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
