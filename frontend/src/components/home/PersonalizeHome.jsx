import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMessageSquare } from "react-icons/fi";
import { BorderBeam } from "../magicui/border-beam";
import { GiTargetDummy } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";

function PersonalizeHomePage() {
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
                  Based on your recent activities and goals, we've curated these
                  personalized recommendations to accelerate your leadership
                  journey.
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
  );
}

export default PersonalizeHomePage;
