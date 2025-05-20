"use client";
import {
  AnimatedList
} from "../components/magicui/animated-list";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "../components/magicui/animated-circular-progress-bar";
import { AuroraText } from "../components/magicui/aurora-text";

const AI_THINKING_MESSAGES = [
  "Analyzing your leadership patterns...",
  "Processing decision-making skills...",
  "Evaluating communication strengths...",
  "Calculating emotional intelligence score...",
  "Finalizing personalized recommendations...",
];

function WaitingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(
        (prev) => (prev + 1) % AI_THINKING_MESSAGES.length,
      );
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      {/* V-Shaped Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-50"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 60%)" }}
        />
        <div
          className="absolute inset-0 bg-[var(--primary-color)]"
          style={{ clipPath: "polygon(0 60%, 100% 40%, 100% 100%, 0 100%)" }}
        />
      </div>

      

      {/* Content Container */}
      <motion.div
        className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl bg-white/80 p-8 backdrop-blur-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <AuroraText
          className="text-2xl font-bold"
          colors={["#0029ff", "#3b82f6", "#2563eb"]}
        >
          Analyzing Your Results
        </AuroraText>

        {/* Circular Progress Timer */}
        <div className="relative">
          <AnimatedCircularProgressBar
            value={progress}
            max={100}
            min={0}
            gaugePrimaryColor="var(--primary-color)"
            gaugeSecondaryColor="rgba(0, 41, 255, 0.1)"
            className="h-40 w-40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--primary-color)]">
              {progress}%
            </span>
          </div>
        </div>

        {/* AI Thinking Messages */}
        <div className="w-full max-w-md">
          <AnimatedList delay={3000}>
            {AI_THINKING_MESSAGES.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg px-4 py-3 text-center ${
                  index === currentMessageIndex
                    ? "bg-[var(--primary-color)] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {message}
              </div>
            ))}
          </AnimatedList>
        </div>

        {/* Animated Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              className="h-3 w-3 rounded-full bg-[var(--primary-color)]"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default WaitingScreen;
