import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;


export const CreateNewTaxEstimationRemainder = async (taxData) => {
    try {
        const response = await axios.post(`${Base_URL}/api/user/v1/tax-estimation/create/new/user-taxestimator-remainder`, taxData, {
            withCredentials: true,
        }
        );
        return response; // return created tax estimation
    } catch (error) {
        console.error("❌ Error creating tax estimation:", error);
        throw error.response?.data || error.message;
    }
};



export const FetchTaxEstimatorRemainderRecords = async () => {
    try {
        const response = await axios.get(`${Base_URL}/api/user/v1/tax-estimation/fetch/current/user-taxestimator-calender-records`, {
            withCredentials: true,
        });
        return response.data?.reminders || []; // assuming API returns { reminders: [] }
    } catch (error) {
        console.error("❌ Error fetching calendar Recods:", error);
        return [];
    }
};



export const UpdateUserTaxRemainder = async (updated_data) => {
    try {
        const response = await axios.put(`${Base_URL}/api/user/v1/tax-estimation/update/user-current-TaxRemainder-data`,
            { updated_data },
            { withCredentials: true }
        );

        return { message: response.data?.message || "TaxRemainder updated" };
    } catch (error) {
        console.error("❌ Error updating TaxRemainder:", error);
        throw new Error(error.response?.data?.message || "Failed to update TaxRemainder");
    }
};


export const DeleteUserTaxRemainder = async (TaxRemainder_id) => {
    try {
        const response = await axios.delete(
            `${Base_URL}/api/user/v1/tax-estimation/delete/current/user-selected-TaxRemainder`,
            {
                data: { TaxRemainder_id },
                withCredentials: true
            }
        );

        return { message: response.data?.message || "TaxRemainder removed" };
    } catch (error) {
        console.error("❌ Error deleting TaxRemainder:", error);
        throw new Error(error.response?.data?.message || "Failed to delete TaxRemainder");
    }
};


export const CheckAndUpdateOverdueReminders = async () => {
    try {
        const hasOverdueRemainderChecked = localStorage.getItem("overdueCheckDone");

        if (hasOverdueRemainderChecked) return;

        const response = await axios.post(
            `${Base_URL}/api/user/v1/tax-estimation/check/current-tax-remainder/duedate-exceed`,
            {},
            { withCredentials: true }
        );

        return {
            success: true,
            updated: response.data?.updated || 0,
            message: response.data?.message || "Check completed",
        };
    } catch (error) {
        console.error("❌ Error checking overdue reminders:", error);
        return {
            success: false,
            updated: 0,
            message: error.response?.data?.message || "Failed to check overdue reminders",
        };
    }
};
