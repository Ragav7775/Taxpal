import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user"
import { GenerateJWTToken } from "../middleware/AuthValidation";
import { GenerateOtp } from "../utils/GenerateOTP";
import { sendOtpEmailToUser } from "../services/Mailer";


// VERCEL_ENV & NODE_ENV will automaticaly set by the vercel in deployment
const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";


const RegisterCurrentUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, country, income_bracket } = req.body;
        // 1. Validate input
        if (!name || !email || !password || !country || !income_bracket) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            country,
            income_bracket,
        });

        await newUser.save();

        return res.status(201).json({ message: "User Registered successfully" });
    } catch (error) {
        console.error("❌ Error in RegisterCurrentUser:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const LoginCurrentUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT
        const token = GenerateJWTToken(user._id.toString());

        // Set JWT as HttpOnly cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: isProduction, // only HTTPS in production
            sameSite: isProduction ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        // success → send back user info
        return res.status(200).json({
            message: "Login successful",
            data: {
                name: user.name,
                email: user.email,
                country: user.country,
                income_bracket: user.income_bracket,
            },
        });

    } catch (error) {
        console.error("Error in LoginCurrentUser:", error);
        return res.status(500).json({ error: "Internal Server error" });
    }
};



const ForgetUserPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        // generate 6 digit OTP
        const GeneratedOTP = GenerateOtp();

        // save otp in DB (overwrite old otp if exists)
        user.ForgotPassword_OTP = GeneratedOTP;
        await user.save();

        // send OTP email
        await sendOtpEmailToUser(
            Number(GeneratedOTP),
            email
        );

        return res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error("ForgotPassword Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const VerifyForgotPasswordOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "OTP is required" });
        }

        // Find user by userId
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare OTP
        if (user.ForgotPassword_OTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clear ForgotPassword_OTP if exists
        user.ForgotPassword_OTP = undefined;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error in verifyOtpController:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const ChangeNewUserPassword = async (req: Request, res: Response) => {
    try {
        const { newPassword, email } = req.body;
        if (!newPassword || !email) {
            return res.status(400).json({ message: "New password is required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error in changePasswordController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const ResendForgotPasswordOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email ID not Found!" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new OTP
        const newOTP = GenerateOtp();

        // Replace old OTP in DB
        user.ForgotPassword_OTP = newOTP;
        await user.save();

        // Resend Send OTP via email
        await sendOtpEmailToUser(
            Number(newOTP),
            email
        );

        return res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error("Error in resendOTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export default {
    RegisterCurrentUser,
    LoginCurrentUser,
    ForgetUserPassword,
    VerifyForgotPasswordOtp,
    ChangeNewUserPassword,
    ResendForgotPasswordOtp
}