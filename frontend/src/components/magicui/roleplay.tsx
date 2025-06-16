"use client";
import { motion, useAnimation } from "framer-motion";
import { Sparkles } from "lucide-react";
import React, { useEffect } from "react";

interface RolePlayButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const RolePlayButton = ({ onClick }: RolePlayButtonProps) => {
  const controls = useAnimation();
  
  // Continuous micro-animations
  useEffect(() => {
    controls.start({
      backgroundPosition: ["0% 50%", "100% 50%"],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, [controls]);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
    //   animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      whileTap="tap"
      className="relative overflow-hidden rounded-lg px-4 py-2.5"
      style={{
        background: `
          linear-gradient(
            90deg,
            rgba(0, 41, 255, 0.9) 0%,
            rgba(65, 105, 225, 0.95) 50%,
            rgba(0, 41, 255, 0.9) 100%
          )`,
        backgroundSize: "200% 100%"
      }}
      animate={controls}
    >
      {/* Ultra-thin shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{
          x: "100%",
          transition: {
            duration: 1.8,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* Content - perfectly aligned with no wasted space */}
      <div className="relative flex items-center justify-center gap-2">
        <motion.div
          animate={{
            rotate: [0, 10, -5, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <Sparkles className="h-4 w-4 text-white" />
        </motion.div>
        <span className="text-sm font-medium text-white">Role-play</span>
      </div>

      {/* Button states */}
      <motion.div
        variants={{
          hover: { 
            opacity: 1,
            scale: 1.02,
            boxShadow: "0 3px 12px rgba(0, 41, 255, 0.3)"
          },
          tap: { 
            scale: 0.98,
            boxShadow: "0 1px 4px rgba(0, 41, 255, 0.2)"
          }
        }}
        className="absolute inset-0 rounded-lg border border-white/20"
      />
    </motion.button>
  );
};