"use client";
import { motion } from "framer-motion";
import BottomNav from "../components/home/BottomNav";
import { FiMessageSquare, FiArrowRight, FiPlay } from "react-icons/fi";
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
      {/* Header */}
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
        {/* Featured Card */}
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
          <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
            <div className="flex items-start">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--primary-color)]">
                  Leadership Video Guide
                </h2>

                {/* Video Thumbnail */}
                <div className="group relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_30%)]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-color)]/80 to-transparent" />

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <motion.div
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all group-hover:bg-white group-hover:shadow-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiPlay className="ml-1 text-2xl text-[var(--primary-color)]" />
                    </motion.div>
                  </div>

                  <div className="absolute right-3 bottom-3 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                    8:24
                  </div>
                </div>

                <p className="mt-4 text-[color-mix(in_srgb,var(--primary-color),black_30%)]">
                  Watch this insightful video on effective leadership strategies
                  and team management. Learn key techniques from industry
                  experts.
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex space-x-4 text-xl">
                    <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] transition-colors hover:text-[var(--primary-color)]">
                      <FiMessageSquare />
                    </button>
                    <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] transition-colors hover:text-[var(--primary-color)]">
                      <GiTargetDummy />
                    </button>
                    <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] transition-colors hover:text-[var(--primary-color)]">
                      <AiOutlineQuestionCircle />
                    </button>
                    <button className="text-[color-mix(in_srgb,var(--primary-color),white_40%)] transition-colors hover:text-[var(--primary-color)]">
                      <BsBookmark />
                    </button>
                  </div>
                  <button className="flex items-center text-sm font-bold text-[var(--primary-color)] transition-colors hover:text-[color-mix(in_srgb,var(--primary-color),black_20%)]">
                    Watch Now <FiArrowRight className="ml-1.5" />
                  </button>
                </div>
              </div>
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

      <BottomNav />
    </div>
  );
}
