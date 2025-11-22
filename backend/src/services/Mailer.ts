import nodemailer from "nodemailer";
import { compile } from "handlebars";
import fs from "fs";
import path from "path";


const TO_GMAIL = process.env.TAXPAL_TEAM3_GMAIL!
const GMAIL_APP_PASSWORD = process.env.TAXPAL_TEAM3_GMAIL_APP_PASSWORD!

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: TO_GMAIL,
        pass: GMAIL_APP_PASSWORD,
    },
});


// Load the user-notification template
const OtpTemplatePath = path.join(__dirname, "../hbs/ForgotPasswordOtpTemplet.hbs");
const OtpTemplateSource = fs.readFileSync(OtpTemplatePath, "utf8");
const OtpTemplate = compile(OtpTemplateSource);



export const sendOtpEmailToUser = async (
    Otp: number,
    UserEmail: string
) => {
    try {

        const htmlContent = OtpTemplate({
            Otp,
            UserEmail,
            year: "2025"
        });

        const mailOptions = {
            from: `"Taxpal Team-3" <${TO_GMAIL}>`,
            to: UserEmail,
            subject: `✔️ TaxPal Otp Verification`,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Failed to send Otp via email:", error);
        return
    }
};