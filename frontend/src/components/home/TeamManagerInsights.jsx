import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { logout } from "../../store/userSlice";
import {
  FiUsers,
  FiTrendingUp,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiTarget,
  FiHeart,
  FiZap,
  FiStar,
  FiAward,
} from "react-icons/fi";
import { FaBrain, FaHandshake, FaRocket } from "react-icons/fa";

function TeamManagerInsights() {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPendingResult, setHasPendingResult] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    teamInsights: true,
    managerInsights: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.6,
      },
    },
  };

  useEffect(() => {
    const fetchTeamManagerInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/team-and-manager-score/insights`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const statusCode = response.status;
        if (statusCode === 401) {
          dispatch(logout());
          navigate("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch team and manager insights");
        }

        const data = await response.json();

        if (data.pending_result) {
          setHasPendingResult(true);
          setInsightsData(null);
        } else {
          setHasPendingResult(false);
          setInsightsData(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching team and manager insights:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchTeamManagerInsights();
    }
  }, [token, dispatch, navigate]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderInsightCard = (insight, index, type) => {
    const icons = {
      team: [FiUsers, FiMessageSquare, FiHeart, FiStar],
      manager: [FiTrendingUp, FiTarget, FiZap],
    };
    const IconComponent = icons[type][index % icons[type].length];

    return (
      <motion.div
        key={index}
        variants={itemVariants}
        className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
            <IconComponent className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-gray-700">{insight}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-64 items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[#0029ff] border-r-[#0029ff]"></div>
            <div className="absolute inset-4 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#0029ff] opacity-20"></div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Generating Manager & Team Insights
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Analyzing feedback and creating personalized insights...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-64 items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiMessageSquare className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </motion.div>
    );
  }

  if (hasPendingResult) {
    return (
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        className="mt-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
          <BorderBeam
            size={150}
            duration={10}
            colorFrom="#F59E0B"
            colorTo="color-mix(in_srgb,#F59E0B,white_50%)"
            className="z-0"
          />

          <div className="relative z-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <FaBrain className="h-10 w-10 text-amber-600" />
            </div>

            <h3 className="mb-4 text-xl font-bold text-amber-800">
              Awaiting Team Feedback
            </h3>

            <p className="mb-6 leading-relaxed text-amber-700">
              Your team members haven't provided feedback yet. Once they
              complete their assessments, we'll generate personalized insights
              showing how your team perceives your leadership and provide
              actionable recommendations for improvement.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400"></div>
              <span>Waiting for team responses...</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      className="mt-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-4 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="color-mix(in_srgb,#0029ff,white_50%)"
          className="z-0"
        />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div>
              <h2 className="bg-gradient-to-r from-[#0029ff] to-blue-600 bg-clip-text text-xl font-bold text-transparent">
                Team & Manager Insights
              </h2>
              <p className="text-sm text-gray-600">
                AI-powered analysis of your team feedback and leadership
                insights
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Team Insights Section */}
            <motion.div
              variants={itemVariants}
              className="overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white shadow-sm"
            >
              <button
                onClick={() => toggleSection("teamInsights")}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-blue-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <FiUsers className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      Team Feedback Insights
                    </h3>
                    <p className="text-sm text-blue-600">
                      How your team perceives your leadership
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.teamInsights ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedSections.teamInsights ? (
                    <FiChevronUp className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-blue-600" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedSections.teamInsights && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-blue-100 bg-white p-4">
                      <div className="space-y-3 text-gray-600">
                        {insightsData?.insightsFromTeamToManager}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Manager Insights Section */}
            <motion.div
              variants={itemVariants}
              className="overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-white shadow-sm"
            >
              <button
                onClick={() => toggleSection("managerInsights")}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-purple-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <FiTrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800">
                      Manager Development Insights
                    </h3>
                    <p className="text-sm text-purple-600">
                      Personalized recommendations for growth
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{
                    rotate: expandedSections.managerInsights ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedSections.managerInsights ? (
                    <FiChevronUp className="h-5 w-5 text-purple-600" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-purple-600" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedSections.managerInsights && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-purple-100 bg-white p-4">
                      <div className="space-y-3 text-gray-600">
                        {insightsData?.managerInsights}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Action Call */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <FaRocket className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">
                  Ready to Take Action?
                </h4>
                <p className="text-sm text-green-700">
                  Use these insights to enhance your leadership effectiveness
                  and team collaboration.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default TeamManagerInsights;
