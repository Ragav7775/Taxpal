import ExcelJS from "exceljs";

export async function generateXLSX(
    reportType: string,
    data: any[]
): Promise<Buffer> {
    // Check if data exists
    if (!data || !data.length) {
        throw new Error("No data available for XLSX export");
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(reportType);

    const cleanedData = data.map(row => {
        const { _id, user_id, __v, estimatedTaxFormatted, ...rest } = row;
        return rest;
    });

    const headers = Object.keys(cleanedData[0]);
    const headerRow = sheet.addRow(headers);

    headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF333333" } };
    });

    // Add data rows
    cleanedData.forEach(row => {
        const values = headers.map(h => {
            const val = row[h];
            if (typeof val === "number") return val; // store as number
            return val ?? "";
        });
        const excelRow = sheet.addRow(values);

        // Apply comma format to numeric cells
        values.forEach((val, idx) => {
            if (typeof val === "number") {
                const cell = excelRow.getCell(idx + 1);
                cell.numFmt = "#,##0.00"; // Excel shows commas with 2 decimals
            }
        });
    });

    // Auto-fit column widths
    if (sheet.columns && Array.isArray(sheet.columns) && sheet.columns.length > 0) {
        sheet.columns.forEach(col => {
            if (!col) return; // skip if column is null
            let maxLength = 10;
            // Check if eachCell exists and is a function
            if (typeof col.eachCell === "function") {
                col.eachCell({ includeEmpty: true }, cell => {
                    // Some cells may be null
                    const cellValue = cell?.value != null ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, cellValue.length);
                });
            }
            col.width = maxLength + 4; // add some padding
        });
    }

    // Return buffer instead of writing to file
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}