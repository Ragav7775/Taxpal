import { useState, useMemo, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTransactionRecord } from "../../../api/TransactionApi";

// Validation schema
const transactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0, "Amount must be positive"),
  type: z.enum(["Income", "Expense"], "Transaction type is required"),
});

export default function EditTransactionModal({
  transaction,
  categories = { INCOME: [], EXPENSE: [] },
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: "Income", label: "Income" },
    { value: "Expense", label: "Expense" },
  ];

  // Default values for prefilled form
  const defaultValues = useMemo(() => ({
    date: transaction.date.split("T")[0],
    description: transaction.description || "",
    category: transaction.category || "",
    amount: transaction.amount || 0,
    // Convert type to match typeOptions values
    type: transaction.type === "INCOME" ? "Income" : "Expense",
  }), [transaction]);


  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const watchedValues = watch();

  // Map transaction type to uppercase key for categories
  const selectedCategoryKey = watchedValues.type.toUpperCase(); // "Income" -> "INCOME"

  // Available categories for current type
  const availableCategories = useMemo(() => {
    return categories[selectedCategoryKey] || [];
  }, [categories, selectedCategoryKey]);

  // Preselect category from available options when type changes
  useEffect(() => {
    if (!availableCategories.find(opt => opt.value === watchedValues.category)) {
      setValue("category", "");
    }
  }, [availableCategories, watchedValues.category, setValue]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    return (
      watchedValues.date !== defaultValues.date ||
      watchedValues.description !== defaultValues.description ||
      watchedValues.category !== defaultValues.category ||
      Number(watchedValues.amount) !== Number(defaultValues.amount) ||
      watchedValues.type !== defaultValues.type
    );
  }, [watchedValues, defaultValues]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await UpdateTransactionRecord(transaction._id, {
        updatedDate: data.date,
        updatedDescription: data.description,
        updatedCategory: data.category,
        updatedAmount: Number(data.amount),
        updatedType: data.type,
      });
      toast.success("Transaction updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update transaction:", err);
      toast.error(err.message || "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow-customShadow w-[clamp(300px,80vw,500px)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 mb-2">
          <div>
            <h4 className="text-lg font-bold">Edit Transaction</h4>
            <p className="text-xs text-gray-500 mt-1">
              Update the details of your transaction
            </p>
          </div>
          <button
            className="absolute right-6 top-6 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">Date</label>
            <input
              type="date"
              {...register("date")}
              onFocus={(e) => e.target.showPicker()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">Description</label>
            <input
              type="text"
              {...register("description")}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={typeOptions}
                  value={typeOptions.find((opt) => opt.value === field.value)}
                  onChange={(val) => field.onChange(val.value)}
                  menuPosition="fixed"
                  menuPlacement="auto"
                />
              )}
            />

            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={availableCategories}
                  value={availableCategories.find((opt) => opt.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                  menuPosition="fixed"
                  menuPlacement="auto"
                  placeholder="Select Category"
                />
              )}
            />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="₹ 0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield]"
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading || !isDirty}
              className="px-4 py-2 rounded-lg bg-customBlue text-white font-bold hover:bg-blue-600 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
