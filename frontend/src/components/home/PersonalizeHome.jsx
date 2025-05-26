import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMessageSquare } from "react-icons/fi";
import { BorderBeam } from "../magicui/border-beam";
import { GiTargetDummy } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { useSelector } from "react-redux";

function PersonalizeHomePage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchLeadershipReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/onboarding/leadership-report`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leadership report");
        }

        const data = await response.json();
        setReportData(data.data.assessment);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leadership report:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchLeadershipReport();
    }
  }, [token]);

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-[var(--background-color)]">
        {/* Modern fluid loader */}
        <div className="relative h-20 w-20">
          {/* Animated border with gradient */}
          <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[var(--primary-color)] border-r-[var(--primary-color)]"></div>

          {/* Center pulse effect */}
          <div className="absolute inset-4 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[var(--primary-color)] opacity-20"></div>
        </div>

        {/* Loading text with progress animation */}
        <div className="text-center">
          <p className="mb-2 text-lg font-medium text-[var(--text-color)]">
            Loading your content
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="mt-4 flex-1 overflow-y-auto px-5 pb-24">
      {/* Growth Recommendations Card */}
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-6 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
          {/* Border Beam Effect */}
          <BorderBeam
            size={150}
            duration={10}
            colorFrom="var(--primary-color)"
            colorTo="color-mix(in_srgb,var(--primary-color),white_50%)"
            className="z-0"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <motion.h2
                  className="bg-gradient-to-r from-[var(--primary-color)] to-blue-400 bg-clip-text text-2xl font-bold text-transparent"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Leadership Action Plan
                </motion.h2>

                <motion.p
                  className="mt-3 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Your personalized roadmap for leadership excellence, crafted
                  from your unique strengths and growth opportunities.
                </motion.p>

                {/* Recommendations Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Continue Doing */}
                  <motion.div
                    className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition-all hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 p-1.5">
                          <svg
                            className="h-4 w-4 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <h3 className="font-semibold text-emerald-700">
                          Continue Doing
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {reportData?.recommendations["do-more"]}
                      </p>
                    </div>
                  </motion.div>

                  {/* Start Doing */}
                  <motion.div
                    className="group relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition-all hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 p-1.5">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </span>
                        <h3 className="font-semibold text-blue-700">
                          Start Doing
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {reportData?.recommendations.start}
                      </p>
                    </div>
                  </motion.div>

                  {/* Do Less */}
                  <motion.div
                    className="group relative overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm transition-all hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-amber-100 p-1.5">
                          <svg
                            className="h-4 w-4 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </span>
                        <h3 className="font-semibold text-amber-700">
                          Do Less
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {reportData?.recommendations["do-less"]}
                      </p>
                    </div>
                  </motion.div>

                  {/* Stop Doing */}
                  <motion.div
                    className="group relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm transition-all hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-red-100 p-1.5">
                          <svg
                            className="h-4 w-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                        <h3 className="font-semibold text-red-700">
                          Stop Doing
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {reportData?.recommendations.stop}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Learning Modules */}
      <div className="mt-7 space-y-5">
        {[
          "Alignment with your Management",
          "Managing High Performers",
          "Growing your team",
          "Conflict Resolution",
          "Strategic Decision Making",
          "Team Motivation",
        ].map((title, index) => (
          <motion.div
            key={index}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
            <div className="rounded-xl border border-white/20 bg-white/90 p-5 shadow-[0_5px_20px_-5px_rgba(0,41,255,0.1)] backdrop-blur-sm">
              <div className="flex items-start">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[var(--primary-color)]">
                    {title}
                  </h2>
                  <p className="mt-1.5 text-[color-mix(in_srgb,var(--primary-color),black_30%)]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi sit amet faucibus sapien.
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4 text-xl">
                      <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                        <FiMessageSquare />
                      </button>
                      <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                        <GiTargetDummy />
                      </button>
                      <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                        <AiOutlineQuestionCircle />
                      </button>
                      <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                        <BsBookmark />
                      </button>
                    </div>
                    <button className="flex items-center text-sm font-bold text-[var(--primary-color)] hover:text-[color-mix(in_srgb,var(--primary-color),black_20%)]">
                      Explore <FiArrowRight className="ml-1.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default PersonalizeHomePage;
