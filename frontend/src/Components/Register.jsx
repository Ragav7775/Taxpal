import { useMemo, useState } from "react";
import Select from "react-select";
import eyeOffIcon from "../assets/vector.png";
import eyeOnIcon from "../assets/visible.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import countryList from "react-select-country-list";

// React Hook Form + Zod
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewUserRegister } from "../api/UserApi";

// Zod schema for validation
const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    country: z.string().min(1, "Country is required"),
    incomeBracket: z.string().min(1, "Income bracket is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [country, setCountry] = useState(null);
  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleCountryChange = (val) => {
    setCountry(val);
    setValue("country", val.label); // update react-hook-form value
  };

  // Hook form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      incomeBracket: "",
    },
  });

  
  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);

      const response = await NewUserRegister(data);

      if (response.status === 201) {
        toast.success("Account Created Successfully");
        navigate("/SignIn");
      } else {
        toast.error(response.data?.message || "Unexpected error");
      }

    } catch (error) {
      toast.error(error?.message || "Account Creation Failed");
      console.error("Registration failed:", error);
    }
  };

  const incomeOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[380px] flex flex-col justify-center"
        style={{ boxShadow: "2px 2px 20px 4px rgba(0, 0, 0, 0.15)" }}
      >
        <h2 className="text-3xl font-bold text-center text-customBlue font-instrument">
          Create an account
        </h2>
        <p className="text-sm text-center text-black font-roboto mt-2 mb-5">
          Enter your information to create a TaxPal account
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <input
            type="text"
            placeholder="Choose a username"
            className="mb-3 w-full px-3 py-2 border border-customBlue rounded-lg shadow-sm placeholder:text-gray-500 font-roboto focus:outline-none focus:ring-customBlue focus:border-customBlue text-sm text-black"
            {...register("username")}
          />
          {errors.username && <p className="text-xs text-red-500 mb-2">{errors.username.message}</p>}

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Choose a password"
              className="w-full px-3 py-2 pr-8 border border-customBlue rounded-lg shadow-sm placeholder:text-gray-500 font-roboto focus:outline-none focus:ring-customBlue focus:border-customBlue text-sm text-black"
              {...register("password")}
            />
            <img
              src={showPassword ? eyeOnIcon : eyeOffIcon}
              alt="toggle password visibility"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 mb-2">{errors.password.message}</p>}

          {/* Confirm Password */}
          <div className="relative mb-3">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 pr-8 border border-customBlue rounded-lg shadow-sm placeholder:text-gray-500 font-roboto focus:outline-none focus:ring-customBlue focus:border-customBlue text-sm text-black"
              {...register("confirmPassword")}
            />
            <img
              src={showConfirm ? eyeOnIcon : eyeOffIcon}
              alt="toggle confirm password visibility"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mb-2">{errors.confirmPassword.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            className="mb-3 w-full px-3 py-2 border border-customBlue rounded-lg shadow-sm placeholder:text-gray-500 font-roboto focus:outline-none focus:ring-customBlue focus:border-customBlue text-sm text-black"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mb-2">{errors.email.message}</p>}
         
          
          {/* Country */}
          <div className="mb-3">
            <Select
              options={countryOptions}
              value={country}
              onChange={handleCountryChange}
              placeholder="Select your country"
              className="mb-3 text-sm font-roboto"
              classNamePrefix="select"
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  boxShadow: state.isFocused ? "0 0 0 1px #4970E4" : "none",
                  "&:hover": { borderColor: "#4970E4" },
                  borderRadius: "0.5rem", // rounded-lg
                  fontSize: "0.875rem", // text-sm
                  backgroundColor: "#ffffff",
                  cursor: "pointer"
                }),
                option: (base) => ({
                  ...base,
                  cursor: "pointer",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6B7280", // text-gray-500
                  fontFamily: "Roboto, sans-serif",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#000000",
                  fontFamily: "Roboto, sans-serif",
                })
              }}
            />
            <input type="hidden" {...register("country")} />
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
          </div>
          
          
          {/* Income Bracket */}
          <div className="mb-4">
            <Select
              options={incomeOptions}
              placeholder="Select your income bracket"
              className="mb-3 text-sm font-roboto"
              classNamePrefix="select"
              isSearchable={false} // disable typing search since it's a short list
              onChange={(val) => setValue("incomeBracket", val.value)}
              styles={{
                control: (base, state) => ({
                  ...base,
                  boxShadow: state.isFocused ? "0 0 0 1px #4970E4" : "none",
                  "&:hover": { borderColor: "#4970E4" },
                  borderRadius: "0.5rem", // rounded-lg
                  fontSize: "0.875rem", // text-sm
                  backgroundColor: "#ffffff",
                  cursor: "pointer"
                }),
                option: (base) => ({
                  ...base,
                  cursor: "pointer",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#6B7280", // text-gray-500
                  fontFamily: "Roboto, sans-serif",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#000000",
                  fontFamily: "Roboto, sans-serif",
                })
              }}
            />
            <input type="hidden" {...register("incomeBracket")} />
            {errors.incomeBracket && (
              <p className="text-xs text-red-500 mt-1">{errors.incomeBracket.message}</p>
            )}
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-customBlue rounded-lg shadow-md hover:bg-customBlue focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-customBlue font-instrument disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-black font-roboto">
          Already have an account?{" "}
          <Link
            to="/SignIn"
            className="font-semibold text-customBlue hover:text-customBlue underline font-roboto"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
