import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Mail, Lock, Info, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  companyName: yup
    .string()
    .required("Company name is required")
    .min(3, "Company name must be at least 3 characters")
    .max(50, "Company name must not exceed 50 characters"),
  hrName: yup
    .string()
    .required("HR name is required")
    .min(3, "HR name must be at least 3 characters")
    .max(50, "HR name must not exceed 50 characters"),
  hrEmail: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email")
    .max(254, "Email must not exceed 254 characters"),
  hrPassword: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
  aboutText: yup
    .string()
    .required("About company is required")
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters"),
});

function AddCompanyTab({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const handleFormSubmit = async (data) => {
    try {
      const response = await onSubmit(data);
      if (response && response.inviteCode) {
        setInviteCode(response.inviteCode);
        setShowSuccess(true);
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const watchedValues = watch();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="mx-auto max-w-4xl">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Company invitation sent successfully! 🎉
                </h3>
                {inviteCode && (
                  <p className="mt-1 text-sm text-green-700">
                    Invite code:{" "}
                    <span className="font-mono font-bold">{inviteCode}</span>
                  </p>
                )}
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="text-green-500 hover:text-green-600 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-xl bg-white shadow-lg"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center">
            <div className="rounded-lg bg-blue-50 p-3">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="ml-3 text-2xl font-bold text-gray-900">
              Add New Company
            </h2>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Company Name
                </label>
                <div className="relative">
                  <input
                    id="companyName"
                    type="text"
                    {...register("companyName")}
                    className={`block w-full rounded-lg border px-4 py-3 text-gray-600 ${
                      errors.companyName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } shadow-sm transition duration-200 focus:outline-none`}
                    placeholder="Enter company name"
                  />
                  {watchedValues.companyName && !errors.companyName && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
                {errors.companyName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 flex items-center text-sm text-red-600"
                  >
                    <X className="mr-1 h-4 w-4" />
                    {errors.companyName.message}
                  </motion.p>
                )}
              </div>

              {/* About Company */}
              <div>
                <label
                  htmlFor="aboutText"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  About Company
                </label>
                <div className="relative">
                  <textarea
                    id="aboutText"
                    rows={4}
                    {...register("aboutText")}
                    className={`block w-full rounded-lg border px-4 py-3 text-gray-600 ${
                      errors.aboutText
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } shadow-sm transition duration-200 focus:outline-none`}
                    placeholder="Tell us about the company (mission, culture, etc.)"
                  />
                  <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                    {watchedValues.aboutText?.length || 0}/5000
                  </div>
                </div>
                {errors.aboutText && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 flex items-center text-sm text-red-600"
                  >
                    <X className="mr-1 h-4 w-4" />
                    {errors.aboutText.message}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* HR Name */}
                <div>
                  <label
                    htmlFor="hrName"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    HR Manager Name
                  </label>
                  <div className="relative">
                    <input
                      id="hrName"
                      type="text"
                      {...register("hrName")}
                      className={`block w-full rounded-lg border px-4 py-3 text-gray-600 ${
                        errors.hrName
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      } shadow-sm transition duration-200 focus:outline-none`}
                      placeholder="Enter HR manager name"
                    />
                    {watchedValues.hrName && !errors.hrName && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  {errors.hrName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex items-center text-sm text-red-600"
                    >
                      <X className="mr-1 h-4 w-4" />
                      {errors.hrName.message}
                    </motion.p>
                  )}
                </div>

                {/* HR Email */}
                <div>
                  <label
                    htmlFor="hrEmail"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    HR Manager Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="hrEmail"
                      type="email"
                      {...register("hrEmail")}
                      className={`block w-full rounded-lg border px-4 py-3 pl-10 text-gray-600 ${
                        errors.hrEmail
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      } shadow-sm transition duration-200 focus:outline-none`}
                      placeholder="Enter HR manager email"
                    />
                    {watchedValues.hrEmail && !errors.hrEmail && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  {errors.hrEmail && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex items-center text-sm text-red-600"
                    >
                      <X className="mr-1 h-4 w-4" />
                      {errors.hrEmail.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* HR Password */}
              <div>
                <label
                  htmlFor="hrPassword"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  HR Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="hrPassword"
                    type="password"
                    {...register("hrPassword")}
                    className={`block w-full rounded-lg border px-4 py-3 pl-10 text-gray-600 ${
                      errors.hrPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    } shadow-sm transition duration-200 focus:outline-none`}
                    placeholder="Create a password"
                  />
                  {watchedValues.hrPassword && !errors.hrPassword && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
                {errors.hrPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 flex items-center text-sm text-red-600"
                  >
                    <X className="mr-1 h-4 w-4" />
                    {errors.hrPassword.message}
                  </motion.p>
                )}
                <p className="mt-2 flex items-center text-xs text-gray-500">
                  <Info className="mr-1 h-3 w-3" />
                  This will be the password for the HR manager to login.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                type="submit"
                disabled={!isValid || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full cursor-pointer justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm ${
                  !isValid || isSubmitting
                    ? "cursor-not-allowed bg-blue-300"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none`}
              >
                {isSubmitting ? (
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Invite Company"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default AddCompanyTab;
