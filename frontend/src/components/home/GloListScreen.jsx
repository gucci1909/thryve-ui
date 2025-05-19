// src/components/GloListScreen.jsx
"use client";
import { motion } from "framer-motion";

export default function GloListScreen() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-purple-800">Your GloList</h2>
      
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Cleansers", "Moisturizers", "Sunscreens", "Treatments"].map(
          (category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
            >
              {category}
            </motion.button>
          )
        )}
      </div>

      {/* Favorite Products */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="h-16 w-16 rounded-lg bg-purple-200/50"></div>
            <div className="flex-1">
              <h3 className="font-medium text-purple-800">Product Name</h3>
              <p className="text-sm text-purple-600">Brand Name</p>
              <div className="mt-1 flex items-center">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${j < 4 ? "text-purple-500" : "text-purple-200"}`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                ))}
                <span className="ml-1 text-xs text-purple-400">(42)</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}