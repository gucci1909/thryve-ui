"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import questions from "./psychographicProfile.json";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FiCheck } from "react-icons/fi";

export default function PsychographicProfile({
  initialData,
  onNext,
  onBack,
  setProgressPercentage,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [psychogaphicProfile, setPsychogaphicProfile] = useState({});

  const currentQuestion = questions.questions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === questions.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Calculate progress for this section (0-25% of total progress)
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = questions.questions.length;
  const sectionProgress = (answeredQuestions / totalQuestions) * 100;
  const scaledProgress = 50 + sectionProgress * 0.25; // This is step 3 of 4 (50-75%)

  // Update parent progress when answers change
  useEffect(() => {
    setProgressPercentage(scaledProgress);
  }, [answers, scaledProgress, setProgressPercentage]);

  const handleOptionSelect = (value, ans, index, questionId, questionText) => {
    setPsychogaphicProfile((prev) => {
      let newOptions;

      if (currentQuestion.type === "single-select") {
        newOptions = [ans];
      } else {
        const currentOptions = prev[questionText] || [];
        newOptions = currentOptions.includes(ans)
          ? currentOptions.filter((opt) => opt !== ans)
          : [...currentOptions, ans];
      }

      const updated = { ...prev, [questionText]: newOptions };

      return updated;
    });
    setSelectedOptions((prev) => {
      let newOptions;

      if (currentQuestion.type === "single-select") {
        // For single select, just set the selected value
        newOptions = [value];
      } else {
        // For multi-select, toggle the value
        const currentOptions = prev[currentQuestionIndex] || [];
        newOptions = currentOptions.includes(value)
          ? currentOptions.filter((opt) => opt !== value)
          : [...currentOptions, value];
      }

      const updated = { ...prev, [currentQuestionIndex]: newOptions };

      // Update answers state
      setAnswers((ans) => ({ ...ans, [questionId]: newOptions }));

      return updated;
    });
  };

  const handleNextQuestion = () => {
    setSelectedOptions([]);
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setSelectedOptions([]);
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <>
      <div className="relative w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl sm:p-6">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="var(--primary-color)"
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
          {currentQuestion.type === "multi-select" && (
            <motion.p
              className="mt-1 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              (You can select multiple options)
            </motion.p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>
              {currentQuestionIndex + 1}/{questions.questions.length}
            </span>
          </div>
          <motion.div
            className="mt-1 h-1.5 w-full rounded-full bg-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="h-full rounded-full bg-[var(--primary-color)]"
              initial={{ width: 0 }}
              animate={{ width: `${sectionProgress}%` }}
              transition={{ duration: 0.6, type: "spring" }}
            />
          </motion.div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-md font-semibold text-gray-800 sm:text-lg">
              {currentQuestion.text}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = selectedOptions[currentQuestionIndex]?.includes(option.value) ||
                answers[currentQuestion.id]?.includes(option.value);

              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: optionIndex * 0.1 }}
                  layout
                >
                  <RippleButton
                    onClick={() =>
                      handleOptionSelect(
                        option.value,
                        option.text,
                        optionIndex,
                        currentQuestion.id,
                        currentQuestion?.text,
                      )
                    }
                    rippleColor="rgba(0, 41, 255, 0.15)"
                    className={cn(
                      "w-full border-2 p-3 transition-all duration-150 sm:p-4",
                      isSelected
                        ? "border-[var(--primary-color)] bg-[#f0f4ff] text-[var(--primary-color)] shadow-sm"
                        : "border-[#d6e0ff] bg-white text-[#0029ff] hover:border-[var(--primary-color)] hover:bg-[#f5f8ff]",
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.div className="flex items-center">
                      <span className="font-medium">{option.text}</span>
                      {isSelected && <FiCheck className="ml-2 h-4 w-4" />}
                    </motion.div>
                  </RippleButton>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative min-h-auto pb-24">
        <motion.div
          className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mx-auto flex max-w-3xl justify-between">
            {isFirstQuestion ? (
              <RippleButton
                onClick={onBack}
                rippleColor="rgba(0, 41, 255, 0.15)"
                className="flex items-center gap-1 border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[#f5f8ff]"
                whileHover={{ scale: 1.03 }}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </RippleButton>
            ) : (
              <RippleButton
                onClick={handlePrevious}
                rippleColor="rgba(0, 41, 255, 0.15)"
                className="flex items-center gap-1 border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[#f5f8ff]"
                whileHover={{ scale: 1.03 }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </RippleButton>
            )}

            <div className="flex gap-2">
              {!isLastQuestion && (
                <RippleButton
                  onClick={handleNextQuestion}
                  disabled={!answers[currentQuestion.id]?.length}
                  rippleColor="rgba(0, 41, 255, 0.3)"
                  className={cn(
                    "flex items-center gap-1 bg-[var(--primary-color)] text-white hover:bg-[#001fcc]",
                    !answers[currentQuestion.id]?.length
                      ? "cursor-not-allowed opacity-50"
                      : "",
                  )}
                  whileHover={{
                    scale: !answers[currentQuestion.id]?.length ? 1 : 1.03,
                  }}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </RippleButton>
              )}

              {isLastQuestion && (
                <RippleButton
                  onClick={() =>
                    onNext({
                      psychographic: answers,
                      psychographicInfo: psychogaphicProfile,
                    })
                  }
                  disabled={!answers[currentQuestion.id]?.length}
                  rippleColor="rgba(0, 41, 255, 0.3)"
                  className={cn(
                    "flex items-center gap-1 bg-[var(--primary-color)] text-white hover:bg-[#001fcc]",
                    !answers[currentQuestion.id]?.length
                      ? "cursor-not-allowed opacity-50"
                      : "",
                  )}
                  whileHover={{
                    scale: !answers[currentQuestion.id]?.length ? 1 : 1.03,
                  }}
                >
                  Complete Profile
                  <ChevronRight className="h-4 w-4" />
                </RippleButton>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
