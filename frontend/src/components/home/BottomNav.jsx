"use client";
import { motion } from "framer-motion";
import { Home, Calendar, PieChart, User, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

const BottomNav = ({
  chatPath = "/chat-box",
  homePath = "/home",
  checkinPath = "/check-in",
  dashboardPath = "/dashboard",
  profilePath = "/profile",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: homePath, icon: <Home size={22} /> },
    { name: "Check-in", path: checkinPath, icon: <Calendar size={22} /> },
    { name: "", path: "", icon: null },
    { name: "Dashboard", path: dashboardPath, icon: <PieChart size={22} /> },
    { name: "Profile", path: profilePath, icon: <User size={22} /> },
  ];

  return (
    <div className="right-0 bottom-0 left-0">
      {/* Coach Button (centered) */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 transform"
        onClick={() => navigate(chatPath)} // Navigate on click
      >
        <button className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_30%)] text-white shadow-[var(--primary-color)]/30 shadow-xl backdrop-blur-md">
          <MessageCircle size={26} strokeWidth={2} />
        </button>
        <motion.span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-xs font-bold text-[var(--primary-color)]"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Coach
        </motion.span>
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative mx-auto max-w-md"
      >
        <div className="flex h-16 items-center justify-between bg-white px-4 shadow-lg">
          {navItems.map((item, index) =>
            item.path ? (
              <Link
                key={index}
                to={item.path}
                className="group relative flex h-full flex-1 flex-col items-center justify-center"
              >
                <motion.div
                  className="flex flex-col items-center"
                  animate={{
                    color:
                      location.pathname === item.path
                        ? "var(--primary-color)"
                        : "#64748b", // slate-500
                  }}
                >
                  {item.icon}
                  <span className="mt-1 text-[10px] font-medium">
                    {item.name}
                  </span>
                </motion.div>

                {location.pathname === item.path && (
                  <>
                    {/* Blue indicator line above the icon */}
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute top-0 h-1 w-full bg-[var(--primary-color)]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                    {/* Blue circle under the icon (optional, already exists) */}
                    {/* <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-1 h-1 w-1/2 rounded-full bg-[var(--primary-color)]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    /> */}
                  </>
                )}
              </Link>
            ) : (
              <div key={index} className="w-16 flex-shrink-0" />
            ),
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BottomNav;
