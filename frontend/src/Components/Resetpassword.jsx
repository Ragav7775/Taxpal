import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import closedEye from "../assets/vector.png";
import openEye from "../assets/visible.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "../store";
import { toast } from "sonner";
import { UserResetPassword } from "../api/UserApi";


//  Zod schema for reset password
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {email}=useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  
  const onSubmit = async (data) => {
    try {
      const response = await UserResetPassword(email, data.password);

      if (response.status === 200) {
        toast.success("Password reset successfully. You can now log in with your new password.");
        navigate("/SignIn");
      } else {
        toast.error(response.data?.message || "Password reset failed!");
      }
    } catch (error) {
      console.error("❌ Reset password failed:", error);
      toast.error(error?.message || "Failed to Reset Password!");
    }
  };

  const togglePasswordVisibility = (setter) => setter((prev) => !prev);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4 font-sans">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[320px] flex flex-col justify-center"
        style={{ boxShadow: "2px 2px 20px 4px rgba(0, 0, 0, 0.15)" }}
      >
        <h2 className="text-2xl font-instrument font-medium text-customBlue text-center">
          Reset Password
        </h2>
        <p className="text-sm mt-2 text-center text-black font-roboto">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 font-roboto"
            >
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                className="block w-full px-2 py-1.5 pr-8 border border-customBlue rounded-lg shadow-sm focus:outline-none focus:ring-customBlue focus:border-customBlue font-roboto text-sm text-black placeholder:text-gray-500"
                {...register("password")}
              />
              <img
                src={showPassword ? openEye : closedEye}
                alt="Toggle password visibility"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-4 h-4"
                onClick={() => togglePasswordVisibility(setShowPassword)}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 font-roboto"
            >
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm new password"
                className="block w-full px-2 py-1.5 pr-8 border border-customBlue rounded-lg shadow-sm focus:outline-none focus:ring-customBlue focus:border-customBlue font-roboto text-sm text-black placeholder:text-gray-500"
                {...register("confirmPassword")}
              />
              <img
                src={showConfirmPassword ? openEye : closedEye}
                alt="Toggle confirm password visibility"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-4 h-4"
                onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-3 py-1.5 mt-5 text-sm font-medium text-white bg-customBlue rounded-lg shadow-md hover:bg-customBlue focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-customBlue font-instrument disabled:opacity-60"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-black font-roboto">
          Remember your password?{" "}
          <Link
            to="/SignIn"
            className="text-customBlue font-semibold hover:text-customBlue underline font-roboto"
          >
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
