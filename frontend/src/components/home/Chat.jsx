"use client";
import { motion } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  ChevronDown,
  MessageSquare,
  Lightbulb,
  Target,
} from "lucide-react";
import { ShinyButton } from "../../components/magicui/shiny-button";
import React, { memo, useEffect, useState } from "react";
import ChatFeedback from "./ChatFeedback";

const Chat = memo(
  function Chat({
    startRecording,
    stopRecording,
    messages,
    isLoading,
    messagesEndRef,
    isRecording,
    goBackToScenarios,
    animationProps,
    isProcessing,
    inputValue,
    handleSend,
    setInputValues,
    canvasRef,
    handleRolePlaySend,
    isRolePlay,
    showFeedback,
    sessionId,
    userId,
    token,
    onContinueChat,
  }) {
    const [expandedMessages, setExpandedMessages] = useState({});

    useEffect(() => {
      if (messagesEndRef?.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isLoading, messagesEndRef]);

    const formatMessage = (text) => {
      // Replace \n\n with <br><br> and \n with <br>
      const paragraphs = text.split("\n\n");
      return (
        <div className="whitespace-pre-wrap">
          {paragraphs.map((paragraph, i) => (
            <div key={i} className="mb-2 last:mb-0">
              {paragraph.split("\n").map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < paragraph.split("\n").length - 1 && (
                    <>
                      {" "}
                      {/* Add a space */}
                      <br /> <br /> {/* Add a br tag */}
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      );
    };

    const toggleMessageExpand = (messageId) => {
      setExpandedMessages((prev) => ({
        ...prev,
        [messageId]: !prev[messageId],
      }));
    };

    const shouldShowReadMore = (text) => {
      return text.length > 300;
    };

    return (
      <motion.div
        key="chat-view"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="flex h-[calc(100vh-60px)] flex-1 flex-col"
      >
        {/* Messages container - takes available space */}
        <motion.div
          className="min-h-0 flex-1 overflow-y-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <div className="space-y-4">
            {messages.length === 0 && !isLoading ? (
              <motion.div
                className="flex h-full flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 flex items-center gap-2"
                >
                  <img
                    src="/logo-thryve.png"
                    alt="Thryve Logo"
                    className="h-12 w-auto bg-[var(--primary-color)]"
                  />
                  <h1 className="text-3xl font-bold text-[var(--primary-color)]">
                    thryve
                  </h1>
                </motion.div>

                <motion.div
                  className="relative mb-5 flex flex-col items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {/* Custom illustration background - lightened version of #0029ff */}
                  <svg
                    width="240"
                    height="180"
                    viewBox="0 0 240 180"
                    className="absolute -z-10"
                  >
                    <motion.path
                      d="M120,20 C160,20 190,50 190,90 C190,130 160,160 120,160 C80,160 50,130 50,90 C50,50 80,20 120,20 Z"
                      fill="#0029ff"
                      fillOpacity="0.1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  </svg>

                  {/* Manager character illustration */}
                  <div className="relative">
                    <svg width="180" height="180" viewBox="0 0 200 200">
                      {/* Head */}
                      <motion.circle
                        cx="100"
                        cy="80"
                        r="40"
                        fill="#FEF3C7"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                      />

                      {/* Body */}
                      <motion.rect
                        x="70"
                        y="120"
                        width="60"
                        height="70"
                        rx="5"
                        fill="#3B82F6"
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.4 }}
                      />

                      {/* Tie */}
                      <motion.path
                        d="M100,125 L90,140 L110,140 Z"
                        fill="#1D4ED8"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.5 }}
                      />

                      {/* Arms */}
                      <motion.line
                        x1="60"
                        y1="130"
                        x2="30"
                        y2="160"
                        stroke="#3B82F6"
                        strokeWidth="12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.6 }}
                      />
                      <motion.line
                        x1="140"
                        y1="130"
                        x2="170"
                        y2="160"
                        stroke="#3B82F6"
                        strokeWidth="12"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.6 }}
                      />

                      {/* Clipboard */}
                      <motion.rect
                        x="25"
                        y="150"
                        width="40"
                        height="30"
                        rx="2"
                        fill="#FFFFFF"
                        initial={{ rotate: -5, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.7 }}
                      />
                      <motion.line
                        x1="35"
                        y1="155"
                        x2="55"
                        y2="155"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      />
                      <motion.line
                        x1="35"
                        y1="160"
                        x2="55"
                        y2="160"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.85 }}
                      />
                    </svg>
                  </div>
                </motion.div>

                {/* Feature bubbles with staggered animation */}
                <motion.div
                  className="grid w-full max-w-md grid-cols-3 gap-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  <motion.div
                    className="flex flex-col items-center rounded-lg bg-gray-50/50 p-3 backdrop-blur-sm"
                    variants={{
                      hidden: { y: 10, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    whileHover={{
                      y: -3,
                      backgroundColor: "rgba(236, 253, 245, 0.7)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MessageSquare className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-xs text-gray-600">Ask questions</p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-center rounded-lg bg-gray-50/50 p-3 backdrop-blur-sm"
                    variants={{
                      hidden: { y: 10, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    whileHover={{
                      y: -3,
                      backgroundColor: "rgba(254, 249, 231, 0.7)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-full bg-amber-100 p-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="mt-2 text-xs text-gray-600">Get insights</p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-center rounded-lg bg-gray-50/50 p-3 backdrop-blur-sm"
                    variants={{
                      hidden: { y: 10, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    whileHover={{
                      y: -3,
                      backgroundColor: "rgba(239, 246, 255, 0.7)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="rounded-full bg-blue-100 p-2">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      Practice skills
                    </p>
                  </motion.div>
                </motion.div>

                {/* Subtle animated prompt */}
                <motion.div
                  className="mt-8 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </motion.div>
                  <span className="ml-1 text-xs text-gray-400">
                    Type below to begin
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`group relative max-w-[85%] rounded-2xl px-4 py-2 ${
                        m.sender === "user"
                          ? "bg-[var(--primary-color)] text-white"
                          : "bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      <div
                        className={`${!expandedMessages[m.id] && shouldShowReadMore(m.text) ? "line-clamp-4" : ""}`}
                      >
                        {formatMessage(m.text)}
                      </div>

                      {shouldShowReadMore(m.text) && (
                        <motion.button
                          onClick={() => toggleMessageExpand(m.id)}
                          className={`mt-1 flex w-full items-center justify-center gap-1 text-xs font-medium transition-colors ${
                            m.sender === "user"
                              ? "text-white/80 hover:text-white"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {expandedMessages[m.id] ? "Show less" : "Read more"}
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              expandedMessages[m.id] ? "rotate-180" : ""
                            }`}
                          />
                        </motion.button>
                      )}

                      <div
                        className={`mt-1 text-xs ${m.sender === "user" ? "text-white/70" : "text-gray-500"}`}
                      >
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {showFeedback && (
                  <ChatFeedback
                    isVisible={true}
                    chatType={isRolePlay ? "roleplay" : "coaching"}
                    sessionId={sessionId}
                    userId={userId}
                    token={token}
                    onContinue={onContinueChat}
                  />
                )}

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="max-w-[85%] rounded-2xl bg-white px-4 py-2 text-gray-800 shadow-sm">
                      <div className="typing-indicator flex gap-1">
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                        >
                          .
                        </motion.span>
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.2,
                          }}
                        >
                          .
                        </motion.span>
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.4,
                          }}
                        >
                          .
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            <div ref={messagesEndRef} className="h-[1px]" />
          </div>
        </motion.div>

        {/* Rest of your component remains the same */}
        {/* Bottom section - contains roleplay button and input area */}
        <div className="sticky w-full bg-white">
          {/* Roleplay button - only shown when not recording */}
          {!isRecording && (
            <motion.div
              className="flex justify-center p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ShinyButton
                onClick={goBackToScenarios}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary-color)] to-blue-600 px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  ...animationProps.animate,
                  boxShadow: [
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    "0 10px 15px -3px rgb(0 0 0 / 0.2)",
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  ],
                }}
                transition={{
                  ...animationProps.transition,
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                  scale: { type: "spring", stiffness: 400, damping: 10 },
                }}
              >
                <Sparkles
                  className="transition-transform group-hover:rotate-12"
                  size={20}
                />
                <span className="font-medium">Role-play Scenario</span>
              </ShinyButton>
            </motion.div>
          )}

          {/* Input area - sticks to bottom */}
          <motion.div
            className="border-t border-gray-200 bg-white p-3"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)",
            }}
          >
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2">
              <textarea
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValues(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (isRolePlay) {
                      await handleRolePlaySend();
                    } else {
                      await handleSend();
                    }
                  }
                }}
                placeholder="Type your message..."
                disabled={isRecording || isProcessing}
                style={{ height: "80px" }}
                className="flex-1 resize-none overflow-y-auto border-none bg-transparent text-gray-800 outline-none"
              />

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`rounded-full p-2 ${
                  isRecording
                    ? "bg-red-500 text-white"
                    : "text-[var(--primary-color)] hover:bg-gray-200"
                } transition-colors`}
              >
                {isProcessing ? (
                  <span className="processing">…</span>
                ) : isRecording ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>

              <button
                onClick={() => {
                  if (isRolePlay) {
                    handleRolePlaySend();
                  } else {
                    handleSend();
                  }
                }}
                disabled={
                  !inputValue.trim() || isRecording || isProcessing || isLoading
                }
                className="rounded-full bg-[var(--primary-color)] p-2 text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width="300"
              height="40"
              className={`voice-visualizer ${isRecording ? "active" : ""} mt-2`}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.messages === nextProps.messages &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.isRecording === nextProps.isRecording &&
      prevProps.isProcessing === nextProps.isProcessing &&
      prevProps.inputValue === nextProps.inputValue &&
      prevProps.messagesEndRef === nextProps.messagesEndRef &&
      prevProps.showFeedback === nextProps.showFeedback
    );
  },
);

export default Chat;
