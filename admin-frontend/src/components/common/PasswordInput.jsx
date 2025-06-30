"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  id,
  label,
  name,
  value,
  onChange,
  error,
  showError,
  className = "",
  placeholder = "",
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={`mb-1 block text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}>
          {label}
          {/* {required && <span className="text-red-500">*</span>} */}
        </label>
      )}
      
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border ${
            error && showError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } bg-white p-3 pr-10 text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
            disabled ? "cursor-not-allowed bg-gray-100 opacity-50" : ""
          }`}
          // required
        />
        
        <motion.button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          whileTap={{ scale: 0.95 }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 ${
            isFocused ? "text-blue-500" : "text-gray-400"
          } hover:text-blue-600 focus:outline-none ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={showPassword ? "show" : "hide"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 cursor-pointer" />
              ) : (
                <Eye className="h-5 w-5 cursor-pointer" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showError && error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}