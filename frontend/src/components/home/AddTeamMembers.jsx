"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";
import { useDispatch, useSelector } from "react-redux";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";
import { FiArrowLeft, FiLoader, FiSend } from "react-icons/fi";

const AddTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([{ name: "", email: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const companyCode = useSelector((state) => state.user.companyCode);

  // Validation function
  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateAllMembers = () => {
    const newErrors = {};
    let hasValidMembers = false;
    const emailSet = new Set();

    teamMembers.forEach((member, index) => {
      const memberErrors = {};
      const name = member.name?.trim() || "";
      const email = member.email?.trim().toLowerCase() || "";

      // Validate name
      const nameError = validateField("name", name);
      if (nameError) memberErrors.name = nameError;

      // Validate email format
      const emailError = validateField("email", email);
      if (emailError) {
        memberErrors.email = emailError;
      } else {
        // Check for duplicates
        if (emailSet.has(email)) {
          memberErrors.email = "This email address is already added";
        } else {
          emailSet.add(email);
        }
      }

      // Check if this member is fully valid
      if (name && email && Object.keys(memberErrors).length === 0) {
        hasValidMembers = true;
      }

      if (Object.keys(memberErrors).length > 0) {
        newErrors[index] = memberErrors;
      }
    });

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    return { isValid, hasValidMembers };
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);

    // Clear API error and success message when user starts typing
    if (apiError) {
      setApiError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }

    // Validate the specific field
    const fieldError = validateField(field, value);

    // Check for duplicate emails if this is an email field
    let duplicateError = "";
    if (field === "email" && value.trim()) {
      const normalizedEmail = value.trim().toLowerCase();
      const isDuplicate = updatedMembers.some(
        (member, memberIndex) =>
          memberIndex !== index &&
          member.email.trim().toLowerCase() === normalizedEmail,
      );
      if (isDuplicate) {
        duplicateError = "This email address is already added";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: fieldError || duplicateError,
      },
    }));
  };

  const addTeamMember = () => {
    // Add new member to the beginning of the array
    setTeamMembers([{ name: "", email: "" }, ...teamMembers]);

    // Clear any existing errors for the new member
    setErrors((prev) => {
      const newErrors = { ...prev };
      // Shift all existing error indices by 1
      const shiftedErrors = {};
      Object.keys(newErrors).forEach((key) => {
        const numKey = parseInt(key);
        shiftedErrors[numKey + 1] = newErrors[key];
      });
      return shiftedErrors;
    });
  };

  const removeTeamMember = (index) => {
    if (teamMembers.length > 1) {
      const updatedMembers = [...teamMembers];
      updatedMembers.splice(index, 1);
      setTeamMembers(updatedMembers);

      // Update error indices
      setErrors((prev) => {
        const newErrors = {};
        Object.keys(prev).forEach((key) => {
          const numKey = parseInt(key);
          if (numKey < index) {
            newErrors[numKey] = prev[key];
          } else if (numKey > index) {
            newErrors[numKey - 1] = prev[key];
          }
        });
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, hasValidMembers } = validateAllMembers();

    if (!isValid) {
      return;
    }

    if (!hasValidMembers) {
      setApiError("Please add at least one team member with valid information");
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      // Filter out empty members and trim email addresses
      const validMembers = teamMembers
        .filter((member) => member.name.trim() && member.email.trim())
        .map((member) => ({
          name: member.name.trim(),
          email: member.email.trim(),
        }));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/invite-team/add-team-members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedbackRequests: validMembers, companyCode }),
        },
      );

      // Handle unauthorized access
      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();

      // Show success message
      setSuccessMessage(
        `Successfully sent ${data.data.insertedCount} Feedback Form(s)!`,
      );

      // Clear form after successful submission
      setTeamMembers([{ name: "", email: "" }]);
      setErrors({});

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error("Error adding team members:", err);
      setApiError(
        err.message || "Failed to send feedback requests. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if submit button should be disabled
  const isSubmitDisabled = () => {
    if (isSubmitting) return true;

    // Check if there's at least one valid member
    const hasValidMember = teamMembers.some(
      (member) =>
        member.name.trim() &&
        member.email.trim() &&
        !validateField("name", member.name) &&
        !validateField("email", member.email),
    );

    return !hasValidMember;
  };

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-[12px] pb-[50px]">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#f5f7ff" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/personalize-profile")}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <FiArrowLeft className="h-6 w-6 text-[var(--primary-color)]" />
          </motion.button>

          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h1 className="font-[Inter] text-3xl font-bold tracking-tight text-gray-900">
                Add Team Members
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-gray-600">
              Share your team member details to provide meaningful feedback on
              your leadership style and effectiveness.
            </p>
          </div>
        </div>

        <div className="relative w-full rounded-xl bg-white p-4 shadow-xl sm:p-6">
          <BorderBeam
            size={130}
            duration={10}
            colorFrom="var(--primary-color)"
            colorTo="#3b82f6"
            className="rounded-xl"
          />

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              <FaCheckCircle className="h-4 w-4 text-green-600" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* API Error Display */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <FaExclamationCircle className="h-4 w-4 text-red-600" />
              <span>{apiError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* Add Team Member Button - Placed at the top */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="text-sm font-medium text-[var(--primary-color)] transition-colors duration-200 hover:text-[#001fcc]"
                >
                  + Add another team member
                </button>
              </motion.div>

              {/* Team Members List - New members will appear at the top */}
              <AnimatePresence initial={false}>
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">
                        Team Member {index + 1}
                      </h3>
                      {teamMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-xs text-red-500 transition-colors duration-200 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, "name", e.target.value)
                        }
                        className={cn(
                          "w-full rounded-lg border px-4 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none",
                          errors[index]?.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                            : "border-gray-200 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]/50",
                        )}
                        placeholder="Enter team member name"
                        autoFocus={index === 0}
                      />
                      {errors[index]?.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].name}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) =>
                          handleMemberChange(index, "email", e.target.value)
                        }
                        className={cn(
                          "w-full rounded-lg border px-4 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none",
                          errors[index]?.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                            : "border-gray-200 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]/50",
                        )}
                        placeholder="Enter email address"
                      />
                      {errors[index]?.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[index].email}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </form>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center rounded-xl border border-[#d6e0ff] bg-white px-8 py-6 shadow-lg"
                >
                  <div className="relative mb-4 h-12 w-12">
                    <motion.div
                      className="absolute inset-0 rounded-full border-[3px] border-[var(--primary-color)] border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                  <motion.p
                    className="mb-6 text-sm font-medium text-gray-700"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Sending feedback requests...
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <motion.div
            whileHover={!isSubmitDisabled() ? { scale: 1.02 } : {}}
            whileTap={!isSubmitDisabled() ? { scale: 0.98 } : {}}
          >
            <RippleButton
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              rippleColor="rgba(0, 41, 255, 0.2)"
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg bg-[var(--primary-color)] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all",
                "hover:bg-[#0018a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color)]",
                "disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none",
                "transform-gpu active:scale-[0.98]", // subtle press effect
              )}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin mr-2" />
                  <span>Sending Invites...</span>
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4 mr-2" />
                  <span>Send Invites</span>
                </>
              )}
            </RippleButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMembers;
