"use client";
import { AnimatedList } from "../components/magicui/animated-list";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "../components/magicui/animated-circular-progress-bar";
import { AuroraText } from "../components/magicui/aurora-text";
import { useLocation, useNavigate } from "react-router";

const AI_THINKING_MESSAGES = [
  "Analyzing your leadership patterns",
  "Processing decision-making skills",
  "Evaluating communication strengths",
  "Calculating emotional intelligence score",
  "Finalizing personalized recommendations",
];

function WaitingScreen() {
  const location = useLocation();
  const formData = location.state?.formData;
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          navigate("/leadership-swot-analysis", { state: { formData } });
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
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#f8f9ff] to-[#e6ecff]">
      {/* Compact Header */}
      <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] px-3 py-1.5">
        <div className="relative z-10 mx-auto flex h-10 max-w-4xl flex-row items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-8 drop-shadow-sm"
            />
            <h1 className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
              thryve
            </h1>
          </motion.div>

          <motion.h2
            className="cursor-default text-lg text-white hover:cursor-[url('/pointer.cur'),_pointer]"
            style={{
              fontWeight: 900,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Welcome, Sunil
          </motion.h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-4">
        <motion.div
          className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-2xl backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ height: "80vh" }} // fixed height
        >
          {/* Header */}
          <div className="text-center">
            <AuroraText
              className="text-2xl font-bold"
              colors={["#0029ff", "#3b82f6", "#2563eb"]}
            >
              Analyzing Your Results
            </AuroraText>
            <p className="mt-1 text-sm text-gray-500">
              This will only take a moment...
            </p>
          </div>

          {/* Scrollable Progress Section */}
          <div
            className="flex flex-col items-center gap-6 overflow-y-auto px-4"
            style={{ flex: 1 }}
          >
            {/* Circular Progress */}
            <div className="relative">
              <AnimatedCircularProgressBar
                value={progress}
                max={100}
                min={0}
                gaugePrimaryColor="var(--primary-color)"
                gaugeSecondaryColor="rgba(0, 41, 255, 0.1)"
                className="h-40 w-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-[var(--primary-color)]">
                  {progress}%
                </span>
                <span className="text-xs text-gray-400">COMPLETE</span>
              </div>
            </div>

            {/* AI Thinking Messages */}
            <div className="w-full max-w-md space-y-2">
              <AnimatedList delay={3000}>
                {AI_THINKING_MESSAGES.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-lg px-4 py-2 text-center text-sm font-medium transition-all ${
                      index === currentMessageIndex
                        ? "bg-[var(--primary-color)] text-white shadow"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {message}
                  </motion.div>
                ))}
              </AnimatedList>
            </div>

            {/* Animated Dots */}
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[1, 2, 3].map((dot) => (
                <motion.div
                  key={dot}
                  className="h-2 w-2 rounded-full bg-[var(--primary-color)]"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WaitingScreen;
