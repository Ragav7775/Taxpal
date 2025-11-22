import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTransaction } from "../../../api/TransactionApi";


// Shared base schema
const baseSchema = z.object({
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  notes: z.string().optional(),
});

// Schema factory
const getSchema = (type) =>
  baseSchema.extend({
    type: z.literal(type),
  });


export default function IncomeExpenseModal({ type = "INCOME", onClose, onSuccess, categories = [] }) {
  const schema = getSchema(type);
  const currencySymbol = localStorage.getItem("CurrencySymbol");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type,
      description: "",
      amount: "",
      category: "",
      notes: "",
      date: "",
    },
  });

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const response = await CreateTransaction(data);
      if (response.status === 201) {
        toast.success(`New ${type === "INCOME" ? "Income" : "Expense"} recorded successfully`);
        if (onSuccess) onSuccess();
        reset();
        if (onClose) onClose();
      }
    } catch (error) {
      toast.error(`Failed to create ${type.toLowerCase()} record!`);
      console.error(`❌ Failed to create ${type.toLowerCase()} record:`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-[clamp(300px,80vw,500px)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-5">
          <div>
            <h4 className="text-lg font-bold">
              Record New {type === "INCOME" ? "Income" : "Expense"}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Add details about your {type === "INCOME" ? "income" : "expense"} to track better
            </p>
          </div>
          <button
            className="absolute right-5 top-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Description */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-1">Description</label>
              <input
                type="text"
                placeholder={type === "INCOME" ? "e.g., Freelance project" : "e.g., Office rent"}
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                placeholder={`${currencySymbol} 0.00`}
                {...register("amount")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield]"
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
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
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999, // ensure it shows above other elements
                      }),
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

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-1">Date</label>
              <input
                type="date"
                {...register("date")}
                onFocus={(e) => e.target.showPicker()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col mb-5">
            <label className="text-sm font-bold text-gray-600 mb-1">Notes (Optional)</label>
            <textarea
              {...register("notes")}
              placeholder="Add any additional details"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
