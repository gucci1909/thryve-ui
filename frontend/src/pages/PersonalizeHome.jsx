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
import AddTeamMembers from "../components/home/AddTeamMembers";
import SendMailToExistingTeamMembers from "../components/home/SendMailToExistingTeamMembers";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

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
      {location.pathname === "/personalize-add-team-members" && (
        <AddTeamMembers />
      )}
      {location.pathname ===
        "/personalize-send-mail-to-existing-team-members" && (
        <SendMailToExistingTeamMembers />
      )}
      {location.pathname === "/personalize-chat-box" && (
        <ChatBox pointAdded={pointAdded} setPointAdded={setPointAdded} />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#0029ff",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #0029ff",
              background: "#f0f4ff",
            },
          },
          error: {
            duration: 0, // Disable error toasts
          },
          loading: {
            duration: 0, // Disable loading toasts
          },
        }}
      />

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
