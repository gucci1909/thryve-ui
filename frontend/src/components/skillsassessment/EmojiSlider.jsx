"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const EmojiSlider = ({ questionId, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const emojiScale = [
    { emoji: "😠", label: "Strongly Disagree", color: "bg-[#ff3e3e]" },
    { emoji: "🙁", label: "Disagree", color: "bg-[#ff6b6b]" },
    { emoji: "😐", label: "Neutral", color: "bg-[#ffcc00]" },
    { emoji: "🙂", label: "Agree", color: "bg-[#66b3ff]" },
    {
      emoji: "😄",
      label: "Strongly Agree",
      color: "bg-[var(--primary-color)]",
    },
  ];

  useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (sliderValue === null) {
      const timer = setInterval(() => {
        setIsAnimating((prev) => !prev);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sliderValue]);

  const handleChange = (newValue) => {
    setSliderValue(newValue);
    onChange(questionId, newValue);
  };

  return (
    <div className="w-full space-y-3">
      {/* Emoji + Label */}
      <div className="flex flex-col items-center">
        {sliderValue === null ? (
          <div className="relative h-12 w-full">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2"
              animate={{
                y: [0, -10, 0],
                x: ["-50%", "-50%", "-50%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="text-3xl"
              >
                👉
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            key={`emoji-${sliderValue}`}
            initial={{ scale: 0.8, opacity: 0.5, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              bounce: 0.5,
            }}
            className="mb-1 text-4xl"
          >
            {emojiScale[sliderValue - 1].emoji}
          </motion.div>
        )}

        <motion.div
          className="text-sm font-medium text-[var(--primary-color)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {sliderValue === null
            ? "Tap to share how you feel"
            : emojiScale[sliderValue - 1].label}
        </motion.div>
      </div>

      {/* Slider Buttons */}
      <div className="relative px-2">
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-gray-200"></div>
        {sliderValue !== null && (
          <div
            className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full"
            style={{
              width: `${(sliderValue / emojiScale.length) * 100}%`,
              background:
                "linear-gradient(to right,#AACCFF,#668CFF, var(--primary-color))",
            }}
          ></div>
        )}

        <div className="relative flex justify-between">
          {emojiScale.map((_, index) => {
            const pointValue = index + 1;
            return (
              <button
                key={pointValue}
                onClick={() => handleChange(pointValue)}
                className="relative z-10 flex flex-col items-center"
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all duration-200",
                    sliderValue === pointValue
                      ? "scale-110 border-[var(--primary-color)] bg-white shadow-md"
                      : "border-gray-300 bg-white hover:border-[var(--primary-color)]",
                  )}
                >
                  {sliderValue === pointValue && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`h-full w-full rounded-full ${emojiScale[index].color}`}
                    />
                  )}
                </div>
                {/* Add labels under first and last radio buttons */}
                {index === 0 && (
                  <span className="absolute top-7 ml-3 text-xs whitespace-nowrap text-gray-500">
                    Strongly Disagree
                  </span>
                )}
                {index === emojiScale.length - 1 && (
                  <span className="absolute top-7 text-xs whitespace-nowrap text-gray-500">
                    Strongly Agree
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmojiSlider;
