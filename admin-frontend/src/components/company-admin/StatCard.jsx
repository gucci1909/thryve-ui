import { motion } from "framer-motion";
import { Users, Star, Flame, BarChart2 } from "lucide-react";

function StatCard({ totalUsers, dashboardData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {/* Total Users Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative cursor-pointer overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm"
      >
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200 opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-blue-500" size={18} />
              <p className="text-sm font-medium text-blue-600">Total Users</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalUsers || 0}
            </p>
            <p className="mt-1 text-xs text-blue-500">
              <span
                className={`inline-block h-2 w-2 rounded-full ${totalUsers > 0 ? "bg-green-500" : "bg-gray-400"}`}
              ></span>
              <span className="ml-1">Active managers</span>
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
            }}
            className="rounded-lg bg-blue-100 p-2 text-blue-600"
          >
            <Users size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* Highest Streak Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative cursor-pointer overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm"
      >
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-200 opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="text-amber-500" size={18} />
              <p className="text-sm font-medium text-amber-600">
                Highest Streak
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData?.highestStreakUser?.streak || 0}
              <span className="ml-1 text-sm font-normal text-gray-500">
                {dashboardData?.highestStreakUser?.streak > 1 ? "days" : "day"}
              </span>
            </p>
            <p className="mt-1 max-w-[160px] truncate text-xs text-amber-500">
              <span className="font-medium">
                {dashboardData?.highestStreakUser?.name || "N/A"}
              </span>
              <span className="mx-1">•</span>
              <span>
                {dashboardData?.highestStreakUser?.totalPoints || 0} pts
              </span>
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-lg bg-amber-100 p-2 text-amber-600"
          >
            <Flame size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* NPS Score Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative cursor-pointer overflow-hidden rounded-xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-5 shadow-sm"
      >
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-200 opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="text-green-500" size={18} />
              <p className="text-sm font-medium text-green-600">Company NPS</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData?.scores_from_company_nps || 0}%
            </p>
            <div className="mt-1 flex items-center text-green-500">
              by team members from respective managers.
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-lg bg-green-100 p-2 text-green-600"
          >
            <Star size={20} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StatCard;
