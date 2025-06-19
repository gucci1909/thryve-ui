"use client";
import { useLocation } from "react-router";
import BottomNav from "../components/home/BottomNav";
import Header from "../components/home/Header";
import PersonalizeHomePage from "../components/home/PersonalizeHome";
import ChatBox from "../components/home/ChatBox";
import Profile from "../components/home/Profile";
import CheckIn from "../components/home/CheckIn";
import PersonalizeDashboard from "../components/home/PersonalizeDashboard";
import ChangePassword from "../components/home/ChangePassword";
import SavedPost from "../components/home/SavedPost";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PersonalizeHome() {
  const location = useLocation();
  const [pointAdded, setPointAdded] = useState(false);
  const isChatView = location.pathname === "/personalize-chat-box";

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#f0f4ff] to-[#e6ecff]">
      <AnimatePresence>
        {!isChatView && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Header pointAdded={pointAdded} setPointAdded={setPointAdded} />
          </motion.div>
        )}
      </AnimatePresence>

      {location.pathname === "/personalize-home" && (
        <PersonalizeHomePage
          pointAdded={pointAdded}
          setPointAdded={setPointAdded}
        />
      )}
      {location.pathname === "/personalize-check-in" && (
        <CheckIn pointAdded={pointAdded} setPointAdded={setPointAdded} />
      )}
      {location.pathname === "/personalize-dashboard" && (
        <PersonalizeDashboard />
      )}
      {location.pathname === "/personalize-profile" && <Profile />}
      {location.pathname === "/personalize-saved-post" && <SavedPost />}
      {location.pathname === "/personalize-change-password" && (
        <ChangePassword />
      )}
      {location.pathname === "/personalize-chat-box" && (
        <ChatBox
          pointAdded={pointAdded}
          setPointAdded={setPointAdded}
        />
      )}

      <AnimatePresence>
        {!isChatView && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <BottomNav
              chatPath="/personalize-chat-box"
              homePath="/personalize-home"
              checkinPath="/personalize-check-in"
              dashboardPath="/personalize-dashboard"
              profilePath="/personalize-profile"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
