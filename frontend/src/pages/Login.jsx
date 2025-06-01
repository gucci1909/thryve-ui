"use client";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import LoginBackground from "../components/onboarding/LoginBackground";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(""); // Clear any previous API errors

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setApiError("Invalid email or password");
        throw new Error(data.message || "Login failed");
      } else {
        const {
          token,
          user: { id, email, firstName, personalized },
        } = data;
        if (personalized) {
          dispatch(login({ token, _id: id, email, firstName, personalized }));
          navigate("/personalize-home");
        } else {
          dispatch(login({ token, _id: id, email, firstName, personalized: false }));
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-4">
      {/* Animated Background */}
      {/* <LoginBackground /> */}
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
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    email: validateField("email", e.target.value),
                  }));
                }}
                className={`block w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
                placeholder="name@company.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: validateField("password", e.target.value),
                  }));
                }}
                className={`block w-full rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 p-2.5 pr-10 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
            <div className="mt-2 flex flex-col items-end text-sm text-gray-600 dark:text-gray-400">
              <span>Difficulty signing in?</span>
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password
              </Link>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[var(--primary-color)] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)] focus:ring-4 focus:ring-[var(--primary-color)]/50 focus:outline-none disabled:opacity-50"
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
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="z-10 cursor-pointer font-medium text-[var(--primary-color)]"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
