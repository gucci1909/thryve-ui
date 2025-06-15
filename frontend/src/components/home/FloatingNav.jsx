import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiHome, FiMessageCircle, FiCalendar, FiBarChart2, FiUser, FiX } from "react-icons/fi";
import { useState } from "react";

const FloatingNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: FiHome, path: "/personalize-home", label: "Home" },
    { icon: FiMessageCircle, path: "/personalize-chat-box", label: "Chat" },
    { icon: FiCalendar, path: "/personalize-check-in", label: "Check-in" },
    { icon: FiBarChart2, path: "/personalize-dashboard", label: "Dashboard" },
    { icon: FiUser, path: "/personalize-profile", label: "Profile" },
  ];

  const handleNavigation = (path) => {
    setIsExpanded(false);
    navigate(path);
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 mb-2 rounded-2xl bg-white p-2 shadow-lg"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavigation(item.path)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <item.icon className="h-5 w-5 text-[var(--primary-color)]" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-color)] text-white shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <FiX className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <FiMessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default FloatingNav; 