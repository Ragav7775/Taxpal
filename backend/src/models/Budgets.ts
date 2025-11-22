import mongoose from "mongoose";
import TaxPal_DB from "../mongodb/DBConnection";


const BudgetSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserId",
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    budget_amount: {
        type: Number,
        required: true,
        min: 0, // Spending limit must be positive
    },
    spent_amount: {
        type: Number,
        min: 0,
    },
    remaining_amount: {
        type: Number,
    },
    month: {
        type: String, // Example: "2025-08" (YYYY-MM format)
        required: true,
        match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid month format"],
    },
    description: {
        type: String
    }
});


const Budget = TaxPal_DB.model("Budgets", BudgetSchema);

export default Budget;
