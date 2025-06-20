"use client";
import { useEffect, useState, memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { logout } from "../../store/userSlice";
import { motion } from "framer-motion";
import { FiBookmark } from "react-icons/fi";
import { useDebounce } from "../hook/useDebounce";
import LearningPlanCard from "./PersonalizeHome/LearningPlanCard";
import SinglePlanView from "./PersonalizeHome/SinglePlanView";
import LoadingSpinner from "./PersonalizeHome/LoadingSpinner";
import LeadershipReport from "./PersonalizeHome/LeadershipReport";

function PersonalizeHomePage({ setPointAdded }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const location = useLocation();
  const showLearningPlan = location.state?.showLearningPlan || false;

  const [visibleCount, setVisibleCount] = useState(4);
  const [savedVisibleCount, setSavedVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [reportData, setReportData] = useState(null);
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

  const loaderRef = useRef(null);

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

  const cardVariants = {
    offscreen: {
      y: 20,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
      },
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
    setVisibleCount(4);
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

  useEffect(() => {
    const fetchLeadershipReportAndLearningPlan = async () => {
      try {
        setLoading(true);
        const learningPlanResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/personalizeLearning/learning-plans`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (showLearningPlan) {
          const leaderShipReportResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/onboarding/leadership-report`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          const data = await leaderShipReportResponse.json();
          setReportData(data.data);
        }

        const statusCode = learningPlanResponse.status;
        if (statusCode === 401) {
          dispatch(logout());
          navigate("/");
          return;
        }

        if (!learningPlanResponse.ok) {
          throw new Error("Failed to fetch learning Plans");
        }

        const learningPlanData = await learningPlanResponse.json();
        setLearningData(learningPlanData.data);

        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching leadership report and learning Plan:",
          error,
        );
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchLeadershipReportAndLearningPlan();
    }
  }, [token]);

  const visibleItems = learningData?.learning_plan?.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          visibleCount < learningData?.learning_plan.length
        ) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 4);
            if (!showSavedOnly) {
              setIsLoadingMore(false);
            }
          }, 800);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    );

    if (visibleCount >= learningData?.learning_plan?.length) {
      setIsLoadingMore(false);
    }

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleCount, learningData?.learning_plan?.length, visibleItems]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeActionView]);

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

  return (
    <main className="flex-1 overflow-y-auto px-[12px] pb-[50px]" ref={contentRef}>
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
          {reportData && (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              className="mt-[20px]"
            >
              <LeadershipReport reportData={reportData} />
            </motion.div>
          )}

          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{
              once: true,
              amount: 0.1, // Trigger earlier
              margin: "0px 0px -100px 0px", // Add negative margin to trigger sooner
            }}
            variants={cardVariants}
            className="mt-8"
          >
            <div className="mb-3 w-full">
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
            {/* Centered Heading */}
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold text-[var(--primary-color)]">
                Your Learning Plan
                <span className="mx-auto mt-2 mb-4 block h-1 w-16 rounded-full bg-[var(--primary-color)]"></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {visibleItems?.filter((plan) => !showSavedOnly || plan.saved)
                ?.length === 0 &&
              showSavedOnly &&
              !isLoadingMore ? (
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
                visibleItems
                  ?.filter((plan) => !showSavedOnly || plan.saved)
                  ?.map((plan, index) => (
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
                  ))
              )}
            </div>
            <div
              ref={loaderRef}
              className="col-span-2 flex flex-col items-center justify-center gap-3 py-8"
            >
              {isLoadingMore && (
                <div className="flex flex-col items-center gap-4">
                  {/* Modern triple-dot spinner */}
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-3 w-3 animate-[bounce_1s_infinite_0ms] rounded-full bg-[#0029ff]"></div>
                    <div className="h-3 w-3 animate-[bounce_1s_infinite_150ms] rounded-full bg-[#0029ff]"></div>
                    <div className="h-3 w-3 animate-[bounce_1s_infinite_300ms] rounded-full bg-[#0029ff]"></div>
                  </div>

                  {/* Loading text with fade animation */}
                  <p className="animate-[fadeInOut_2s_ease-in-out_infinite] text-sm font-medium text-gray-600">
                    {showSavedOnly
                      ? "Loading saved plans..."
                      : "Loading more plans..."}
                  </p>
                </div>
              )}

              {/* End of Feed Message */}
              {!isLoadingMore &&
                !showSavedOnly &&
                visibleCount >= learningData?.learning_plan?.length && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-medium text-[#0029ff]">
                        You've reached the end of your learning plans
                      </p>
                      <p className="text-xs text-[#0029ff]">
                        Check back later for more personalized content
                      </p>
                    </div>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                )}
            </div>
          </motion.div>
        </>
      )}
    </main>
  );
}

export default PersonalizeHomePage;
