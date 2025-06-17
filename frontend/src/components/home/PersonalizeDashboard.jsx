import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { BorderBeam } from "../magicui/border-beam";
import { logout } from "../../store/userSlice";
import SwotAnalysis from "../common/SwotAnalysis";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiBookmark,
  FiEdit,
  FiEdit2,
  FiCheck,
  FiX,
  FiPlay,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import { FaFire, FaCalendarAlt, FaTrophy, FaBolt } from "react-icons/fa";
import YouTube from "react-youtube";
import { useDebounce } from "../hook/useDebounce";
import { useCookies } from "react-cookie";

function PersonalizeDashboard() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const [activeActionView, setActiveActionView] = useState(null);
  const [singlePlan, setSinglePlan] = useState({});
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: true,
    opportunities: true,
    threats: true,
  });
  const [clickedCards, setClickedCards] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const firstName = useSelector((state) => state.user.firstName);
  const points = useSelector((state) => state.user.points);
  const streakDays = Math.floor(points / 20);
  const pointsNeeded = 20 - (points % 20);

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

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId)
      return "https://placehold.co/600x400/png?text=Video+Thumbnail";
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      origin: window.location.origin,
      enablejsapi: 1,
    },
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleVideoClick = (index) => {
    setActiveVideo(activeVideo === index ? null : index);
  };

  const handleActionViewClick = (action_view, plan) => {
    setActiveActionView(action_view);
    setSinglePlan(plan);
    setShowNoteInput(false);
    setNote("");
  };

  const addNote = async (title, noteText) => {
    if (!noteText.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed/add-notes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, note: noteText }),
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      setReportData((prev) => ({
        ...prev,
        learning_plan: prev.learning_plan.map((plan) =>
          plan.title === title
            ? {
                ...plan,
                notes: [noteText],
              }
            : plan,
        ),
      }));

      setSinglePlan((prev) => ({
        ...prev,
        notes: [noteText],
      }));

      setNote("");
      setShowNoteInput(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleSaveStatus = async (title, saved) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed/change-status-saved`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, saved }),
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update save status");
      }

      setReportData((prev) => ({
        ...prev,
        learning_plan: prev.learning_plan.map((plan) =>
          plan.title === title ? { ...plan, saved } : plan,
        ),
      }));

      setSinglePlan((prev) => ({
        ...prev,
        saved: saved,
      }));
    } catch (error) {
      console.error("Error updating save status:", error);
    }
  };

  const handleEditNote = async (title, updatedNote) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed/edit-note`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, updatedNote }),
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to edit note");
      }

      setReportData((prev) => ({
        ...prev,
        learning_plan: prev.learning_plan.map((plan) =>
          plan.title === title
            ? {
                ...plan,
                notes: [updatedNote],
              }
            : plan,
        ),
      }));

      setSinglePlan((prev) => ({
        ...prev,
        notes: [updatedNote],
      }));

      setIsEditingNote(false);
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  const handleDeleteNote = async (title) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed/delete-note`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        },
      );

      if (response.status === 401) {
        removeCookie("authToken", { path: "/" });
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setReportData((prev) => ({
        ...prev,
        learning_plan: prev.learning_plan.map((plan) =>
          plan.title === title
            ? {
                ...plan,
                notes: [],
              }
            : plan,
        ),
      }));

      setSinglePlan((prev) => ({
        ...prev,
        notes: [],
      }));

      setShowNoteInput(false);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

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

        const statusCode = response.status;
        if (statusCode === 401) {
          removeCookie("authToken", { path: "/" });
          dispatch(logout());
          navigate("/");
          return;
        }

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

  // Create debounced function with 500ms delay
  const debouncedAddNote = useDebounce(addNote, 500);

  // Handle textarea changes
  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
    debouncedAddNote(singlePlan.title, newNote);
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="mt-4 flex-1 overflow-y-auto px-5 pb-24">
      {activeActionView === "single_feed" ? (
        <motion.div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <button
            onClick={() => handleActionViewClick(null, {})}
            className="absolute top-6 left-6 flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#0029ff]">
                {singlePlan.title}
              </h3>
              <button
                onClick={() =>
                  handleSaveStatus(singlePlan.title, !singlePlan.saved)
                }
                className="flex items-center gap-1 rounded-full bg-gray-100 p-2 text-[#0029ff] hover:bg-gray-200"
              >
                <FiBookmark
                  className={`h-5 w-5 ${singlePlan.saved ? "fill-current" : ""}`}
                />
              </button>
            </div>
            <p className="mt-3 text-gray-600">{singlePlan.content}</p>

            {/* Video Player */}
            <div className="relative mt-6 overflow-hidden rounded-lg border border-gray-200">
              {isPlaying ? (
                <div className="aspect-video w-full">
                  <YouTube
                    videoId={getYouTubeVideoId(singlePlan.video)}
                    opts={opts}
                    className="h-full w-full"
                    onError={(e) => console.error("YouTube Error:", e)}
                  />
                </div>
              ) : (
                <div
                  className="relative aspect-video w-full cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={getYouTubeThumbnail(singlePlan.video)}
                    alt={singlePlan.title}
                    className="h-full w-full object-cover opacity-90 transition-opacity duration-300 hover:opacity-100"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x400/png?text=Video+Thumbnail";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <FiPlay className="h-10 w-10 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {singlePlan.notes?.length > 0 ? (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Your Note
                  </h4>
                  <div className="flex items-center gap-2">
                    {!isEditingNote ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditingNote(true);
                            setEditedNote(singlePlan.notes[0]);
                          }}
                          className="rounded-full p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Edit note"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(singlePlan.title)}
                          className="rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-50"
                          title="Delete note"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleEditNote(singlePlan.title, editedNote)
                          }
                          className="rounded-full p-1.5 text-green-600 transition-colors hover:bg-green-50"
                          title="Save changes"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingNote(false);
                            setEditedNote("");
                          }}
                          className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50"
                          title="Cancel editing"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <motion.div
                  className="rounded-lg bg-gray-50 p-4"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {isEditingNote ? (
                    <textarea
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white p-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700">{singlePlan.notes[0]}</p>
                  )}
                </motion.div>
              </motion.div>
            ) : showNoteInput ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-6"
              >
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Add Note
                </h4>
                <textarea
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="Write your note here..."
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-600 focus:border-[#0029ff] focus:outline-none"
                  rows={3}
                />
              </motion.div>
            ) : null}

            {/* Action Bar */}
            <div className="mt-8 flex items-center gap-4">
              {!singlePlan.notes?.length && !showNoteInput && (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="flex items-center gap-1 rounded-full bg-gray-100 p-2 text-[#0029ff] hover:bg-gray-200"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Learning Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-6 shadow-lg">
              {/* Animated background effects */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "radial-gradient(circle at center, white 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      Learning Streak
                    </h2>
                    <motion.div
                      animate={{
                        rotate: [0, 10, 0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <FaFire className="h-8 w-8 text-yellow-300" />
                    </motion.div>
                  </div>
                </div>

                <div className="mt-3 flex flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-xl font-bold text-white">
                        {streakDays || 0}
                      </span>
                    </motion.div>
                    <p className="text-lg font-medium text-white">Days</p>
                  </div>

                  {/* Progress bar with points needed inside */}
                  {/* <div className="flex-1">
                    <div className="relative h-8 w-full overflow-hidden rounded-full bg-white/20">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-yellow-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${(points % 20) * 5}%` }}
                        transition={{ duration: 0.8, type: "spring" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {pointsNeeded} points needed
                        </span>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="mt-5 flex-1">
                  <div className="relative h-8 w-full overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-yellow-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${(points % 20) * 5}%` }}
                      transition={{ duration: 0.8, type: "spring" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {pointsNeeded || 0} points needed
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="mt-6">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-yellow-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${(points % 20) * 5}%` }}
                      transition={{ duration: 0.8, type: "spring" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {pointsNeeded} points needed
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </motion.div>

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
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <motion.h2
                      className="bg-gradient-to-r from-[#0029ff] to-blue-400 bg-clip-text text-2xl font-bold text-transparent"
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
                      Your personalized roadmap for leadership excellence.
                    </motion.p>

                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Continue Doing */}
                      <motion.div
                        className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition-all hover:shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
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
                        <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />{" "}
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

          {/* SWOT Analysis */}

          <motion.div className="mt-4">
            <SwotAnalysis
              expandedSections={expandedSections}
              reportData={reportData}
              toggleSection={toggleSection}
            />
          </motion.div>
        </>
      )}
    </main>
  );
}

export default PersonalizeDashboard;
