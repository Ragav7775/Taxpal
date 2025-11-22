import Select from "react-select";

const FORMAT_OPTIONS = ["PDF", "DOCX", "CSV", "XLSX"];

export default function ReportGenerator({
  reportType,
  setReportType,
  periodOption,
  setPeriodOption,
  format,
  setFormat,
  periodOptions,
  handleGenerate,
  isGenerating,
  handleReset,
}) {
  const REPORT_TYPES = [
    "Income Statement",
    "Expense Breakdown",
    "Transaction Detail Export",
    "Quarterly Tax Estimate",
    "Annual Tax Summary",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Generate New Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          options={REPORT_TYPES.map((rt) => ({ value: rt, label: rt }))}
          value={reportType ? { value: reportType, label: reportType } : null}
          onChange={(opt) => setReportType(opt.value)}
          placeholder="Select Report Type"
        />

        <Select
          options={periodOptions.map((p) => ({ value: p, label: p }))}
          value={periodOption ? { value: periodOption, label: periodOption } : null}
          onChange={(opt) => setPeriodOption(opt.value)}
          placeholder="Select Period"
          isDisabled={!reportType}
        />

        <Select
          options={FORMAT_OPTIONS.map((f) => ({ value: f, label: f }))}
          value={format ? { value: format, label: format } : null}
          onChange={(opt) => setFormat(opt.value)}
          placeholder="Select Format"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 border transition duration-300 border-gray-300 hover:bg-gray-300 hover:cursor-pointer"
          onClick={handleReset}
          disabled={isGenerating}
        >
          Reset
        </button>

        <button
          onClick={handleGenerate}
          className={`px-6 py-3 rounded-lg font-semibold text-white hover:cursor-pointer transition duration-300 ${
            isGenerating ? "bg-customBlue/90 cursor-not-allowed" : "bg-customBlue hover:bg-blue-600"
          }`}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </div>
  );
}
