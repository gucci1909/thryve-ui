"use client";
import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { logout } from "../../store/userSlice";
import YouTube from "react-youtube";
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
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import { FaFire, FaCalendarAlt, FaTrophy, FaBolt } from "react-icons/fa";
import { useDebounce } from "../hook/useDebounce";

function PersonalizeHomePage({ pointAdded, setPointAdded }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeActionView, setActiveActionView] = useState(null);
  const [singlePlan, setSinglePlan] = useState({});
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const points = useSelector((state) => state.user.points);
  const [clickedCards, setClickedCards] = useState({});
  const location = useLocation();
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const showLearningPlan = location.state?.showLearningPlan || true;
  const [reactionLoading, setReactionLoading] = useState({});
  const streakDays = Math.floor(points / 20);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId)
      return "https://placehold.co/600x400/png?text=Video+Thumbnail";

    // Try multiple thumbnail qualities
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

  const handleVideoClick = (index) => {
    setActiveVideo(activeVideo === index ? null : index);
  };

  const handleInteraction = async (title) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed/interact`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        },
      );

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to record interaction");
      }

      const data = await response.json();
      console.log("Interaction recorded successfully:", data);
    } catch (error) {
      console.error("Error recording interaction:", error);
    } finally {
      setPointAdded(true);
    }
  };

  const handleActionViewClick = async (action_view, plan) => {
    if (action_view === "single_feed") {
      await handleInteraction(plan.title);
    }
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

      // Reset note input and hide it
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

  const handleReaction = async (title, reactionType) => {
    try {
      setReactionLoading((prev) => ({ ...prev, [title]: true }));

      // Get current reaction value to toggle it
      const currentPlan = reportData.learning_plan.find(
        (plan) => plan.title === title,
      );
      const currentReactionValue =
        currentPlan?.reactions?.[reactionType] || false;
      const reactionValue = !currentReactionValue; // Toggle the value

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed/add-reaction`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, reactionType, reactionValue }),
        },
      );

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add reaction");
      }

      // Update reportData state with new reaction
      setReportData((prev) => ({
        ...prev,
        learning_plan: prev.learning_plan.map((plan) =>
          plan.title === title
            ? {
                ...plan,
                reactions: {
                  ...plan.reactions,
                  [reactionType]: reactionValue,
                  [reactionType === "thumbsUp" ? "thumbsDown" : "thumbsUp"]:
                    false,
                },
              }
            : plan,
        ),
      }));

      // Update singlePlan state if the title matches
      if (singlePlan.title === title) {
        setSinglePlan((prev) => ({
          ...prev,
          reactions: {
            ...prev.reactions,
            [reactionType]: reactionValue,
            [reactionType === "thumbsUp" ? "thumbsDown" : "thumbsUp"]: false,
          },
        }));
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    } finally {
      setReactionLoading((prev) => ({ ...prev, [title]: false }));
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

  // Create debounced function with 500ms delay
  const debouncedAddNote = useDebounce(addNote, 500);

  // Handle textarea changes
  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);

    debouncedAddNote(singlePlan.title, newNote);
  };

  // Memoized Video Player Component
  const VideoPlayer = memo(({ videoId, opts, onClose }) => (
    <div className="aspect-video w-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        className="h-full w-full"
        onError={(e) => console.error("YouTube Error:", e)}
      />
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  ));

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
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {!singlePlan.notes?.length && !showNoteInput && (
                  <button
                    onClick={() => setShowNoteInput(true)}
                    className="flex items-center gap-1 rounded-full bg-gray-100 p-2 text-[#0029ff] hover:bg-gray-200"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Reaction Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction(singlePlan.title, "thumbsUp")}
                  disabled={reactionLoading[singlePlan.title]}
                  className={`group relative rounded-full p-2 transition-colors ${
                    singlePlan.reactions?.thumbsUp
                      ? "bg-blue-100 text-blue-600"
                      : "text-[var(--primary-color)] hover:bg-gray-100"
                  }`}
                >
                  <FiThumbsUp
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      singlePlan.reactions?.thumbsUp
                        ? "fill-current"
                        : "border-blue-500"
                    }`}
                  />
                  {reactionLoading[singlePlan.title] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction(singlePlan.title, "thumbsDown")}
                  disabled={reactionLoading[singlePlan.title]}
                  className={`group relative rounded-full p-2 transition-colors ${
                    singlePlan.reactions?.thumbsDown
                      ? "bg-red-100 text-red-600"
                      : "text-[var(--primary-color)] hover:bg-gray-100"
                  }`}
                >
                  <FiThumbsDown
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      singlePlan.reactions?.thumbsDown
                        ? "fill-current"
                        : "text-[var(--primary-color)]"
                    }`}
                  />
                  {reactionLoading[singlePlan.title] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Learning Streak Card */}
          {/* <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] p-6 shadow-lg"> */}
              {/* Animated background effects */}
              {/* <motion.div
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                    <h2 className="text-2xl font-bold text-white">
                      Learning Streak
                    </h2>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
                  >
                    <FaTrophy className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold text-white">
                      {points} Points
                    </span>
                  </motion.div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
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
                        <span className="text-2xl font-bold text-white">
                          {streakDays}
                        </span>
                      </motion.div>
                      <p className="mt-2 text-sm font-medium text-white/80">
                        Days
                      </p>
                    </div>

                    <div className="text-center">
                      <motion.div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <span className="text-2xl font-bold text-white">
                          {20 - (points % 20)}
                        </span>
                      </motion.div>
                      <p className="mt-2 text-sm font-medium text-white/80">
                        Points to Next Day
                      </p>
                    </div>
                  </div> */}

                  {/* <motion.div
                className="flex flex-col items-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <FaBolt className="h-5 w-5 text-yellow-300" />
                  <span className="text-lg font-semibold text-white">Keep Going!</span>
                </div>
                <p className="mt-1 text-sm text-white/80">Complete more lessons to extend your streak</p>
              </motion.div> */}
                {/* </div> */}

                {/* Progress bar */}
                {/* <div className="mt-6">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      className="h-full bg-yellow-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${(points % 20) * 5}%` }}
                      transition={{ duration: 0.8, type: "spring" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div> */}

          {showLearningPlan && (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
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
          )}

          {/* {showLearningPlan && ( */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="mt-8"
          >
            <div className="mb-8 w-full">
              <div
                className={`relative flex h-12 w-full items-center justify-center rounded-full bg-gray-100 p-1 shadow-inner ${
                  !showSavedOnly ? "border border-blue-500" : ""
                }`}
              >
                <motion.button
                  className={`relative z-10 flex h-full w-full items-center justify-center rounded-full text-lg font-medium transition-colors focus:outline-none ${
                    showSavedOnly
                      ? "bg-[var(--primary-color)] text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setShowSavedOnly((prev) => !prev)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showSavedOnly ? "Show All Posts" : "Show Saved Posts"}
                </motion.button>
              </div>
            </div>
            <h2 className="mb-6 text-2xl font-bold text-[#0029ff]">
              Your Learning Journey
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reportData?.learning_plan?.filter(
                (plan) => !showSavedOnly || plan.saved,
              )?.length === 0 && showSavedOnly ? (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--primary-color)]/20 bg-[var(--primary-color)]/5 px-4 py-12">
                  <FiBookmark className="h-12 w-12 text-[var(--primary-color)]" />
                  <p className="mt-4 text-center text-lg font-medium text-[var(--primary-color)]">
                    No saved posts yet
                  </p>
                  <p className="mt-2 text-center text-gray-600">
                    Click the bookmark icon on any post to save it for later
                  </p>
                </div>
              ) : (
                reportData?.learning_plan
                  ?.filter((plan) => !showSavedOnly || plan.saved)
                  ?.map((plan, index) => {
                    const handleClick = (e) => {
                      // Don't trigger if clicking on bookmark button or video thumbnail
                      if (
                        e.target.closest("button") ||
                        e.target.closest(".video-container")
                      ) {
                        return;
                      }

                      // Set this card as clicked
                      setClickedCards((prev) => ({ ...prev, [index]: true }));

                      setTimeout(() => {
                        handleActionViewClick("single_feed", plan);
                        // Reset the clicked state after navigation
                        setClickedCards((prev) => ({
                          ...prev,
                          [index]: false,
                        }));
                      }, 300);
                    };

                    return (
                      <motion.div
                        key={index}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * index }}
                        whileHover={{ scale: 1.01 }}
                        onClick={handleClick}
                      >
                        {/* Click feedback overlay - only show if this card is clicked */}
                        {clickedCards[index] && (
                          <motion.div
                            className="absolute inset-0 z-20 bg-[var(--primary-color)]/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-[#0029ff]">
                              {plan.title}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveStatus(plan.title, !plan.saved);
                              }}
                              className="rounded-full bg-gray-100 p-2 text-[#0029ff] hover:bg-gray-200"
                            >
                              <FiBookmark
                                className={`h-5 w-5 ${plan.saved ? "fill-current" : ""}`}
                              />
                            </button>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {plan.content}
                          </p>

                          <div className="video-container mt-4 overflow-hidden rounded-lg border border-gray-200">
                            <div className="aspect-video w-full bg-gray-100">
                              {activeVideo === index ? (
                                <div className="aspect-video w-full">
                                  <YouTube
                                    videoId={getYouTubeVideoId(plan.video)}
                                    opts={opts}
                                    className="h-full w-full"
                                    onError={(e) =>
                                      console.error("YouTube Error:", e)
                                    }
                                  />
                                </div>
                              ) : (
                                <div
                                  className="relative h-full w-full cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVideoClick(index);
                                  }}
                                >
                                  <img
                                    src={getYouTubeThumbnail(plan.video)}
                                    alt={plan.title}
                                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 hover:opacity-100"
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
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="mt-4 flex items-center justify-between">
                              {plan.notes?.length > 0 && (
                                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                                  <FiFileText className="h-4 w-4 text-[var(--primary-color)]" />
                                  Your notes...
                                </div>
                              )}

                              {/* Add the reactions UI here */}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(plan.title, "thumbsUp");
                                }}
                                disabled={reactionLoading[plan.title]}
                                className={`group relative rounded-full p-2 transition-colors ${
                                  plan.reactions?.thumbsUp
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-[var(--primary-color)] hover:bg-gray-100"
                                }`}
                              >
                                <FiThumbsUp
                                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                                    plan.reactions?.thumbsUp
                                      ? "fill-current"
                                      : "border-blue-500"
                                  }`}
                                />
                                {reactionLoading[plan.title] && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                  </div>
                                )}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(plan.title, "thumbsDown");
                                }}
                                disabled={reactionLoading[plan.title]}
                                className={`group relative rounded-full p-2 transition-colors ${
                                  plan.reactions?.thumbsDown
                                    ? "bg-red-100 text-red-600"
                                    : "text-[var(--primary-color)] hover:bg-gray-100"
                                }`}
                              >
                                <FiThumbsDown
                                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                                    plan.reactions?.thumbsDown
                                      ? "fill-current"
                                      : "text-[var(--primary-color)]"
                                  }`}
                                />
                                {reactionLoading[plan.title] && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                                  </div>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
              )}
            </div>
          </motion.div>
          {/* )} */}
        </>
      )}
    </main>
  );
}

export default PersonalizeHomePage;