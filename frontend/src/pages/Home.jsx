"use client";
import BottomNav from "../components/home/BottomNav";
import Home from "../components/home/Home";
import ChatBox from "../components/home/ChatBox";
import Header from "../components/home/Header";
import { useLocation } from "react-router";

export default function HomePage() {
  const location = useLocation();
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#f0f4ff] to-[#e6ecff]">
      <Header />

      {location.pathname === "/home" && <Home />}
      {location.pathname === "/check-in" && <Home />}
      {location.pathname === "/dashboard" && <Home />}
      {location.pathname === "/profile" && <Home />}

      {location.pathname === "/chat-box" && <ChatBox />}

      <BottomNav />
    </div>
  );
}
