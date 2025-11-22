import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TaxSummaryCard from "../Components/ui/tax-estimator/TaxSummaryCard";
import TaxCalculatorForm from "../Components/tax-estimator/TaxEstimatorForm";


function TaxEstimatorPage() {
  const navigate = useNavigate();
  const defaultcurrencySymbol = localStorage.getItem("CurrencySymbol") || "₹";

  // State to manage estimated tax & currency symbol
  const [estimatedTax, setEstimatedTax] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(defaultcurrencySymbol);


  return (
    <div className="p-4 relative min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2 p-3 bg-white rounded-lg">
          <div className="flex flex-col gap-0.5 ml-4">
            <h1 className="text-xl font-bold text-black">Tax Estimator</h1>
            <p className="text-sm text-gray-600">
              Get a quick estimate of your tax liabilities
            </p>
          </div>

          <button
            onClick={() => navigate("/Dashboard/TaxEstimator/TaxCalendar")}
            className="-mt-1 px-5 py-2.5 text-sm font-medium text-white bg-customBlue rounded-lg hover:bg-blue-700 transition duration-200 mr-4 cursor-pointer"
          >
            Tax Calendar
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 flex flex-col lg:flex-row gap-6">
          {/* Tax Calculator Form */}
          <TaxCalculatorForm
            estimatedTax={estimatedTax}
            setEstimatedTax={setEstimatedTax}
            currencySymbol={currencySymbol}
            setCurrencySymbol={setCurrencySymbol}
          />

          {/* Tax Summary */}
          <TaxSummaryCard estimatedTax={estimatedTax} currencySymbol={currencySymbol} />
        </div>
      </div>
    </div>
  );
}

export default TaxEstimatorPage;
