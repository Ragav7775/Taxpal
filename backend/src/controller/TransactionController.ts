import { Request, Response } from "express";
import Transaction from "../models/Transactions";
import Budget from "../models/Budgets";


const Create_Income_Expense_Record = async (req: Request, res: Response) => {
    try {
        const { description, type, category, amount, date, notes } = req.body;
        const userID = req.userID;

        if (!description || !type || !category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        // Create new transaction
        const newTransactionData = new Transaction({
            user_id: userID,
            description,
            type,
            category,
            amount,
            date,
            ...(notes && { notes }),
        });

        await newTransactionData.save();

        // If EXPENSE → update corresponding budget
        if (type === "EXPENSE") {
            // Convert expense date to YYYY-MM format
            const expenseMonth = new Date(date).toISOString().slice(0, 7);

            // Find matching budget
            const budget = await Budget.findOne({
                user_id: userID,
                month: expenseMonth,
                category: category,
            });

            if (budget) {
                // Update spent and remaining
                const newSpent = (budget.spent_amount || 0) + Number(amount);
                const newRemaining = budget.budget_amount - newSpent;

                budget.spent_amount = newSpent;
                budget.remaining_amount = newRemaining >= 0 ? newRemaining : 0;

                await budget.save();
            } else {
                console.warn(
                    `⚠️ No budget found for user=${userID}, month=${expenseMonth}, category=${category}`
                );
            }
        }

        return res.status(201).json({ message: "Transaction Created successfully" });
    } catch (error) {
        console.error("❌ Error in RegisterTransaction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const Get_Recent_Transactions = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        // Fetch recent 10 transactions sorted by date (newest first)
        const transactions = await Transaction.find({ user_id: userID })
            .sort({ date: -1 })  // descending order by date
            .limit(10);

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("❌ Error in Get_Recent_Transactions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const Get_All_Transactions = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        const transactions = await Transaction.find({ user_id: userID })
            .sort({ date: -1 }); // No .limit() here

        return res.status(200).json(transactions);

    } catch (error) {
        console.error("❌ Error in Get_All_Transactions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const Update_Income_Expense_Record = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            updatedDescription,
            updatedType,
            updatedCategory,
            updatedAmount,
            updatedDate,
            notes,
        } = req.body;
        const userID = req.userID;

        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        if (!updatedDescription || !updatedType || !updatedCategory || !updatedAmount || !updatedDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find transaction
        const transaction = await Transaction.findOne({ _id: id, user_id: userID });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Store old values for budget adjustment
        const oldAmount = transaction.amount;
        const oldType = transaction.type;
        const oldCategory = transaction.category;
        const oldDate = transaction.date;

        // Update transaction fields
        transaction.description = updatedDescription;
        transaction.type = updatedType.toUpperCase(); // Normalize to "INCOME" | "EXPENSE"
        transaction.category = updatedCategory;
        transaction.amount = Number(updatedAmount);
        transaction.date = updatedDate;
        transaction.notes = notes || "";

        await transaction.save();

        // Adjust budget if needed
        // Step 1: Roll back old expense impact (if oldType was EXPENSE)
        if (oldType === "EXPENSE") {
            const oldMonth = oldDate.slice(0, 7);
            const oldBudget = await Budget.findOne({
                user_id: userID,
                month: oldMonth,
                category: oldCategory,
            });

            if (oldBudget) {
                oldBudget.spent_amount = (oldBudget.spent_amount || 0) - oldAmount;
                oldBudget.remaining_amount = oldBudget.budget_amount - oldBudget.spent_amount;
                if (oldBudget.remaining_amount < 0) oldBudget.remaining_amount = 0;
                await oldBudget.save();
            }
        }

        // Step 2: Apply new expense impact (if updated type is EXPENSE)
        if (updatedType.toUpperCase() === "EXPENSE") {
            const newMonth = updatedDate.slice(0, 7);
            const newBudget = await Budget.findOne({
                user_id: userID,
                month: newMonth,
                category: updatedCategory,
            });

            if (newBudget) {
                newBudget.spent_amount = (newBudget.spent_amount || 0) + Number(updatedAmount);
                newBudget.remaining_amount = newBudget.budget_amount - newBudget.spent_amount;
                if (newBudget.remaining_amount < 0) newBudget.remaining_amount = 0;
                await newBudget.save();
            }
        }

        return res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        console.error("❌ Error updating transaction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const Delete_Income_Expense_Record = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userID = req.userID;

        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        // Find transaction
        const transaction = await Transaction.findOne({ _id: id, user_id: userID });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Adjust budget if expense
        if (transaction.type === "EXPENSE") {
            const month = transaction.date.slice(0, 7);
            const budget = await Budget.findOne({
                user_id: userID,
                month,
                category: transaction.category,
            });

            if (budget) {
                budget.spent_amount = (budget.spent_amount || 0) - transaction.amount;
                budget.remaining_amount = budget.budget_amount - budget.spent_amount;
                if (budget.remaining_amount < 0) budget.remaining_amount = 0;
                await budget.save();
            }
        }

        // DELETE transaction
        await transaction.deleteOne();

        return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting transaction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export default {
    Create_Income_Expense_Record,
    Get_Recent_Transactions,
    Get_All_Transactions,
    Update_Income_Expense_Record,
    Delete_Income_Expense_Record
};