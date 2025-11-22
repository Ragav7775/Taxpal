import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "../store";
import { toast } from "sonner";
import { UserForgotPassword } from "../api/UserApi";

// Zod schema for email validation
const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { setEmail } = useAppStore();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });
   
    
    const onSubmit = async (data) => {
        try {
            console.log("Forgot Password Data:", data);

            const response = await UserForgotPassword(data);

            if (response.status === 200) {
                toast.success("OTP Sent to Registered Email");
                setEmail(data.email);
                navigate("/OTP-Verification");
            } else {
                toast.error(response.data?.message || "Something went wrong!");
            }

        } catch (error) {
            toast.error(error?.message || "OTP Send Failed, try again later!");
            console.error("❌ Failed to send OTP:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-[360px]  p-6 flex flex-col justify-center shadow-lg relative">
                {/* Back Arrow */}
                <Link
                    to="/"
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                </Link>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-customBlue text-center mt-2">
                    Forgot Password
                </h2>
                <p className="text-sm text-gray-800 text-center mt-3 mb-6">
                    Enter your email to receive a 6-digit OTP
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-3 py-1.5 border border-customBlue rounded-lg shadow-sm text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-customBlue"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Send OTP Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-customBlue text-white py-2 rounded-lg text-sm font-medium hover:bg-customBlue focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-customBlue disabled:opacity-60 transition-colors"
                    >
                        {isSubmitting ? "Sending..." : "Send OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
