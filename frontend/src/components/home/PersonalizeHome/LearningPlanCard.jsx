import { motion } from "framer-motion";
import {
  FiBookmark,
  FiPlay,
  FiThumbsUp,
  FiThumbsDown,
  FiFileText,
} from "react-icons/fi";
import { FaRegLightbulb, FaChartLine, FaRegClock } from "react-icons/fa";
import YouTube from "react-youtube";

const LearningPlanCard = ({
  plan,
  index,
  handleClick,
  handleSaveStatus,
  handleReaction,
  reactionLoading,
  activeVideo,
  handleVideoClick,
  getYouTubeThumbnail,
  getYouTubeVideoId,
  opts,
  clickedCards,
  isClicked,
  playerRef,
}) => {
  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-800",
    intermediate: "bg-amber-100 text-amber-800",
    advanced: "bg-rose-100 text-rose-800",
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

  const focusAreaIcons = {
    "decision-making": "🧠",
    communication: "💬",
    strategy: "♟️",
    leadership: "👑",
  };

  return (
    <motion.div
      key={index}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{
        once: true,
        amount: 0.1,
        margin: "0px 0px -100px 0px",
      }}
      variants={cardVariants}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-all hover:shadow-2xl"
      onClick={handleClick}
      whileTap={{ scale: isClicked ? 0.98 : 1 }}
    >
      {/* Click feedback overlay */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 z-20 bg-blue-500/10"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Saved status indicator */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSaveStatus(plan.title, !plan.saved);
        }}
        className={`absolute top-4 right-4 z-30 rounded-full p-2 backdrop-blur-sm transition-all ${
          plan.saved
            ? "bg-blue-500 text-white"
            : "bg-white/80 text-gray-400 hover:bg-white"
        }`}
      >
        <FiBookmark className="h-5 w-5" />
      </button>

      {/* Video Section */}
      <div className="video-container relative aspect-video w-full overflow-hidden bg-gray-900">
        {plan.video ? (
          activeVideo === index ? (
            <div className="h-full w-full" onClick={handleVideoClick}>
              <YouTube
                videoId={getYouTubeVideoId(plan.video)}
                opts={opts}
                className="h-full w-full"
                onError={(e) => console.error("YouTube Error:", e)}
                onReady={(e) => {
                  playerRef.current[index] = e;
                }}
              />
            </div>
          ) : (
            <div
              className="relative h-full w-full cursor-pointer"
              onClick={handleVideoClick}
            >
              <img
                src={getYouTubeThumbnail(plan.video)}
                alt={plan.title}
                className="h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all group-hover:bg-black/20">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-blue-500 shadow-lg transition-all group-hover:scale-110 group-hover:bg-white">
                  <FiPlay className="h-6 w-6 translate-x-[1px]" />
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="relative h-full w-full">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
              alt="Abstract background"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/80 to-gray-800/80">
              <p className="text-lg font-semibold text-white">
                Video not available for this content
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Difficulty Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[plan.difficulty]}`}
          >
            {plan.difficulty}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {plan.focus_area}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900">
          {plan.title}
        </h3>

        {/* Content */}
        <p className="mb-4 line-clamp-3 text-gray-600">{plan.content}</p>

        {/* Skills Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {plan.skills.map((skill, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800"
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* Metrics */}
        <div className="mb-4 space-y-3">
          <div className="flex items-start">
            {/* <FaRegLightbulb className="mt-0.5 mr-2 text-yellow-500" /> */}

            <div className="mt-auto mr-3 mb-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 transition-all duration-200 group-hover:bg-yellow-200">
              <FaRegLightbulb className="text-yellow-600 transition-all duration-200 group-hover:scale-110" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Short-term:</p>
              <p className="text-sm text-gray-600">
                {plan.metrics.short_term[0]}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mt-auto mr-3 mb-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 transition-all duration-200 group-hover:bg-green-200">
              <FaChartLine className="text-green-600 transition-all duration-200 group-hover:scale-110" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Long-term:</p>
              <p className="text-sm text-gray-600">
                {plan.metrics.long_term[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-6 flex items-start">
          <div className="mt-auto mr-3 mb-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 transition-all duration-200 group-hover:bg-purple-200">
            <FaRegClock className="text-purple-600 transition-all duration-200 group-hover:scale-110" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Next Steps:</p>
            <p className="text-sm text-gray-600">{plan.next_steps[0]}</p>
          </div>
        </div>

        {/* Footer with notes and reactions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          {plan.notes?.length > 0 ? (
            <div className="flex items-center text-sm text-gray-500">
              <FiFileText className="mr-2 h-4 w-4 text-blue-500" />
              <span>Your notes...</span>
            </div>
          ) : (
            <div className="text-xs text-gray-400">No notes yet</div>
          )}

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleReaction(plan.title, "thumbsUp");
              }}
              disabled={reactionLoading[plan.title]}
              className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                plan.reactions?.thumbsUp
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <FiThumbsUp
                className={`h-4 w-4 ${
                  plan.reactions?.thumbsUp ? "fill-current" : ""
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
              className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                plan.reactions?.thumbsDown
                  ? "bg-red-100 text-red-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <FiThumbsDown
                className={`h-4 w-4 ${
                  plan.reactions?.thumbsDown ? "fill-current" : ""
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
};

export default LearningPlanCard;
