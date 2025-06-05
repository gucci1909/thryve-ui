"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";

const Feedback = ({ onNext, onBack }) => {
  const [teamMembers, setTeamMembers] = useState([{ name: "", email: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const companyCode = useSelector((state) => state.user.companyCode);


  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    // Add new member to the beginning of the array
    setTeamMembers([{ name: "", email: "" }, ...teamMembers]);
  };

  const removeTeamMember = (index) => {
    if (teamMembers.length > 1) {
      const updatedMembers = [...teamMembers];
      updatedMembers.splice(index, 1);
      setTeamMembers(updatedMembers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/invite-team/add-team-members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedbackRequests: teamMembers, companyCode }),
        }
      );

      // Handle unauthorized access
      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Wait for a short delay to show the loading state
      setTimeout(() => {
        onNext({ feedbackRequests: data.data.teamMembers });
      }, 800);
      
    } catch (err) {
      console.error("Error adding team members:", err);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl sm:p-6">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="var(--primary-color)"
          colorTo="#3b82f6"
          className="rounded-xl"
        />

        {/* Header */}
        <div className="mb-2">
          <motion.h2
            className="text-lg font-bold text-gray-900 sm:text-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Invite Team Feedback
          </motion.h2>
        </div>

        <motion.p
          className="mb-3 text-sm text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Invite your team to provide feedback on your coaching goals.
        </motion.p>

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
                className="text-sm font-medium text-[var(--primary-color)] hover:text-[#001fcc]"
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
                        className="text-xs text-gray-500 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:outline-none"
                      placeholder="Enter team member name"
                      autoFocus={index === 0} // Auto-focus the first field of new members
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:outline-none"
                      placeholder="Enter email address"
                    />
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

      {/* Sticky Navigation */}
      <div className="relative min-h-auto pb-24">
        <motion.div
          className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mx-auto flex max-w-3xl justify-end gap-4">
            <RippleButton
              type="button"
              onClick={() => onNext({ feedbackRequests: [] })}
              rippleColor="rgba(0, 41, 255, 0.15)"
              className="flex items-center justify-center gap-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
              whileHover={{ scale: 1.03 }}
            >
              Skip for later
            </RippleButton>

            <RippleButton
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              rippleColor="rgba(0, 41, 255, 0.3)"
              className={cn(
                "flex items-center justify-center gap-1 bg-[var(--primary-color)] text-white hover:bg-[#001fcc]",
                isSubmitting ? "cursor-not-allowed opacity-80" : "",
              )}
              whileHover={{
                scale: isSubmitting ? 1 : 1.03,
                boxShadow: isSubmitting
                  ? "none"
                  : "0 2px 8px rgba(0, 41, 255, 0.2)",
              }}
            >
              Submit
            </RippleButton>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Feedback;