import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiBookmark,
  FiEdit,
  FiCheck,
  FiX,
  FiPlay,
  FiThumbsUp,
  FiThumbsDown,
  FiTarget,
  FiList,
  FiBarChart2,
  FiLayers,
  FiClock,
  FiFileText,
  FiDownload,
  FiExternalLink,
  FiChevronDown,
} from "react-icons/fi";
import YouTube from "react-youtube";
import { useState, useEffect, useRef } from "react";

const SinglePlanView = ({
  singlePlan,
  handleActionViewClick,
  handleSaveStatus,
  isPlaying,
  setIsPlaying,
  getYouTubeVideoId,
  getYouTubeThumbnail,
  opts,
  handleReaction,
  reactionLoading,
  showNoteInput,
  setShowNoteInput,
  note,
  handleNoteChange,
  isEditingNote,
  setIsEditingNote,
  editedNote,
  setEditedNote,
  handleEditNote,
  handleDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-800",
    intermediate: "bg-amber-100 text-amber-800",
    advanced: "bg-rose-100 text-rose-800",
  };

  const focusAreaIcons = {
    "decision-making": "🧠",
    communication: "💬",
    strategy: "♟️",
    leadership: "👑",
  };

  const toggleSection = (section) => {
    if (isMobile) {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative mt-5 min-h-screen rounded-2xl border border-gray-200 bg-gray-50 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleActionViewClick(null, {})}
            className="group flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
          >
            <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Plans
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl rounded-2xl px-4 py-4">
        {/* Video Section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden rounded-2xl bg-gray-900 shadow-2xl"
        >
          {isPlaying ? (
            <div className="aspect-video w-full">
              <YouTube
                videoId={getYouTubeVideoId(singlePlan.video)}
                opts={opts}
                className="h-full w-full"
                onReady={() => setIsVideoLoaded(true)}
                onError={(e) => console.error("YouTube Error:", e)}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-video w-full cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={getYouTubeThumbnail(singlePlan.video)}
                alt={singlePlan.title}
                className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all hover:bg-black/30">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-blue-500 shadow-lg"
                >
                  <FiPlay className="h-8 w-8 translate-x-[2px]" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col items-start">
            <div className="flex items-start justify-between">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-[#0029ff]"
              >
                {singlePlan.title}
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleSaveStatus(singlePlan.title, !singlePlan.saved)
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  singlePlan.saved
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiBookmark
                  className={`h-5 w-5 ${singlePlan.saved ? "fill-current" : ""}`}
                />
                {singlePlan.saved ? "Saved" : "Save"}
              </motion.button>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-lg text-gray-600"
            >
              {singlePlan.content}
            </motion.p>
          </div>

          {/* Tags and Difficulty */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${difficultyColors[singlePlan.difficulty]}`}
            >
              {singlePlan.difficulty}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {singlePlan.focus_area}
            </span>
            {singlePlan.skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2">
            {/* Tabs */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex space-x-1 overflow-x-auto pb-2 md:space-x-4 md:border-b md:border-gray-200 md:pb-0">
                {["overview", "prerequisites", "resources"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap capitalize transition-colors md:rounded-none md:px-4 md:py-2 ${
                      activeTab === tab
                        ? "bg-[#0029ff]/10 text-[#0029ff] md:bg-transparent"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && !isMobile && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute right-0 bottom-0 left-0 h-0.5 bg-[#0029ff]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            {/* <AnimatePresence mode="wait"> */}
            <div
              // key={activeTab}
              // initial={{ opacity: 0, y: 10 }}
              // animate={{ opacity: 1, y: 0 }}
              // // exit={{ opacity: 0, y: -10 }}
              // transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  <motion.div
                    variants={itemVariants}
                    className="rounded-xl bg-white p-4 shadow-sm md:p-6"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between md:cursor-auto"
                      onClick={() => toggleSection("nextSteps")}
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <FiTarget className="h-5 w-5 text-[#0029ff]" />
                        Next Steps
                      </h3>
                      {isMobile && (
                        <FiChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === "nextSteps" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                    {(expandedSection === "nextSteps" || !isMobile) && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 space-y-3 overflow-hidden"
                      >
                        {singlePlan.next_steps.map((step, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-3 text-gray-600"
                          >
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-[#0029ff]" />
                            {step}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="rounded-xl bg-white p-4 shadow-sm md:p-6"
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between md:cursor-auto"
                      onClick={() => toggleSection("metrics")}
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <FiBarChart2 className="h-5 w-5 text-[#0029ff]" />
                        Metrics
                      </h3>
                      {isMobile && (
                        <FiChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === "metrics" ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                    {(expandedSection === "metrics" || !isMobile) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 space-y-4 overflow-hidden"
                      >
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700">
                            Short-term Goals
                          </h4>
                          <ul className="space-y-2">
                            {singlePlan.metrics.short_term.map(
                              (metric, index) => (
                                <motion.li
                                  key={index}
                                  className="flex items-center gap-2 text-gray-600"
                                >
                                  <FiClock className="h-4 w-4 text-[#0029ff]" />
                                  {metric}
                                </motion.li>
                              ),
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700">
                            Long-term Goals
                          </h4>
                          <ul className="space-y-2">
                            {singlePlan.metrics.long_term.map(
                              (metric, index) => (
                                <motion.li
                                  key={index}
                                  className="flex items-center gap-2 text-gray-600"
                                >
                                  <FiLayers className="h-4 w-4 text-[#0029ff]" />
                                  {metric}
                                </motion.li>
                              ),
                            )}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </>
              )}

              {/* Prerequisites Tab */}
              {activeTab === "prerequisites" && (
                <motion.div
                  variants={itemVariants}
                  className="rounded-xl bg-white p-4 shadow-sm md:p-6"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between md:cursor-auto"
                    onClick={() => toggleSection("prerequisites")}
                  >
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <FiList className="h-5 w-5 text-[#0029ff]" />
                      Prerequisites
                    </h3>
                    {isMobile && (
                      <FiChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === "prerequisites" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                  {(expandedSection === "prerequisites" || !isMobile) && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      {singlePlan.prerequisites.map((prereq, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <span className="h-2 w-2 rounded-full bg-[#0029ff]" />
                          {prereq}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.div>
              )}

              {/* Resources Tab */}
              {activeTab === "resources" && (
                <motion.div
                  variants={itemVariants}
                  className="rounded-xl bg-white p-4 shadow-sm md:p-6"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between md:cursor-auto"
                    onClick={() => toggleSection("resources")}
                  >
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <FiFileText className="h-5 w-5 text-[#0029ff]" />
                      Resources
                    </h3>
                    {isMobile && (
                      <FiChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${expandedSection === "resources" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                  {(expandedSection === "resources" || !isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 space-y-4 overflow-hidden"
                    >
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Required
                        </h4>
                        <ul className="space-y-2">
                          {singlePlan.resources.required.map(
                            (resource, index) => (
                              <motion.li
                                key={index}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <FiDownload className="h-4 w-4 text-[#0029ff]" />
                                {resource}
                              </motion.li>
                            ),
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Optional
                        </h4>
                        <ul className="space-y-2">
                          {singlePlan.resources.optional.map(
                            (resource, index) => (
                              <motion.li
                                key={index}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <FiExternalLink className="h-4 w-4 text-[#0029ff]" />
                                {resource}
                              </motion.li>
                            ),
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Notes (Always Visible) */}
          <div className="md:col-span-1">
            <motion.div
              variants={itemVariants}
              className="sticky top-6 rounded-xl bg-white p-4 shadow-sm md:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <FiFileText className="h-5 w-5 text-[#0029ff]" />
                  Notes
                </h3>
                {singlePlan.notes?.length > 0 &&
                  !showNoteInput &&
                  !isEditingNote && (
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditingNote(true);
                          setEditedNote(singlePlan.notes[0]);
                        }}
                        className="rounded-full bg-blue-50 p-2 text-[#0029ff] transition-colors hover:bg-blue-100"
                      >
                        <FiEdit className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteNote(singlePlan.title)}
                        className="rounded-full bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                      >
                        <FiX className="h-5 w-5" />
                      </motion.button>
                    </div>
                  )}
              </div>

              {singlePlan.notes?.length > 0 ? (
                isEditingNote ? (
                  <div className="space-y-4">
                    <textarea
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:border-[#0029ff] focus:ring-1 focus:ring-[#0029ff] focus:outline-none"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditingNote(false);
                          setEditedNote("");
                        }}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleEditNote(singlePlan.title, editedNote)
                        }
                        className="rounded-full bg-[#0029ff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#001fcc]"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
                    {singlePlan.notes[0]}
                  </div>
                )
              ) : showNoteInput ? (
                <div className="space-y-4">
                  <textarea
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Write your note here..."
                    className="w-full rounded-lg border border-gray-200 p-3 text-gray-700 focus:border-[#0029ff] focus:ring-1 focus:ring-[#0029ff] focus:outline-none"
                    rows={4}
                  />
                  {/* <div className="flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNoteInput(false)}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditNote(singlePlan.title, note)}
                      className="rounded-full bg-[#0029ff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#001fcc]"
                    >
                      Add Note
                    </motion.button>
                  </div> */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <FiFileText className="mb-3 h-10 w-10 text-gray-400" />
                  <p className="mb-4 text-gray-500">No notes yet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNoteInput(true)}
                    className="rounded-full bg-[#0029ff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#001fcc]"
                  >
                    Add Note
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Reaction Buttons with Context */}
        <motion.div
          variants={itemVariants}
          className="mt-4 flex flex-row gap-4 md:flex-row md:items-center md:justify-between"
        >
          {/* Coaching Context Text */}
          <div className="max-w-md">
            <p className="text-sm text-gray-600">
              Rate this learning plan to help us improve your coaching
              experience.
            </p>
          </div>

          {/* Reaction Buttons */}
          <div className="flex items-center justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction(singlePlan.title, "thumbsUp")}
              disabled={reactionLoading[singlePlan.title]}
              className={`group relative rounded-full p-3 transition-colors ${
                singlePlan.reactions?.thumbsUp
                  ? "bg-blue-100 text-[#0029ff]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FiThumbsUp
                className={`h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6 ${
                  singlePlan.reactions?.thumbsUp ? "fill-current" : ""
                }`}
              />
              {reactionLoading[singlePlan.title] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0029ff] border-t-transparent"></div>
                </div>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction(singlePlan.title, "thumbsDown")}
              disabled={reactionLoading[singlePlan.title]}
              className={`group relative rounded-full p-3 transition-colors ${
                singlePlan.reactions?.thumbsDown
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FiThumbsDown
                className={`h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6 ${
                  singlePlan.reactions?.thumbsDown ? "fill-current" : ""
                }`}
              />
              {reactionLoading[singlePlan.title] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SinglePlanView;
