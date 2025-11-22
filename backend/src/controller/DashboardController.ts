import { Request, Response } from "express";
import Transaction from "../models/Transactions";
import mongoose from "mongoose";
import { calcPercentageChange, getMonthYear } from "../utils/Month&PercentageCalculator";
import User from "../models/user";
import TaxEstimation from "../models/TaxEstimation";

// Utility: month short names
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GetIncomeVsExpenseRecords = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(400).json({ message: "UserID not found!" });
        }

        // Fetch all transactions of this user
        const transactions = await Transaction.find({ user_id: userID });

        // Initialize default records with 0 values for all months
        const records: { month: string; income: number; expense: number }[] =
            months.map((m) => ({ month: m, income: 0, expense: 0 }));

        // Loop through all transactions and accumulate per month
        transactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            const monthIndex = txDate.getMonth(); // 0 = Jan, 11 = Dec

            if (tx.type === "INCOME") {
                records[monthIndex].income += tx.amount;
            } else if (tx.type === "EXPENSE") {
                records[monthIndex].expense += tx.amount;
            }
        });

        return res.status(200).json({ records });
    } catch (error) {
        console.error("❌ Error in GetIncomeVsExpenseRecords:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const GetExpenseBreakdown = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(400).json({ message: "UserID not found!" });
        }

        // Aggregate expenses by category
        const expenses = await Transaction.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userID), // 👈 FIX
                    type: "EXPENSE"
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: "$total"
                }
            }
        ]);


        return res.status(200).json({ categories: expenses });
    } catch (error) {
        console.error("❌ Error in GetExpenseBreakdown:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const getSummaryRecords = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(400).json({ message: "UserID not found" });
        }

        const user = await User.findById(userID).select("country");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const currentMonth = getMonthYear(now); // e.g. "2025-09"

        const lastMonthDate = new Date(now);
        lastMonthDate.setMonth(now.getMonth() - 1);
        const lastMonth = `${lastMonthDate.getFullYear()}-${String(
            lastMonthDate.getMonth() + 1
        ).padStart(2, "0")}`;

        // Aggregate income & expense only for this user
        const result = await Transaction.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userID),
                },
            },
            {
                $addFields: {
                    parsedDate: { $dateFromString: { dateString: "$date" } }
                }
            },
            {
                $group: {
                    _id: {
                        month: {
                            $dateToString: { format: "%Y-%m", date: "$parsedDate" },
                        },
                        type: "$type",
                    },
                    total: { $sum: "$amount" },
                },
            },
        ]);



        // Convert aggregation result into lookup object
        const data: Record<string, { income: number; expense: number }> = {};
        result.forEach((item) => {
            const month = item._id.month;
            if (!data[month]) data[month] = { income: 0, expense: 0 };
            if (item._id.type === "INCOME") data[month].income = item.total;
            if (item._id.type === "EXPENSE") data[month].expense = item.total;
        });


        // Current and last month values
        const currentIncome = data[currentMonth]?.income || 0;
        const currentExpense = data[currentMonth]?.expense || 0;
        const lastIncome = data[lastMonth]?.income || 0;
        const lastExpense = data[lastMonth]?.expense || 0;


        // Savings & Savings Rate
        const savings = currentIncome - currentExpense;
        const savingsRate =
            currentIncome > 0 ? ((savings / currentIncome) * 100).toFixed(1) : 0;

        // 👉 Fetch next upcoming tax due
        const upcomingTax = await TaxEstimation.findOne({
            user_id: new mongoose.Types.ObjectId(userID),
            status: "Pending",
        }).sort({ dueDate: 1 }); // earliest due date (past or future)

        let taxDue = 0;
        let taxDueMsg = "No upcoming tax";


        if (upcomingTax) {
            taxDue = upcomingTax.estimatedTax;
            taxDueMsg = `Tax due on ${upcomingTax.dueDate.toString().split("T")[0]} : ${upcomingTax.currencySymbol}${upcomingTax.estimatedTax}`;
        }

        return res.json({
            income: currentIncome,
            expense: currentExpense,
            taxDue,
            savingsRate: Number(savingsRate),
            country: user.country,
            changes: {
                income: calcPercentageChange(currentIncome, lastIncome),
                expense: calcPercentageChange(currentExpense, lastExpense),
                taxDue: taxDueMsg,
                savings:
                    currentIncome > 0
                        ? `↑${savingsRate}% from your goal!`
                        : "No savings data",
            },
        });
    } catch (error) {
        console.error("❌ Error in getSummaryRecords:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};




export default {
    GetIncomeVsExpenseRecords,
    GetExpenseBreakdown,
    getSummaryRecords
}