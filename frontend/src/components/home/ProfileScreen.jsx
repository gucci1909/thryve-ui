// src/components/ProfileScreen.jsx
"use client";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="h-16 w-16 rounded-full bg-purple-200"
        ></motion.div>
        <div>
          <h2 className="text-xl font-bold text-purple-800">Sophie Martinez</h2>
          <p className="text-purple-600">@sophie_skin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-purple-50/50 p-4">
        {[
          { label: "Reviews", value: "42" },
          { label: "Following", value: "156" },
          { label: "Followers", value: "892" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <p className="text-lg font-bold text-purple-700">{stat.value}</p>
            <p className="text-xs text-purple-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        {[
          "My Reviews",
          "Saved Products",
          "Following",
          "Followers",
          "Settings",
          "Help Center",
        ].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between rounded-lg p-3 hover:bg-purple-50"
          >
            <span className="text-purple-700">{item}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-400"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z"
              />
            </svg>
          </motion.div>
        ))}
      </div>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}