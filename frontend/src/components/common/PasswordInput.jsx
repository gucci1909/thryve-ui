// src/components/PasswordInput.jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ 
  id,
  label,
  name,
  value,
  onChange,
  error,
  showError,
  className = ""
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-purple-700">
        {label}*
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-purple-200 bg-purple-50/50 p-3 pr-10 text-purple-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-300"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {showError && error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}