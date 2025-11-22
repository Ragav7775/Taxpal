import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;


export const CreateNewBudget = async (budgetData) => {
    try {
        const response = await axios.post(`${Base_URL}/api/user/v1/budget/create/new/user-budget-data`, budgetData, {
            withCredentials: true,
        });
        return response; // return created budget
    } catch (error) {
        console.error("❌ Error creating budget:", error);
        throw error.response?.data || error.message;
    }
};


export const FetchBudgetsRecords = async () => {
    try {
        const response = await axios.get(`${Base_URL}/api/user/v1/budget/fetch/user-budgets-records`, {
            withCredentials: true,
        });
        return response.data?.budgets || []; // assuming API returns { budgets: [] }
    } catch (error) {
        console.error("❌ Error fetching budgets:", error);
        return [];
    }
};



export const UpdateBudgetRecord = async (budgetId, budgetData) => {
    try {
        const response = await axios.put(
            `${Base_URL}/api/user/v1/budget/update/previous/user-budget-data-by-id/${budgetId}`,
            budgetData,
            {
                withCredentials: true,
            }
        );
        return response; // return updated budget
    } catch (error) {
        console.error("❌ Error updating budget:", error);
        throw error.response?.data || error.message;
    }
};


export const DeleteBudgetData = async (budgetID) => {
    try {
        const response = await axios.delete(`${Base_URL}/api/user/v1/budget/delete/user-budget-data-by-id/${budgetID}`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete budget" };
    }
};
