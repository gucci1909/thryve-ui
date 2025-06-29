import { motion } from "framer-motion";

export const StatCard = ({ title, value, icon, highlight = false }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`rounded-lg p-4 ${highlight ? "bg-gradient-to-br from-yellow-50 to-yellow-100" : "bg-white"} border border-gray-200 shadow-sm`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p
          className={`text-2xl font-bold ${highlight ? "text-yellow-600" : "text-[var(--primary-color)]"}`}
        >
          {value}
        </p>
      </div>
      <div
        className={`rounded-full p-2 ${highlight ? "bg-yellow-100 text-yellow-600" : "bg-blue-50 text-[var(--primary-color)]"}`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);
