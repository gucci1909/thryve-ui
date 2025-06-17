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
import { LeadershipButton } from "../../components/magicui/shiny-button";
import React, { memo, useEffect, useState } from "react";
import ChatFeedback from "./ChatFeedback";
import { useSelector, useDispatch } from "react-redux";
import { setChatMode } from "../../store/userSlice";
// import { addMessage } from "../../store/userSlice";

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
    setShowFeedback,
    inputValue,
    handleSend,
    setInputValues,
    canvasRef,
    handleRolePlaySend,
    isRolePlay,
    showFeedback,
    sessionId,
    setMessages,
    userId,
    token,
    onContinueChat,
  }) {
    const [expandedMessages, setExpandedMessages] = useState({});
    const dispatch = useDispatch();
    const { firstName, chatMode } = useSelector((state) => state.user);

    useEffect(() => {
      if (messagesEndRef?.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isLoading, messagesEndRef]);

    // Add effect to show welcome message when chat mode changes
    useEffect(() => {
      if (chatMode === "coaching" && messages.length === 0) {
        const newMessage = {
          id: messages?.length + 1,
          sender: "bot",
          text: `Hi ${firstName}! 👋 I'm your AI coach. I'm here to help you develop your leadership skills and guide you through your professional journey. What would you like to work on today?`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    }, [chatMode, messages.length, firstName]);

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
            {messages.length === 0 && !isLoading && chatMode === "none" ? (
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
                    <img
                      src="/chat-1.png"
                      alt="Thryve Logo"
                      className="h-40 w-auto"
                    />
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
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} mb-3 px-2`}
                  >
                    <div
                      className={`group relative max-w-[85%] rounded-2xl px-2 py-2 ${
                        m.sender === "user"
                          ? "rounded-tr-none bg-[var(--primary-color)] text-white"
                          : "rounded-tl-none bg-gray-100 text-gray-800"
                      }`}
                      style={{
                        boxShadow:
                          m.sender === "user"
                            ? "0 1px 2px rgba(0,0,0,0.1)"
                            : "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Message bubble with tail */}
                      <div className="relative">
                        <div
                          className={`${!expandedMessages[m.id] && shouldShowReadMore(m.text) ? "line-clamp-4" : ""}`}
                        >
                          {formatMessage(m.text)}
                        </div>

                        {/* Message metadata */}
                        <div className="mt-1 flex items-center justify-end space-x-2">
                          {shouldShowReadMore(m.text) && (
                            <motion.button
                              onClick={() => toggleMessageExpand(m.id)}
                              className={`text-xs font-medium transition-colors ${
                                m.sender === "user"
                                  ? "text-white/80 hover:text-white"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {expandedMessages[m.id]
                                ? "Show less"
                                : "Read more"}
                              <ChevronDown
                                size={14}
                                className={`ml-1 inline transition-transform duration-200 ${
                                  expandedMessages[m.id] ? "rotate-180" : ""
                                }`}
                              />
                            </motion.button>
                          )}

                          <span
                            className={`text-xs ${m.sender === "user" ? "text-white/70" : "text-gray-500"}`}
                          >
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
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

        <div className="sticky w-full bg-white">
          {chatMode === "none" && (
            <motion.div
              className="flex justify-center px-2 py-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LeadershipButton
                onClick={() => {
                  setMessages([]);
                  setShowFeedback(false);
                  dispatch(setChatMode("roleplay"));
                  goBackToScenarios();
                }}
                isCompact={messages.length > 0}
                mode="roleplay"
              >
                Role-play Scenario
              </LeadershipButton>
            </motion.div>
          )}

          {chatMode === "none" && (
            <motion.div
              className="flex justify-center px-2 py-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LeadershipButton
                onClick={() => {
                  setMessages([]);
                  setShowFeedback(false);
                  dispatch(setChatMode("coaching"));
                }}
                isCompact={messages.length > 0}
                mode="coaching"
              >
                Start Coaching
              </LeadershipButton>
            </motion.div>
          )}

          {chatMode === "coaching" && (
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
                    !inputValue.trim() ||
                    isRecording ||
                    isProcessing ||
                    isLoading
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
          )}

          {chatMode === "roleplay" && (
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
                    !inputValue.trim() ||
                    isRecording ||
                    isProcessing ||
                    isLoading
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
          )}
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
