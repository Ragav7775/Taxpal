import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;


export const CreateTransaction = async (formData) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/transactions/create/new/user-income-or-expense-data`,
            formData,
            {
                withCredentials: true, // send cookies for auth
            }
        );
        return response;
    } catch (error) {
        console.error("❌ Error creating transaction:", error);
        throw error; // rethrow so UI can handle toast/error
    }
};


export const fetchRecentTransactions = async () => {
    try {
        const response = await axios.get(
            `${Base_URL}/api/user/v1/transactions/fetch/recent-transactions`,
            {
                withCredentials: true, // send cookies (for auth session)
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        return []
    }
};


export const getAllTransactions = async () => {
    try {
        const response = await axios.get(`${Base_URL}/api/user/v1/transactions/fetch/all-transactions`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching all transactions:", error);
        return [];
    }
};




export const UpdateTransactionRecord = async (transactionId, transactionData) => {
    try {
        const response = await axios.put(
            `${Base_URL}/api/user/v1/transactions/update/user-income-or-expense-by-id/${transactionId}`,
            transactionData,
            {
                withCredentials: true,
            }
        );
        return response;
    } catch (error) {
        console.error("❌ Error updating transactions:", error);
        throw error.response?.data || error.message;
    }
};


export const DeleteTransactionData = async (transactionID) => {
    try {
        const response = await axios.delete(`${Base_URL}/api/user/v1/transactions/delete/user-income-or-expense-record-by-id/${transactionID}`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete transactions" };
    }
};
