"use client";
import { motion } from "framer-motion";
import { Home, Calendar, PieChart, User, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={22} /> },
    { name: "Check-in", path: "/checkin", icon: <Calendar size={22} /> },
    { name: "", path: "", icon: null },
    { name: "Dashboard", path: "/dashboard", icon: <PieChart size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
  ];

  return (
    <div className="right-0 bottom-0 left-0">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 transform"
      >
        <button className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#006792] to-[#00C6FB] text-white shadow-xl shadow-blue-400/50 backdrop-blur-md">
          <MessageCircle size={26} strokeWidth={2} />
        </button>
        <motion.span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-xs font-semibold text-[#006792]"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Coach
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative mx-auto max-w-md"
      >
        <div className="flex h-16 items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-4 shadow-2xl ring-1 shadow-blue-900/10 ring-slate-200 backdrop-blur-md">
          {navItems.map((item, index) =>
            item.path ? (
              <Link
                key={index}
                to={item.path}
                className="group relative flex h-full flex-1 flex-col items-center justify-center"
              >
                <motion.div
                  animate={{
                    color:
                      location.pathname === item.path ? "#006792" : "#64748B",
                  }}
                  className="flex flex-col items-center"
                >
                  {item.icon}
                  <span className="mt-1 text-[10px] font-medium">
                    {item.name}
                  </span>
                </motion.div>

                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-1 h-1 w-1/2 rounded-full bg-[#006792]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ) : (
              <div key={index} className="w-16 flex-shrink-0" /> // Spacer
            ),
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BottomNav;
