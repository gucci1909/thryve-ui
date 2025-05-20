import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

function Header() {
  return (
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
  );
}

export default Header;
