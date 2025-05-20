"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { BoxReveal } from "../magicui/box-reveal";
import questions from "./leadership_questions.json";

export default function LeadershipAssessment({ initialData, onNext }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions.questions[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === questions.questions.length - 1;

  const handleOptionSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      setTimeout(() => onNext({ leadership: answers }), 1000);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  return (
    <div className="relative w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
      {/* Border Beam Effect */}
      <BorderBeam
        size={150}
        duration={10}
        colorFrom="#0029ff"
        colorTo="#3b82f6"
        className="rounded-2xl"
      />

      {/* Assessment Header */}
      <BoxReveal boxColor="#0029ff" duration={0.6}>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {questions.assessmentTitle}
        </h2>
      </BoxReveal>
      <BoxReveal boxColor="#3b82f6" duration={0.6} delay={0.2}>
        <p className="mb-8 text-gray-600">{questions.instructions}</p>
      </BoxReveal>

      {/* Progress Indicator */}
      <BoxReveal boxColor="#2563eb" duration={0.6} delay={0.4}>
        <div className="mb-8 w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of{" "}
              {questions.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {currentQuestion.category}
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-[var(--primary-color)]"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestionIndex + 1) / questions.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>
        </div>
      </BoxReveal>

      {/* Question */}
      <BoxReveal boxColor="#1d4ed8" duration={0.6} delay={0.6}>
        <h3 className="mb-6 text-xl font-semibold text-gray-800">
          {currentQuestion.text}
        </h3>
      </BoxReveal>

      {/* Options */}
      <div className="space-y-4">
        {currentQuestion.options.map((option) => (
          <BoxReveal
            key={option.value}
            boxColor="#0029ff"
            duration={0.4}
            delay={0.2 * option.value}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  handleOptionSelect(currentQuestion.id, option.value)
                }
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  answers[currentQuestion.id] === option.value
                    ? "border-[var(--primary-color)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium text-gray-800">{option.text}</span>
              </button>
              {answers[currentQuestion.id] === option.value && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-color)] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          </BoxReveal>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <BoxReveal boxColor="#3b82f6" duration={0.6} delay={0.8}>
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-lg px-6 py-2 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
        </BoxReveal>
        <BoxReveal boxColor="#0029ff" duration={0.6} delay={0.8}>
          <button
            type="button"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="rounded-lg bg-[var(--primary-color)] px-6 py-2 text-white disabled:opacity-50"
          >
            {isLastQuestion ? "Complete Assessment" : "Next"}
          </button>
        </BoxReveal>
      </div>

      {/* Loading State */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent" />
            <p className="mt-4 text-gray-700">Processing your results...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
