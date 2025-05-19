// components/SplashScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setVisible(true);
    localStorage.setItem("hasSeenSplash", "true");

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated Logo with elegant shadow */}
        <motion.div
          className="relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <h1 className="text-6xl font-bold text-[#006792] drop-shadow-lg">
            THRYVE
          </h1>
          <div className="absolute inset-0 -z-10 rounded-full bg-[#006792] opacity-10 blur-xl"></div>
        </motion.div>

        {/* Tagline with staggered words */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
          {["AI", "Coach", "for", "Managers"].map((word, index) => (
            <motion.span
              key={index}
              className="text-xl font-medium text-[#006792]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Animated progress indicators */}
        <div className="mt-8 flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1 w-6 rounded-full bg-[#006792] opacity-30"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{
                delay: i * 0.1 + 0.6,
                duration: 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
