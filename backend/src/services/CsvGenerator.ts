import { stringify } from "csv-stringify/sync";

function formatNumber(num: number): string {
    // Use Intl.NumberFormat for consistent formatting
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

export async function generateCSV(
    reportType: string,
    data: any[]
): Promise<Buffer> {
    // Check if data exists
    if (!data || !data.length) {
        throw new Error("No data available for CSV export");
    }

    // Remove MongoDB internal fields
    const cleanedData = data.map(row => {
        const { _id, user_id, __v, estimatedTaxFormatted, ...rest } = row;
        return rest;
    });

    // Convert numeric values to formatted strings for display in Excel
    const normalizedData = cleanedData.map(row => {
        const newRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
            if (typeof value === "number") {
                // Keep as number for Excel formulas, but store formatted string
                newRow[key] = formatNumber(value);
            } else {
                newRow[key] = value ?? "";
            }
        }
        return newRow;
    });

    // Generate CSV with headers and UTF-8 BOM for Excel
    const csv = stringify(normalizedData, { header: true });

    // Return buffer with UTF-8 BOM
    return Buffer.from("\uFEFF" + csv, "utf8");
}