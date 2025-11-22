import fs from "fs";
import path from "path";
import handlebars from "handlebars";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function generatePDF(
    data: Record<string, any>,
    templateName: "transaction" | "taxEstimation" = "transaction"
): Promise<Buffer> {
    try {
        //-------------------- Load Template --------------------
        const templateFile =
            templateName === "taxEstimation"
                ? "TaxEstimationReportTemplate.hbs"
                : "TransactionReportTemplete.hbs";

        const templatePath = path.join(__dirname, "../hbs", templateFile);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        const templateHtml = fs.readFileSync(templatePath, "utf8");
        const html = handlebars.compile(templateHtml)(data);

        //-------------------- Puppeteer Setup --------------------
        const executablePath =
            process.env.NODE_ENV === "production"
                ? await chromium.executablePath()
                : undefined;

        const browser = await puppeteer.launch({
            executablePath,
            args: chromium.args,
            headless: true,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        return Buffer.from(pdf);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    }
}
