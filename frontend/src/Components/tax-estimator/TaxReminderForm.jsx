import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreateNewTaxEstimationRemainder } from "../../api/TaxEstimationApi";
import { useNavigate } from "react-router-dom";


// Validation Schema
const reminderSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.string().default("Pending"),
    dueDate: z.string().min(1, "Due date is required"),
    estimatedTax: z.number().min(0),
});

export default function TaxReminderForm({
  onSubmitReminder,
  onCancel,
  estimatedTax,
  currencySymbol,
}) {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "Pending",
            dueDate: today,
            estimatedTax: parseFloat(estimatedTax || 0),
        },
    });

  // form submit handler with API
    const handleFormSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                currencySymbol,
            };
            const response = await CreateNewTaxEstimationRemainder(payload);

            if (response.status == 201) {
                toast.success("Tax Reminder saved successfully");
                navigate("/Dashboard/TaxEstimator/TaxCalendar")
                if (onSubmitReminder) onSubmitReminder(response.data);
                reset();
            } else {
                toast.error(response?.message || "Failed to save reminder!");
            }
        } catch (error) {
            console.error("Save Reminder Error:", error);
            toast.error("Something went wrong while saving!...");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="w-full space-y-4"
        >
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold underline mb-1 text-gray-800">
                    Create Tax Reminder
                </h3>
                <p className="text-sm text-gray-500">
                    Fill in the details below to save a tax reminder.
                </p>
            </div>

            {/* Title */}
            <div>
                <label className="text-sm text-start text-gray-600 mb-1 block">
                    Title
                </label>
                <input
                    type="text"
                    {...register("title")}
                    placeholder="Reminder Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.title && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="text-sm text-start text-gray-600 mb-1 block">
                    Description
                </label>
                <textarea
                    {...register("description")}
                    placeholder="Description (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
            </div>

            {/* Status (read-only) */}
            <div>
                <label className="text-sm text-start text-gray-600 mb-1 block">
                    Payment Status
                </label>
                <input
                    type="text"
                    value="Pending"
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                />
            </div>

            {/* Due Date */}
            <div>
                <label className="text-sm text-start text-gray-600 mb-1 block">
                    Due Date
                </label>
                <input
                    type="date"
                    {...register("dueDate")}
                    onFocus={(e) => e.target.showPicker()}
                    min={today}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.dueDate && (
                    <p className="text-xs text-red-500 mt-1">
                        {errors.dueDate.message}
                    </p>
                )}
            </div>

            {/* Estimated Tax (read-only) */}
            <div>
                <label className="text-sm text-start text-gray-600 mb-1 block">
                    Estimated Tax
                </label>
                <input
                    type="text"
                    value={`${currencySymbol} ${estimatedTax}`}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 bg-customBlue text-white font-semibold rounded-lg hover:bg-blue-600 hover:cursor-pointer transition duration-200 disabled:opacity-70"
                >
                    {isSubmitting ? "Saving..." : "Save Reminder"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 hover:cursor-pointer transition duration-200"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
