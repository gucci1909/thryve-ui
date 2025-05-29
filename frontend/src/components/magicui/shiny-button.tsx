"use client";

import { cn } from "../../lib/utils";
import { motion, MotionProps, type AnimationProps } from "framer-motion";
import React from "react";

const animationProps = {
  initial: { "--x": "100%", scale: 0.95 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.92 },
  whileHover: { scale: 1.03 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1.5,
    type: "spring",
    stiffness: 50,
    damping: 15,
    mass: 1,
    scale: {
      type: "spring",
      stiffness: 300,
      damping: 10,
      mass: 0.3,
    },
  },
} as AnimationProps;

interface ShinyButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode;
  className?: string;
  withSparkles?: boolean;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, withSparkles = false, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "group relative cursor-pointer rounded-full px-6 py-3 font-medium",
          "bg-gradient-to-r from-[var(--primary-color)] to-blue-600",
          "text-white shadow-lg transition-all duration-300",
          "hover:shadow-xl hover:shadow-blue-500/20",
          className
        )}
        {...animationProps}
        {...props}
      >
        <span
          className="relative flex items-center justify-center gap-2"
          style={{
            maskImage:
              "linear-gradient(-75deg, var(--primary-color) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), var(--primary-color) calc(var(--x) + 100%))",
          }}
        >
          <span className="font-medium flex justify-center gap-2">{children}</span>
        </span>
        <span
          style={{
            mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
            WebkitMask:
              "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
            backgroundImage:
              "linear-gradient(-75deg, rgba(0, 41, 255, 0.3) calc(var(--x) + 20%), rgba(0, 41, 255, 0.7) calc(var(--x) + 25%), rgba(0, 41, 255, 0.3) calc(var(--x) + 100%))",
          }}
          className="absolute inset-0 z-10 block rounded-[inherit] p-px"
        />
      </motion.button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";