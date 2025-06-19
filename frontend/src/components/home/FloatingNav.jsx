import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiX } from "react-icons/fi";
import { Home, Calendar, PieChart, User, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChatMode } from "../../store/userSlice";

const FloatingNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatMode = useSelector((state) => state.user.chatMode) || "none";

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, path: "/personalize-home", label: "Home" },
    ];

    if (chatMode === "none") {
      return [
        ...baseItems,
        {
          icon: MessageCircle,
          action: () => {
            dispatch(setChatMode("roleplay"));
          },
          label: "Start Roleplay",
        },
        {
          icon: MessageCircle,
          action: () => {
            dispatch(setChatMode("coaching"));
          },
          label: "Start Coaching",
        },
      ];
    } else if (chatMode === "roleplay") {
      return [
        ...baseItems,
        {
          icon: MessageCircle,
          action: () => {
            dispatch(setChatMode("coaching"));
          },
          label: "Start Coaching",
        },
      ];
    } else if (chatMode === "coaching") {
      return [
        ...baseItems,
        {
          icon: MessageCircle,
          action: () => {
            dispatch(setChatMode("roleplay"));
          },
          label: "Start Roleplay",
        },
      ];
    }

    return baseItems;
  };

  const handleNavigation = (item) => {
    setIsExpanded(false);
    if (item.action) {
      item.action();
    } else {
      dispatch(setChatMode("none"));
      navigate(item.path);
    }
  };

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute top-12 right-0 mt-4 min-w-[120px] rounded-2xl bg-white p-2 shadow-lg"
          >
            {getNavItems().map((item) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleNavigation(item)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 whitespace-nowrap text-gray-700 hover:bg-gray-50"
              >
                <item.icon className="h-5 w-5 shrink-0 text-[var(--primary-color)]" />
                <span className="overflow-hidden text-sm font-medium text-ellipsis">
                  {item.label}
                </span>
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
