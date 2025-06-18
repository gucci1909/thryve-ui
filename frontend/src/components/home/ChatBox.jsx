"use client";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import scenariosData from "./chatbox.json";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { logout, setChatMode } from "../../store/userSlice";
import { useCookies } from "react-cookie";
import Chat from "./Chat";
import FloatingNav from "./FloatingNav";
import { RainbowButton } from "../magicui/rainbow-button";
import LoadingSpinner from "./PersonalizeHome/LoadingSpinner";
import { CoachingBubbles } from "../magicui/meteors";

export default function ChatBox({ pointAdded, setPointAdded }) {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user._id);
  const firstName = useSelector((state) => state.user.firstName);
  const chatMode = useSelector((state) => state.user.chatMode) || 'none';
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeView, setActiveView] = useState("chat");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previousView, setPreviousView] = useState(null);
  const [isRolePlay, setIsRolePlay] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeView === "chat" && previousView !== "scenarios") {
      loadChatHistory();
    }
    setPreviousView(activeView);
  }, [activeView]);

  useEffect(() => {
    if (chatMode === "roleplay") {
      setActiveView("scenarios");
    } else if (chatMode === "coaching") {
      setActiveView("chat");
    }
  }, [chatMode]);

  useEffect(() => {
    if (isRolePlay) {
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     id: prev.length + 1,
      //     text: selectedScenario.question,
      //     sender: "user",
      //     timestamp: new Date(),
      //   },
      // ]);

      handleRolePlaySend(selectedScenario.question);
    }
  }, [isRolePlay]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeView]);

  const groupMessagesBySession = (messages) => {
    const sessions = {};
    messages.forEach((msg) => {
      if (!sessions[msg.sessionId]) {
        sessions[msg.sessionId] = [];
      }
      sessions[msg.sessionId].push(msg);
    });
    return Object.values(sessions);
  };

  const formatSessionTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const loadChatHistory = async () => {
    setIsLoadingMessage(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat-box/get-message`,
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

      if (!response.ok) {
        throw new Error("Failed to load chat history");
      }

      const data = await response.json();
      if (data.success && data.chat_context) {
        const formattedMessages = data.chat_context.map((msg, index) => ({
          id: index + 1,
          text: msg.chat_text,
          sender: msg.from === "user" ? "user" : "bot",
          timestamp: new Date(msg.timestamp),
          sessionId: msg.sessionId,
        }));

        if (formattedMessages.length > 0) {
          setCurrentSessionId(
            formattedMessages[formattedMessages.length - 1].sessionId,
          );
        }

        // setMessages(formattedMessages);
      }
      setIsLoadingMessage(false);
    } catch (error) {
      setIsLoadingMessage(false);
      console.error("Error loading chat history:", error);
    }
  };

  const startScenarioChat = (scenario) => {
    setActiveView("chat");
    setSelectedScenario(scenario);
    setIsRolePlay(true);
    setIsLoading(true);

     setMessages([
      {
        id: 1,
        text: scenario.question,
        sender: "user",
        timestamp: new Date(),
      }
    ]);
  };

  const startCustomChat = () => {
    setIsRolePlay(false);
    setSelectedScenario(null);
    setActiveView("chat");
    if (chatMode === "roleplay") {
      setMessages([]);
    }
    setShowFeedback(false);
    dispatch(setChatMode("coaching"));
  };

  const handleSend = async () => {
    scrollToBottom();
    const trimmed = inputValue.trim();

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

        // Show feedback if it's a third round
        if (data.thirdRound) {
          setShowFeedback(true);
        }
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
    const trimmed = question?.trim() || inputValue?.trim();

    setIsLoading(true);
    // const newMessage = {
    //   id: messages.length + 1,
    //   text: trimmed,
    //   sender: "user",
    //   timestamp: new Date(),
    // };
    // setMessages((prev) => [...prev, newMessage]);
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

        // Show feedback if it's a third round
        if (data.thirdRound) {
          setShowFeedback(true);
        }
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

  const goBackToScenarios = () => {
    setActiveView("scenarios");
    setIsRolePlay(false);
    setSelectedScenario(null);
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

  const animationProps = {
    initial: { "--x": "100%", scale: 0.8 },
    animate: { "--x": "-100%", scale: 1 },
    whileTap: { scale: 0.95 },
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 1,
      type: "spring",
      stiffness: 20,
      damping: 15,
      mass: 2,
      scale: {
        type: "spring",
        stiffness: 200,
        damping: 5,
        mass: 0.5,
      },
    },
  };

  const handleContinueChat = () => {
    setShowFeedback(false);
  };

  if (isLoadingMessage) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[#0029ff] border-r-[#0029ff]"></div>
          <div className="absolute inset-4 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#0029ff] opacity-20"></div>
        </div>
        <p className="text-lg font-medium text-gray-700">
          Loading your chat history
        </p>
      </div>
    );
  }

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
            {activeView === "scenarios" ? "Choose Scenario" : "Coach Chat"}
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
              className="mb-8 text-center"
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
        ) : (
          <Chat
            startRecording={startRecording}
            stopRecording={stopRecording}
            setShowFeedback={setShowFeedback}
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            isRecording={isRecording}
            goBackToScenarios={goBackToScenarios}
            animationProps={animationProps}
            isProcessing={isProcessing}
            inputValue={inputValue}
            setInputValues={setInputValue}
            handleSend={handleSend}
            handleRolePlaySend={handleRolePlaySend}
            isRolePlay={isRolePlay}
            canvasRef={canvasRef}
            showFeedback={showFeedback}
            sessionId={currentSessionId}
            userId={userId}
            setMessages={setMessages}
            token={token}
            onContinueChat={handleContinueChat}
          />
        )}
      </AnimatePresence>

      <FloatingNav
        setMessages={setMessages}
        setShowFeedback={setShowFeedback}
      />
    </main>
  );
}
