"use client";
import { useLocation } from "react-router";
import BottomNav from "../components/home/BottomNav";
import Header from "../components/home/Header";
import PersonalizeHomePage from "../components/home/PersonalizeHome";
import ChatBox from "../components/home/ChatBox";
import Profile from "../components/home/Profile";

export default function PersonalizeHome() {
  const location = useLocation();
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#f0f4ff] to-[#e6ecff]">
      <Header />

      {location.pathname === "/personalize-home" && <PersonalizeHomePage />}
      {location.pathname === "/personalize-check-in" && <PersonalizeHomePage />}
      {location.pathname === "/personalize-dashboard" && (
        <PersonalizeHomePage />
      )}
      {location.pathname === "/personalize-profile" && <Profile />}

      {location.pathname === "/personalize-chat-box" && <ChatBox />}

      <BottomNav
        chatPath="/personalize-chat-box"
        homePath="/personalize-home"
        checkinPath="/personalize-check-in"
        dashboardPath="/personalize-dashboard"
        profilePath="/personalize-profile"
      />
    </div>
  );
}
