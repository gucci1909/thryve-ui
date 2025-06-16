"use client";
import { useEffect, useState, useRef } from "react";
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
import LearningPlanCard from "./PersonalizeHome/LearningPlanCard";
import SinglePlanView from "./PersonalizeHome/SinglePlanView";
import LoadingSpinner from "./PersonalizeHome/LoadingSpinner";

function SavedPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const location = useLocation();

  const [learningData, setLearningData] = useState(null);
  const [activeActionView, setActiveActionView] = useState(null);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [note, setNote] = useState("");
  const [editedNote, setEditedNote] = useState("");
  const [singlePlan, setSinglePlan] = useState({});
  const [clickedCards, setClickedCards] = useState({});
  const [reactionLoading, setReactionLoading] = useState({});
  const [isClickedStates, setIsClickedStates] = useState({});
  const playerRefs = useRef({});
  const contentRef = useRef(null);

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

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.slice(1);
      }
      if (parsedUrl.searchParams.has("v")) {
        return parsedUrl.searchParams.get("v");
      }
      const pathnameMatch = parsedUrl.pathname.match(
        /\/embed\/([a-zA-Z0-9_-]{11})/,
      );
      if (pathnameMatch) {
        return pathnameMatch[1];
      }
    } catch (e) {
      const regExp =
        /^.*(?:youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }
    return null;
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

      setLearningData((prev) => ({
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

  const debouncedAddNote = useDebounce(addNote, 500);

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
    debouncedAddNote(singlePlan.title, newNote);
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

      setLearningData((prev) => ({
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

      setLearningData((prev) => ({
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

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId)
      return "https://placehold.co/600x400/png?text=Video+Thumbnail";
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleCardClick = (index, e) => {
    if (
      e.target.closest(".ytp-chrome-bottom") ||
      e.target.closest("button") ||
      e.target.closest(".video-container")
    ) {
      return;
    }

    setIsClickedStates((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setIsClickedStates((prev) => ({ ...prev, [index]: false }));
    }, 300);

    const plan = learningData.learning_plan[index];
    setClickedCards((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      handleActionViewClick("single_feed", plan);
      setClickedCards((prev) => ({
        ...prev,
        [index]: false,
      }));
    }, 300);
  };

  const handleVideoClick = (index) => {
    if (activeVideo === index && playerRefs.current[index]) {
      const player = playerRefs.current[index].internalPlayer;
      player.getPlayerState().then((state) => {
        if (state === 1) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      });
    } else {
      setActiveVideo(activeVideo === index ? null : index);
    }
  };

  const handleActionViewClick = (action_view, plan) => {
    setActiveActionView(action_view);
    setSinglePlan(plan);
    setShowNoteInput(false);
    setNote("");
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

      setLearningData((prev) => ({
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

  const handleReaction = async (title, reactionType) => {
    try {
      const currentPlan = learningData.learning_plan.find(
        (plan) => plan.title === title,
      );
      const currentReactionValue =
        currentPlan?.reactions?.[reactionType] || false;
      const reactionValue = !currentReactionValue;

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

      setLearningData((prev) => ({
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
    const fetchLearningPlan = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/personalizeLearning/learning-plans`,
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
          throw new Error("Failed to fetch learning Plans");
        }

        const data = await response.json();
        setLearningData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching learning Plan:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchLearningPlan();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const savedPlans =
    learningData?.learning_plan?.filter((plan) => plan.saved) || [];

  return (
    <main
      className="mt-[20px] flex-1 overflow-y-auto px-[12px] pb-[50px]"
      ref={contentRef}
    >
      {activeActionView === "single_feed" ? (
        <>
          <SinglePlanView
            singlePlan={singlePlan}
            handleActionViewClick={handleActionViewClick}
            handleSaveStatus={handleSaveStatus}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            getYouTubeVideoId={getYouTubeVideoId}
            getYouTubeThumbnail={getYouTubeThumbnail}
            opts={opts}
            handleReaction={handleReaction}
            reactionLoading={reactionLoading}
            showNoteInput={showNoteInput}
            setShowNoteInput={setShowNoteInput}
            note={note}
            handleNoteChange={handleNoteChange}
            isEditingNote={isEditingNote}
            setIsEditingNote={setIsEditingNote}
            editedNote={editedNote}
            setEditedNote={setEditedNote}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
          />
        </>
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

            {savedPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--primary-color)]/20 bg-[var(--primary-color)]/5 px-4 py-12">
                <FiBookmark className="h-12 w-12 text-[var(--primary-color)]" />
                <p className="mt-4 text-center text-lg font-medium text-[var(--primary-color)]">
                  No saved posts yet
                </p>
                <p className="mt-2 text-center text-gray-600">
                  Click the bookmark icon on any post to save it for later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {savedPlans.map((plan, index) => (
                  <LearningPlanCard
                    key={index}
                    plan={plan}
                    index={index}
                    handleClick={(e) => handleCardClick(index, e)}
                    handleSaveStatus={handleSaveStatus}
                    handleReaction={handleReaction}
                    reactionLoading={reactionLoading}
                    activeVideo={activeVideo}
                    handleVideoClick={() => handleVideoClick(index)}
                    getYouTubeThumbnail={getYouTubeThumbnail}
                    getYouTubeVideoId={getYouTubeVideoId}
                    opts={opts}
                    clickedCards={clickedCards}
                    isClicked={isClickedStates[index]}
                    playerRef={playerRefs}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </main>
  );
}

export default SavedPost;
