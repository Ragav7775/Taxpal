import { Request, Response } from "express";
import Budget from "../models/Budgets";
import Transaction from "../models/Transactions";


const CreateUserBudget = async (req: Request, res: Response) => {
    try {
        const { category, budget_amount, month, description } = req.body;
        const userID = req.userID;

        if (!category || !budget_amount || !month) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        // Since Transaction.date is YYYY-MM-DD string, we can use regex to match the month
        const monthRegex = new RegExp(`^${month}`); // matches strings starting with YYYY-MM

        const existingExpenses = await Transaction.find({
            user_id: userID,
            type: "EXPENSE",
            category: category,
            date: { $regex: monthRegex },
        });

        let spentAmount = 0;
        let remainingAmount = Number(budget_amount);

        if (existingExpenses.length > 0) {
            // Sum all previous expenses
            spentAmount = existingExpenses.reduce(
                (sum, txn) => sum + Number(txn.amount),
                0
            );
            remainingAmount = Math.max(Number(budget_amount) - spentAmount, 0);
        }

        // Step 2: Create the budget
        const newUserBudget = new Budget({
            user_id: userID,
            category,
            budget_amount,
            month,
            spent_amount: spentAmount,
            remaining_amount: remainingAmount,
            ...(description && { description }),
        });

        await newUserBudget.save();

        return res.status(201).json({ message: "Budget Created successfully" });
    } catch (error) {
        console.error("❌ Error in RegisterBudget:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const FetchUserBudgetRecords = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Fetch budgets from DB
        const budgets = await Budget.find({ user_id: userID }).sort({ month: -1 });

        return res.status(200).json({ budgets });
    } catch (error) {
        console.error("❌ Error fetching user budgets:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const UpdateUserBudget = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { category, budget_amount, month, description } = req.body;
        const userID = req.userID;

        if (!id) {
            return res.status(400).json({ message: "Budget ID is required" });
        }

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        // Find budget belonging to this user
        const budget = await Budget.findOne({ _id: id, user_id: userID });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        // Update fields
        if (category) budget.category = category;
        if (budget_amount !== undefined) budget.budget_amount = budget_amount;
        if (month) budget.month = month;
        if (description !== undefined) budget.description = description;

        // If spent_amount is already set, recalc remaining
        const spent = budget.spent_amount ?? 0;
        budget.remaining_amount = budget.budget_amount - spent;

        await budget.save();

        return res.status(200).json({
            message: "Budget updated successfully",
            budget,
        });
    } catch (error) {
        console.error("❌ Error in UpdateBudget:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const DeleteUserBudget = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userID = req.userID;

        if (!id) {
            return res.status(400).json({ message: "Budget ID is required" });
        }

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        const budget = await Budget.findOneAndDelete({ _id: id, user_id: userID });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found or not authorized" });
        }

        return res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        console.error("❌ Error in DeleteBudget:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export default {
    CreateUserBudget,
    FetchUserBudgetRecords,
    UpdateUserBudget,
    DeleteUserBudget
};