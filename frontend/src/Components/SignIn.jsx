import { useState } from "react";
import { useNavigate } from "react-router-dom";
import eyeOffIcon from "../assets/vector.png";
import eyeOnIcon from "../assets/visible.png";
import { Link } from "react-router-dom";
import { toast } from 'sonner';


// React Hook Form + Zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckAndUpdateOverdueReminders } from "../api/TaxEstimationApi";
import { UserSignIn } from "../api/UserApi";

// Zod schema for validation
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (data) => {
    try {
      const response = await UserSignIn(data);

      if (response.status === 200) {
        toast.success("Login Successful");

        // Store user data and handle overdue reminders
        localStorage.setItem("user", JSON.stringify(response.data.data));
        localStorage.removeItem("overdueCheckDone");

        navigate("/Dashboard");

        await CheckAndUpdateOverdueReminders();
        localStorage.setItem("overdueCheckDone", "true");
      } else {
        toast.error(response.data?.message || "Unexpected login error");
      }

    } catch (error) {
      toast.error(error?.message || "Login Failed, Try again later!");
      console.error("❌ Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[380px] flex flex-col justify-center"
        style={{ boxShadow: "2px 2px 20px 4px rgba(0, 0, 0, 0.15)" }}
      >
        <h1 className="text-3xl font-bold text-center text-customBlue font-instrument">
          TaxPal
        </h1>
        <p className="text-sm mt-2 text-center text-black font-roboto">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-roboto">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-2 py-1.5 border border-customBlue rounded-lg shadow-sm focus:outline-none focus:ring-customBlue focus:border-customBlue font-roboto text-sm text-black placeholder:text-gray-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-roboto">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-roboto">
              Password
            </label>
            <div className="flex items-center relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full px-2 py-1.5 pr-8 border border-customBlue rounded-lg shadow-sm focus:outline-none focus:ring-customBlue focus:border-customBlue font-roboto text-sm text-black placeholder:text-gray-500"
                {...register("password")}
              />
              <img
                src={showPassword ? eyeOnIcon : eyeOffIcon}
                alt="Toggle Password Visibility"
                className="absolute right-2 cursor-pointer w-4 h-4"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-roboto">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="mt-2 text-right">
            <Link
              to="/Forgot-Password"
              className="text-sm text-customBlue hover:text-customBlue font-medium font-roboto underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-3 py-1.5 mt-5 text-sm font-medium text-white bg-customBlue rounded-lg shadow-md hover:bg-customBlue focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-customBlue font-instrument disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-sm text-center text-black font-roboto">
          New here?{" "}
          <Link
            to="/Register"
            className="text-customBlue font-semibold hover:text-customBlue underline font-roboto"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
