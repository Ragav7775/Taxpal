import { Request, Response } from "express";
import TaxEstimation from "../models/TaxEstimation";
import mongoose from "mongoose";


const CreateTaxEstimationRemainder = async (req: Request, res: Response) => {
    try {
        const { title, description, status, dueDate, estimatedTax, currencySymbol } = req.body;
        const userID = req.userID;

        if (!title || !description || !status || !dueDate || !estimatedTax || !currencySymbol) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!userID) {
            return res.status(400).json({ message: "UserID not Found!" });
        }

        const newTaxEstimation = new TaxEstimation({
            user_id: userID,
            title,
            description,
            status,
            dueDate,
            estimatedTax,
            currencySymbol
        });

        await newTaxEstimation.save();

        return res.status(201).json({ message: "Tax Estimation created successfully" });
    } catch (error) {
        console.error("❌ Error in CreateTaxEstimation:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const GetTaxEstimationCalender = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Fetch reminders for this user
        const reminders = await TaxEstimation.find({ user_id: userID }).sort({ createdAt: -1 }); // latest first

        return res.status(200).json({ reminders });
    } catch (error) {
        console.error("❌ Error fetching user tax reminders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const UpdateTaxEstimationCalender = async (req: Request, res: Response) => {
    try {
        const { updated_data } = req.body;
        const userID = req.userID;

        if (!updated_data || !updated_data._id) {
            return res.status(400).json({
                message: "_id is required to identify the reminder",
            });
        }

        const {
            _id,
            updatedTitle,
            updatedDescription,
            updatedDueDate,
            updatedStatus,
        } = updated_data;

        // Ensure reminder belongs to the user
        const reminder = await TaxEstimation.findOne({
            _id: new mongoose.Types.ObjectId(_id),
            user_id: new mongoose.Types.ObjectId(userID),
        });

        if (!reminder) {
            return res.status(404).json({ message: "Tax reminder not found" });
        }

        const updateFields: any = {};
        if (updatedTitle) updateFields.title = updatedTitle;
        if (updatedDescription) updateFields.description = updatedDescription;
        if (updatedDueDate) updateFields.dueDate = updatedDueDate;
        if (updatedStatus) updateFields.status = updatedStatus;

        await TaxEstimation.findByIdAndUpdate(
            _id,
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({ message: "Tax reminder updated successfully" });
    } catch (error) {
        console.error("❌ Error in UpdateTaxEstimationCalender:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const DeleteTaxEstimationCalender = async (req: Request, res: Response) => {
    try {
        const { TaxRemainder_id } = req.body;
        const userID = req.userID;

        if (!TaxRemainder_id) {
            return res.status(400).json({ message: "_id is required to delete reminder" });
        }

        const deleted = await TaxEstimation.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(TaxRemainder_id),
            user_id: new mongoose.Types.ObjectId(userID),
        });

        if (!deleted) {
            return res.status(404).json({ message: "Tax reminder not found" });
        }

        return res.status(200).json({ message: "Tax reminder deleted successfully" });
    } catch (error) {
        console.error("❌ Error in DeleteTaxEstimationCalender:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const CheckAndUpdateOverdueReminders = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const today = new Date();

        // Find overdue reminders (pending ones where dueDate < today)
        const overdueReminders = await TaxEstimation.find({
            user_id: userID,
            dueDate: { $lt: today },
            status: { $nin: ["Completed", "Overdue"] }, // Only update Pending
        });

        if (overdueReminders.length > 0) {
            // Bulk update status to Overdue
            await TaxEstimation.updateMany(
                { _id: { $in: overdueReminders.map((r) => r._id) } },
                { $set: { status: "Overdue" } }
            );
        }

        return res.status(200).json({
            message: "Overdue check completed",
            updated: overdueReminders.length,
        });
    } catch (error) {
        console.error("❌ Error updating overdue reminders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



export default {
    CreateTaxEstimationRemainder,
    GetTaxEstimationCalender,
    UpdateTaxEstimationCalender,
    DeleteTaxEstimationCalender,
    CheckAndUpdateOverdueReminders
}