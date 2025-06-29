"use client";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Settings,
  Users,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../store/userSlice";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage all user accounts, activities, and daily streaks",
      icon: <Users className="text-[var(--primary-color)]" size={24} />,
    },
    {
      title: "Add New Managers",
      description:
        "Provide system access and permissions to new managerial users.",
      icon: <UserPlus className="text-[var(--primary-color)]" size={24} />,
    },
    {
      title: "System Settings",
      description: "Configure platform settings and integrations.",
      icon: <Settings className="text-[var(--primary-color)]" size={24} />,
    },
  ];

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
    setApiError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/managers/login`,
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
          user: { id, email, firstName, role, companyId },
        } = data;

        dispatch(login({ token, _id: id, email, firstName, role, companyId }));

        if (role === "company-admin") {
          navigate("/admin-dashboard");
        } else if (role === "super-admin") {
          navigate("/super-admin-dashboard");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <img src="/logo-thryve.png" alt="Thryve Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-white">
            thryve admin console
          </h1>
        </div>

        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white">
            Comprehensive Admin Tools
          </h2>
          <p className="max-w-lg text-xl text-white/90">
            Powerful dashboard to manage users, monitor activities, and
            configure system settings
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white/20 p-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and Header */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              <img
                src="/logo-thryve.png"
                alt="Thryve Logo"
                className="h-14 w-auto bg-[var(--primary-color)]"
              />
            </motion.div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Admin Login
            </h1>
            <p className="text-gray-500">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
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
                Email Address
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
                  className={`block w-full rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
                  placeholder="admin@company.com"
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
                  className={`block w-full rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 p-3 pr-10 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[var(--primary-color)] hover:text-[color-mix(in_srgb,var(--primary-color),black_20%)]"
                >
                  Forgot password?
                </a>
              </div> */}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[var(--primary-color)] px-5 py-3 text-center text-sm font-medium text-white hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)] focus:ring-4 focus:ring-[var(--primary-color)]/50 focus:outline-none disabled:opacity-50 cursor-pointer"
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
                "Sign In"
              )}
            </motion.button>
          </form>
          {/* 
          <div className="mt-8 text-center text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="font-medium text-[var(--primary-color)] hover:underline"
            >
              Contact support
            </a>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
