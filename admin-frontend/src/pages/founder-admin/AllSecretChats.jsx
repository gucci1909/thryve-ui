import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  UserCircle,
  Loader2,
  ArrowLeft,
  MessageCircle,
  Bot,
  Search,
  AlertCircle,
  BadgeCheck,
  Clock,
  MessageSquare,
  BookOpen,
  Users,
  RefreshCw,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const primaryColor = "#0029ff";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const chatTypeBadge = (type) => {
  let color = "bg-gray-200 text-gray-700";
  let icon = <MessageCircle className="h-4 w-4 mr-1" />;
  if (type === "coaching") {
    color = "bg-blue-100 text-blue-700";
    icon = <MessageCircle className="h-4 w-4 mr-1" />;
  } else if (type === "role-play") {
    color = "bg-purple-100 text-purple-700";
    icon = <Users className="h-4 w-4 mr-1" />;
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${color}`}>{icon}{type}</span>
  );
};

const AllSecretChats = () => {
  // UI states
  const [step, setStep] = useState("email"); // email | chats | chat
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);
  const [search, setSearch] = useState("");

  // Token
  const token = localStorage.getItem("token");

  // Step 1: Find user by email
  const handleFindUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    setChatHistory(null);
    try {
      const res = await fetch(`${API_BASE_URL}/managers/login/find-by-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (res.status === 401) {
        showErrorToast("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.user) {
        setError("User not found. Please check the email.");
        showErrorToast(data.error || "User not found");
        setLoading(false);
        return;
      }
      setUser(data.user);
      setStep("chats");
      showSuccessToast("User found!");
    } catch (err) {
      setError("Failed to fetch user. Try again.");
      showErrorToast("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Fetch all chats for user
  const handleFetchChats = async () => {
    setLoading(true);
    setError(null);
    setChats([]);
    setSelectedChat(null);
    setChatHistory(null);
    try {
      const res = await fetch(`${API_BASE_URL}/managers/login/find-all-chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user._id }),
      });
      if (res.status === 401) {
        showErrorToast("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.chats) {
        setError("No chats found for this user.");
        showErrorToast(data.error || "No chats found");
        setLoading(false);
        return;
      }
      setChats(data.chats);
    } catch (err) {
      setError("Failed to fetch chats. Try again.");
      showErrorToast("Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Fetch chat by session id
  const handleFetchChatById = async (session_id) => {
    setLoading(true);
    setError(null);
    setChatHistory(null);
    try {
      const res = await fetch(`${API_BASE_URL}/managers/login/find-chat-by-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user._id, session_id }),
      });
      if (res.status === 401) {
        showErrorToast("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.chat_context) {
        setError("No chat history found for this session.");
        showErrorToast(data.error || "No chat history found");
        setLoading(false);
        return;
      }
      setChatHistory(data);
    } catch (err) {
      setError("Failed to fetch chat history. Try again.");
      showErrorToast("Failed to fetch chat history");
    } finally {
      setLoading(false);
    }
  };

  // UI: Back navigation
  const handleBack = () => {
    if (step === "chat") {
      setChatHistory(null);
      setSelectedChat(null);
      setStep("chats");
    } else if (step === "chats") {
      setUser(null);
      setChats([]);
      setSelectedChat(null);
      setChatHistory(null);
      setEmail("");
      setStep("email");
    }
  };

  // UI: Search chats
  const filteredChats = chats.filter((c) =>
    c.first_question?.toLowerCase().includes(search.toLowerCase()) ||
    c.chatType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full mx-auto"
      >
        {/* Step 1: Email input */}
        <AnimatePresence>
          {step === "email" && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100"
            >
              <Mail className="h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Find User by Email</h2>
              <p className="mb-6 text-gray-500 text-center">Enter the email address of the user to view all their secret chats.</p>
              <form onSubmit={handleFindUser} className="w-full flex flex-col items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full max-w-md rounded-lg border border-gray-300 py-2 px-4 mb-4 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full max-w-md flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  <span>Find User</span>
                </button>
              </form>
              {error && (
                <div className="mt-4 flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: All chats for user */}
        <AnimatePresence>
          {step === "chats" && user && (
            <motion.div
              key="chats-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100"
            >
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  title="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <UserCircle className="h-10 w-10 text-blue-600 mr-3" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-gray-900">{user.firstName || user.email}</span>
                    {user.status === "active" && <BadgeCheck className="h-5 w-5 text-green-500" title="Active" />}
                  </div>
                  <span className="text-gray-500 text-sm">{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleFetchChats}
                disabled={loading}
                className="mb-6 flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                <span>View All Chats</span>
              </button>
              {loading && (
                <div className="flex justify-center my-8">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              )}
              {!loading && chats.length > 0 && (
                <>
                  <div className="mb-4 flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search chats by question or type..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full max-w-xs rounded-lg border border-gray-300 py-2 px-4 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredChats.map((chat) => (
                      <motion.div
                        key={chat.session_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow hover:shadow-lg transition"
                      >
                        <div className="flex items-center mb-2">
                          {chatTypeBadge(chat.chatType)}
                          <span className="ml-auto text-xs text-gray-400 flex items-center"><Clock className="h-4 w-4 mr-1" />{formatDate(chat.created_at)}</span>
                        </div>
                        <div className="font-semibold text-gray-900 mb-2 truncate">{chat.first_question}</div>
                        <button
                          onClick={() => {
                            setSelectedChat(chat);
                            setStep("chat");
                            handleFetchChatById(chat.session_id);
                          }}
                          className="mt-2 flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white font-medium shadow hover:from-blue-700 hover:to-blue-800"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>View Chat</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  {filteredChats.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">No chats found for your search.</div>
                  )}
                </>
              )}
              {!loading && chats.length === 0 && (
                <div className="text-center text-gray-500 mt-8">No chats found for this user.</div>
              )}
              {error && (
                <div className="mt-4 flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Chat history */}
        <AnimatePresence>
          {step === "chat" && selectedChat && (
            <motion.div
              key="chat-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100"
            >
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  title="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                {chatTypeBadge(selectedChat.chatType)}
                <span className="ml-3 text-gray-700 font-semibold">Session ID:</span>
                <span className="ml-1 text-xs text-gray-400">{selectedChat.session_id}</span>
              </div>
              {loading && (
                <div className="flex justify-center my-8">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              )}
              {!loading && chatHistory && (
                <div className="max-h-[50vh] overflow-y-auto pr-2">
                  {chatHistory.chat_context.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.from === "user" ? 40 : -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`flex mb-4 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow text-sm ${msg.from === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"}`}>
                        <div className="flex items-center mb-1">
                          {msg.from === "user" ? (
                            <UserCircle className="h-4 w-4 mr-1 text-white opacity-80" />
                          ) : (
                            <Bot className="h-4 w-4 mr-1 text-blue-600 opacity-80" />
                          )}
                          <span className="font-semibold text-xs opacity-70">{msg.from === "user" ? "User" : "AI Coach"}</span>
                          <span className="ml-auto text-[10px] text-gray-400">{formatDate(msg.timestamp)}</span>
                        </div>
                        <div className="whitespace-pre-line">{msg.chat_text}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {!loading && chatHistory && chatHistory.chat_context.length === 0 && (
                <div className="text-center text-gray-500 mt-8">No messages in this chat.</div>
              )}
              {error && (
                <div className="mt-4 flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AllSecretChats;