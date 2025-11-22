import mongoose from "mongoose";
import TaxPal_DB from "../mongodb/DBConnection";



const CategoryData = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    category_color: {
        type: String,
        required: true
    }
});



const UserCategoryData = new mongoose.Schema({
    incomeCategories: {
        type: [CategoryData],
        default: [
            { category_name: "Salary", category_color: "#54c947" },
            { category_name: "Freelance", category_color: "#f64949" },
            { category_name: "Investment", category_color: "#E8C547" },
            { category_name: "Rental Income", category_color: "#60A2D5" },
            { category_name: "Gift", category_color: "#FF4500" },
            { category_name: "Other", category_color: "#894BCA" }
        ]
    },
    expenseCategories: {
        type: [CategoryData],
        default: [
            { category_name: "Groceries", category_color: "#54c947" },
            { category_name: "Food", category_color: "#f64949" },
            { category_name: "Rent", category_color: "#E8C547" },
            { category_name: "Utilities", category_color: "#60A2D5" },
            { category_name: "Transportation", category_color: "#FF4500" },
            { category_name: "Other", category_color: "#894BCA" }
        ]
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserId"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    income_bracket: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"]
    },
    ForgotPassword_OTP: {
        type: String,
    },
    category: {
        type: UserCategoryData,
        default: () => ({}) // ensures defaults are applied
    }
});

const User = TaxPal_DB.model("user-data", userSchema);

export default User;