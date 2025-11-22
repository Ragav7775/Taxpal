import mongoose from "mongoose";
import TaxPal_DB from "../mongodb/DBConnection";

const TaxEstimkationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserId",
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Overdue"],
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    currencySymbol: {
        type: String,
    },
    estimatedTax: {
        type: Number,
        required: true
    }
});

const TaxEstimation = TaxPal_DB.model("TaxEstimations", TaxEstimkationSchema);

export default TaxEstimation;

