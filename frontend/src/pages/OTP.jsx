import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setApiError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (error) {
      setApiError(error.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend verification code");
      }

      setApiError("New verification code sent!");
    } catch (error) {
      setApiError(error.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        {/* Logo and Header */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 flex items-center gap-2"
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-12 w-auto bg-[var(--primary-color)]"
            />
            <h1 className="text-3xl font-bold text-[var(--primary-color)]">
              thryve
            </h1>
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-800">Verify Code</h2>
          <p className="text-center text-gray-500">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{apiError}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <span>Code verified successfully!</span>
            </div>
          )}

          {/* OTP Input */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 rounded-lg border text-gray-600 border-gray-300 bg-gray-50 text-center text-xl focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[var(--primary-color)] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)] focus:ring-4 focus:ring-[var(--primary-color)]/50 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Code"
            )}
          </motion.button>

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-sm text-gray-500 hover:text-[var(--primary-color)]"
            >
              Didn't receive the code? Resend
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-[var(--primary-color)] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default OTP;