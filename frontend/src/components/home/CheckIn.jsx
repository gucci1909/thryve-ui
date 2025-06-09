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
} from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../store/userSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const CheckIn = () => {
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
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            // transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl space-y-6"
          >
            {/* Your Goals Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView("goals")}
              className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                    <FiTarget className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Your Goals
                    </h3>
                    <p className="text-sm text-gray-500">
                      {goals.length} active{" "}
                      {goals.length === 1 ? "goal" : "goals"}
                    </p>
                  </div>
                </div>
                <div className="relative h-16 w-16">
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
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={`${calculateOverallProgress()}, 100`}
                    />
                    <animateTransform
                      attributeName="transform"
                      // type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="2s"
                      // repeatCount="indefinite"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">
                      {calculateOverallProgress()}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Reflections */}
            <div>
              <motion.div
                // initial={{ opacity: 0, y: -10 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.3 }}
                className="m-auto mb-6 flex flex-col items-center justify-center"
              >
                <div className="relative inline-block">
                  <h2 className="relative z-10 text-xl font-bold text-[#0029ff]">
                    Daily Reflections
                  </h2>
                  <div className="mt-1 h-1 w-45 bg-gradient-to-r from-[#0029ff] to-transparent" />
                </div>
              </motion.div>

              {/* Add Reflection Button when there are existing reflections */}
              {!showReflectionInput && reflections.length > 0 && (
                <motion.button
                  onClick={() => setShowReflectionInput(true)}
                  className="mb-4 w-full rounded-xl border-2 border-dashed border-[#0029ff]/30 bg-white p-4 text-center text-[#0029ff] transition-all hover:border-[#0029ff]/50 hover:bg-[#0029ff]/5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiFeather className="h-5 w-5" />
                    <span>Add Daily Reflection</span>
                  </div>
                </motion.button>
              )}

              {/* Empty State */}
              {reflections.length === 0 && !showReflectionInput && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-8 text-center"
                >
                  <FiFeather className="mb-3 text-4xl text-[#0029ff] opacity-70" />
                  <h3 className="mb-1 text-lg font-medium text-gray-700">
                    No reflections yet
                  </h3>
                  <p className="mb-4 max-w-md text-sm text-gray-500">
                    Your daily reflections will appear here. Start by adding
                    your first reflection to track your progress and thoughts.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReflectionInput(true)}
                    className="flex items-center gap-2 rounded-lg bg-[#0029ff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0029ff]/90"
                  >
                    <FiPlus className="h-4 w-4" />
                    Add Your First Reflection
                  </motion.button>
                </motion.div>
              )}

              {/* Reflection Input */}
              {showReflectionInput && (
                <div className="mb-4 rounded-xl border border-[#0029ff]/20 bg-white p-4 shadow-lg">
                  <textarea
                    value={newReflection}
                    onChange={(e) => setNewReflection(e.target.value)}
                    placeholder="Write your reflection for today..."
                    className="min-h-[100px] w-full resize-y rounded-lg border border-gray-200 p-3 text-gray-700 focus:border-[#0029ff] focus:ring-1 focus:outline-none"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowReflectionInput(false);
                        setNewReflection("");
                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addReflection}
                      className="flex items-center gap-2 rounded-lg bg-[#0029ff] px-4 py-2 text-sm text-white hover:bg-[#0029ff]/90"
                    >
                      <FiFeather className="h-4 w-4" />
                      Add Reflection
                    </button>
                  </div>
                </div>
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
                        className="mx-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mx-0"
                      >
                        <div className="mb-2 text-sm text-gray-500">
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
            className="mx-auto max-w-6xl space-y-6"
          >
            {/* Header with back button and add goal */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setView("main")}
                className="flex items-center text-[var(--primary-color)] transition-colors hover:text-blue-800"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <Button
                color="blue"
                size="sm"
                onClick={() => setShowAddGoal(true)}
                className="flex items-center bg-[var(--primary-color)] hover:bg-blue-700"
              >
                <FiPlus className="mr-2" />
                Add Goal
              </Button>
            </div>

            {/* Hero section with image and title */}
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
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
                    >
                      <FaBullseye className="text-3xl text-[var(--primary-color)]" />
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
                    className="bg-[var(--primary-color)] text-white hover:bg-blue-700"
                  >
                    <FiPlus className="mr-2" />
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
                  <div className="relative h-64 w-full md:h-80">
                    <img
                      src="/goals.png"
                      alt="Goal achievement illustration"
                      layout="fill"
                      objectFit="contain"
                      className="drop-shadow-lg"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[var(--primary-color)] opacity-10"></div>
              <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-indigo-400 opacity-10"></div>
            </motion.div>
            {/* Keep the existing showAddGoal section unchanged */}
            {showAddGoal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
              >
                {/* ... existing add goal form ... */}
              </motion.div>
            )}

            {/* Goals grid with improved card design */}
            <div className="space-y-6 pb-4">
              {goals.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 py-16 text-center"
                >
                  <div className="mx-auto max-w-md px-4">
                    <FiTarget className="mx-auto h-12 w-12 text-[var(--primary-color)] opacity-70" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No goals yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Start your journey by adding your first goal. What do you
                      want to achieve?
                    </p>
                    <div className="mt-6">
                      <Button
                        color="blue"
                        onClick={() => setShowAddGoal(true)}
                        className="inline-flex items-center bg-[var(--primary-color)] hover:bg-blue-700"
                      >
                        <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                        Add Your First Goal
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
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
                      whileHover={{ y: -5 }}
                      className={`group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md`}
                    >
                      {/* Status indicator bar */}
                      <div
                        className={`absolute top-0 left-0 h-1 w-full ${
                          goal.current_status === "completed"
                            ? "bg-teal-500"
                            : goal.current_status === "deprecated"
                              ? "bg-rose-500"
                              : goal.current_status === "not-started"
                                ? "bg-gray-400"
                                : "bg-indigo-500"
                        }`}
                      />

                      <div className="p-5">
                        {/* Goal header with title and delete */}
                        <div className="flex items-start justify-between">
                          <h3 className="line-clamp-2 pr-2 text-lg font-semibold break-words text-gray-900">
                            {goal.title}
                          </h3>
                          <button
                            onClick={() => deleteGoal(goal._id)}
                            className="text-gray-400 transition-colors hover:text-rose-500"
                          >
                            <FiTrash2 />
                          </button>
                        </div>

                        {/* Goal value */}
                        <div className="mt-3">
                          <p className="line-clamp-3 text-sm break-words text-gray-600">
                            {goal.value}
                          </p>
                        </div>

                        {/* Deadline and status */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar className="flex-shrink-0" />
                            <span>
                              {new Date(goal.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              goal.current_status === "completed"
                                ? "bg-teal-100 text-teal-800"
                                : goal.current_status === "deprecated"
                                  ? "bg-rose-100 text-rose-800"
                                  : goal.current_status === "not-started"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {goal.current_status}
                          </div>
                        </div>
                      </div>

                      {/* Progress and action buttons */}
                      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                        {getStatusButtons(goal)}
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
