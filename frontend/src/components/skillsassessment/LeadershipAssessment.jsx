"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import questions from "./leadership_questions.json";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";
import EmojiSlider from "./EmojiSlider";

export default function LeadershipAssessment({
  initialData,
  onNext,
  setProgressPercentage,
}) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {});
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const currentCategory = questions.assessment[currentCategoryIndex];
  const isLastCategory =
    currentCategoryIndex === questions.assessment.length - 1;

  // Calculate progress
  const totalQuestions = questions.assessment.reduce(
    (acc, category) => acc + category.questions.length,
    0,
  );

  const handleOptionSelect = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Calculate and update progress percentage (scaled to 25% of total progress)
    const answeredQuestions = Object.keys(newAnswers).length;
    const sectionProgress = (answeredQuestions / totalQuestions) * 100;
    const scaledProgress = sectionProgress * 0.25; // Since this is 1 of 4 steps
    setProgressPercentage(scaledProgress);
  };

  // Check if all questions in current category are answered
  useEffect(() => {
    const categoryQuestions = currentCategory.questions.map((q) => q.id);
    const answeredInCategory = categoryQuestions.every((id) =>
      answers.hasOwnProperty(id),
    );
    setAllQuestionsAnswered(answeredInCategory);
  }, [currentCategoryIndex, answers]);

  // Calculate current progress for display (not scaled)
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastCategory) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else {
      // When completing this section, set progress to 25% (this step's full value)
      setProgressPercentage(25);
      onNext({ leadership: answers });
    }
  };

  return (
    <>
      <div className="relative w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl sm:p-6">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="#3b82f6"
          className="rounded-xl"
        />

        {/* Header */}
        <div className="mb-4">
          <motion.h2
            className="text-lg font-bold text-gray-900 sm:text-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {questions.assessmentTitle}
          </motion.h2>
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {questions.instructions}
          </motion.p>
        </div>

        {/* Category Indicator */}
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-800 sm:text-lg">
            {currentCategory.category}
          </h3>
          <div className="mt-1 h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#0029ff] transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(answers).filter((id) =>
                    currentCategory.questions.some((q) => q.id === id),
                  ).length /
                    currentCategory.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Overall Progress</span>
            <span>
              {answeredQuestions}/{totalQuestions}
            </span>
          </div>
          <motion.div
            className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: "var(--primary-color)",
                width: `${progressPercentage}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </motion.div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {" "}
          {/* Increased spacing */}
          {currentCategory.questions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-gray-100 pt-4 pr-6 pb-8 pl-6 shadow-md" // Larger padding and rounded corners
            >
              <h4 className="mb-1 text-base font-medium text-gray-800 sm:text-lg">
                {" "}
                {/* Larger text */}
                {question.text}
              </h4>

              <div className="px-2">
                {" "}
                {/* Added horizontal padding */}
                <EmojiSlider
                  questionId={question.id}
                  value={answers[question.id]}
                  onChange={handleOptionSelect}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* Show only Next button for first category when all questions are answered */}
      {currentCategoryIndex === 0 && allQuestionsAnswered && (
        <div className="relative">
          <div className="relative min-h-auto pb-24">
            <motion.div
              className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mx-auto flex max-w-3xl justify-end">
                {" "}
                {/* Changed to justify-end to align single button to right */}
                <RippleButton
                  onClick={handleNext}
                  rippleColor="rgba(0, 41, 255, 0.3)"
                  className="bg-[var(--primary-color)] text-white hover:bg-[#001fcc]"
                >
                  Next Section →
                </RippleButton>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      {currentCategoryIndex > 0 && (
        <div className="relative">
          <div className="relative min-h-auto pb-24">
            <motion.div
              className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mx-auto flex max-w-3xl justify-between">
                <RippleButton
                  onClick={handlePrevious}
                  disabled={currentCategoryIndex === 0}
                  rippleColor="rgba(var(--primary-color-rgb))"
                  className={cn(
                    "border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color),white_95%)]",
                    currentCategoryIndex === 0 ? "opacity-50" : "",
                  )}
                >
                  ← Previous Section
                </RippleButton>

                {!isLastCategory ? (
                  <RippleButton
                    onClick={handleNext}
                    disabled={!allQuestionsAnswered}
                    rippleColor="rgba(0, 41, 255, 0.3)"
                    className={cn(
                      "bg-[#0029ff] text-white hover:bg-[#001fcc]",
                      !allQuestionsAnswered
                        ? "cursor-not-allowed opacity-50"
                        : "",
                    )}
                  >
                    Next Section →
                  </RippleButton>
                ) : (
                  <RippleButton
                    onClick={() => onNext({ leadership: answers })}
                    disabled={!allQuestionsAnswered}
                    rippleColor="rgba(0, 41, 255, 0.3)"
                    className={cn(
                      "bg-[#0029ff] text-white hover:bg-[#001fcc]",
                      !allQuestionsAnswered
                        ? "cursor-not-allowed opacity-50"
                        : "",
                    )}
                  >
                    Complete Assessment →
                  </RippleButton>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
