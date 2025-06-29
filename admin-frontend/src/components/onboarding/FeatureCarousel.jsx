"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function FeatureCarousel({ features }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="container mx-auto px-6">
      <div className="relative mb-8 h-[210px] overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 to-white shadow-lg">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0, x: index > currentIndex ? "100%" : "-100%" }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              x:
                index === currentIndex
                  ? "0%"
                  : index > currentIndex
                    ? "100%"
                    : "-100%",
            }}
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <motion.div
              className="flex max-w-md items-center gap-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 shadow-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="mb-3 text-xl font-bold text-[var(--primary-color)]">
                  {feature.title}
                </h3>
                <p className="text-blue-800/90">{feature.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}

        <div className="absolute right-0 bottom-6 left-0 z-20 flex justify-center gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-6 bg-[var(--primary-color)]" : "w-2 bg-blue-300"}`}
              aria-label={`Go to feature ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          to="/login"
          className="w-full text-xl rounded-full border-2 border-[var(--primary-color)] px-8 py-3 text-center font-medium text-[var(--primary-color)] transition-all hover:scale-[1.02] hover:bg-blue-50 sm:w-auto"
        >
          Sign In as Admin
        </Link>
      </div>
    </div>
  );
}
