import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  MessageSquare,
  Target,
  BookOpen,
  Award,
  Flame,
  BarChart2,
  Clock,
  Zap,
  Lightbulb,
  ArrowLeft,
  ThumbsUp,
  ChevronRight,
  Target as TargetIcon,
  BookOpen as BookOpenIcon,
  Users as UsersIcon,
  Star as StarIcon,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import ReactApexChart from "react-apexcharts";

const SingleManager = () => {
  const [manager, setManager] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [npsScore, setNPSScore] = useState(0);
  const location = useLocation();
  const state = location.state;

  const navigate = useNavigate();
  const { managerId } = useParams();
  const { token } = useSelector((state) => state.user);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch manager details
  const fetchManagerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/managers/single-manager?manager_id=${managerId}&companyId=${state?.companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setNPSScore(data.scores_from_team_nps || 0);
        setManager(data.manager);
      }
    } catch (error) {
      console.error("Error fetching manager details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch learning plans
  const fetchLearningPlans = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/managers/manager-learning-plan?manager_id=${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setLearningPlans(data.learningPlans);
      }
    } catch (error) {
      console.error("Error fetching learning plans:", error);
    }
  };

  useEffect(() => {
    fetchManagerDetails();
    // fetchLearningPlans();
  }, [managerId]);

  const getScoreCategory = (score) => {
    const numericScore = parseFloat(score);
    if (numericScore >= 50)
      return {
        category: "Excellent",
        color: "#10B981",
        bgColor: "#D1FAE5",
        emoji: "😍",
        gradient: ["#10B981", "#059669"],
      };
    if (numericScore >= 30)
      return {
        category: "Great",
        color: "#22C55E",
        bgColor: "#BBF7D0",
        emoji: "😊",
        gradient: ["#22C55E", "#16A34A"],
      };
    if (numericScore >= 0)
      return {
        category: "Good",
        color: "#3B82F6",
        bgColor: "#BFDBFE",
        emoji: "🙂",
        gradient: ["#3B82F6", "#2563EB"],
      };
    if (numericScore >= -30)
      return {
        category: "Needs Work",
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        emoji: "😕",
        gradient: ["#F59E0B", "#D97706"],
      };
    return {
      category: "Poor",
      color: "#EF4444",
      bgColor: "#FEE2E2",
      emoji: "😞",
      gradient: ["#EF4444", "#DC2626"],
    };
  };

  const npsCategory = getScoreCategory(npsScore || 0);
  const chartOptions = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeOutElastic",
        speed: 1200,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: true,
        top: 4,
        left: 0,
        blur: 12,
        opacity: 0.2,
      },
      foreColor: "#1F2937",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 8,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val > 0 ? "+" : ""}${Math.round(val)} ${npsCategory.emoji}`;
      },
      style: {
        fontSize: "14px",
        fontWeight: 700,
        colors: ["#111827"],
      },
      offsetY: -8,
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        opacity: 1,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Manager NPS"],
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: [npsCategory.color],
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Score",
        style: {
          color: "#6B7280",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
      min: -100,
      max: 100,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: ["#6b7280"],
        },
        formatter: function (val) {
          return val > 0 ? `+${Math.round(val)}` : Math.round(val);
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.6,
        gradientToColors: [npsCategory.gradient[1]],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    colors: [npsCategory.gradient[0]],
    tooltip: {
      enabled: true,
      shared: false,
      followCursor: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
      },
      y: {
        formatter: function (val) {
          return `${npsCategory.emoji} Manager NPS: ${val > 0 ? "+" : ""}${Math.round(val)}`;
        },
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const category = getScoreCategory(value);
        return `
          <div style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            font-family: Inter, sans-serif;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            ">
              <span style="font-size: 16px;">${category.emoji}</span>
              <span style="
                font-weight: 600;
                color: ${category.color};
                font-size: 14px;
              ">${category.category}</span>
            </div>
            <div style="
              font-size: 18px;
              font-weight: 700;
              color: #111827;
            ">
              ${value > 0 ? "+" : ""}${Math.round(value)} NPS Score
            </div>
          </div>
        `;
      },
    },
    legend: { show: false },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: {
        lines: {
          show: true,
          color: "#e5e7eb",
        },
      },
      padding: { top: 20, right: 20, bottom: 0, left: 20 },
    },
  };

  const chartSeries = [
    {
      name: "NPS Score",
      data: [parseFloat(npsScore || 0)],
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-[#0029ff] border-t-transparent"
        />
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Users className="text-gray-400" size={32} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Manager Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The manager you're looking for doesn't exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/founder-dashboard")}
            className="rounded-lg bg-[#0029ff] px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:shadow-md"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <div className="p-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/founder-dashboard")}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-[#0029ff]"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0029ff] to-[#1a4bff]">
                  <span className="text-lg font-bold text-white">
                    {manager.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {manager.name}
                  </h1>
                  <p className="text-xs text-gray-500">{manager.email}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
                  <img
                    src="/logo-thryve.png"
                    alt="Thryve Logo"
                    className="h-8 w-auto"
                  />
                </div>
                <h1 className="text-2xl font-bold text-[#0029ff]">thryve</h1>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {/* Points Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm"
          >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-blue-200 opacity-20"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="text-blue-500" size={18} />
                  <p className="text-sm font-medium text-blue-600">Points</p>
                </div>
                <p className="mt-1 text-2xl font-bold text-blue-500">
                  {manager.points || 0}
                </p>
                <p className="mt-1 text-xs text-blue-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="ml-1">Earned from activities</span>
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                }}
                className="rounded-lg bg-blue-100 p-2 text-blue-600"
              >
                <Award size={20} />
              </motion.div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-4 shadow-sm"
          >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-amber-200 opacity-20"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="text-amber-500" size={18} />
                  <p className="text-sm font-medium text-amber-600">
                    Current Streak
                  </p>
                </div>
                <p className="mt-1 text-2xl font-bold text-amber-600">
                  {manager.streak || 0}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    {manager.streak > 1 ? "days" : "day"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-amber-500">
                  <span className="ml-1">Daily engagement</span>
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="rounded-lg bg-amber-100 p-2 text-amber-600"
              >
                <Flame size={20} />
              </motion.div>
            </div>
          </motion.div>

          {/* Team Members Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative overflow-hidden rounded-xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-4 shadow-sm"
          >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-green-200 opacity-20"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="text-green-500" size={18} />
                  <p className="text-sm font-medium text-green-600">
                    Team Members
                  </p>
                </div>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {manager.teamMembers || 0}
                </p>
                <p className="mt-1 text-xs text-green-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="ml-1">Providing feedback</span>
                </p>
              </div>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="rounded-lg bg-green-100 p-2 text-green-600"
              >
                <Users size={20} />
              </motion.div>
            </div>
          </motion.div>

          {/* NPS Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-4 shadow-sm"
          >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-purple-200 opacity-20"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="text-purple-500" size={18} />
                  <p className="text-sm font-medium text-purple-600">
                    Manager NPS
                  </p>
                </div>
                <p className="mt-1 text-2xl font-bold text-purple-600">
                  {npsScore || 0} %
                  <span className="ml-1">{npsCategory.emoji}</span>
                </p>
                <p className="mt-1 text-xs text-purple-500">
                  <span className="font-medium">{npsCategory.category}</span>
                  <span className="mx-1">•</span>
                  <span>From feedback</span>
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="rounded-lg bg-purple-100 p-2 text-purple-600"
              >
                <BarChart2 size={20} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid - NPS Graph, Activity & Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* NPS Graph - Left Side */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0029ff] text-white">
                    <BarChart2 size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Net Promoter Score
                  </h3>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${npsCategory.color}20`,
                    color: npsCategory.color,
                  }}
                >
                  {npsCategory.category}
                </span>
              </div>
              <div className="h-[200px]">
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                  height="100%"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>-100 (Poor)</span>
                <span>0 (Neutral)</span>
                <span>+100 (Excellent)</span>
              </div>
            </div>
          </div>

          {/* Activity & Feedback - Right Side */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-2">
            {/* Activity */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0029ff] text-white">
                  <Zap size={16} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Activity Overview
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-blue-500" size={16} />
                    <span className="text-sm font-medium text-blue-500">
                      Chat Sessions
                    </span>
                  </div>
                  <span className="font-bold text-blue-500">
                    {manager.chats || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="text-purple-500" size={16} />
                    <span className="text-sm font-medium text-purple-500">
                      Role Play Sessions
                    </span>
                  </div>
                  <span className="font-bold text-purple-500">
                    {manager.rolePlays || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-green-500" size={16} />
                    <span className="text-sm font-medium text-green-500">
                      Learning Cards Read
                    </span>
                  </div>
                  <span className="font-bold text-green-500">
                    {manager.learningInteractions || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <Target className="text-orange-500" size={16} />
                    <span className="text-sm font-medium text-orange-500">
                      Goals Set
                    </span>
                  </div>
                  <span className="font-bold text-orange-500">
                    {manager.goals?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0029ff] text-white">
                  <Star size={16} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Feedback & Insights
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="text-blue-500" size={16} />
                    <span className="text-sm font-medium text-blue-500">
                      Coaching Feedback ("Yes, Got it")
                    </span>
                  </div>
                  <span className="font-bold text-blue-500">
                    {manager.chatFeedbackCoaching || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="text-green-500" size={16} />
                    <span className="text-sm font-medium text-green-500">
                      Role Play Feedback ("Yes, Got it")
                    </span>
                  </div>
                  <span className="font-bold text-green-500">
                    {manager.chatFeedbackRolePlay || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="text-purple-500" size={16} />
                    <span className="text-sm font-medium text-purple-500">
                      Reflections Added
                    </span>
                  </div>
                  <span className="font-bold text-purple-500">
                    {manager.reflections?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="text-amber-500" size={16} />
                    <span className="text-sm font-medium text-amber-500">
                      Team Members Feedback Received
                    </span>
                  </div>
                  <span className="font-bold text-amber-500">
                    {manager.teamMembers || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {manager.goals?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6"
          >
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg">
                    <Target className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Goals & Objectives
                    </h3>
                    <p className="text-sm text-gray-500">
                      {manager.goals.length} active{" "}
                      {manager.goals.length === 1 ? "goal" : "goals"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Scroll to view all
                  </span>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              </div>

              <div className="scrollbar-hide max-h-96 overflow-y-auto pr-2">
                <div className="space-y-4 pr-2">
                  {manager.goals.map((goal) => (
                    <div
                      key={goal._id}
                      className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-5 shadow-sm"
                    >
                      <div className="absolute inset-y-0 left-0 w-1.5 rounded-r-full bg-gradient-to-b from-blue-600 to-blue-500"></div>
                      <div className="pl-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              {goal.title}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                              {goal.value}
                            </p>
                          </div>
                          <span
                            className={`ml-4 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                              goal.current_status === "completed"
                                ? "border border-green-200 bg-green-100 text-green-800"
                                : goal.current_status === "in-progress"
                                  ? "border border-amber-200 bg-amber-100 text-amber-800"
                                  : "border border-gray-200 bg-gray-100 text-gray-800"
                            }`}
                          >
                            {goal.current_status.replace("-", " ")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>
                                Due:{" "}
                                {new Date(goal.deadline).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            {goal.current_status === "completed" && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2
                                  size={14}
                                  className="text-green-500"
                                />
                                <span className="text-xs font-medium">
                                  Completed
                                </span>
                              </div>
                            )}
                          </div>

                          {goal.current_status !== "completed" && (
                            <div className="flex items-center gap-3">
                              <div className="text-xs text-gray-500">
                                Progress
                              </div>
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    goal.current_status === "in-progress"
                                      ? "w-2/3 bg-gradient-to-r from-amber-400 to-amber-500"
                                      : "w-1/4 bg-gradient-to-r from-gray-400 to-gray-500"
                                  }`}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-600">
                                {goal.current_status === "in-progress"
                                  ? "66%"
                                  : "25%"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SingleManager;
