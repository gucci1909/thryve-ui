"use client";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import scenariosData from "./chatbox.json";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../store/userSlice";
import Chat from "./Chat";

export default function ChatBox() {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user._id);
  const firstName = useSelector((state) => state.user.firstName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeView, setActiveView] = useState("chat");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previousView, setPreviousView] = useState(null);
  const [isRolePlay, setIsRolePlay] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

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
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const loadChatHistory = async () => {
    setIsLoading(true);
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
          sessionId: msg.sessionId
        }));

        if (formattedMessages.length > 0) {
          setCurrentSessionId(formattedMessages[formattedMessages.length - 1].sessionId);
        }

        setMessages(formattedMessages);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error loading chat history:", error);
    }
  };

  const startScenarioChat = (scenario) => {
    setActiveView("chat");
    setSelectedScenario(scenario);
    setIsRolePlay(true);
    setIsLoading(true);
  };

  const startCustomChat = () => {
    setIsRolePlay(false);
    setSelectedScenario(null);
    setActiveView("chat");
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
    }
  };

   const handleRolePlaySend = async (question) => {
    scrollToBottom();
    const trimmed = question?.trim() || inputValue?.trim();

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

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      <div className="flex items-center justify-between border-b border-white/20 bg-white px-4 py-3 shadow-sm">
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
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              mass: 0.5,
            }}
            className="relative mx-auto flex h-[calc(100vh-100px)] max-w-md flex-col pt-4 pb-[100px]"
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h3
                className="mb-3 text-xl font-semibold text-gray-800"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-[var(--primary-color)] to-purple-500 bg-clip-text text-transparent">
                  {firstName}
                </span>
                <span className="text-gray-600">, choose your scenario!</span>
              </motion.h3>
              <motion.div
                className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-purple-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            </motion.div>

            <motion.div
              className="flex w-full flex-1 flex-col gap-3 overflow-y-auto pr-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {scenariosData.scenarios.slice(0, 6).map((sc) => (
                <motion.div
                  key={sc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative min-h-[70px] cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all"
                  onClick={() => startScenarioChat(sc)}
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)/10] to-purple-100 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-full items-center gap-3">
                    <motion.div
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-xs font-medium text-amber-900 shadow-inner"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      RP
                    </motion.div>
                    <h4 className="text-lg font-medium text-gray-700 transition-colors group-hover:text-[var(--primary-color)]">
                      {sc.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  background:
                    "linear-gradient(to right, var(--primary-color), #8b5cf6)",
                }}
                whileTap={{ scale: 0.98 }}
                className="bottom-14 w-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-purple-500 px-5 py-3 font-medium text-white shadow-md transition-all"
                onClick={startCustomChat}
              >
                Define your own scenario
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {groupMessagesBySession(messages).map((sessionMessages, sessionIndex) => (
              <div key={sessionIndex} className="mb-8">
                {sessionMessages.length > 0 && (
                  <div className="mb-4 flex justify-center">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {formatSessionTime(sessionMessages[0].timestamp)}
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  {sessionMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-[var(--primary-color)] text-white"
                            : "bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div
                          className={`mt-1 text-right text-xs ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary-color)] border-t-transparent"></div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
