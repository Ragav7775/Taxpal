import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChangeUserPassword } from "../../api/SettingsApi";
import eyeOffIcon from "../../assets/vector.png";
import eyeOnIcon from "../../assets/visible.png";

// Zod Validation Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

export default function SecuritySettings() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Eye toggle state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // On Submit Handler
  const onSubmit = async (data) => {
    try {
      const { currentPassword, newPassword } = data;
      const response = await ChangeUserPassword(currentPassword, newPassword);

      toast.success(response.message || "Password updated successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Security</h3>
      <p className="text-gray-600 mb-4">
        Update your password and security settings here.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="relative">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword")}
            className="w-full mt-1 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            placeholder="Enter current password"
          />
          <img
            src={showCurrent ? eyeOnIcon : eyeOffIcon}
            alt="toggle password visibility"
            className="absolute right-2 top-3/5 w-4 h-4 cursor-pointer"
            onClick={() => setShowCurrent(!showCurrent)}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
            className="w-full mt-1 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            placeholder="Enter new password"
          />
          <img
            src={showNew ? eyeOnIcon : eyeOffIcon}
            alt="toggle password visibility"
            className="absolute right-2 top-3/5 w-4 h-4 cursor-pointer"
            onClick={() => setShowNew(!showNew)}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <label className="block text-sm font-medium">Confirm New Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmNewPassword")}
            className="w-full mt-1 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            placeholder="Re-enter new password"
          />
          <img
            src={showConfirm ? eyeOnIcon : eyeOffIcon}
            alt="toggle password visibility"
            className="absolute right-2 top-3/5 w-4 h-4 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-2 py-2 rounded-md text-white transition-colors cursor-pointer ${isSubmitting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-customBlue hover:bg-blue-600"
            }`}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};
