import { useMemo, useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "sonner";
import countryList from "react-select-country-list";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserProfileAPI } from "../../api/SettingsApi";
import { useUserData } from "../../hooks/useUserData";

// Validation Schema
const profileSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  country: z.string().min(1, "Country is required"),
  incomeBracket: z.string().min(1, "Income bracket is required"),
});

export default function ProfileSettings() {
  const userData = useUserData();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [country, setCountry] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const incomeOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      country: userData?.country || "",
      incomeBracket: userData?.income_bracket || "",
    },
  });

  const formValues = useWatch({ control });

  // Prefill country select when userData changes
  useEffect(() => {
    if (countryOptions.length > 0 && userData?.country) {
      const selected = countryOptions.find(
        (c) => c.label.toLowerCase() === userData.country.toLowerCase()
      );
      if (selected) {
        setCountry(selected);
        setValue("country", selected.label, { shouldDirty: false });
      }
    }
  }, [countryOptions, userData, setValue]);

  // Prefill income bracket select when userData changes
  useEffect(() => {
    if (userData?.income_bracket) {
      setValue("incomeBracket", userData.income_bracket, { shouldDirty: false });
    }
  }, [userData, setValue]);

  // Detect changes from default
  useEffect(() => {
    const hasChanged =
      formValues.name !== (userData.name || "") ||
      formValues.country !== (userData.country || "") ||
      formValues.incomeBracket !== (userData.income_bracket || "");
    setIsChanged(hasChanged);
  }, [formValues, userData]);

  const handleCountryChange = (val) => {
    setCountry(val);
    setValue("country", val.label, { shouldDirty: true });
  };

  const handleIncomeChange = (val) => {
    setValue("incomeBracket", val.value, { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    try {
      const response = await UpdateUserProfileAPI(data);
      toast.success(response.message || "Profile updated successfully!");

      // Update localStorage and dispatch event for shared state
      const updatedUser = {
        ...userData,
        name: data.name,
        country: data.country,
        income_bracket: data.incomeBracket,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userDataUpdated"));

      setIsChanged(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
      <p className="text-gray-600 mb-4">
        Manage your personal information and account details here.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter your full name"
            className="w-full mt-1 p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            disabled
            className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium">Country</label>
          <Select
            options={countryOptions}
            value={country}
            onChange={handleCountryChange}
            placeholder="Select your country"
            className="text-sm"
            classNamePrefix="select"
            isSearchable
          />
          <input type="hidden" {...register("country")} />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* Income Bracket */}
        <div>
          <label className="block text-sm font-medium">Income Bracket</label>
          <Select
            options={incomeOptions}
            value={incomeOptions.find(
              (i) => i.value === formValues.incomeBracket
            )}
            onChange={handleIncomeChange}
            placeholder="Select your income bracket"
            className="text-sm"
            classNamePrefix="select"
            isSearchable={false}
          />
          <input type="hidden" {...register("incomeBracket")} />
          {errors.incomeBracket && (
            <p className="text-red-500 text-xs mt-1">
              {errors.incomeBracket.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 w-1/5">
          <button
            type="submit"
            disabled={!isChanged || isSubmitting}
            className={`w-full px-2 py-2 text-white rounded-md transition-colors cursor-pointer ${!isChanged || isSubmitting
                ? "bg-blue-600/50 cursor-not-allowed"
                : "bg-customBlue hover:bg-blue-600"
              }`}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};
