"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import questions from "./psychographicProfile.json";
import { cn } from "../../lib/utils";
import { RippleButton } from "../magicui/ripple-button";

export default function PsychographicProfile({ initialData, onNext, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {});
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = questions.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progressPercentage = ((currentQuestionIndex + 1) / questions.questions.length) * 100;

  const handleOptionSelect = (questionId, value) => {
    setSelectedOption(value);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    setTimeout(() => {
      setSelectedOption(null);
      if (!isLastQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
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
            animate={{ width: `${progressPercentage}%` }}
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
          {currentQuestion.options.map((option) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: option.value * 0.1 }}
              layout
            >
              <RippleButton
                onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                rippleColor="rgba(0, 41, 255, 0.15)"
                className={cn(
                  "w-full border-2 p-3 transition-all duration-150 sm:p-4",
                  answers[currentQuestion.id] === option.value
                    ? "border-[var(--primary-color)] bg-[#f0f4ff] text-[var(--primary-color)] shadow-sm"
                    : "border-[#d6e0ff] bg-white text-[#0029ff] hover:border-[var(--primary-color)] hover:bg-[#f5f8ff]",
                  selectedOption === option.value
                    ? "ring-opacity-50 ring-2 ring-[var(--primary-color)]"
                    : ""
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
                </motion.div>
              </RippleButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        className="mt-6 flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {isFirstQuestion ? (
          <RippleButton
            onClick={onBack}
            rippleColor="rgba(0, 41, 255, 0.15)"
            className="border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[#f5f8ff]"
          >
            ← Back
          </RippleButton>
        ) : (
          <RippleButton
            onClick={handlePrevious}
            rippleColor="rgba(0, 41, 255, 0.15)"
            className="border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[#f5f8ff]"
          >
            ← Previous
          </RippleButton>
        )}

        {isLastQuestion && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RippleButton
              onClick={() => onNext({ psychographic: answers })}
              disabled={!answers[currentQuestion.id]}
              rippleColor="rgba(0, 41, 255, 0.3)"
              className={cn(
                "bg-[var(--primary-color)] text-white hover:bg-[#001fcc]",
                !answers[currentQuestion.id] ? "cursor-not-allowed opacity-50" : ""
              )}
              whileHover={{
                scale: !answers[currentQuestion.id] ? 1 : 1.03,
                boxShadow: !answers[currentQuestion.id]
                  ? "none"
                  : "0 2px 8px rgba(0, 41, 255, 0.2)",
              }}
            >
              Complete Profile →
            </RippleButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}