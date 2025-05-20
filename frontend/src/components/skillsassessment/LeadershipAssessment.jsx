"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import questions from "./leadership_questions.json";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";

export default function LeadershipAssessment({ initialData, onNext }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {});
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = questions.questions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === questions.questions.length - 1;
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.questions.length) * 100;

  const handleOptionSelect = (questionId, value) => {
    setSelectedOption(value);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Auto-advance after selection
    setTimeout(() => {
      setSelectedOption(null);
      if (!isLastQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
        // } else {
        // setIsSubmitting(true);
        // setTimeout(() => onNext({ leadership: answers }), 800);
      }
    }, 400);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl sm:p-6">
      <BorderBeam
        size={150}
        duration={10}
        colorFrom="#0029ff"
        colorTo="#3b82f6"
        className="rounded-xl"
      />

      {/* Compact Header */}
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

      {/* Full-width Progress Bar */}
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
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, type: "spring" }}
          />
        </motion.div>
      </div>

      {/* Question with smooth transitions */}
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

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AnimatePresence>
          {currentQuestion.options.map((option) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: option.value * 0.1 }}
              layout
            >
              <RippleButton
                onClick={() =>
                  handleOptionSelect(currentQuestion.id, option.value)
                }
                rippleColor="rgba(0, 41, 255, 0.15)"
                className={cn(
                  "w-full border-2 p-3 transition-all duration-150 sm:p-4",
                  answers[currentQuestion.id] === option.value
                    ? "border-[#0029ff] bg-[#f0f4ff] text-[#0029ff] shadow-sm"
                    : "border-[#d6e0ff] bg-white text-[#0029ff] hover:border-[#0029ff] hover:bg-[#f5f8ff]",
                  selectedOption === option.value
                    ? "ring-opacity-50 ring-2 ring-[#0029ff]"
                    : "",
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.div
                  animate={{
                    scale: selectedOption === option.value ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <span className="font-medium">{option.text}</span>
                  {/* {answers[currentQuestion.id] === option.value && (
                    <motion.div
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-color)] text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )} */}
                </motion.div>
              </RippleButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation - Only Previous Button */}
      <motion.div
        className="mt-6 flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <RippleButton
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          rippleColor="rgba(var(--primary-color-rgb))"
          className={cn(
            "border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color),white_95%)]",
            currentQuestionIndex === 0 ? "opacity-50" : "",
          )}
        >
          ← Previous
        </RippleButton>

        {isLastQuestion && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RippleButton
              onClick={() => {
                onNext({ leadership: answers });
              }}
              disabled={!answers[currentQuestion.id]}
              rippleColor="rgba(0, 41, 255, 0.3)"
              className={cn(
                "bg-[#0029ff] text-white hover:bg-[#001fcc]",
                !answers[currentQuestion.id]
                  ? "cursor-not-allowed opacity-50"
                  : "",
              )}
              whileHover={{
                scale: !answers[currentQuestion.id] ? 1 : 1.03,
                boxShadow: !answers[currentQuestion.id]
                  ? "none"
                  : "0 2px 8px rgba(0, 41, 255, 0.2)",
              }}
            >
              Complete Assessment →
            </RippleButton>
          </motion.div>
        )}
      </motion.div>

      {/* Loading Overlay */}
      {/* {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="flex flex-col items-center"
          >
            <div className="relative h-10 w-10">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[var(--primary-color)] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p
              className="mt-3 text-sm font-medium text-gray-700"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Analyzing your leadership style...
            </motion.p>
          </motion.div>
        </motion.div>
      )} */}
    </div>
  );
}
