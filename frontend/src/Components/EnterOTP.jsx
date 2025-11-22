import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../store";
import { toast } from "sonner";
import { UserEnterOTP, UserResendOTP } from "../api/UserApi";

const EnterOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { email } = useAppStore();
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput.focus();
    }
  };

  const handleVerify = async () => {
    try {
      const otpValue = otp.join("");
      console.log("Entered OTP:", otpValue);
      console.log("Email:", email);

      const response = await UserEnterOTP(otpValue, email);

      if (response.status === 200) {
        toast.success("OTP Verified Successfully");
        navigate("/ResetPassword");
      } else {
        toast.error(response.data?.message || "OTP verification failed!");
      }
    } catch (error) {
      console.error("❌ Failed to verify OTP:", error);
      toast.error(error?.message || "OTP verification failed! Try again later.");
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    try {
      setIsResending(true);
      const response = await UserResendOTP({ email });

      if (response.status === 200) {
        toast.success("OTP resent successfully");
        setCountdown(30); // restart countdown
        setCanResend(false);
      } else {
        toast.error(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("❌ Failed to resend OTP:", error);
      toast.error(error?.message || "Failed to resend OTP, try again later!");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">
        {/* Back button */}
        <div
          className="flex items-center mb-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 mr-2" />
          <span className="text-gray-600">Back</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-customBlue text-center mb-2">
          Enter Your OTP
        </h1>
        <p className="text-sm text-center text-black mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-0 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
              className="w-12 h-12 text-center text-lg font-semibold border border-[#D9D9D9] rounded-xl focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue"
            />
          ))}
        </div>

        {/* Resend OTP */}
        <div className="text-center mb-6">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm text-customBlue font-medium hover:underline disabled:opacity-60"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend OTP in {countdown} second{countdown !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full bg-customBlue text-white py-2 rounded-md hover:bg-customBlue font-medium"
        >
          Verify Your OTP
        </button>
      </div>
    </div>
  );
};

export default EnterOTP;
