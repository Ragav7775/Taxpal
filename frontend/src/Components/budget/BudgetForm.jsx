import { FaTimes } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});


export default function BudgetForm({ categories = [], onSubmit, onCancel }) {
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "",
      amount: "",
      date: "",
      description: "",
    },
  });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-customShadow mb-5">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold">Create a new Budget</h4>
        <button
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onCancel}
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={categories.find((option) => option.value === field.value)}
                  onChange={(selectedOption) => field.onChange(selectedOption.value)}
                  options={categories}
                  placeholder="Select a Category"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-600 mb-1">
              Budget Amount
            </label>
            <input
              type="number"
              placeholder={`${currencySymbol} 0.00`}
              {...register("amount")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield]"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-bold text-gray-600 mb-1">Month</label>
          <input
            type="date"
            {...register("date")}
            onFocus={(e) => e.target.showPicker()}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-600 mb-1">
            Description (Optional)
          </label>
          <textarea
            {...register("description")}
            placeholder="Add any additional details"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-customBlue text-white font-bold hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Create Budget"}
          </button>
        </div>
      </form>
    </div>
  );
};
