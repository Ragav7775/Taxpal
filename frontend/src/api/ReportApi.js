import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;


export const CreateNewReport = async (ReportData) => {
    try {
        const response = await axios.post(`${Base_URL}/api/user/v1/report/create/new/user-report-document`, ReportData, {
            withCredentials: true,
        });
        return response; // return created Report
    } catch (error) {
        console.error("❌ Error creating Report:", error);
        throw error.response?.data || error.message;
    }
};


export const FetchReportsRecords = async () => {
    try {
        const response = await axios.get(`${Base_URL}/api/user/v1/report/fetch/user-reports-data`, {
            withCredentials: true,
        });
        return response.data?.reports || []; // assuming API returns { reports: [] }
    } catch (error) {
        console.error("❌ Error fetching Reports:", error);
        return [];
    }
};


export const DeleteReportsData = async (report_Url) => {
    try {
        const response = await axios.delete(`${Base_URL}/api/user/v1/report/delete/user-report-from-records`, {
            data: report_Url,
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete Report" };
    }
};