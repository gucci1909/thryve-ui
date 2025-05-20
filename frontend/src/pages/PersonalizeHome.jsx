"use client";
import { motion } from "framer-motion";
import { FiArrowRight, FiMessageSquare } from "react-icons/fi";
import { BorderBeam } from "../components/magicui/border-beam";
import BottomNav from "../components/home/BottomNav";
import { GiTargetDummy } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";

export default function PersonalizeHome() {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#f0f4ff] to-[#e6ecff]">
      {/* Header (unchanged) */}
      <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] py-3 shadow-md">
        {/* Top center-aligned logo + title */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-8 drop-shadow-md"
            />
            <h1 className="text-2xl font-semibold tracking-wide text-white drop-shadow-sm">
              thryve
            </h1>
          </div>
        </div>

        {/* Separator line */}
        <div className="my-2 h-[1px] w-full bg-white/30" />

        {/* Bottom row: greeting and trophy */}
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
          {/* Left: Menu + greeting */}
          <div className="flex items-center gap-2 text-white">
            {/* <Menu className="h-5 w-5" /> */}
            <span className="text-sm font-medium">Good Morning, Sunil</span>
          </div>

          {/* Right: Trophy + score */}
          <div className="relative flex items-center gap-1 text-white">
            <motion.div
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),black_20%)] px-3 py-1.5 text-sm font-bold text-white shadow-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: "0 4px 12px rgba(0, 41, 255, 0.25)",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.2,
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 6px 16px rgba(0, 41, 255, 0.35)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Trophy icon with subtle shine */}
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <FaTrophy className="text-yellow-300" />
                {/* <motion.div
                      className="absolute top-0 left-0 h-full w-3 bg-white/40"
                      initial={{ x: -10 }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                      style={{
                        transform: "skewX(-20deg)",
                      }}
                    /> */}
              </motion.div>

              {/* Score with subtle pulse */}
              <motion.span
                animate={{
                  scale: [1, 1.05, 1],
                }}
                // transition={{
                //   duration: 3,
                //   repeat: Infinity,
                //   repeatType: "reverse",
                //   ease: "easeInOut",
                // }}
              >
                274
              </motion.span>

              {/* Subtle floating particles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-yellow-300/80"
                  initial={{
                    opacity: 0,
                    y: 0,
                    x: 0,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: [0, -8, -15],
                    x: i % 2 === 0 ? [0, 3, 0] : [0, -3, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Soft glow */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-[var(--primary-color)]/20 blur-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1.1,
                opacity: 0.3,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>

      <main className="mt-4 flex-1 overflow-y-auto px-5 pb-24">
        {/* Growth Recommendations Card */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-6 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
            {/* Border Beam Effect */}
            <BorderBeam
              size={150}
              duration={10}
              colorFrom="var(--primary-color)"
              colorTo="color-mix(in_srgb,var(--primary-color),white_50%)"
              className="z-0"
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <motion.h2
                    className="text-xl font-bold text-[var(--primary-color)]"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your Growth Recommendations
                  </motion.h2>

                  <motion.p
                    className="mt-3 text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Based on your recent activities and goals, we've curated
                    these personalized recommendations to accelerate your
                    leadership journey.
                  </motion.p>

                  <motion.div
                    className="mt-6 flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-xl">
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <FiMessageSquare />
                        </button>
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <GiTargetDummy />
                        </button>
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <AiOutlineQuestionCircle />
                        </button>
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <BsBookmark />
                        </button>
                      </div>
                      {/* <button className="flex items-center text-sm font-bold text-[var(--primary-color)] hover:text-[color-mix(in_srgb,var(--primary-color),black_20%)]">
                        Explore <FiArrowRight className="ml-1.5" />
                      </button> */}
                    </div>
                    <motion.button
                      className="flex items-center gap-1 rounded-full bg-[var(--primary-color)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Explore
                      <FiArrowRight className="ml-1" />
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-[var(--primary-color)]/20"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: 0,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${30 + Math.random() * 50}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Learning Modules */}
        <div className="mt-7 space-y-5">
          {[
            "Alignment with your Management",
            "Managing High Performers",
            "Growing your team",
            "Conflict Resolution",
            "Strategic Decision Making",
            "Team Motivation",
          ].map((title, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <div className="rounded-xl border border-white/20 bg-white/90 p-5 shadow-[0_5px_20px_-5px_rgba(0,41,255,0.1)] backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[var(--primary-color)]">
                      {title}
                    </h2>
                    <p className="mt-1.5 text-[color-mix(in_srgb,var(--primary-color),black_30%)]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Morbi sit amet faucibus sapien.
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-4 text-xl">
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <FiMessageSquare />
                        </button>
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <GiTargetDummy />
                        </button>
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <AiOutlineQuestionCircle />
                        </button>
                        <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] hover:text-[var(--primary-color)]">
                          <BsBookmark />
                        </button>
                      </div>
                      <button className="flex items-center text-sm font-bold text-[var(--primary-color)] hover:text-[color-mix(in_srgb,var(--primary-color),black_20%)]">
                        Explore <FiArrowRight className="ml-1.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav
        homePath="/personalize-home"
        checkinPath="/personalize-check-in"
        dashboardPath="/personalize-dashboard"
        profilePath="/personalize-profile"
      />
    </div>
  );
}
