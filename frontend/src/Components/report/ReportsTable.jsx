import { FaEye, FaDownload, FaFileAlt, FaTrash } from "react-icons/fa";

export default function ReportsTable({ reports, onPreview, onDelete, onDownload }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border-spacing-0">
                    <thead>
                        <tr className="border-b-2 border-gray-300 bg-gray-50">
                            {["Report Type", "Generated", "Period", "Format", "Actions"].map((h) => (
                                <th
                                    key={h}
                                    className="w-1/5 px-6 text-center py-3 text-xs font-bold text-gray-600 uppercase tracking-wider align-middle"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((r, i) => (
                                <tr key={r._id || i} className="border-t border-gray-200 hover:bg-blue-50/50">
                                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900 align-middle">
                                        {r.report_Type || "Untitled Report"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700 align-middle">
                                        {r.period ? new Date(r.period).toLocaleString() : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700 align-middle">
                                        {r.report_Period || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700 align-middle">
                                        {r.report_Format || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        <div className="flex items-center justify-between space-x-3">
                                            <button
                                                onClick={() => onPreview(r)}
                                                className="p-1 rounded hover:bg-blue-200 text-customBlue hover:cursor-pointer transition duration-300"
                                                title="Preview"
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDownload(r)}
                                                className="p-1 rounded hover:bg-blue-200 text-customBlue hover:cursor-pointer transition duration-300"
                                                title="Download"
                                            >
                                                <FaDownload size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(r)}
                                                className="p-1 rounded hover:bg-red-200 text-customRed hover:cursor-pointer transition duration-300"
                                                title="Delete"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 align-middle">
                                    <FaFileAlt size={40} className="mx-auto mb-3 text-gray-300" />
                                    <p className="font-semibold text-gray-600">No Recent Reports</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Generate your first report using the controls above.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
