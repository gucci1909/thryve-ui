"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "./../magicui/globe";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setVisible(true);
    localStorage.setItem("hasSeenSplash", "true");

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-10" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <motion.div
          className="relative flex items-center justify-center gap-3"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "backOut",
          }}
        >
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-14 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          <h1 className="bg-gradient-to-r from-white to-white/80 bg-clip-text pb-2 text-5xl font-bold tracking-tight text-transparent drop-shadow-lg">
            thryve
          </h1>
          <div className="absolute -inset-4 -z-10 rounded-full bg-white/10 blur-xl" />
        </motion.div>

        <div className="relative h-8 overflow-hidden">
          <motion.div
            className="flex flex-wrap justify-center gap-x-2 gap-y-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {["AI", "Coach", "for", "Managers"].map((word, index) => (
              <motion.span
                key={index}
                className="text-lg font-medium text-white/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15 + 0.4,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-white"
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                repeatDelay: 0.2,
                delay: i * 0.15,
                duration: 0.6,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
