import { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateBudgetRecord } from "../../../api/BudgetApi";

// Validation Schema
const budgetSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  budget_amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Budget amount must be a valid positive number",
    }),
  description: z.string().optional(),
});

export default function EditBudgetModal({ categories = [], onClose, onSuccess, budget }) {
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      category: budget?.category || "",
      budget_amount: budget?.budget_amount?.toString() || "",
      description: budget?.description || "",
    }),
    [budget]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues,
  });

  // Watch all fields
  const watchedValues = watch();

  // Compare current values with default values
  const isDirty = useMemo(() => {
    const categoryChanged =
      (watchedValues.category || "") !== (defaultValues.category || "");
    const amountChanged =
      (watchedValues.budget_amount || "") !== (defaultValues.budget_amount || "");
    const descChanged =
      (watchedValues.description || "") !== (defaultValues.description || "");
    return categoryChanged || amountChanged || descChanged;
  }, [watchedValues, defaultValues]);

  // Handle Update
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = { ...data, budget_amount: parseFloat(data.budget_amount) };
      const response = await UpdateBudgetRecord(budget._id, payload);

      if (response.status === 200) {
        toast.success("Budget updated successfully!");
        if (onSuccess) onSuccess(); // Refetch budgets
        reset(data); // reset to new saved values
        onClose(); // Close modal
      }
    } catch (error) {
      console.error("❌ Failed to update budget", error);
      toast.error("Failed to update budget!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-[clamp(300px,80vw,500px)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-5">
          <div>
            <h4 className="text-lg font-bold">Edit Budget</h4>
            <p className="text-xs text-gray-500 mt-1">
              Update your budget details for this category
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Category */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-1">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categories}
                    value={categories.find((opt) => opt.value === field.value)}
                    onChange={(val) => field.onChange(val.value)}
                    placeholder="Select category"
                    className="text-sm"
                    styles={{
                      menuList: (base) => ({
                        ...base,
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                        paddingRight: "4px",
                      }),
                    }}
                  />
                )}
              />
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Budget Amount */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-1">Budget Amount</label>
              <input
                type="number"
                placeholder="₹ 0.00"
                {...register("budget_amount")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield]"
              />
              {errors.budget_amount && (
                <p className="text-xs text-red-500 mt-1">{errors.budget_amount.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mb-5">
            <label className="text-sm font-bold text-gray-600 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              placeholder="Add a note about this budget"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || loading || !isDirty}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
