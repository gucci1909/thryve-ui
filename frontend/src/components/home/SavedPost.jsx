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
} from "react-icons/fi";
import { useDebounce } from "../hook/useDebounce";

function SavedPost() {
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
  const [clickedCards, setClickedCards] = useState({});
  const location = useLocation();

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
    <div className="flex-1 overflow-y-auto px-4 pb-32">
      <div className="mx-auto max-w-md py-8">
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
                <h3 className="text-2xl font-bold text-[var(--primary-color)]">
                  {singlePlan.title}
                </h3>
                <button
                  onClick={() =>
                    handleSaveStatus(singlePlan.title, !singlePlan.saved)
                  }
                  className="flex items-center gap-1 rounded-full bg-gray-100 p-2 text-[var(--primary-color)] hover:bg-gray-200"
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
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-600 focus:border-[var(--primary-color)] focus:outline-none"
                    rows={3}
                  />
                </motion.div>
              ) : null}

              {/* Action Bar */}
              <div className="mt-8 flex items-center gap-4">
                {!singlePlan.notes?.length && !showNoteInput && (
                  <button
                    onClick={() => setShowNoteInput(true)}
                    className="flex items-center gap-1 rounded-full bg-gray-100 p-2 text-[var(--primary-color)] hover:bg-gray-200"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mb-6 flex items-center">
              <button
                onClick={() => navigate("/personalize-profile")}
                className="inline-flex items-center text-[var(--primary-color)] transition-colors hover:text-[#0020cc]"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                <span className="font-medium">Back to Profile</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-6 text-2xl font-bold text-[var(--primary-color)]">
                Saved Posts
              </h2>

              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                  {error}
                </div>
              ) : reportData?.learning_plan?.filter((plan) => plan.saved)
                  ?.length === 0 ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <FiBookmark className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No saved posts yet
                  </h3>
                  <p className="text-gray-600">
                    Your saved posts will appear here
                  </p>
                </div>
              ) : (
                <motion.div
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className="mt-8"
                >
                  <h2 className="mb-6 text-2xl font-bold text-[#0029ff]">
                    Your Learning Journey
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {reportData?.learning_plan?.map((plan, index) => {
                      if(plan.saved){

                        const handleClick = (e) => {
                          // Don't trigger if clicking on bookmark button or video thumbnail
                          if (
                            e.target.closest("button") ||
                            e.target.closest(".video-container")
                          ) {
                            return;
                          }

                          // Set this card as clicked
                          setClickedCards((prev) => ({
                            ...prev,
                            [index]: true,
                          }));

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
                                {plan.notes?.length > 0 && (
                                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                                    <FiFileText className="h-4 w-4 text-[var(--primary-color)]" />
                                    Your notes...
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default SavedPost;
