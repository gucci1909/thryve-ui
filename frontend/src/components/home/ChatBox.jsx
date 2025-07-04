"use client";
import React from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import scenariosData from "./chatbox.json";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { logout, setChatMode } from "../../store/userSlice";
import Chat from "./Chat";
import FloatingNav from "./FloatingNav";
import { CoachingBubbles } from "../magicui/meteors";
import ChatHistory from "./PersonalizeHome/ChatHistory";

export default function ChatBox({ setPointAdded }) {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user._id);
  const firstName = useSelector((state) => state.user.firstName);
  const chatMode = useSelector((state) => state.user.chatMode) || "none";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeView, setActiveView] = useState("chat");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRolePlay, setIsRolePlay] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackConfig, setFeedbackConfig] = useState({});
  const [rolePlayCounter, setRolePlayCounter] = useState(0);
  const [coachingCounter, setCoachingCounter] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [chatHistoryMessages, setChatHistoryMessages] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const messagesEndRef = useRef(null);
  const topMessageRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    if (chatMode === "roleplay") {
      setActiveView("scenarios");
      setRolePlayCounter(0);
      setCoachingCounter(0);
      setShowFeedback(false);
      setIsRolePlay(false);
      setSelectedScenario(null);
      setMessages([]);
    } else if (chatMode === "coaching") {
      const newMessage = {
        id: messages?.length + 1,
        sender: "bot",
        text: `Hi ${firstName}! 👋 I'm your AI coach. I'm here to help you develop your leadership skills and guide you through your professional journey. What would you like to work on today?`,
        timestamp: new Date().toISOString(),
      };
      setCoachingCounter(0);
      setRolePlayCounter(0);
      setMessages([newMessage]);
      setShowFeedback(false);
      setActiveView("chat");
    } else if (chatMode === "chat-history") {
      loadChatHistory();
      setCoachingCounter(0);
      setRolePlayCounter(0);
      setMessages([]);
      setShowFeedback(false);
      setActiveView("chat-history");
    }
  }, [chatMode]);

  useEffect(() => {
    if (isRolePlay) {
      handleRolePlaySend(selectedScenario.question);
    }
  }, [isRolePlay, selectedScenario]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeView]);

  useEffect(() => {
    if (
      chatHistoryMessages?.chat_context?.length > 0 &&
      activeView === "single-chat-history"
    ) {
      topMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistoryMessages, activeView]);

  const getFeedbackConfig = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feedback/config`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const statusCode = response.status;
      if (statusCode === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();

      if (data["feedback-back-and-fourth"]) {
        setFeedbackConfig(data["feedback-back-and-fourth"]);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      await getFeedbackConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (chatMode === "coaching") {
      if (messages?.length >= 10) {
        if (coachingCounter === feedbackConfig?.firstFeedback) {
          setShowFeedback(true);
          setCoachingCounter(0);
        } else if (coachingCounter === feedbackConfig?.others) {
          setShowFeedback(true);
          setCoachingCounter(0);
        }
      }
    } else if (chatMode === "roleplay") {
      if (messages?.length >= 10) {
        if (rolePlayCounter === feedbackConfig?.firstFeedback) {
          setShowFeedback(true);
          setRolePlayCounter(0);
        } else if (rolePlayCounter === feedbackConfig?.others) {
          setShowFeedback(true);
          setRolePlayCounter(0);
        }
      }
    }
  }, [rolePlayCounter, coachingCounter, feedbackConfig]);

  async function loadChatHistory() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat-box/past-chats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const statusCode = response.status;
      if (statusCode === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      setChatHistory(data.chats);
    } catch (error) {
      console.error("Chat error:", err);
      setError("Failed to load chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectChatHistory = async (id) => {
    setActiveView("single-chat-history");
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat-box/past-chats/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const statusCode = response.status;
      if (statusCode === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      setChatHistoryMessages(data);
    } catch (error) {
      console.error("Chat error:", err);
      setError("Failed to load chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToChatHistory = () => {
    setActiveView("chat-history");
  };

  const startScenarioChat = (scenario) => {
    setActiveView("chat");
    setSelectedScenario(scenario);
    setIsRolePlay(true);
    setIsLoading(true);
  };

  const startCustomChat = () => {
    setActiveView("chat");
    setIsRolePlay(false);
    setSelectedScenario(null);
    dispatch(setChatMode("coaching"));
  };

  const handleSend = async () => {
    scrollToBottom();

    if (showFeedback) {
      setShowFeedback(false);
    }

    const trimmed = inputValue.trim();

    let sessionStart = false;

    if (messages.length === 1) {
      sessionStart = true;
    }

    setIsLoading(true);
    const newMessage = {
      id: messages.length + 1,
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat-box/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: trimmed,
            userId: userId,
            sessionStart: sessionStart,
          }),
        },
      );

      const statusCode = response.status;
      if (statusCode === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to get response from chat API");
      }

      const data = await response.json();

      if (data.success && data.conversation) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: data.conversation.serverMessage.chat_text,
            sender: "bot",
            timestamp: new Date(data.conversation.serverMessage.timestamp),
          },
        ]);

        setCoachingCounter((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setPointAdded(true);
    }
  };

  const handleRolePlaySend = async (question) => {
    scrollToBottom();

    if (showFeedback) {
      setShowFeedback(false);
    }

    const trimmed = question?.trim() || inputValue?.trim();

    let sessionStart = false;

    if (messages.length === 0) {
      sessionStart = true;
    }

    setIsLoading(true);
    const newMessage = {
      id: messages.length + 1,
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat-box/send-role-play-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: trimmed,
            userId: userId,
            sessionStart: sessionStart,
          }),
        },
      );

      // Access status code
      const statusCode = response.status;
      if (statusCode === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to get response from chat API");
      }

      const data = await response.json();

      if (data.success && data.conversation) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: data.conversation.serverMessage.chat_text,
            sender: "bot",
            timestamp: new Date(data.conversation.serverMessage.timestamp),
          },
        ]);

        setRolePlayCounter((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setPointAdded(true);
    }
  };

  /* ====================================================== */
  /* ================  Audio-recording logic  ============== */
  /* ====================================================== */

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      /* -- AudioContext + Analyser for visualiser -- */
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      startVisualisation(); // draw bars while recording

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        await processAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const startVisualisation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const bufferLen = analyserRef.current.frequencyBinCount;
    const dataArr = new Uint8Array(bufferLen);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArr);

      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barW = (canvas.width / bufferLen) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLen; i++) {
        const barH = dataArr[i] / 2;
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, "#007bff");
        grad.addColorStop(1, "#00ff88");
        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barH, barW, barH);
        x += barW + 1;
      }
    };
    draw();
  };

  const processAudio = async (blob) => {
    try {
      const form = new FormData();
      form.append("file", blob, "voice.webm");
      form.append("model_id", "scribe_v1"); // Whisper model

      const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": `sk_cceab93ca33c2ed420b6a70873173ad0b51df20eeb89d4d7`,
        },
        body: form,
      });

      // Access status code
      const statusCode = res.status;
      if (statusCode === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || res.statusText);
      }

      const data = await res.json();
      if (data.text)
        setInputValue((prev) => prev + (prev ? " " : "") + data.text);
    } catch (err) {
      console.error("STT error:", err);
      setInputValue("Error processing audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      )
        mediaRecorderRef.current.stop();
    };
  }, []);

  const handleContinueChat = () => {
    setShowFeedback(false);
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[#f0f4ff] to-[#e6ecff]">
      <div className="flex items-center justify-between border-b border-white/20 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-[var(--primary-color)]" size={20} />
          <motion.h2
            className="font-medium text-[var(--primary-color)]"
            key={activeView}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === "scenarios"
              ? "Choose Scenario"
              : activeView === "chat-history" ||
                  activeView === "single-chat-history"
                ? "All Chat History"
                : "Coach Chat"}
          </motion.h2>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "scenarios" ? (
          <motion.div
            key="scenarios-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto h-[calc(100vh-100px)] max-w-4xl flex-col px-4 py-8"
          >
            {/* Animated background elements */}
            <CoachingBubbles
              number={20}
              delayBetween={1}
              minDuration={10}
              maxDuration={25}
            />

            {/* Header section */}
            <motion.div
              className="mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold md:text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-[var(--primary-color)] to-purple-600 bg-clip-text text-transparent">
                  Leadership Scenarios
                </span>
              </motion.h2>
              <motion.p
                className="text-base text-gray-600 md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Practice real-world scenarios, {firstName}
              </motion.p>
              <motion.div
                className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-purple-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              />
            </motion.div>

            {/* Scenarios grid */}
            <motion.div
              className="grid max-h-[calc(100vh-300px)] grid-cols-1 gap-4 overflow-y-auto py-2 pr-2 md:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {scenariosData.scenarios.map((sc) => (
                <motion.div
                  key={sc.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 6px 12px -2px rgba(0, 41, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex h-20 min-w-[280px] cursor-pointer items-center rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                  onClick={() => startScenarioChat(sc)}
                >
                  <motion.div
                    className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-color)] to-blue-500 text-white"
                    whileHover={{ rotate: 8 }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>

                  <div className="overflow-hidden">
                    <h3 className="truncate text-base font-medium text-gray-800 group-hover:text-[var(--primary-color)] md:text-lg">
                      {sc.title}
                    </h3>
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

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  background:
                    "linear-gradient(to right, var(--primary-color), #8b5cf6)",
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[var(--primary-color)] to-purple-600 px-6 py-3 font-medium text-white shadow-lg md:px-8 md:py-4"
                onClick={startCustomChat}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FiPlus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                  Create Custom Scenario
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-[var(--primary-color)] opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        ) : activeView === "chat-history" ? (
          <motion.div
            key="scenarios-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto h-[calc(100vh-100px)] max-w-4xl flex-col px-4 py-8"
          >
            {/* Animated background elements */}
            <CoachingBubbles
              number={20}
              delayBetween={1}
              minDuration={10}
              maxDuration={25}
            />

            {/* Header section */}
            <motion.div
              className="mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h2
                className="mb-2 text-3xl font-bold md:text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-gradient-to-r from-[var(--primary-color)] to-purple-600 bg-clip-text text-transparent">
                  Your Chat History
                </span>
              </motion.h2>
              <motion.p
                className="text-base text-gray-600 md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Review past conversations, {firstName}
              </motion.p>
              <motion.div
                className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-purple-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              />
            </motion.div>
            <ChatHistory
              loading={loading}
              error={error}
              chatHistory={chatHistory}
              handleSelectChatHistory={handleSelectChatHistory}
            />
          </motion.div>
        ) : activeView === "single-chat-history" ? (
          <motion.div
            key="chat-view"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex h-[calc(100vh-60px)] flex-1 flex-col"
          >
            {/* Chat header with back button and metadata */}
            <motion.div
              className="flex items-center justify-between border-b border-gray-200 bg-white p-4"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              <button
                onClick={handleBackToChatHistory}
                className="flex items-center text-[var(--primary-color)] hover:text-[var(--primary-color-dark)]"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-1">Back</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-[var(--primary-color)/10] px-3 py-1 text-sm font-medium text-[var(--primary-color)]">
                  {chatHistoryMessages?.chatType?.replace("-", " ")}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(chatHistoryMessages.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </div>
              </div>
            </motion.div>

            {/* Messages container */}
            <motion.div
              className="min-h-0 overflow-y-auto p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div ref={topMessageRef} />
              <div className="space-y-4">
                {chatHistoryMessages?.chat_context?.map((message, index) => (
                  <motion.div
                    key={`${message.timestamp}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className={`flex ${message.from === "user" ? "justify-end" : "justify-start"} mb-3 px-2`}
                  >
                    <div
                      className={`group relative max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.from === "user"
                          ? "rounded-tr-none bg-[var(--primary-color)] text-white"
                          : "rounded-tl-none bg-gray-100 text-gray-800"
                      }`}
                      style={{
                        boxShadow:
                          message.from === "user"
                            ? "0 1px 2px rgba(0,0,0,0.1)"
                            : "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="relative">
                        <div
                          className={`${!expandedMessages[index] && shouldShowReadMore(message.chat_text) ? "line-clamp-4" : ""}`}
                        >
                          {formatMessage(message.chat_text)}
                        </div>

                        {/* Message metadata */}
                        <div className="mt-1 flex items-center justify-end space-x-2">
                          <div className="flex items-center space-x-2">
                            {shouldShowReadMore(message.chat_text) && (
                              <motion.button
                                onClick={() => toggleMessageExpand(index)}
                                className={`text-xs font-medium transition-colors ${
                                  message.from === "user"
                                    ? "text-white/80 hover:text-white"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {expandedMessages[index]
                                  ? "Show less"
                                  : "Read more"}
                                <ChevronDown
                                  size={14}
                                  className={`ml-1 inline transition-transform duration-200 ${
                                    expandedMessages[index] ? "rotate-180" : ""
                                  }`}
                                />
                              </motion.button>
                            )}

                            <span
                              className={`text-xs ${
                                message.from === "user"
                                  ? "text-white/70"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <Chat
            startRecording={startRecording}
            stopRecording={stopRecording}
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            isRecording={isRecording}
            isProcessing={isProcessing}
            inputValue={inputValue}
            setInputValues={setInputValue}
            handleSend={handleSend}
            handleRolePlaySend={handleRolePlaySend}
            isRolePlay={isRolePlay}
            canvasRef={canvasRef}
            showFeedback={showFeedback}
            userId={userId}
            token={token}
            onContinueChat={handleContinueChat}
          />
        )}
      </AnimatePresence>

      <FloatingNav />
    </main>
  );
}
