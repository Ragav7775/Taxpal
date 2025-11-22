import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;


export const CreateNewUserCategory = async (category_name, category_color, type) => {
    try {
        const response = await axios.post(`${Base_URL}/api/user/v1/settings/create/new/user-category-data`,
            { category_name, category_color, type },
            { withCredentials: true }
        );

        return {
            incomeCategories: response.data?.incomeCategories || [],
            expenseCategories: response.data?.expenseCategories || [],
            message: response.data?.message || "Category added"
        };
    } catch (error) {
        console.error("❌ Error creating category:", error);
        throw new Error(error.response?.data?.message || "Failed to create category");
    }
};


export const FetchUserCategoryData = async () => {
    try {
        const response = await axios.get(`${Base_URL}/api/user/v1/settings/fetch/user-category-data`, {
            withCredentials: true,
        });

        return {
            incomeCategories: response.data?.incomeCategories || [],
            expenseCategories: response.data?.expenseCategories || []
        };

    } catch (error) {
        console.error("❌ Error fetching Category:", error);
        return {
            incomeCategories: [],
            expenseCategories: []
        };
    }
};


export const UpdateUserCategory = async (type, old_name, new_name, new_color) => {
    try {
        const response = await axios.put(`${Base_URL}/api/user/v1/settings/update/user-current-category-data`,
            { type, old_name, new_name, new_color },
            { withCredentials: true }
        );

        return {
            incomeCategories: response.data?.incomeCategories || [],
            expenseCategories: response.data?.expenseCategories || [],
            message: response.data?.message || "Category updated"
        };
    } catch (error) {
        console.error("❌ Error updating category:", error);
        throw new Error(error.response?.data?.message || "Failed to update category");
    }
};


export const DeleteUserCategory = async (type, category_name) => {
    try {
        const response = await axios.delete(
            `${Base_URL}/api/user/v1/settings/delete/current/user-selected-category`,
            {
                data: { type, category_name },
                withCredentials: true
            }
        );

        return {
            incomeCategories: response.data?.incomeCategories || [],
            expenseCategories: response.data?.expenseCategories || [],
            message: response.data?.message || "Category removed"
        };
    } catch (error) {
        console.error("❌ Error deleting category:", error);
        throw new Error(error.response?.data?.message || "Failed to delete category");
    }
};


export const ChangeUserPassword = async (currentPassword, newPassword) => {
    try {
        const response = await axios.put(`${Base_URL}/api/user/v1/settings/update/current-user-password`,
            { currentPassword, newPassword },
            { withCredentials: true }
        );

        return {
            message: response.data?.message || "Password changed successfully"
        };
    } catch (error) {
        console.error("❌ Error changing password:", error);
        throw new Error(error.response?.data?.message || "Failed to change password");
    }
};


export const UpdateUserProfileAPI = async (data) => {
    try {
        const response = await axios.put(`${Base_URL}/api/user/v1/settings/update/current-user-profile-data`, data,
            { withCredentials: true }
        );

        return {
            message: response.data?.message || "Profile updated successfully",
        };
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        throw new Error(error.response?.data?.message || "Failed to update profile");
    }
};