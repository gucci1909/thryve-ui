"use client";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LoginBackground from "../components/onboarding/LoginBackground";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-4">
      {/* Animated Background */}
      <LoginBackground />
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
        <form className="space-y-6">
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
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="name@company.com"
                required
              />
            </div>
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
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="••••••••"
                required
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
            className="w-full rounded-lg bg-[var(--primary-color)] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)] focus:ring-4 focus:ring-[var(--primary-color)]/50 focus:outline-none"
          >
            Sign in
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
          <button
            onClick={()=>{
              console.log({1:true})
              navigate("/signup");
            }}
            className="font-medium text-[var(--primary-color)] hover:underline"
          >
            Sign up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
