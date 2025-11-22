import { useRef } from "react";
import { FaDownload, FaFileAlt, FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";

const ReportPreview = ({ onBack, reportData }) => {
    const { name, report_Url, report_Format, report_Period } = reportData || {};
    const isReportSelected = !!reportData;
    const pdfRef = useRef(null);

    const handleDownload = () => {
        if (!isReportSelected || !report_Url) {
            toast.error("Download URL not available");
            return;
        }

        if (report_Format === "PDF") {
            window.open(report_Url, "_blank");
        } else {
            // Force download for DOCX, XLSX, CSV
            const link = document.createElement("a");
            link.href = report_Url;
            link.download = `${name}.${report_Format.toLowerCase()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Downloading ${name} as ${report_Format}`);
        }
    };

    const actionButtonClass = "flex items-center space-x-2 px-6 py-2 rounded-lg shadow-md font-semibold transition-colors duration-200";
    const disabledButtonClass = "opacity-50 cursor-not-allowed";

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-4 text-black">
                    <button
                        onClick={onBack}
                        className="p-2 text-black hover:text-customBlue hover:cursor-pointer transition-colors rounded-full"
                        title="Go Back"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold">
                        Report Preview: {isReportSelected ? name : "Loading..."}
                    </h2>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleDownload}
                        disabled={!isReportSelected || !report_Url}
                        className={`${actionButtonClass} bg-blue-600 text-white hover:bg-blue-700 ${!isReportSelected ? disabledButtonClass : ""
                            }`}
                    >
                        <FaDownload /> <span>Download</span>
                    </button>
                </div>
            </div>

            {/* Report Preview */}
            {isReportSelected ? (
                <div className="w-full flex-1">
                    <div className="text-center mb-2">
                        <h3 className="text-2xl font-bold">{name}</h3>
                        <p className="text-sm text-gray-600">
                            Period: {report_Period} | Format: {report_Format}
                        </p>
                    </div>

                    {report_Format === "PDF" ? (
                        <iframe
                            ref={pdfRef}
                            src={report_Url}
                            title={name}
                            className="w-full h-[calc(100vh-130px)] border rounded shadow"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 border rounded p-6">
                            <FaFileAlt size={64} className="mb-4 text-gray-300" />
                            <p className="font-medium mb-1">
                                Preview not supported for {report_Format} files.
                            </p>
                            <p className="text-sm mb-2">
                                Click Download to open this report in its native application.
                            </p>
                            <button
                                onClick={handleDownload}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Download {report_Format}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center border rounded p-6">
                    <FaFileAlt size={64} className="mb-4 text-gray-300" />
                    <p className="text-xl font-medium mb-1">Select a Report to Preview</p>
                    <p className="text-sm">
                        Generated reports will appear here for review before downloading
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReportPreview;
