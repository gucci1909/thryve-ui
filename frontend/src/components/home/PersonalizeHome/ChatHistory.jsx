"use client";
import { motion } from "framer-motion";
import { MessageSquareText, Sparkles } from "lucide-react";

function ChatHistory({ loading, error, chatHistory, handleSelectChatHistory }) {
  const truncateText = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="m-auto flex flex-col items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[#0029ff] border-r-[#0029ff]"></div>
          <div className="absolute inset-4 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#0029ff] opacity-20"></div>
        </div>
        <p className="text-lg font-medium text-gray-700">
          Loading your content
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (chatHistory.length === 0) {
    return (
      <motion.div
        className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-[var(--primary-color)/5] to-blue-50/20 p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
          }}
        >
          <MessageSquareText
            className="h-10 w-10 text-[var(--primary-color)]"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.h3
          className="text-xl font-semibold text-gray-800"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No chat history yet
        </motion.h3>

        <motion.p
          className="max-w-md text-gray-500"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your{" "}
          <span className="font-medium text-[var(--primary-color)]">
            chat sessions
          </span>{" "}
          will appear here
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid max-h-[calc(100vh)] grid-cols-1 gap-4 overflow-y-auto py-2 pr-2 md:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {chatHistory.map((chat) => (
        <motion.div
          key={chat.session_id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{
            y: -4,
            boxShadow: "0 6px 12px -2px rgba(0, 41, 255, 0.2)",
          }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex h-20 min-w-[280px] cursor-pointer items-center rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            onClick={() => handleSelectChatHistory(chat.session_id)}
        >
          <motion.div
            className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-blue-500 text-white"
            whileHover={{ rotate: 8 }}
          >
            {chat.chatType === "role-play" ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <MessageSquareText className="h-5 w-5" />
            )}
          </motion.div>

          <div className="overflow-hidden">
            <h3 className="truncate text-base font-medium text-gray-800 group-hover:text-[var(--primary-color)]">
              {truncateText(chat.first_question)}
            </h3>
            <p className="truncate text-sm text-gray-500">
              {formatDate(chat.created_at)} • {chat.chatType.replace("-", " ")}
            </p>
          </div>

          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--primary-color)/5] to-blue-50/50 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="absolute inset-0 overflow-hidden rounded-xl"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ChatHistory;
