"use client";
import { motion } from "framer-motion";
import BottomNav from "../components/home/BottomNav";
import {
  FiMessageSquare,
  FiArrowRight,
  FiPlay
} from "react-icons/fi";
import { GiTargetDummy } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";

export default function HomePage() {
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
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#e6f2f8] to-[#cce6f5]">
      <header className="w-full border-b border-[#006792]/20 bg-white/80 pt-4 pb-4 shadow-sm backdrop-blur-sm">
        <div className="mb-3 flex justify-center">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.h1
              className="text-primary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            >
              Thryve
            </motion.h1>
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#006792] to-[#00a6fb]"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </motion.div>
        </div>

        <div className="mx-auto my-4 h-px w-full bg-[#006792]/20" />

        <div className="mt-2 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <motion.p
              className="font-medium text-[#004d70]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Good Morning,{" "}
              <span className="font-semibold text-[#006792]">Sunil</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            whileHover={{ y: -2 }}
            className="relative"
          >
            <motion.div
              className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-[#006792] to-[#004d70] py-1.5 pr-3.5 pl-2.5 text-sm font-bold text-white shadow-lg"
              whileTap={{ scale: 0.95 }}
              initial={{ boxShadow: "0 4px 14px rgba(0, 103, 146, 0.3)" }}
              animate={{
                boxShadow: [
                  "0 4px 14px rgba(0, 103, 146, 0.3)",
                  "0 6px 18px rgba(0, 103, 146, 0.4)",
                  "0 4px 14px rgba(0, 103, 146, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <FaTrophy className="text-yellow-300 drop-shadow-[0_1px_2px_rgba(255,215,0,0.4)]" />
              </motion.div>
              <span className="text-shadow-sm">274</span>

              {/* Shimmer effect - simplified */}
              <motion.div
                className="absolute top-0 left-0 h-full w-8 bg-white/30"
                initial={{ x: -30 }}
                animate={{ x: "220%" }}
                transition={{
                  delay: 1,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
                style={{
                  transform: "skewX(-20deg)",
                }}
              />
            </motion.div>

            {/* Particle effects - more stable */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-0 h-1 w-1 rounded-full bg-yellow-300"
                initial={{ opacity: 0 }}
                animate={{
                  y: [0, -10, -20, 0],
                  x: [0, i % 2 === 0 ? 5 : -5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Glow effect - more subtle */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-[#006792]/20 blur-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 0.2 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </header>

      <main
        // onScroll={handleScroll}
        className="mt-5 flex-1 overflow-y-auto px-4 pb-20"
      >
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-start">
              {/* <div className="mr-3 rounded-lg bg-[#006792]/10 p-2">
                <FiVideo className="text-[#006792]" />
              </div> */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#004d70]">
                  Leadership Video Guide
                </h2>

                {/* Video Thumbnail with Play Button */}
                <div className="group relative mt-3 aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#006792] to-[#00a6fb]">
                  {/* Thumbnail Image */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60" />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#004d70]/80 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <motion.div
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all group-hover:bg-white group-hover:shadow-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiPlay className="ml-1 text-2xl text-[#006792]" />
                    </motion.div>
                  </div>

                  {/* Video Duration */}
                  <div className="absolute right-3 bottom-3 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                    8:24
                  </div>
                </div>

                <p className="mt-3 text-[#006792]/90">
                  Watch this insightful video on effective leadership strategies
                  and team management. Learn key techniques from industry
                  experts.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4 text-xl">
                    <button className="text-[#006792]/70 transition-colors hover:text-[#006792]">
                      <FiMessageSquare />
                    </button>
                    <button className="text-[#006792]/70 transition-colors hover:text-[#006792]">
                      <GiTargetDummy />
                    </button>
                    <button className="text-[#006792]/70 transition-colors hover:text-[#006792]">
                      <AiOutlineQuestionCircle />
                    </button>
                    <button className="text-[#006792]/70 transition-colors hover:text-[#006792]">
                      <BsBookmark />
                    </button>
                  </div>
                  <button className="flex items-center text-sm font-medium text-[#006792] transition-colors hover:text-[#004d70]">
                    Watch Now <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="mt-6 space-y-6">
          {[
            {
              title: "Alignment with your Management",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet faucibus sapien, ac rutrum quam.",
            },
            {
              title: "Managing High Performers",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet faucibus sapien, ac rutrum quam.",
            },
            {
              title: "Growing your team",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet faucibus sapien, ac rutrum quam.",
            },
            {
              title: "Alignment with your Management",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet faucibus sapien, ac rutrum quam.",
            },
            {
              title: "Managing High Performers",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet faucibus sapien, ac rutrum quam.",
            },
            {
              title: "Growing your team",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet faucibus sapien, ac rutrum quam.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <div className="rounded-2xl bg-white p-5 shadow-md">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#004d70]">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-[#006792]/90">{item.content}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-4 text-xl">
                        <button className="text-[#006792]/70 hover:text-[#006792]">
                          <FiMessageSquare />
                        </button>
                        <button className="text-[#006792]/70 hover:text-[#006792]">
                          <GiTargetDummy />
                        </button>
                        <button className="text-[#006792]/70 hover:text-[#006792]">
                          <AiOutlineQuestionCircle />
                        </button>
                        <button className="text-[#006792]/70 hover:text-[#006792]">
                          <BsBookmark />
                        </button>
                      </div>
                      <button className="flex items-center text-sm font-medium text-[#006792] hover:text-[#004d70]">
                        Explore <FiArrowRight className="ml-1" />
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
