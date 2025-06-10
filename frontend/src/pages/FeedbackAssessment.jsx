"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "../components/magicui/border-beam";
import questions from "../components/skillsassessment/leadership_questions_feedback.json";
import { cn } from "../lib/utils";
import { RippleButton } from "../components/magicui/ripple-button";
import EmojiSlider from "../components/skillsassessment/EmojiSlider";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiSend,
  FiUser,
  FiUsers,
  FiArrowRight,
  FiBriefcase,
  FiInfo,
} from "react-icons/fi";
import { FaRegLightbulb } from "react-icons/fa";

function FeedbackAssessment() {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("inviteCode");
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Assessment state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    questions.assessment[0].category,
  );
  const [showNPS, setShowNPS] = useState(false);
  const [showOpenEnded, setShowOpenEnded] = useState(false);
  const [openEndedAnswers, setOpenEndedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten all questions into a single array
  const allQuestions = questions.assessment.flatMap((category) =>
    category.questions.map((question) => ({
      ...question,
      category: category.category,
      categoryID: category.categoryID,
    })),
  );

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Fetch member info
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/invite-team/get-member-info/${inviteCode}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch member information");
        }

        setMemberInfo(data.data);
      } catch (error) {
        console.error("Error fetching member info:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (inviteCode) {
      fetchMemberInfo();
    }
  }, [inviteCode]);

  // Calculate category progress
  const getCategoryProgress = () => {
    const categoryQuestions = allQuestions.filter(
      (q) => q.category === selectedCategory,
    );
    const answeredInCategory = categoryQuestions.filter(
      (q) => answers[q.id],
    ).length;
    return (answeredInCategory / categoryQuestions.length) * 100;
  };

  const handleOptionSelect = (questionId, value) => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    const { categoryID, id } = currentQuestion;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Auto-advance to next question if not last
    if (!isLastQuestion) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        const nextCategory = allQuestions[currentQuestionIndex + 1].category;
        setSelectedCategory(nextCategory);
        setIsTransitioning(false);
      }, 800);
    } else {
      setIsComplete(true);
      setShowNPS(true);
    }
  };

  const handleOpenEndedChange = (questionId, value) => {
    setOpenEndedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const feedbackData = {
        ratingQuestions: Object.entries(answers)
          .map(([id, response]) => {
            const question = allQuestions.find((q) => q.id === id);
            return question
              ? {
                  id,
                  category: question.category,
                  categoryID: question.categoryID,
                  text: question.text,
                  response,
                }
              : null;
          })
          .filter(Boolean),
        npsScore: answers[questions.npsQuestion.id],
        openEndedQuestions: Object.entries(openEndedAnswers).map(
          ([id, response]) => {
            const question = questions.openEndedQuestions.find(
              (q) => q.id === id,
            );
            return {
              id,
              text: question.text,
              response,
            };
          },
        ),
        overallProgress:
          ((currentQuestionIndex + 1) / allQuestions.length) * 100,
        categoryProgress: getCategoryProgress(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/invite-team/save-feedback/${inviteCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save feedback");
      }

      // Navigate to thank you page
      navigate("/feedback-thank-you");
    } catch (error) {
      console.error("Submit Feedback Error:", error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        const prevCategory = allQuestions[currentQuestionIndex - 1].category;
        setSelectedCategory(prevCategory);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleNPSSubmit = () => {
    if (answers[questions.npsQuestion.id] !== undefined) {
      setShowNPS(false);
      setShowOpenEnded(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f6f9ff] to-[#eef2ff]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-[#0029ff] border-t-transparent"
          ></motion.div>
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600"
          >
            Loading assessment...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f6f9ff] to-[#eef2ff]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-8 text-center shadow-lg"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FiInfo className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            Error Loading Assessment
          </h3>
          <p className="text-red-600">{error}</p>
          <p className="mt-4 text-sm text-red-500">
            Please try again later or contact support
          </p>
        </motion.div>
      </div>
    );
  }

  if (!memberInfo) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-[#f6f9ff] to-[#eef2ff]">
      <div className="flex-1 px-4 pt-6 pb-24 sm:pt-8">
        <div className="mx-auto max-w-3xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-2 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center rounded-full bg-[#0029ff]/10 p-3"
              >
                <FaRegLightbulb className="h-6 w-6 text-[#0029ff]" />
              </motion.div>
              <h1 className="text-2xl font-bold text-[#0029ff] sm:text-3xl">
                Leadership Feedback
              </h1>
            </div>
            <div className="mt-2 flex justify-center text-center text-sm text-gray-600 sm:text-base">
              Providing feedback for{" "}
              <span className="mr-1 ml-1 font-medium text-[#0029ff]">
                {memberInfo.manager.name}
              </span>{" "}
              at{" "}
              <span className="ml-1 font-medium text-[#0029ff]">
                {memberInfo.company.name}
              </span>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0029ff]/10 text-[#0029ff]">
                  <FiBriefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Company</h3>
                  <p className="font-medium text-gray-900">
                    {memberInfo.company.name}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {memberInfo.company.aboutText}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0029ff]/10 text-[#0029ff]">
                  <FiUsers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Participants
                  </h3>
                  <p className="font-medium text-gray-900">
                    {memberInfo.manager.name} & {memberInfo.teamMember.name}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Manager</p>
                  <p className="text-sm font-medium text-gray-900">
                    {memberInfo.manager.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Team Member</p>
                  <p className="text-sm font-medium text-gray-900">
                    {memberInfo.teamMember.name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assessment Section */}
          <motion.div
            layout
            className="relative w-full rounded-xl bg-white p-4 shadow-xl sm:p-6"
          >
            <BorderBeam
              size={150}
              duration={10}
              colorFrom="#0029ff"
              colorTo="#3b82f6"
              className="rounded-xl"
            />

            {/* Progress Section */}
            {!showOpenEnded && !showNPS ? (
              <div>
                <div className="mb-6">
                  {/* Main Progress */}
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Question {currentQuestionIndex + 1} of{" "}
                      {allQuestions.length}
                    </span>
                    <span className="font-semibold text-[#0029ff]">
                      {Math.round(
                        ((currentQuestionIndex + 1) / allQuestions.length) *
                          100,
                      )}
                      % Complete
                    </span>
                  </div>

                  <div className="relative mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      className="absolute h-full rounded-full bg-gradient-to-r from-[#0029ff] to-[#3b82f6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                      }}
                      key={`progress-${currentQuestionIndex}`}
                    />
                  </div>

                  {/* Category Progress */}
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {selectedCategory}
                        </span>
                      </div>
                      <span className="text-[#3b82f6]">
                        {Math.round(getCategoryProgress())}% Complete
                      </span>
                    </div>
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200/50">
                      <motion.div
                        className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb]"
                        animate={{
                          width: `${getCategoryProgress()}%`,
                        }}
                        key={`category-${selectedCategory}`}
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30" />
                      </motion.div>
                    </div>
                  </div>
                </div>
                <motion.div
                  layout
                  key={currentQuestion.id}
                  className="rounded-xl border border-gray-100 pt-4 pr-6 pb-8 pl-6 shadow-md"
                >
                  <motion.div className="mb-6 flex items-start gap-3 sm:gap-4">
                    <motion.div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#0029ff] to-[#3b82f6] text-sm font-medium text-white shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {currentQuestionIndex + 1}
                    </motion.div>
                    <h4 className="mt-1 text-lg leading-tight font-medium text-gray-800">
                      {currentQuestion.text}
                    </h4>
                  </motion.div>

                  <div className="px-1 sm:px-2">
                    <EmojiSlider
                      questionId={currentQuestion.id}
                      value={answers[currentQuestion.id]}
                      onChange={handleOptionSelect}
                    />
                  </div>
                </motion.div>
              </div>
            ) : showNPS ? (
              /* Improved NPS Question Card */
              <motion.div
                layout
                key="nps-question"
                className="rounded-xl border border-gray-100 pt-4 pr-6 pb-8 pl-6 shadow-md"
              >
                <motion.div className="mb-6 flex items-start gap-3 sm:gap-4">
                  <div>
                    <h4 className="mt-1 text-lg leading-tight font-medium text-gray-800">
                      {questions.npsQuestion.text}
                    </h4>
                  </div>
                </motion.div>

                <div className="px-1 sm:px-2">
                  <div className="flex flex-col space-y-6">
                    <div className="flex justify-between gap-1">
                      {questions.npsQuestion.scaleOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setAnswers((prev) => ({
                              ...prev,
                              [questions.npsQuestion.id]: option.value,
                            }));
                          }}
                          className={cn(
                            "flex h-10 w-10 flex-col items-center justify-center rounded-full text-sm font-medium transition-all",
                            answers[questions.npsQuestion.id] === option.value
                              ? "bg-[#0029ff] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-[#0029ff]/10 hover:text-[#0029ff]",
                          )}
                        >
                          {option.value}
                        </button>
                      ))}
                    </div>

                    <div className="pt-4">
                      <RippleButton
                        onClick={handleNPSSubmit}
                        rippleColor="rgba(255, 255, 255, 0.3)"
                        disabled={
                          answers[questions.npsQuestion.id] === undefined
                        }
                        className={cn(
                          "flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#0029ff] to-[#3b82f6] px-4 py-3 text-white shadow-lg hover:shadow-xl",
                          answers[questions.npsQuestion.id] === undefined
                            ? "cursor-not-allowed opacity-70"
                            : "",
                        )}
                      >
                        Continue
                        <FiArrowRight className="h-4 w-4" />
                      </RippleButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {questions.openEndedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-gray-100 p-6 shadow-md"
                  >
                    <h4 className="mb-4 text-lg font-medium text-gray-800">
                      {question.text}
                    </h4>
                    <textarea
                      className="w-full rounded-lg border border-gray-200 p-3 text-gray-600 focus:border-[#0029ff] focus:ring-1 focus:ring-[#0029ff] focus:outline-none"
                      rows={4}
                      placeholder="Type your response here..."
                      value={openEndedAnswers[question.id] || ""}
                      onChange={(e) =>
                        handleOpenEndedChange(question.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {(!isFirstQuestion || showNPS || showOpenEnded) && (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl justify-between px-4 py-3 sm:px-6 sm:py-4">
            {showNPS ? (
              <RippleButton
                onClick={() => {
                  setShowNPS(false);
                  setIsComplete(false);
                }}
                rippleColor="rgba(0, 41, 255, 0.2)"
                className="flex items-center gap-2 border border-[#0029ff] bg-white px-4 text-[#0029ff] hover:bg-[#0029ff]/5 sm:px-6"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Ratings</span>
              </RippleButton>
            ) : showOpenEnded ? (
              <RippleButton
                onClick={() => {
                  setShowOpenEnded(false);
                  setShowNPS(true);
                }}
                rippleColor="rgba(0, 41, 255, 0.2)"
                className="flex items-center gap-2 border border-[#0029ff] bg-white px-4 text-[#0029ff] hover:bg-[#0029ff]/5 sm:px-6"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to NPS</span>
              </RippleButton>
            ) : (
              !isFirstQuestion && (
                <RippleButton
                  onClick={handlePrevious}
                  rippleColor="rgba(0, 41, 255, 0.2)"
                  className={cn(
                    "flex items-center gap-2 border border-[#0029ff] bg-white px-4 text-[#0029ff] hover:bg-[#0029ff]/5 sm:px-6",
                    isTransitioning ? "cursor-not-allowed opacity-50" : "",
                  )}
                  disabled={isTransitioning}
                >
                  <FiArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </RippleButton>
              )
            )}

            {/* Submit Button */}
            {showOpenEnded && (
              <RippleButton
                onClick={handleSubmit}
                rippleColor="rgba(255, 255, 255, 0.3)"
                className={cn(
                  "flex items-center gap-2 bg-gradient-to-r from-[#0029ff] to-[#3b82f6] px-4 py-2 text-white shadow-lg hover:shadow-xl sm:px-6 sm:py-3",
                  isSubmitting ? "cursor-not-allowed opacity-50" : "",
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="hidden sm:inline">Submitting...</span>
                    <span className="sm:hidden">Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Submit Feedback</span>
                    <span className="sm:hidden">Submit</span>
                    <FiSend className="h-4 w-4" />
                  </>
                )}
              </RippleButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackAssessment;
