// components/Loader.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="relative flex items-center justify-center">
        {/* Vibrating "L" */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1, 1],
            x: [0, 5, -5, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-7xl font-bold text-purple-600"
          >
            L
          </motion.span>
        </motion.div>

        {/* Pulsing circle background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute h-24 w-24 rounded-full bg-purple-300"
        />

        {/* Floating dots */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#8b5cf6",
              x: Math.cos((i * Math.PI) / 2) * 40,
              y: Math.sin((i * Math.PI) / 2) * 40,
            }}
          />
        ))}

        {/* Subtle glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 rounded-full bg-purple-400 blur-xl"
        />
      </div>

      {/* Loading text with wave animation */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 60 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-20 flex space-x-1 text-purple-600"
      >
        {"Loading".split("").map((letter, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default Loader;