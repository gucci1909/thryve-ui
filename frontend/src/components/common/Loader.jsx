// components/Loader.jsx
"use client";
import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0029ff]">
      <div className="relative flex flex-col items-center justify-center space-y-8">
        {/* Logo with pulse animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">thryve</h1>
          <div className="absolute inset-0 -z-10 rounded-full bg-white opacity-20 blur-xl" />
        </motion.div>

        {/* Animated dots loader */}
        <div className="flex items-center justify-center space-x-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-white"
              initial={{ y: 0, opacity: 0.5 }}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading text with subtle animation */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-medium text-white/80"
        >
          Loading your experience...
        </motion.div> */}

        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Loader;