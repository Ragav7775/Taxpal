import { useState, useEffect } from "react";
import { FaCalculator } from "react-icons/fa";
import TaxReminderForm from "../../tax-estimator/TaxReminderForm";

export default function TaxSummaryCard({ estimatedTax, currencySymbol, onSaveReminder }) {
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Hide reminder form if estimatedTax or currencySymbol changes
  useEffect(() => {
    setShowReminderForm(false);
  }, [estimatedTax, currencySymbol]);

  // Show reminder form when user clicks button
  const handleCreateReminderClick = () => {
    if (parseFloat(estimatedTax) > 0) {
      setShowReminderForm(true);
    }
  };

  // Handle reminder submission
  const handleReminderSubmit = (data) => {
    if (onSaveReminder) onSaveReminder(data);
    setShowReminderForm(false); // hide form after saving
  };

  // Handle cancel button
  const handleCancel = () => {
    setShowReminderForm(false);
  };

  const isTaxZero = parseFloat(estimatedTax) <= 0;

  return (
    <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-customShadow flex flex-col items-center justify-center text-center">
      {showReminderForm ? (
        <TaxReminderForm
          onSubmitReminder={handleReminderSubmit}
          onCancel={handleCancel}
          estimatedTax={estimatedTax}
          currencySymbol={currencySymbol}
        />
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4 text-gray-800">Tax Summary</h2>
          {estimatedTax ? (
            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Based on your entries:</p>
                <p className="text-4xl font-bold text-green-600">
                  {currencySymbol} {estimatedTax}
                </p>
                <p className="text-sm text-gray-500">Estimated Quarterly Tax</p>
              </div>

              {/* Create Reminder button or disabled message */}
              {isTaxZero ? (
                <p className="text-sm text-blue-500">
                  Cannot create a reminder for zero tax.
                </p>
              ) : (
                <button
                  onClick={handleCreateReminderClick}
                  className="w-full py-2 bg-customBlue text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Create Reminder
                </button>
              )}
            </div>
          ) : (
            <>
              <FaCalculator size={50} className="text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm px-4">
                Enter your income and deductions to calculate your estimated tax.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};
