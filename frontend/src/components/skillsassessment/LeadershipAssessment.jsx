"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  // Flatten all questions into a single array
  const allQuestions = questions.assessment.flatMap((category) =>
    category.questions.map((question) => ({
      ...question,
      category: category.category,
    })),
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {});
  const [isComplete, setIsComplete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    questions.assessment[0].category,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Calculate progress
  const progressPercentage = (currentQuestionIndex / allQuestions.length) * 100;

  const handleOptionSelect = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Update progress (scaled to 25% of total progress)
    const scaledProgress =
      ((currentQuestionIndex + 1) / allQuestions.length) * 25;
    setProgressPercentage(scaledProgress);

    // Auto-advance to next question if not last
    if (!isLastQuestion) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        // Update current category for the progress bar
        const nextCategory = allQuestions[currentQuestionIndex + 1].category;
        setSelectedCategory(nextCategory);
        setIsTransitioning(false);
      }, 800);
    } else {
      setIsComplete(true);
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

  // Calculate category progress for the indicator
  const getCategoryProgress = () => {
    const categoryQuestions = allQuestions.filter(
      (q) => q.category === selectedCategory,
    );
    const answeredInCategory = categoryQuestions.filter(
      (q) => answers[q.id],
    ).length;
    return (answeredInCategory / categoryQuestions.length) * 100;
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
            {selectedCategory}
          </h3>
          <div className="mt-1 h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#0029ff] transition-all duration-300"
              style={{
                width: `${getCategoryProgress()}%`,
              }}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Overall Progress</span>
            <span>
              {currentQuestionIndex + 1} of {allQuestions.length}
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

        {/* Single Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-gray-100 pt-4 pr-6 pb-8 pl-6 shadow-md"
        >
          <motion.div
            className="mb-4 flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#0029ff] to-[#3b82f6] text-sm font-medium text-white shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {currentQuestionIndex + 1}
            </motion.div>
            <h4 className="mt-0.5 text-base leading-tight font-medium text-gray-800 sm:text-lg">
              {currentQuestion.text}
            </h4>
          </motion.div>

          <div className="px-2">
            <EmojiSlider
              questionId={currentQuestion.id}
              value={answers[currentQuestion.id]}
              onChange={handleOptionSelect}
              disabled={isTransitioning}
            />
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      {!isFirstQuestion && (
        <div className="relative">
          <div className="relative min-h-auto pb-24">
            <motion.div
              className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mx-auto flex max-w-3xl justify-between">
                {/* Previous Button - only shown after first question */}
                {!isFirstQuestion && (
                  <RippleButton
                    onClick={handlePrevious}
                    rippleColor="rgba(var(--primary-color-rgb))"
                    className={cn(
                      "border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color),white_95%)]",
                      isTransitioning ? "cursor-not-allowed opacity-50" : "",
                    )}
                    disabled={isTransitioning}
                  >
                    ← Previous
                  </RippleButton>
                )}

                {/* Complete Assessment Button (only shows when all questions answered) */}
                {isComplete && (
                  <RippleButton
                    onClick={() => onNext({ leadership: answers })}
                    rippleColor="rgba(0, 41, 255, 0.3)"
                    className="min-w-[90px] bg-[#0029ff] px-6 py-2 text-white hover:bg-[#001fcc]"
                  >
                    Submit →
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
