import { Request, Response } from "express";
import User from "../models/user";
import TaxEstimation from "../models/TaxEstimation";
import Transaction from "../models/Transactions";
import Report from "../models/Report";
import { generatePDF } from "../services/PdfGenerator";
import { generateCSV } from "../services/CsvGenerator";
import { generateXLSX } from "../services/ExcelGenerator";
import { generateDOCX } from "../services/DocxGenerator";
import { deleteFromCloudinary, extractCloudinaryPublicId, isValidCloudinaryUrl, uploadDocumentToCloudinary, uploadPdfToCloudinary } from "../utils/cloudinaryUtils";
import { getCurrencySymbolByCountryName } from "../utils/GetCurrencySymbol";
import { FormatAmountWithName } from "../utils/FormatCountryCurrency";
import { aggregateTaxes, aggregateTransactions, displayNumber, getPeriodRange } from "../utils/ReportUtils";



const CreateUserReport = async (req: Request, res: Response) => {
    try {
        const { ReportData } = req.body;
        const { reportType, period, format } = ReportData;
        const userID = req.userID;

        if (!reportType || !period || !format) return res.status(400).json({ message: "reportType, period, and format are required" });
        if (!userID) return res.status(400).json({ message: "UserID not found" });


        const user = await User.findById(userID).lean();
        if (!user) return res.status(404).json({ message: "User not found" });

        const { startDate, endDate, quarterLabel } = getPeriodRange(period);
        const currencySymbol = getCurrencySymbolByCountryName(user.country);

        let reportData: Record<string, any> = {
            period: period + (quarterLabel ? ` - ${quarterLabel}` : ""),
            generatedOn: new Date().toLocaleDateString(),
            income: [],
            expense: [],
            taxEstimations: [],
            currencySymbol,
        };

        let templateName: "transaction" | "taxEstimation" = "transaction";

        // ------------------ Fetch & Process Report Data ------------------
        if (["Income Statement", "Expense Breakdown", "Transaction Detail Export"].includes(reportType)) {
            const filter: any = { user_id: userID, date: { $gte: startDate.toISOString().slice(0, 10), $lte: endDate.toISOString().slice(0, 10) } };
            if (reportType === "Income Statement") filter.type = "INCOME";
            if (reportType === "Expense Breakdown") filter.type = "EXPENSE";

            const transactions = await Transaction.find(filter).lean();

            // Check if no data found
            if (!transactions || transactions.length === 0) {
                return res.status(200).json({ message: "No data found for the selected criteria" });
            }

            if (reportType === "Transaction Detail Export") {
                reportData.income = transactions.filter(t => t.type === "INCOME");
                reportData.expense = transactions.filter(t => t.type === "EXPENSE");
            } else if (reportType === "Income Statement") {
                reportData.income = transactions;
            } else {
                reportData.expense = transactions;
            }
        } else {
            templateName = "taxEstimation";
            const taxFilter = {
                user_id: userID,
                dueDate: { $gte: startDate.toISOString().slice(0, 10), $lte: endDate.toISOString().slice(0, 10) },
            };

            const taxEstimations = await TaxEstimation.find(taxFilter).lean();

            // Check if no data found
            if (!taxEstimations || taxEstimations.length === 0) {
                return res.status(200).json({ message: "No data found for the selected criteria" });
            }

            taxEstimations.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
            Object.assign(reportData, aggregateTaxes(taxEstimations, user.country));
        }

        // ------------------ Aggregate Transactions ------------------
        if (reportData.income?.length) {
            const { categoryTotals, total, formattedTransactions } = aggregateTransactions(reportData.income, user.country);
            reportData.incomeCategoryTotals = categoryTotals;
            reportData.totalIncome = total;
            reportData.income = formattedTransactions;
        }

        if (reportData.expense?.length) {
            const { categoryTotals, total, formattedTransactions } = aggregateTransactions(reportData.expense, user.country);
            reportData.expenseCategoryTotals = categoryTotals;
            reportData.totalExpense = total;
            reportData.expense = formattedTransactions;
        }

        // Net profit/loss
        if (reportData.totalIncome !== undefined && reportData.totalExpense !== undefined) {
            const netProfitLossNum =
                Number(reportData.totalIncome.toString().replace(/,/g, "")) -
                Number(reportData.totalExpense.toString().replace(/,/g, ""));
            reportData.netProfitLoss = FormatAmountWithName(netProfitLossNum, user.country);
        }

        // ------------------ Prepare Export Data ------------------
        let dataForExport: any[] = [];

        // Use helper to prepare transaction or tax data for export
        const prepareDataForExport = async () => {
            if (reportType === "Income Statement") {
                const data = reportData.income.map((tx: any) => ({
                    description: tx.description,
                    category: tx.category,
                    date: tx.date,
                    currencySymbol,
                    amount: displayNumber(tx.amount),
                }));
                const categoryTotals: Record<string, number> = {};
                data.forEach((tx: any) => categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount);
                data.push({}, {});
                Object.entries(categoryTotals).forEach(([cat, amt]) => data.push({ description: "", category: "", date: `${cat} Total`, currencySymbol, amount: displayNumber(amt) }));
                data.push({ description: "", category: "", date: "Overall Total Income", currencySymbol, amount: displayNumber(reportData.totalIncome) });
                return data;
            }

            if (reportType === "Expense Breakdown") {
                const data = reportData.expense.map((tx: any) => ({
                    description: tx.description,
                    category: tx.category,
                    date: tx.date,
                    currencySymbol,
                    amount: displayNumber(tx.amount),
                }));
                const categoryTotals: Record<string, number> = {};
                data.forEach((tx: any) => categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount);
                data.push({}, {});
                Object.entries(categoryTotals).forEach(([cat, amt]) => data.push({ description: "", category: "", date: `${cat} Total`, currencySymbol, amount: displayNumber(amt) }));
                data.push({ description: "", category: "", date: "Overall Total Expense", currencySymbol, amount: displayNumber(reportData.totalExpense) });
                return data;
            }

            if (reportType === "Transaction Detail Export") {
                const data = [...reportData.income, ...reportData.expense].map(tx => ({
                    description: tx.description,
                    category: tx.category,
                    type: tx.type,
                    date: tx.date,
                    currencySymbol,
                    amount: displayNumber(tx.amount),
                }));
                const categoryTotals: Record<string, number> = {};
                data.forEach(tx => {
                    const key = `${tx.type}-${tx.category}`;
                    categoryTotals[key] = (categoryTotals[key] || 0) + tx.amount;
                });
                data.push({
                    description: "",
                    category: "",
                    type: "",
                    date: "",
                    currencySymbol,
                    amount: 0
                });
                Object.entries(categoryTotals).forEach(([cat, amt]) => {
                    data.push({
                        description: "",
                        category: "",
                        type: "",
                        date: `${cat} Total`,
                        currencySymbol,
                        amount: displayNumber(amt)
                    });
                });
                const netProfit = displayNumber(
                    Number(reportData.totalIncome?.toString().replace(/,/g, "")) -
                    Number(reportData.totalExpense?.toString().replace(/,/g, ""))
                );
                data.push({
                    description: "", category: "", date: "Net Profit/Loss", currencySymbol, amount: netProfit,
                    type: ""
                });
                return data;
            }

            if (["Quarterly Tax Estimate", "Annual Tax Summary"].includes(reportType)) {
                const data = [...reportData.taxEstimations];
                data.push({}, {});
                const totalsMap: Record<string, any> = {
                    "Pending Total": reportData.pendingTax,
                    "Completed Total": reportData.completedTax,
                    "Overdue Total": reportData.overdueTax,
                    "Total Due Tax": reportData.totalDueTax,
                    "Overall Total Tax": reportData.totalTax,
                };
                Object.entries(totalsMap).forEach(([label, val]) => data.push({
                    dueDate: label,
                    currencySymbol: reportData.currencySymbol,
                    estimatedTax: displayNumber(val),
                }));
                return data;
            }

            return [];
        };

        dataForExport = await prepareDataForExport();

        // ------------------ Generate Report and Upload to Cloudinary ------------------
        const fileName = `${reportType.replace(/\s+/g, "_")}-${Date.now()}`;
        let fileBuffer: Buffer;
        let cloudinaryUrl: string;

        try {
            if (format === "PDF") {
                fileBuffer = await generatePDF(reportData, templateName);
                const uploadResult = await uploadPdfToCloudinary(fileBuffer, `${fileName}.pdf`, "Taxpal-Reports");
                cloudinaryUrl = uploadResult.secure_url;
            } else if (format === "DOCX") {
                fileBuffer = await generateDOCX(reportData, templateName);
                const uploadResult = await uploadDocumentToCloudinary(fileBuffer, `${fileName}.docx`, "Taxpal-Reports");
                cloudinaryUrl = uploadResult.secure_url;
            } else if (format === "CSV") {
                fileBuffer = await generateCSV(reportType, dataForExport);
                const uploadResult = await uploadDocumentToCloudinary(fileBuffer, `${fileName}.csv`, "Taxpal-Reports");
                cloudinaryUrl = uploadResult.secure_url;
            } else if (format === "XLSX") {
                fileBuffer = await generateXLSX(reportType, dataForExport);
                const uploadResult = await uploadDocumentToCloudinary(fileBuffer, `${fileName}.xlsx`, "Taxpal-Reports");
                cloudinaryUrl = uploadResult.secure_url;
            } else {
                return res.status(400).json({ message: "Invalid format" });
            }

            // ------------------ Save Report Details to MongoDB ------------------
            const newReport = new Report({
                user_id: userID,
                period: new Date(),
                report_Type: reportType,
                report_Period: period + (quarterLabel ? ` - ${quarterLabel}` : ""),
                report_Format: format,
                report_Url: cloudinaryUrl,
                report_QuarterlyDuration: quarterLabel || undefined,
            });

            await newReport.save();

            return res.status(201).json({
                message: `${format} generated and uploaded successfully`,
                Report: {
                    period: newReport.period,
                    report_Type: newReport.report_Type,
                    report_Period: newReport.report_Period,
                    report_Format: newReport.report_Format,
                    report_Url: newReport.report_Url,
                    report_QuarterlyDuration: newReport.report_QuarterlyDuration ? newReport.report_QuarterlyDuration : "",
                }
            });

        } catch (uploadError) {
            console.error("❌ Error uploading to Cloudinary:", uploadError);
            return res.status(500).json({ message: "Error uploading file to cloud storage" });
        }

    } catch (error) {
        console.error("❌ Error in CreateUserReport:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const FetchUserReports = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const reports = await Report.find({ user_id: userID }).sort({ createdAt: -1 });

        return res.status(200).json({ reports });
    } catch (error) {
        console.error("❌ Error fetching user reports:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const DeleteUserReport = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;
        const { report_Url } = req.body;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!report_Url) {
            return res.status(400).json({ message: "report_Url is required" });
        }

        // Validate Cloudinary URL format
        if (!isValidCloudinaryUrl(report_Url)) {
            return res.status(400).json({ message: "Invalid Cloudinary URL format" });
        }

        const existingReport = await Report.findOne({
            user_id: userID,
            report_Url: report_Url
        });

        if (!existingReport) {
            return res.status(404).json({ message: "Report not found or you don't have permission to delete this report" });
        }

        // Extract Cloudinary public ID from URL
        const publicId = extractCloudinaryPublicId(report_Url);

        if (!publicId) {
            console.error('Failed to extract public ID from URL:', report_Url);
            return res.status(400).json({ success: false, message: "Unable to process Cloudinary URL" });
        }

        // Delete from Cloudinary first
        const cloudinaryDeleted = await deleteFromCloudinary(publicId, 'raw');

        if (!cloudinaryDeleted) {
            console.error('Failed to delete file from Cloudinary');
            return res.status(500).json({ message: "Failed to delete file from cloud storage" });
        }

        // Delete from MongoDB
        const deletedReport = await Report.findOneAndDelete({
            _id: existingReport._id,
            user_id: userID
        });

        if (!deletedReport) {
            return res.status(500).json({ message: "Report partially deleted. Please contact support." });
        }

        return res.status(200).json({ success: true, message: "Report deleted successfully", });

    } catch (error: any) {
        console.error("Error deleting report:", error);

        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid report identifier"
            });
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




export default {
    CreateUserReport,
    FetchUserReports,
    DeleteUserReport
};