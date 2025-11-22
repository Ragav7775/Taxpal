import axios from "axios";

const Base_URL = import.meta.env.VITE_SERVER_URL;

export const NewUserRegister = async (userData) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/create/new/user-register`,
            {
                name: userData.username,
                email: userData.email,
                password: userData.password,
                country: userData.country,
                income_bracket: userData.incomeBracket,
            }
        );

        return response;
    } catch (error) {
        console.error("❌ Registration API error:", error);
        throw error.response?.data || error;
    }
};


export const UserSignIn = async (loginData) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/verify/new/user-login`,
            loginData,
            { withCredentials: true }
        );

        return response;
    } catch (error) {
        console.error("❌ Login API error:", error);
        throw error.response?.data || error;
    }
};


export const UserForgotPassword = async (userData) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/notify/forgot-password`,
            userData
        );

        return response;
    } catch (error) {
        console.error("❌ Forgot Password API error:", error);
        throw error.response?.data || error;
    }
};


export const UserEnterOTP = async (otpValue, email) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/check/forgot-password/verify-otp`,
            {
                otp: otpValue,
                email: email,
            }
        );

        return response;
    } catch (error) {
        console.error("❌ OTP Verification API error:", error);
        throw error.response?.data || error;
    }
};


export const UserResetPassword = async (email, newPassword) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/update/forgot-password/new-password`,
            {
                newPassword,
                email,
            }
        );

        return response;
    } catch (error) {
        console.error("❌ Error resetting password:", error);
        throw error.response?.data || error;
    }
};


export const UserResendOTP = async (userData) => {
    try {
        const response = await axios.post(
            `${Base_URL}/api/user/v1/notify/forgot-password/resend-otp`,
            userData
        );

        return response;
    } catch (error) {
        console.error("❌ Forgot Password API error:", error);
        throw error.response?.data || error;
    }
};