import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";


const CreateNewUserCategory = async (req: Request, res: Response) => {
    try {
        const userID = req.userID; // from auth middleware
        const { category_name, category_color, type } = req.body;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!category_name || !category_color || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Invalid category type" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newCategory = { category_name, category_color };

        if (type === "income") {
            user.category.incomeCategories.push(newCategory);
        } else {
            user.category.expenseCategories.push(newCategory);
        }

        await user.save();

        return res.status(201).json({
            message: "Category added successfully",
            incomeCategories: user.category.incomeCategories,
            expenseCategories: user.category.expenseCategories
        });
    } catch (error) {
        console.error("❌ Error creating category:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const FetchUserCategories = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;

        if (!userID) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Fetch user from DB
        const user = await User.findById(userID).select("category");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            incomeCategories: user.category.incomeCategories,
            expenseCategories: user.category.expenseCategories
        });
    } catch (error) {
        console.error("❌ Error fetching user categories:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const UpdateUserCurrentCategory = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;
        const { type, old_name, new_name, new_color } = req.body;

        if (!userID) return res.status(401).json({ message: "User not authenticated" });
        if (!type || !old_name) return res.status(400).json({ message: "Type and old_name are required" });
        if (!["income", "expense"].includes(type)) return res.status(400).json({ message: "Invalid category type" });

        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const categories = type === "income" ? user.category.incomeCategories : user.category.expenseCategories;

        // Find the category by name
        const category = categories.find(c => c.category_name === old_name);
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Update fields
        if (new_name) category.category_name = new_name;
        if (new_color) category.category_color = new_color;

        await user.save();

        return res.status(200).json({
            message: "Category updated successfully",
            incomeCategories: user.category.incomeCategories,
            expenseCategories: user.category.expenseCategories
        });
    } catch (error) {
        console.error("❌ Error updating category:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const DeleteUserSelectedCategory = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;
        const { type, category_name } = req.body;

        if (!userID) return res.status(401).json({ message: "User not authenticated" });
        if (!type || !category_name) return res.status(400).json({ message: "Type and category_name are required" });
        if (!["income", "expense"].includes(type)) return res.status(400).json({ message: "Invalid category type" });

        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const categories = type === "income"
            ? user.category.incomeCategories
            : user.category.expenseCategories;

        // Find category index
        const index = categories.findIndex(c => c.category_name === category_name);
        if (index === -1) return res.status(404).json({ message: "Category not found" });

        // Use Mongoose DocumentArray method `pull` to remove
        categories.pull(categories[index]);

        await user.save();

        return res.status(200).json({
            message: "Category removed successfully",
            incomeCategories: user.category.incomeCategories,
            expenseCategories: user.category.expenseCategories
        });
    } catch (error) {
        console.error("❌ Error deleting category:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const ChangeUserPassword = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required." });
        }

        // Find user
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify current password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error in ChangeUserPassword:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const UpdateUserProfile = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;
        const { name, country, incomeBracket } = req.body;

        // 1. Validate input
        if (!name || !country || !incomeBracket) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Ensure user exists
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Update allowed fields only
        user.name = name;
        user.country = country;
        user.income_bracket = incomeBracket;

        await user.save();

        // 4. Respond with success message
        return res.status(200).json({
            message: "Profile updated successfully",
            updatedUser: {
                name: user.name,
                email: user.email,
                country: user.country,
                income_bracket: user.income_bracket,
            },
        });
    } catch (error) {
        console.error("❌ Error in UpdateUserProfile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export default {
    CreateNewUserCategory,
    FetchUserCategories,
    UpdateUserCurrentCategory,
    DeleteUserSelectedCategory,
    ChangeUserPassword,
    UpdateUserProfile
};