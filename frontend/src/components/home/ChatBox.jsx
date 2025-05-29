"use client";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import scenariosData from "./chatbox.json";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ShinyButton } from "../../components/magicui/shiny-button";
import { logout } from "../../store/userSlice";

export default function ChatBox({ onClose }) {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* ---------------- Text / scenario state ---------------- */
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeView, setActiveView] = useState("chat");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- Audio-recording state ---------------- */
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ---------------- Audio-specific refs ------------------ */
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const firstName = useSelector((state) => state.user.firstName);

  const [isRoleplay, setIsRoleplay] = useState(false);

  // Load chat history when component mounts or when switching to chat view
  useEffect(() => {
    if (activeView === "chat") {
      loadChatHistory();
    }
  }, [activeView]);

  const loadChatHistory = async () => {
    // try {
    if (isRoleplay) {
      setMessages((prev) => [
        ...prev,
        {
          id: 1,
          text: "I want to engage in a roleplay on giving constructive feedback",
          sender: "user",
          timestamp: new Date(),
        },
      ]);
    }
    //   const response = await fetch(
    //     `${import.meta.env.VITE_API_BASE_URL}/chat-box/get-message`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   );

    //   // Access status code
    //   const statusCode = response.status;
    //   if (statusCode === 401) {
    //     dispatch(logout());
    //     navigate("/");
    //     return;
    //   }

    //   if (!response.ok) {
    //     throw new Error("Failed to load chat history");
    //   }

    //   const data = await response.json();
    //   if (data.success && data.chat_context) {
    //     const formattedMessages = data.chat_context.map((msg, index) => ({
    //       id: index + 1,
    //       text: msg.chat_text,
    //       sender: msg.from === "user" ? "user" : "bot",
    //       timestamp: new Date(msg.timestamp),
    //     }));
    //     setMessages(formattedMessages);
    //   }
    // } catch (error) {
    //   console.error("Error loading chat history:", error);
    // }
  };

  const startScenarioChat = (scenario) => {
    // Add the scenario question to messages

    // Set loading to true and change view
    setIsRoleplay(true);
    setActiveView("chat");
    setIsLoading(true);

    // Send the question to handleSend
    // handleSend(scenario.question);
  };

  const startCustomChat = () => {
    setSelectedScenario(null);
    // setMessages();
    setActiveView("chat");
  };

  const handleSend = async (questionText = null) => {
    const trimmed = inputValue.trim();

    if (questionText) if (!trimmed) return;

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

  const goBackToScenarios = () => {
    setActiveView("scenarios");
    setMessages([]);
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

  /* cleanup on unmount */
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

  /* ====================================================== */
  /* ========================== UI ======================== */
  /* ====================================================== */

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      {/* ---- Header ---- */}
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

      {/* ---- Animated View Transition ---- */}
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
                  onClick={() => {
                    console.log({ f: sc.question });
                    startScenarioChat(sc);
                  }}
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
          /* ---- Chat View ---- */
          <motion.div
            key="chat-view"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              mass: 0.5,
            }}
            className="flex h-full flex-col"
          >
            {/* Scrollable Messages Area */}
            <motion.div
              className="flex-1 space-y-4 overflow-y-auto p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      m.sender === "user"
                        ? "bg-[var(--primary-color)] text-white"
                        : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className="mt-1 text-xs opacity-70">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="max-w-[80%] rounded-2xl bg-white px-4 py-2 text-gray-800 shadow-sm">
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
            </motion.div>

            {/* Bottom Container with Button and Input */}
            <div className="relative z-10 h-[242px]">
              <motion.div
                className="flex justify-center p-4"
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

              {/* Input area (keep bottom-14 as required) */}
              <motion.div
                className="sticky bottom-14 border-t border-gray-200 bg-white p-3"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2">
                  <textarea
                    rows={3}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        await handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    disabled={isRecording || isProcessing}
                    className="max-h-40 flex-1 resize-none overflow-y-auto border-none bg-transparent text-gray-800 outline-none"
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
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isRecording || isProcessing}
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
        )}
      </AnimatePresence>
    </main>
  );
}
