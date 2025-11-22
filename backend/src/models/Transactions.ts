import mongoose from "mongoose";
import TaxPal_DB from "../mongodb/DBConnection";


const TransactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserId",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["INCOME", "EXPENSE"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        match: [/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, "Invalid date format"], // YYYY-MM-DD
    },
    amount: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    }
});

const Transaction = TaxPal_DB.model("Transactions", TransactionSchema);

export default Transaction;