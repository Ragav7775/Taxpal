import { FormatAmountWithName, FormatAmountWithSymbol } from "./FormatCountryCurrency";


const quarterlyDuration = ["Q1(Jan-Mar)", "Q2(Apr-Jun)", "Q3(Jul-Sep)", "Q4(Oct-Dec)"];


// Calculate start and end dates based on period
export const getPeriodRange = (period: string) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    let quarterLabel = "";

    switch (period) {
        case "Current Month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case "Last Month":
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case "Current Quarter": {
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
            quarterLabel = quarterlyDuration[quarter];
            break;
        }
        case "Last Quarter": {
            let quarter = Math.floor(now.getMonth() / 3) - 1;
            const year = quarter >= 0 ? now.getFullYear() : now.getFullYear() - 1;
            quarter = quarter >= 0 ? quarter : 3;
            startDate = new Date(year, quarter * 3, 1);
            endDate = new Date(year, quarter * 3 + 3, 0);
            quarterLabel = quarterlyDuration[quarter];
            break;
        }
        case "Current Year":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
        case "Last Year":
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31);
            break;
        default: {
            const quarterIndex = quarterlyDuration.indexOf(period);
            if (quarterIndex >= 0) {
                startDate = new Date(now.getFullYear(), quarterIndex * 3, 1);
                endDate = new Date(now.getFullYear(), quarterIndex * 3 + 3, 0);
                quarterLabel = quarterlyDuration[quarterIndex];
            } else {
                throw new Error(`Invalid period: ${period}`);
            }
            break;
        }
    }

    return { startDate, endDate, quarterLabel };
};

// Format numbers safely
export const displayNumber = (num: any): number => {
    if (num === null || num === undefined) return 0;
    if (typeof num === "number") return Number(num.toFixed(2));
    const n = parseFloat(num.toString().replace(/,/g, ""));
    return isNaN(n) ? 0 : Number(n.toFixed(2));
};

// Aggregate transactions by category
export const aggregateTransactions = (transactions: any[], userCountry: string) => {
    const categoryTotals: Record<string, number> = {};
    transactions.forEach(tx => categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount);

    const formattedCategoryTotals: Record<string, string> = {};
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
        formattedCategoryTotals[cat] = FormatAmountWithName(amt, userCountry);
    });

    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const formattedTransactions = transactions.map(tx => ({
        ...tx,
        amount: FormatAmountWithName(tx.amount, userCountry),
    }));

    return { categoryTotals: formattedCategoryTotals, total: FormatAmountWithName(total, userCountry), formattedTransactions };
};

// Aggregate tax estimations
export const aggregateTaxes = (taxEstimations: any[], userCountry: string) => {
    const symbolCount: Record<string, number> = {};
    taxEstimations.forEach(t => {
        const sym = t.currencySymbol || "₹";
        symbolCount[sym] = (symbolCount[sym] || 0) + 1;
    });

    const majoritySymbol = Object.keys(symbolCount).reduce((a, b) => symbolCount[a] > symbolCount[b] ? a : b, "₹");

    let pending = 0, completed = 0, overdue = 0;
    taxEstimations.forEach((t: any) => {
        const amountNum = Number(t.estimatedTax.toString().replace(/,/g, "")) || 0;
        t.estimatedTaxFormatted = FormatAmountWithName(t.estimatedTax, userCountry);
        if (t.status === "Pending") pending += amountNum;
        if (t.status === "Completed") completed += amountNum;
        if (t.status === "Overdue") overdue += amountNum;
    });

    return {
        taxEstimations,
        pendingTax: FormatAmountWithSymbol(pending, majoritySymbol),
        completedTax: FormatAmountWithSymbol(completed, majoritySymbol),
        overdueTax: FormatAmountWithSymbol(overdue, majoritySymbol),
        totalDueTax: FormatAmountWithSymbol(pending + overdue, majoritySymbol),
        totalTax: FormatAmountWithSymbol(pending + completed + overdue, majoritySymbol),
        currencySymbol: majoritySymbol
    };
};