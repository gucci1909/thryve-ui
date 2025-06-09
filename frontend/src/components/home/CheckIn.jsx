"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiArrowLeft,
  FiTarget,
  FiTrash2,
  FiCalendar,
  FiAward,
  FiFlag,
  FiPlayCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiFeather,
  FiX,
} from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../store/userSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const CheckIn = ({ pointAdded, setPointAdded }) => {
  const [view, setView] = useState("main");
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalValue, setNewGoalValue] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReflection, setNewReflection] = useState("");
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  // Fetch goals from API
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals-list/goals`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        // Clear the authToken cookie
        removeCookie("authToken", { path: "/" });
        dispatch(logout());

        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      const data = await response.json();
      setGoals(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch reflections from API
  const fetchReflections = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals-list/reflections`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch reflections");
      }

      const data = await response.json();
      setReflections(data.data);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      setError(error.message);
    }
  };

  // Add new goal
  const addGoal = async () => {
    if (newGoalTitle.trim() && newGoalValue.trim() && newGoalDeadline) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/goals-list/add-goals`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: newGoalTitle,
              value: newGoalValue,
              deadline: new Date(newGoalDeadline).toISOString(),
              current_status: "started",
            }),
          },
        );

        if (response.status === 401) {
          removeCookie("authToken", { path: "/" });
          dispatch(logout());
          navigate("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to add goal");
        }

        const data = await response.json();
        setGoals([...goals, data.data]);
        setNewGoalTitle("");
        setNewGoalValue("");
        setNewGoalDeadline("");
        setShowAddGoal(false);
      } catch (error) {
        console.error("Error adding goal:", error);
        setError(error.message);
      }
    }
  };

  // Add new reflection
  const addReflection = async () => {
    if (!newReflection.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals-list/add-reflection`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newReflection,
            date: new Date().toISOString(),
          }),
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add reflection");
      }

      const data = await response.json();
      setReflections([data.data, ...reflections]);
      setNewReflection("");
      setShowReflectionInput(false);
    } catch (error) {
      console.error("Error adding reflection:", error);
      setError(error.message);
    } finally {
      setPointAdded(true);
    }
  };

  // Delete goal
  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals-list/delete-goal`,
        {
          method: "DELETE",
          body: JSON.stringify({ goalId }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      setGoals(goals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError(error.message);
    }
  };

  // Change goal status
  const changeGoalStatus = async (goalId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals-list/change-status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalId,
            current_status: newStatus,
          }),
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update goal status");
      }

      setGoals(
        goals.map((goal) =>
          goal._id === goalId ? { ...goal, current_status: newStatus } : goal,
        ),
      );
    } catch (error) {
      console.error("Error updating goal status:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGoals();
      fetchReflections();
    }
  }, [token]);

  const getStatusButtons = (goal) => {
    const statuses = ["started", "deprecated", "completed"];
    return (
      <div className="mt-4 flex flex-wrap gap-1">
        {statuses
          .filter((status) => status !== goal.current_status)
          .map((status) => (
            <button
              key={status}
              onClick={() => changeGoalStatus(goal._id, status)}
              className="rounded px-2 py-1 text-xs capitalize"
              style={{
                backgroundColor:
                  status === "completed"
                    ? "#e6ffed"
                    : status === "deprecated"
                      ? "#ffebee"
                      : "#e3f2fd",
                color:
                  status === "completed"
                    ? "#135c2d"
                    : status === "deprecated"
                      ? "#b71c1c"
                      : "#0d47a1",
                border: `1px solid ${
                  status === "completed"
                    ? "#9be9a8"
                    : status === "deprecated"
                      ? "#ffcdd2"
                      : "#bbdefb"
                }`,
              }}
            >
              {status}
            </button>
          ))}
      </div>
    );
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "workspace":
        return "bg-blue-100 text-blue-800";
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "team":
        return "bg-green-100 text-green-800";
      case "personal":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;

    // Count completed goals
    const completedCount = goals.filter(
      (goal) => goal.current_status === "completed",
    ).length;

    // Calculate percentage
    const percentage = (completedCount / goals.length) * 100;

    return Math.round(percentage);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex-1 overflow-y-auto px-5 pb-24">
      <AnimatePresence mode="wait">
        {view === "main" ? (
          <motion.div
            key="main"
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            {/* Your Goals Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setView("goals")}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:border-[var(--primary-color)]/30 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-blue-400 p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <FiTarget className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Your Goals
                    </h3>
                    <p className="text-sm text-gray-500">
                      {goals.length} active{" "}
                      {goals.length === 1 ? "goal" : "goals"}
                    </p>
                  </div>
                </div>
                <div className="relative h-20 w-20">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#blue-gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${calculateOverallProgress()}, 100`}
                    />
                    <defs>
                      <linearGradient
                        id="blue-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "var(--primary-color)" }}
                        />
                        <stop offset="100%" style={{ stopColor: "#60A5FA" }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">
                      {calculateOverallProgress()}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Reflections */}
            <div>
              <motion.div className="m-auto mb-8 flex flex-col items-center justify-center">
                <div className="relative inline-block">
                  <h2 className="relative z-10 text-2xl font-bold text-[var(--primary-color)]">
                    Daily Reflections
                  </h2>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-transparent" />
                </div>
              </motion.div>

              {/* Add Reflection Button when there are existing reflections */}
              {!showReflectionInput && reflections.length > 0 && (
                <motion.button
                  onClick={() => setShowReflectionInput(true)}
                  className="mb-6 w-full rounded-xl border-2 border-dashed border-[var(--primary-color)]/30 bg-white p-4 text-center text-[var(--primary-color)] transition-all hover:border-[var(--primary-color)]/50 hover:bg-[var(--primary-color)]/5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiFeather className="h-5 w-5" />
                    <span className="font-medium">Add Daily Reflection</span>
                  </div>
                </motion.button>
              )}

              {/* Empty State */}
              {reflections.length === 0 && !showReflectionInput && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-white to-blue-50/30 p-10 text-center"
                >
                  <div className="rounded-full bg-[var(--primary-color)]/10 p-4">
                    <FiFeather className="h-8 w-8 text-[var(--primary-color)]" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    Start Your Reflection Journey
                  </h3>
                  <p className="mt-2 max-w-md text-gray-600">
                    Track your progress and thoughts with daily reflections.
                    Each entry helps you grow and learn.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReflectionInput(true)}
                    className="mt-6 flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[var(--primary-color)]/90"
                  >
                    <FiPlus className="h-4 w-4" />
                    Write Your First Reflection
                  </motion.button>
                </motion.div>
              )}

              {/* Reflection Input */}
              {showReflectionInput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 overflow-hidden rounded-2xl border border-[var(--primary-color)]/20 bg-white p-6 shadow-lg"
                >
                  <textarea
                    value={newReflection}
                    onChange={(e) => setNewReflection(e.target.value)}
                    placeholder="What's on your mind today? Share your thoughts, learnings, and experiences..."
                    className="min-h-[120px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-gray-700 placeholder:text-gray-400 focus:border-[var(--primary-color)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none"
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowReflectionInput(false);
                        setNewReflection("");
                      }}
                      className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addReflection}
                      className="flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[var(--primary-color)]/90 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      <FiFeather className="h-4 w-4" />
                      Save Reflection
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Reflections List */}
              {reflections.length > 0 && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {reflections.map((reflection) => (
                      <motion.div
                        key={reflection.reflectionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:border-[var(--primary-color)]/20 hover:shadow-lg"
                      >
                        <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] group-hover:bg-[var(--primary-color)]/20">
                            <FiFeather className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="hidden sm:block">
                              {new Date(reflection.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                            <div className="sm:hidden">
                              {new Date(reflection.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm break-words text-gray-700 sm:text-base">
                          {reflection.content}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl space-y-8"
          >
            {/* Header with back button and add goal */}
            {/* {!showAddGoal && goals.length === 0 && ( */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setView("main")}
                  className="flex items-center gap-2 rounded-lg bg-[var(--primary-color)]/10 px-4 py-2 text-[var(--primary-color)] transition-colors hover:bg-[var(--primary-color)]/20"
                >
                  <FiArrowLeft />
                  Back
                </button>
                <Button
                  onClick={() => setShowAddGoal(true)}
                  className="flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-5 py-2.5 text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[var(--primary-color)]/90 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Goal
                </Button>
              </div>
            {/* )} */}

            {/* Hero section with image and title */}
            {!showAddGoal && goals.length === 0 && (
              <motion.div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-color)]/5 to-blue-50 p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
                  {/* Text content */}
                  <div className="flex-1 space-y-4">
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="rounded-xl bg-[var(--primary-color)] p-3 text-white shadow-lg"
                      >
                        <FaBullseye className="h-6 w-6" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-[var(--primary-color)]">
                        Your Goals Journey
                      </h3>
                    </motion.div>
                    <p className="max-w-2xl text-lg text-gray-600">
                      Track your progress and celebrate your achievements. Every
                      step counts towards your success.
                    </p>
                    <Button
                      onClick={() => setShowAddGoal(true)}
                      className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-6 py-3 text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[var(--primary-color)]/90 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      <FiPlus className="h-5 w-5" />
                      Add New Goal
                    </Button>
                  </div>

                  {/* Image container */}
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative h-48 w-full md:h-64">
                      <img
                        src="/goals.png"
                        alt="Goal achievement illustration"
                        className="h-full w-full object-contain drop-shadow-xl"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[var(--primary-color)] opacity-5"></div>
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-400 opacity-5"></div>
              </motion.div>
            )}

            {/* Add Goal Form */}
            <AnimatePresence>
              {showAddGoal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Add New Goal
                    </h3>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Goal Title
                      </label>
                      <input
                        type="text"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        placeholder="Enter your goal title"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-gray-700 placeholder:text-gray-400 focus:border-[var(--primary-color)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={newGoalValue}
                        onChange={(e) => setNewGoalValue(e.target.value)}
                        placeholder="Describe your goal in detail"
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-gray-700 placeholder:text-gray-400 focus:border-[var(--primary-color)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={newGoalDeadline}
                        onChange={(e) => setNewGoalDeadline(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-gray-700 focus:border-[var(--primary-color)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addGoal}
                      className="flex items-center gap-2 rounded-lg bg-[var(--primary-color)] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[var(--primary-color)]/90 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      <FiPlus className="h-4 w-4" />
                      Create Goal
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Goals grid */}
            <div className="space-y-6 pb-4">
              {goals.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {goals.map((goal) => (
                    <motion.div
                      key={goal._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Status indicator */}
                      <div
                        className={`absolute top-0 left-0 h-1 w-full ${
                          goal.current_status === "completed"
                            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                            : goal.current_status === "deprecated"
                              ? "bg-gradient-to-r from-rose-400 to-red-500"
                              : goal.current_status === "not-started"
                                ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                : "bg-gradient-to-r from-[var(--primary-color)] to-blue-500"
                        }`}
                      />

                      <div className="p-6">
                        {/* Goal header */}
                        <div className="mb-4 flex items-start justify-between">
                          <h3 className="line-clamp-2 flex-1 text-lg font-semibold text-gray-800">
                            {goal.title}
                          </h3>
                          <button
                            onClick={() => deleteGoal(goal._id)}
                            className="ml-4 rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Goal description */}
                        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                          {goal.value}
                        </p>

                        {/* Deadline and status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
                            <FiCalendar className="h-4 w-4" />
                            <span>
                              {new Date(goal.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          <div
                            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                              goal.current_status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : goal.current_status === "deprecated"
                                  ? "bg-rose-100 text-rose-700"
                                  : goal.current_status === "not-started"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {goal.current_status}
                          </div>
                        </div>

                        {/* Status buttons */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {getStatusButtons(goal)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckIn;
