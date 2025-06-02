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
  FiFeather 
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
      <div className="flex flex-wrap gap-1 mt-4">
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
        <div className="text-center flex flex-col justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Loading goals...</p>
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
          <p className="max-w-md text-sm text-gray-500 mb-4">
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
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm mx-2 sm:mx-0"
              >
                <div className="mb-2 text-sm text-gray-500">
                  <div className="sm:hidden">
                    {new Date(reflection.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                  <div className="hidden sm:block">
                    {new Date(reflection.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <p className="text-gray-700 text-sm sm:text-base break-words">
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
            className="mx-auto max-w-3xl space-y-6"
          >
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setView("main")}
                className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <Button
                color="blue"
                size="sm"
                onClick={() => setShowAddGoal(true)}
                className="flex items-center"
              >
                <FiPlus className="mr-2" />
                Add Goal
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
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
                <FaBullseye className="text-2xl text-[#0029ff]" />
              </motion.div>

              <motion.h3
                className="bg-gradient-to-r bg-clip-text text-2xl font-bold text-[#0029ff]"
                whileHover={{ scale: 1.05 }}
              >
                Your Goals
              </motion.h3>
            </motion.div>

            {showAddGoal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Add New Goal
                  </h3>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Goal Title
                    </label>
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="What do you want to achieve?"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Goal Value
                    </label>
                    <textarea
                      value={newGoalValue}
                      onChange={(e) => setNewGoalValue(e.target.value)}
                      className="min-h-[100px] w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      placeholder="Why is this goal important?"
                      rows={3} // Sets initial visible rows
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addGoal}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                      Add Goal
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-4 pb-4">
              {goals.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 text-center"
                >
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No goals yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first goal.
                  </p>
                  <div className="mt-6">
                    <Button
                      color="blue"
                      onClick={() => setShowAddGoal(true)}
                      className="inline-flex items-center"
                    >
                      <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                      Add Goal
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                      className={`group relative h-full min-h-[200px] w-full rounded-xl border border-purple-200/50 p-5 shadow-md hover:shadow-lg ${
                        goal.current_status === "completed"
                          ? "bg-teal-300"
                          : goal.current_status === "deprecated"
                            ? "bg-pink-300"
                            : goal.current_status === "not-started"
                              ? "bg-gray-300"
                              : "bg-violet-300"
                      }`}
                    >
                      <div
                        className={`relative z-10 flex h-full flex-col justify-between space-y-4`}
                      >
                        {/* Title with text wrapping */}
                        <div className="flex items-start justify-between">
                          <h3 className="line-clamp-2 w-[80%] text-lg font-semibold break-words text-purple-800">
                            {goal.title}
                          </h3>
                          <div className="rounded-lg border border-pink-400 bg-white p-2 shadow-md transition-shadow duration-300 hover:shadow-pink-400">
                            <button
                              onClick={() => deleteGoal(goal._id)}
                              className="text-pink-500 hover:text-pink-700"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>

                        {/* Main content with proper text handling */}
                        <div className="flex flex-1 flex-col gap-2">
                          {/* Value section with text wrapping */}
                          <div className="flex flex-1 items-start gap-2 overflow-hidden rounded-md bg-pink-100 p-3">
                            <FiFlag className="mt-0.5 flex-shrink-0 text-pink-600" />
                            <p className="line-clamp-3 font-medium break-words text-pink-800">
                              {goal.value}
                            </p>
                          </div>

                          {/* Deadline section */}
                          <div className="flex items-center gap-2 rounded-md bg-purple-100 p-3">
                            <FiCalendar className="flex-shrink-0 text-purple-600" />
                            <span className="text-sm text-purple-700">
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
                        </div>

                        {/* Status section */}
                        <div className="flex flex-col rounded-md bg-white/70 p-2">
                          <div className="flex items-center gap-2">
                            {goal.current_status === "completed" ? (
                              <div className="flex items-center gap-1">
                                <FiCheckCircle className="h-4 w-4 text-teal-500" />
                                <span className="text-xs font-medium tracking-wide text-teal-700 uppercase sm:text-sm">
                                  {goal.current_status}
                                </span>
                              </div>
                            ) : goal.current_status === "deprecated" ? (
                              <div className="flex items-center gap-1">
                                <FiAlertTriangle className="h-4 w-4 text-pink-500" />
                                <span className="text-xs font-medium tracking-wide text-pink-700 uppercase sm:text-sm">
                                  {goal.current_status}
                                </span>
                              </div>
                            ) : goal.current_status === "not-started" ? (
                              <div className="flex items-center gap-1">
                                <FiTarget className="h-4 w-4 text-gray-500" />
                                <span className="text-xs font-medium tracking-wide text-gray-700 uppercase sm:text-sm">
                                  {goal.current_status}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <FiPlayCircle className="h-4 w-4 text-violet-500" />
                                <span className="text-xs font-medium tracking-wide text-violet-700 uppercase sm:text-sm">
                                  {goal.current_status}
                                </span>
                              </div>
                            )}
                          </div>
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
