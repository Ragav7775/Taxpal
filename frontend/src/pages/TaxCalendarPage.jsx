import { useState, useEffect } from "react";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DeleteUserTaxRemainder,
  FetchTaxEstimatorRemainderRecords,
} from "../api/TaxEstimationApi";
import DeleteConfirmationDialogBox from "../Components/ui/dialog-box/DeleteConfirmationDialogBox";
import EditTaxReminderModal from "../Components/ui/tax-estimator/EditTaxReminderModal";

const statusClasses = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Completed: "bg-green-100 text-green-700 border border-green-300",
  Overdue: "bg-red-100 text-red-700 border border-red-300",
};

const TaxCalendarPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // Fetch reminders from API
  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await FetchTaxEstimatorRemainderRecords();
      setReminders(data);
    } catch (err) {
      toast.error("Failed to fetch reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await DeleteUserTaxRemainder(deleteTarget._id);
      toast.success("Reminder deleted successfully");
      fetchReminders();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete reminder");
    }
  };

  // Group reminders by month
  const groupedByMonth = reminders.reduce((acc, rem) => {
    const month = new Date(rem.dueDate).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(rem);
    return acc;
  }, {});

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-3 text-gray-700 hover:text-customBlue hover:cursor-pointer rounded-full transition duration-200"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Tax Calendar</h1>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-300"></div>
        </div>
      )}

      {!loading && Object.keys(groupedByMonth).length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No tax reminders found.
        </p>
      )}

      {/* Reminders */}
      {!loading &&
        Object.entries(groupedByMonth).map(([month, events]) => (
          <div key={month} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b border-gray-200 pb-2">
              {month}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((reminder, idx) => (
                <div
                  key={idx}
                  className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3 border border-gray-100"
                >
                  {/* Edit/Delete icons */}
                  <div className="absolute top-4 right-4 flex gap-3">
                    <button
                      onClick={() => setEditTarget(reminder)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Reminder"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(reminder)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Reminder"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-800 text-lg mt-2">
                    {reminder.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {reminder.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due Date:{" "}
                    {new Date(reminder.dueDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Estimated Tax: {reminder.currencySymbol}
                    {reminder.estimatedTax}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusClasses[reminder.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {reminder.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteConfirmationDialogBox
          title="Delete Tax Reminder"
          message={`Are you sure you want to delete the tax reminder "${deleteTarget.title}"?`}
          resourceName="Tax Reminder"
          onDelete={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Edit Tax Reminder Modal */}
      {editTarget && (
        <EditTaxReminderModal
          reminder={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchReminders}
        />
      )}
    </div>
  );
};

export default TaxCalendarPage;
