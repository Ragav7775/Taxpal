import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import countryList from "react-select-country-list";
import getSymbolFromCurrency from "currency-symbol-map";
import { Country, State } from "country-state-city";
import CountriesTaxSlabs from "../../json/CountriesTaxSlabs.json";

// Validation Schema
const taxSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(0, "City/State is required is Available"),

  filingStatus: z.enum(["Single", "Married"], {
    message: "Filing status is required",
    invalid_type_error: 'Filing status must be "Single" or "Married"',
  }),

  quarter: z.enum(
    [
      "Q1(Jan-Mar2025)",
      "Q2(Apr-Jun2025)",
      "Q3(Jul-Sep2025)",
      "Q4(Oct-Dec2025)",
    ],
    {
      message: "Quarter is required",
      invalid_type_error: "Quarter must be one of the allowed values",
    }
  ),

  grossIncome: z
    .string()
    .min(1, "Gross income is required")
    .refine((val) => !isNaN(val) && Number(val) >= 0, {
      message: "Gross income must be a non-negative number",
    }),

  businessExpenses: z.string().optional(),
  retirementContributions: z.string().optional(),
  healthInsurancePremiums: z.string().optional(),
  homeOfficeDeduction: z.string().optional(),
});

// Utilities
function getTaxSystemByCountry(countryName) {
  for (const system in CountriesTaxSlabs) {
    if (CountriesTaxSlabs[system].countries.includes(countryName)) {
      return { type: system, brackets: CountriesTaxSlabs[system].taxBrackets };
    }
  }
  return null;
}

function calculateProgressiveTax(income, brackets) {
  let tax = 0;
  for (const { min, max, rate } of brackets) {
    if (income > min) {
      const taxableAtThisRate = max ? Math.min(income, max) - min : income - min;
      tax += taxableAtThisRate * rate;
    }
  }
  return tax;
}

function calculateTax(countryName, taxableIncome) {
  const taxSystem = getTaxSystemByCountry(countryName);
  if (!taxSystem) return taxableIncome * 0.15;

  switch (taxSystem.type) {
    case "Progressive":
      return calculateProgressiveTax(taxableIncome, taxSystem.brackets);
    case "Flat":
      return taxableIncome * taxSystem.brackets[0].rate;
    case "Zero":
      return 0;
    default:
      return taxableIncome * 0.15;
  }
}

export default function TaxCalculatorForm({ setEstimatedTax, currencySymbol, setCurrencySymbol }) {
  const countries = useMemo(() => countryList().getData(), []);
  const defaultcurrencySymbol = localStorage.getItem("CurrencySymbol");

  const {
    register,
    control,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      country: "",
      city: "",
      filingStatus: "",
      quarter: "",
      grossIncome: "",
      businessExpenses: "",
      retirementContributions: "",
      healthInsurancePremiums: "",
      homeOfficeDeduction: "",
    },
  });

  const selectedCountry = watch("country");

  // Load states dynamically
  const stateOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [selectedCountry]);

  // Update currency symbol & reset tax when country changes
  useEffect(() => {
    if (!selectedCountry) return;

    const countryData = Country.getCountryByCode(selectedCountry);
    
    if (countryData?.currency) {
      const symbol = getSymbolFromCurrency(countryData.currency) || defaultcurrencySymbol;
      setCurrencySymbol(symbol);
    } else {
      setCurrencySymbol(defaultcurrencySymbol);
    }

    setEstimatedTax(null);
  }, [defaultcurrencySymbol, selectedCountry, setCurrencySymbol, setEstimatedTax]);

  const onSubmit = (data) => {
    const income = parseFloat(data.grossIncome || 0);
    const deductions =
      parseFloat(data.businessExpenses || 0) +
      parseFloat(data.retirementContributions || 0) +
      parseFloat(data.healthInsurancePremiums || 0) +
      parseFloat(data.homeOfficeDeduction || 0);

    const taxableIncome = Math.max(0, income - deductions);

    const countryData = Country.getCountryByCode(data.country);
    const countryName = countryData?.name || "";

    const estimated = calculateTax(countryName, taxableIncome);
    setEstimatedTax(estimated.toFixed(2));
  };

  const quarterOptions = [
    { value: "Q1(Jan-Mar2025)", label: "Q1 (Jan - Mar 2025)" },
    { value: "Q2(Apr-Jun2025)", label: "Q2 (Apr - Jun 2025)" },
    { value: "Q3(Jul-Sep2025)", label: "Q3 (Jul - Sep 2025)" },
    { value: "Q4(Oct-Dec2025)", label: "Q4 (Oct - Dec 2025)" },
  ];

  const filingStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
  ];

  const renderInput = (label, name) => (
    <div className="flex-1 min-w-0">
      <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          {currencySymbol}
        </span>
        <input
          type="number"
          {...register(name)}
          placeholder="0.00"
          style={{ paddingLeft: `${currencySymbol.length * 12 + 20}px` }} // dynamic padding left according to the symbol
          className="w-full pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm 
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
        focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue shadow-sm"
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-white p-8 rounded-2xl shadow-customShadow">
      <h2 className="text-xl font-bold mb-4 underline text-gray-800">Quarterly Tax Calculator</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Country & City */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countries}
                  placeholder="Select Country"
                  value={countries.find((c) => c.value === field.value) || null}
                  onChange={(val) => {
                    field.onChange(val.value);
                    resetField("city");
                    resetField("grossIncome");
                    resetField("businessExpenses");
                    resetField("retirementContributions");
                    resetField("healthInsurancePremiums");
                    resetField("homeOfficeDeduction");
                  }}
                />
              )}
            />
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-gray-700 text-sm font-medium mb-1">City/State</label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={stateOptions}
                  placeholder="Select City/State"
                  value={stateOptions.find((s) => s.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                  isDisabled={!selectedCountry}
                />
              )}
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>
        </div>

        {/* Filing Status & Quarter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-gray-700 text-sm font-medium mb-1">Filing Status</label>
            <Controller
              name="filingStatus"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={filingStatusOptions}
                  placeholder="Select Status"
                  value={filingStatusOptions.find((o) => o.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                />
              )}
            />
            {errors.filingStatus && <p className="text-xs text-red-500 mt-1">{errors.filingStatus.message}</p>}
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-gray-700 text-sm font-medium mb-1">Quarter</label>
            <Controller
              name="quarter"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={quarterOptions}
                  placeholder="Select Quarter"
                  value={quarterOptions.find((q) => q.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                />
              )}
            />
            {errors.quarter && <p className="text-xs text-red-500 mt-1">{errors.quarter.message}</p>}
          </div>
        </div>

        {/* Income */}
        <div className="pt-3">
          <h3 className="text-lg font-medium text-gray-800">Income</h3>
          {renderInput("Gross Income for Quarter", "grossIncome")}
        </div>

        {/* Deductions */}
        <div className="pt-3.5">
          <h3 className="text-lg font-medium text-gray-800">Deductions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput("Business Expenses", "businessExpenses")}
            {renderInput("Retirement Contributions", "retirementContributions")}
            {renderInput("Health Insurance Premiums", "healthInsurancePremiums")}
            {renderInput("Home Office Deductions", "homeOfficeDeduction")}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-customBlue rounded-lg hover:bg-blue-600 transition duration-200 hover:cursor-pointer"
          >
            Calculate Estimated Tax
          </button>
        </div>
      </form>
    </div>
  );
}
