import { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserTaxRemainder } from "../../../api/TaxEstimationApi";

// Validation schema
const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.string().min(1, "Status is required"),
});

export default function EditTaxReminderModal({ reminder, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Overdue", label: "Overdue" },
  ];

  const defaultValues = useMemo(
    () => ({
      title: reminder.title,
      description: reminder.description || "",
      dueDate: reminder.dueDate.split("T")[0], // format for input type="date"
      status: reminder.status || "Pending",
    }),
    [reminder]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues,
  });

  // Watch all fields
  const watchedValues = watch();

  // Compare current values with defaults to enable Save button only on change
  const isDirty = useMemo(() => {
    const titleChanged = (watchedValues.title || "") !== (defaultValues.title || "");
    const descChanged =
      (watchedValues.description || "") !== (defaultValues.description || "");
    const dateChanged =
      (watchedValues.dueDate || "") !== (defaultValues.dueDate || "");
    const statusChanged =
      (watchedValues.status || "") !== (defaultValues.status || "");
    return titleChanged || descChanged || dateChanged || statusChanged;
  }, [watchedValues, defaultValues]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await UpdateUserTaxRemainder({
        _id: reminder._id,
        TaxRemainder_title: reminder.title,
        estimatedTax: reminder.estimatedTax,
        updatedTitle: data.title,
        updatedDescription: data.description,
        updatedDueDate: data.dueDate,
        updatedStatus: data.status,
      });
      toast.success("Reminder updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update reminder", err);
      toast.error(err.message || "Failed to update reminder");
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
                        <h4 className="text-lg font-bold">Edit Tax Reminder</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Update details of your tax reminder
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-600 mb-1">Title</label>
                        <input
                            type="text"
                            {...register("title")}
                            placeholder="Reminder Title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-600 mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Description (optional)"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    {/* Due Date */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-600 mb-1">Due Date</label>
                        <input
                            type="date"
                            {...register("dueDate")}
                            onFocus={(e) => e.target.showPicker()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.dueDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-600 mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={statusOptions}
                                    value={statusOptions.find((opt) => opt.value === field.value)}
                                    onChange={(val) => field.onChange(val.value)}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                />
                            )}
                        />
                        {errors.status && (
                            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
                        )}
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
