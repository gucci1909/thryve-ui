import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { logout } from "../../store/userSlice";
import {
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiZap as FiLightning,
} from "react-icons/fi";
import {
  FaBrain,
  FaComments,
  FaGraduationCap,
  FaBalanceScale,
  FaTrophy,
  FaLightbulb,
} from "react-icons/fa";

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

  // Category configuration with icons and colors
  const categoryConfig = {
    "Communication & Clarity": {
      icon: FaComments,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      lightTextColor: "text-blue-600",
    },
    "Support & Development": {
      icon: FaGraduationCap,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      lightTextColor: "text-emerald-600",
    },
    "Decision-Making & Fairness": {
      icon: FaBalanceScale,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      lightTextColor: "text-purple-600",
    },
    "Recognition & Team Culture": {
      icon: FaTrophy,
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      lightTextColor: "text-amber-600",
    },
    "Empowerment & Motivation": {
      icon: FaLightbulb,
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
      bgGradient: "from-rose-50 to-rose-100",
      borderColor: "border-rose-200",
      textColor: "text-rose-800",
      lightTextColor: "text-rose-600",
    },
  };

  const cardVariants = {
    offscreen: {
      y: 50
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
    // hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20 },
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

  const insightCardVariants = {
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.5,
      },
    },
  };

  const sectionVariants = {
    collapsed: {
      height: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
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
    const config = categoryConfig[insight.category];
    const IconComponent = config.icon;

    return (
      <motion.div
        key={`${type}-${index}`}
        variants={insightCardVariants}
        className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        {/* Background gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} transition-opacity duration-300 group-hover:opacity-10`}
        />

        {/* Category header */}
        <div className="relative mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${config.gradient} shadow-lg`}
          >
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${config.textColor}`}>
              {insight.category}
            </h4>
            <div className="flex items-center gap-2">
              {/* <div className={`h-1.5 w-1.5 rounded-full bg-${config.color}-400`} /> */}
              <span className={`text-xs font-medium ${config.lightTextColor}`}>
                {type === "team" ? "Team Feedback" : "Self Assessment"}
              </span>
            </div>
          </div>
        </div>

        {/* Insight content */}
        <div className="relative">
          <p className="text-sm leading-relaxed text-gray-700">
            {insight.insights}
          </p>
        </div>

        {/* Decorative elements */}
        <div
          className={`absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br ${config.gradient} opacity-20 blur-sm`}
        />
        <div
          className={`absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-gradient-to-br ${config.gradient} opacity-15 blur-sm`}
        />
      </motion.div>
    );
  };

  if (loading) {
    return (
      <motion.div
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

  const ToggleButton = ({ isExpanded, color }) => {
    const colorClasses = {
      blue: "text-blue-600",
      purple: "text-purple-600",
    };

    return (
      <motion.div
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex h-8 w-14 items-center justify-center rounded-full bg-white/80 shadow-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-md"
      >
        {isExpanded ? (
          <FiChevronUp className={`h-4 w-4 ${colorClasses[color]}`} />
        ) : (
          <FiChevronDown className={`h-4 w-4 ${colorClasses[color]}`} />
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      className="mt-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-6 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="color-mix(in_srgb,#0029ff,white_50%)"
          className="z-0"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="bg-gradient-to-r from-[#0029ff] to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
              Team & Manager Insights
            </h2>
            <p className="text-sm text-gray-600">
              AI-powered analysis of your team feedback and leadership insights
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            // initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Team Insights Section */}
            <motion.div variants={itemVariants}>
              {/* Section Header - Non-card structure */}
              <button
                onClick={() => toggleSection("teamInsights")}
                className="group mb-6 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 text-left transition-all duration-300 hover:from-blue-100 hover:to-blue-200 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[210px]">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Team Feedback Insights
                    </h3>
                    <p className="text-sm text-blue-600">
                      How your team perceives your leadership across key areas
                    </p>
                  </div>
                </div>

                <ToggleButton
                  isExpanded={expandedSections.teamInsights}
                  color="blue"
                />
              </button>

              {/* Team Insights Content */}
              <AnimatePresence>
                {expandedSections.teamInsights && (
                  <motion.div
                    variants={sectionVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                      {insightsData?.insightsFromTeamToManager?.map(
                        (insight, index) =>
                          renderInsightCard(insight, index, "team"),
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Manager Insights Section */}
            <motion.div variants={itemVariants}>
              {/* Section Header - Non-card structure */}
              <button
                onClick={() => toggleSection("managerInsights")}
                className="group mb-6 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 p-4 text-left transition-all duration-300 hover:from-purple-100 hover:to-purple-200 focus:ring-2 focus:ring-purple-200 focus:ring-offset-2 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[210px]">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Manager Development Insights
                    </h3>
                    <p className="text-sm text-purple-600">
                      Your self-assessment and growth opportunities
                    </p>
                  </div>
                </div>
                <ToggleButton
                  isExpanded={expandedSections.managerInsights}
                  color="purple"
                />
              </button>

              {/* Manager Insights Content */}
              <AnimatePresence>
                {expandedSections.managerInsights && (
                  <motion.div
                    variants={sectionVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                      {insightsData?.managerInsights?.map((insight, index) =>
                        renderInsightCard(insight, index, "manager"),
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Action Call */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-green-800">
                  Ready to Take Action?
                </h4>
                <p className="text-sm text-green-700">
                  Use these insights to enhance your leadership effectiveness
                  and team collaboration. Focus on the areas that need
                  improvement and leverage your strengths.
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
