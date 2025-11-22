import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import ReportGenerator from "../Components/report/ReportGenerator";
import ReportsTable from "../Components/report/ReportsTable";
import ReportPreviewPage from "../Components/report/ReportPreview";

import { FetchReportsRecords, CreateNewReport, DeleteReportsData } from "../api/ReportApi";
import DeleteConfirmationDialogBox from "../Components/ui/dialog-box/DeleteConfirmationDialogBox";


const PERIOD_MAP = {
  "Income Statement": [
    "Current Month",
    "Last Month",
    "Current Quarter",
    "Last Quarter",
    "Current Year",
    "Last Year",
  ],
  "Expense Breakdown": [
    "Current Month",
    "Last Month",
    "Current Quarter",
    "Last Quarter",
    "Current Year",
    "Last Year",
  ],
  "Transaction Detail Export": [
    "Current Month",
    "Last Month",
    "Current Quarter",
    "Last Quarter",
    "Current Year",
    "Last Year",
  ],
  "Quarterly Tax Estimate": [
    "Q1(Jan-Mar)",
    "Q2(Apr-Jun)",
    "Q3(Jul-Sep)",
    "Q4(Oct-Dec)",
  ],
  "Annual Tax Summary": ["Current Year", "Last Year"],
};


export default function ReportsPage() {
    const [reportType, setReportType] = useState(null);
    const [periodOption, setPeriodOption] = useState(null);
    const [format, setFormat] = useState(null);
    const [reports, setReports] = useState([]);
    const [previewReport, setPreviewReport] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [deletingReport, setDeletingReport] = useState(null);


    const periodOptions = useMemo(() => {
        return reportType ? PERIOD_MAP[reportType] || [] : [];
    }, [reportType]);

    const fetchReports = async () => {
        try {
            const response = await FetchReportsRecords();
            const fetchedReports =
                (response?.reports && Array.isArray(response.reports) && response.reports) ||
                (response?.data?.reports && Array.isArray(response.data.reports) && response.data.reports) ||
                (Array.isArray(response) ? response : []);
            setReports(fetchedReports.length ? fetchedReports : []);
        } catch (err) {
            console.error("❌ Error fetching reports:", err);
            toast.error("Failed to fetch reports");
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerate = async () => {
        if (!reportType || !periodOption || !format) {
            toast.info("Please select Report Type, Period, and Format");
            return;
        }
        setIsGenerating(true);
        try {
            const payload = { reportType, period: periodOption, format };
            const resp = await CreateNewReport({ ReportData: payload });
            const status = resp?.status;
            const message = resp?.data?.message || resp?.message || "Something went wrong";

            if (status === 201) {
                toast.success("Report generated successfully");
                await fetchReports();
            } else if (status === 200 && message.includes("No data found")) {
                toast.info("No data found for the selected criteria");
            } else {
                toast.error(message || "Failed to generate report");
            }
        } catch (err) {
            console.error("❌ Create report error:", err);
            const msg = err?.response?.data?.message;
            toast.error(msg || "Error generating report");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (report) => {
        try {
            await DeleteReportsData({ report_Url: report.report_Url });
            toast.success("Report deleted successfully");
            fetchReports();
        } catch (err) {
            console.error("❌ Delete error:", err);
            toast.error(err?.response?.data?.message || "Error deleting report");
        }
    };

    const handleDownload = (report) => {
        if (!report?.report_Url) {
            toast.error("Download URL not available");
            return;
        }
        if (report.report_Format === "PDF") {
            window.open(report.report_Url, "_blank");
            toast.success(`Opening ${report.report_Type} as PDF`);
        } else {
            const link = document.createElement("a");
            link.href = report.report_Url;
            link.download = `${report.report_Type}.${report.report_Format.toLowerCase()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Downloading ${report.report_Type} as ${report.report_Format}`);
        }
    };

  if (previewReport) {
      return (
          <ReportPreviewPage
              reportData={previewReport}
              onBack={() => setPreviewReport(null)}
              onDownload={() => handleDownload(previewReport)}
          />
      );
    };

    return (
        <div className="flex-1 p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Generate and manage your financial documents.</p>

            <ReportGenerator
                reportType={reportType}
                setReportType={setReportType}
                periodOption={periodOption}
                setPeriodOption={setPeriodOption}
                format={format}
                setFormat={setFormat}
                periodOptions={periodOptions}
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
                handleReset={() => {
                    setReportType(null);
                    setPeriodOption(null);
                    setFormat(null);
                }}
            />

            <ReportsTable
                reports={reports}
                onPreview={setPreviewReport}
                onDownload={handleDownload}
                onDelete={(report) => setDeletingReport(report)}
            />

            {deletingReport && (
                <DeleteConfirmationDialogBox
                    title="Delete Report"
                    message={`Are you sure you want to permanently delete this report? This action cannot be undone.`}
                    resourceName={deletingReport.report_Type}
                    onDelete={async () => {
                        await handleDelete(deletingReport);
                        setDeletingReport(null);
                    }}
                    onClose={() => setDeletingReport(null)}
                    onSuccess={fetchReports}
                />
            )}

        </div>
    );
};
