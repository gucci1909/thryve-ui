"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";
import { useDispatch, useSelector } from "react-redux";
import { FaExclamationCircle, FaCheckCircle, FaUser } from "react-icons/fa";
import {
  FiUsers,
  FiMail,
  FiSend,
  FiCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiArrowLeft,
  FiLoader,
  FiHelpCircle,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";

const SendMailToExistingTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  // Fetch existing team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/invite-team/get-existing-team-members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      setTeamMembers(data.data.teamMembers);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setApiError("Failed to load team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map((member) => member._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedMembers.length === 0) {
      setApiError("Please select at least one team member to send emails to.");
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/invite-team/resend-emails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ teamMemberIds: selectedMembers }),
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
      setSuccessMessage(data.message);

      // Clear selection after successful submission
      setSelectedMembers([]);

      // Refresh team members to get updated status
      await fetchTeamMembers();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error("Error resending emails:", err);
      setApiError(err.message || "Failed to resend emails. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnhancedStatusBadge = (status, assessment) => {
    const baseClasses =
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";

    if (assessment) {
      return (
        <motion.span
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`${baseClasses} bg-green-100 text-green-800`}
        >
          <FiCheckCircle className="mr-1 h-3 w-3" />
          Completed
        </motion.span>
      );
    }

    switch (status) {
      case "email_sent":
        return (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`${baseClasses} bg-blue-100 text-blue-800`}
          >
            <FiSend className="mr-1 h-3 w-3" />
            Sent
          </motion.span>
        );
      case "email_failed":
        return (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`${baseClasses} bg-red-100 text-red-800`}
          >
            <FiAlertCircle className="mr-1 h-3 w-3" />
            Failed
          </motion.span>
        );
      case "email_pending":
        return (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`${baseClasses} bg-yellow-100 text-yellow-800`}
          >
            <FiClock className="mr-1 h-3 w-3" />
            Pending
          </motion.span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <FiHelpCircle className="mr-1 h-3 w-3" />
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[#0029ff] border-r-[#0029ff]"></div>
          <div className="absolute inset-4 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#0029ff] opacity-20"></div>
        </div>
        <p className="text-lg font-medium text-gray-700">
          Loading your content
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-[12px] pb-[50px]">
      <div className="mx-auto max-w-4xl py-8">
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
                Resend Team Emails
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-gray-600">
              Select team members to resend feedback invitations.
            </p>
          </div>
        </div>

        <div className="relative w-full rounded-xl bg-white p-4 shadow-xl sm:p-6">
          <BorderBeam
            size={150}
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

          {teamMembers.length === 0 ? (
            <div className="py-12 text-center">
              <FaUser className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No team members found
              </h3>
              <p className="mb-6 text-gray-600">
                You haven't added any team members yet.
              </p>
              <RippleButton
                onClick={() => navigate("/personalize-add-team-members")}
                rippleColor="rgba(0, 41, 255, 0.3)"
                className="rounded-lg bg-[var(--primary-color)] px-6 py-2 text-white transition-colors duration-200 hover:bg-[#001fcc]"
              >
                Add Team Members
              </RippleButton>
            </div>
          ) : (
            <>
              {/* Select All Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white py-3"
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedMembers.length === teamMembers.length &&
                      teamMembers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-5 w-5 rounded-lg border-2 border-gray-200 bg-white text-[var(--primary-color)] transition-all checked:border-[var(--primary-color)] focus:ring-0"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">
                    Select All{" "}
                    <span className="text-gray-400">
                      ({selectedMembers.length}/{teamMembers.length})
                    </span>
                  </label>
                </motion.div>

                {selectedMembers.length > 0 && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="border-opacity-30 hover:border-opacity-100 flex items-center space-x-1 rounded-full border border-[var(--primary-color)] px-3 py-1 transition-colors"
                  >
                    <FiUsers className="h-4 w-4 text-[var(--primary-color)]" />
                    <span className="text-sm font-medium text-[var(--primary-color)]">
                      {selectedMembers.length} selected
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Team Members List */}
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all ${selectedMembers.includes(member._id) ? "ring-2 ring-[var(--primary-color)]" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          className="flex-shrink-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member._id)}
                            onChange={() => handleSelectMember(member._id)}
                            className="h-5 w-5 rounded-lg border-2 border-gray-200 bg-white text-[var(--primary-color)] transition-all checked:border-[var(--primary-color)] focus:ring-0"
                          />
                        </motion.div>

                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="bg-opacity-10 border-opacity-30 hover:border-opacity-100 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--primary-color)] px-3 py-1 font-medium text-[var(--primary-color)] transition-colors">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            {member.assessment && (
                              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 p-1">
                                <FiCheck className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {member.name}
                            </h3>
                            <div className="flex flex-row items-center space-x-2">
                              <FiMail className="h-[16px] w-[16px] text-gray-400" />
                              <p className="h-[15px] max-w-[180px] truncate text-sm leading-none text-gray-500">
                                {member.email}
                              </p>
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              {getEnhancedStatusBadge(
                                member.status,
                                member.assessment,
                              )}
                              <span className="text-xs text-gray-400">
                                <FiCalendar className="mr-0.5 inline h-3 w-3" />
                                {formatDate(member.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-[var(--primary-color)] hover:text-white"
                      >
                        <FiSend className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

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
                    Resending emails...
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        {teamMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 flex justify-end"
          >
            <RippleButton
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedMembers.length === 0}
              rippleColor="rgba(0, 41, 255, 0.2)"
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl bg-[var(--primary-color)] px-6 py-2.5 text-sm font-medium text-white shadow-lg",
                "transition-all duration-200 hover:bg-[#0018a8] hover:shadow-xl",
                "focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:outline-none",
                "transform-gpu active:scale-[0.98]",
                isSubmitting || selectedMembers.length === 0
                  ? "cursor-not-allowed opacity-70 hover:bg-[var(--primary-color)]"
                  : "hover:shadow-[0_4px_12px_rgba(0,41,255,0.2)]",
              )}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FiSend className="mr-2 h-4 w-4" />
                  <span>
                    Resend to {selectedMembers.length}{" "}
                    {selectedMembers.length === 1 ? "member" : "members"}
                  </span>
                </>
              )}
            </RippleButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SendMailToExistingTeamMembers;
