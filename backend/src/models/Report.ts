import mongoose from "mongoose";
import TaxPal_DB from "../mongodb/DBConnection";


const ReportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserId",
        required: true,
    },
    period: {
        type: Date,
        required: true
    },
    report_Type: {
        type: String,
        required: true
    },
    report_Period: {
        type: String,
        required: true
    },
    report_Format: {
        type: String,
        required: true
    },
    report_Url: {
        type: String,
        required: true
    },
    report_QuarterlyDuration: {
        type: String,
    }
});


const Report = TaxPal_DB.model("Reports", ReportSchema);

export default Report;