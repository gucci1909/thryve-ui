"use client";
import { motion, useAnimation } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Target,
  BarChart2,
  Mic,
  MessageSquare,
  Brain,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Heart,
  Shield,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const leadershipMessages = {
  roleplay: [
    { text: "Practice Real Scenarios", icon: Target },
    { text: "Master Difficult Conversations", icon: Mic },
    { text: "Develop Executive Presence", icon: Trophy },
    { text: "Strategic Decision Making", icon: Brain },
    { text: "Lead With Confidence", icon: Shield },
    { text: "Boost Team Performance", icon: BarChart2 },
  ],
  coaching: [
    { text: "Personal Growth Journey", icon: Heart },
    { text: "Unlock Your Potential", icon: Zap },
    { text: "Learn & Develop", icon: BookOpen },
    { text: "Expert Guidance", icon: GraduationCap },
    { text: "Get Actionable Insights", icon: Lightbulb },
    { text: "Continuous Improvement", icon: MessageSquare },
  ],
};

export const LeadershipButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    isCompact?: boolean;
    mode?: "roleplay" | "coaching";
  }
>(({ children, className, onClick, isCompact = false, mode = "roleplay" }, ref) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  // Animate leadership messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % leadershipMessages[mode].length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  // Background animation
  useEffect(() => {
    controls.start({
      backgroundPosition: ["0% 50%", "100% 50%"],
      transition: { duration: 8, ease: "linear", repeat: Infinity },
    });
  }, [controls]);

  const getGradientColors = () => {
    if (mode === "roleplay") {
      return "linear-gradient(90deg, rgba(0, 41, 255, 0.9) 0%, rgba(100, 140, 255, 0.9) 50%, rgba(0, 41, 255, 0.9) 100%)";
    }
    return "linear-gradient(90deg, rgba(147, 51, 234, 0.9) 0%, rgba(236, 72, 153, 0.9) 50%, rgba(147, 51, 234, 0.9) 100%)";
  };

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl", isCompact ? "h-10" : "h-auto")}>
      {/* Animated leadership messages in background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4"
        animate={{
          x: [0, -50, 50, 0],
          transition: {
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {leadershipMessages[mode].map((msg, i) => (
          <motion.div
            key={i}
            className="absolute flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: i === currentMessage ? (isHovered ? 0.2 : 0.15) : 0.05,
              scale: i === currentMessage ? 1.1 : 0.9,
              y: i === currentMessage ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
          >
            <msg.icon className="h-6 w-6 text-white/20" />
            <span className="text-xl font-bold whitespace-nowrap text-white/20">
              {msg.text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main button */}
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: isHovered
            ? [
                `0 0 20px ${mode === "roleplay" ? "rgba(0, 41, 255, 0.6)" : "rgba(147, 51, 234, 0.6)"}`,
                `0 0 40px ${mode === "roleplay" ? "rgba(0, 41, 255, 0.8)" : "rgba(147, 51, 234, 0.8)"}`,
                `0 0 20px ${mode === "roleplay" ? "rgba(0, 41, 255, 0.6)" : "rgba(147, 51, 234, 0.6)"}`,
              ]
            : [
                `0 0 10px ${mode === "roleplay" ? "rgba(0, 41, 255, 0.5)" : "rgba(147, 51, 234, 0.5)"}`,
                `0 0 20px ${mode === "roleplay" ? "rgba(0, 41, 255, 0.8)" : "rgba(147, 51, 234, 0.8)"}`,
                `0 0 10px ${mode === "roleplay" ? "rgba(0, 41, 255, 0.5)" : "rgba(147, 51, 234, 0.5)"}`,
              ],
        }}
        transition={{
          y: { type: "spring", stiffness: 300 },
          boxShadow: { duration: 3, repeat: Infinity },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative w-full overflow-hidden rounded-xl",
          "text-lg font-bold text-white",
          "border-2 border-white/30 backdrop-blur-sm",
          "transform-gpu transition-all duration-300",
          isCompact ? "h-10 px-4 py-2" : "px-8 py-6",
          className,
        )}
        style={{
          background: getGradientColors(),
          backgroundSize: "200% 100%",
        }}
      >
        {/* Floating leadership icons - only show in non-compact mode */}
        {!isCompact && leadershipMessages[mode].map(({ icon: Icon }, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              rotate: [0, Math.random() * 360],
              opacity: [0.05, 0.1, 0.05],
              transition: {
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            <Icon size={28} />
          </motion.div>
        ))}

        {/* Pulsing center circle */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            boxShadow: "inset 0 0 50px rgba(255, 255, 255, 0.3)",
          }}
          animate={{
            boxShadow: [
              "inset 0 0 50px rgba(255, 255, 255, 0.3)",
              "inset 0 0 70px rgba(255, 255, 255, 0.5)",
              "inset 0 0 50px rgba(255, 255, 255, 0.3)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Main content */}
        <div className={cn(
          "relative z-10 flex items-center",
          isCompact ? "justify-center" : "flex-col gap-3"
        )}>
          <div className={cn(
            "relative z-10 flex items-center gap-3",
            isCompact ? "flex-row" : "flex-row"
          )}>
            <motion.div
              animate={{
                rotate: [0, 15, -10, 0],
                scale: [1, 1.1, 1],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
            >
              <Sparkles className={cn(
                mode === "roleplay" ? "text-yellow-300" : "text-pink-300",
                isCompact ? "h-5 w-5" : "h-8 w-8"
              )} />
            </motion.div>
            <span className={cn(
              "text-center font-bold tracking-wide drop-shadow-lg",
              isCompact ? "text-base" : "text-2xl"
            )}>
              {children}
            </span>
          </div>

          {/* Current message indicator - only show in non-compact mode */}
          {!isCompact && (
            <motion.div
              className="flex items-center gap-2 text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {React.createElement(leadershipMessages[mode][currentMessage].icon, {
                className: "h-4 w-4",
              })}
              <span>{leadershipMessages[mode][currentMessage].text}</span>
            </motion.div>
          )}

          {!isCompact && (
            <motion.div
              className="mt-2 h-1 w-24 bg-white/50"
              animate={{
                scaleX: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                },
              }}
            />
          )}
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          animate={{
            borderColor: [
              "rgba(255, 255, 255, 0)",
              "rgba(255, 255, 255, 0.3)",
              "rgba(255, 255, 255, 0)",
            ],
            transition: {
              duration: 3,
              repeat: Infinity,
            },
          }}
        />
      </motion.button>
    </div>
  );
});

LeadershipButton.displayName = "LeadershipButton";
