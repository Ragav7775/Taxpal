import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;


export const FetchSummaryCardData = async () => {
    try {
        const response = await axios.get(`${Base_URL}/api/user/v1/dashboard/fetch/user-total-summary-records`, {
            withCredentials: true,
        });
        return response.data || {};
        // expected { income, expense, taxDue, savingsRate, changes }
    } catch (error) {
        console.error("❌ Error fetching summary:", error);
        return {};
    }
};


export const fetchMonthlyIncomeExpense = async () => {
    try {
        const response = await axios.get(
            `${Base_URL}/api/user/v1/dashboard/fetch/user-income-vs-expense-records`,
            { withCredentials: true }
        );

        // expecting API to return something like:
        // { records: [{ month: "Jan", income: 10000, expense: 9000 }, ...] }
        return response.data?.records || [];
    } catch (error) {
        console.error("❌ Error fetching income vs expense records:", error);
        return []; // return empty → frontend will fallback
    }
};



export const fetchExpenseBreakdown = async () => {
    try {
        const response = await axios.get(
            `${Base_URL}/api/user/v1/dashboard/fetch/user-expense-breakdown-records`,
            { withCredentials: true }
        );
        return response.data?.categories || [];
        // expected API response: { categories: [{ name: "Food", value: 400 }, ...] }
    } catch (error) {
        console.error("❌ Error fetching expense breakdown:", error);
        return []; // fallback to empty so frontend can use defaults
    }
};