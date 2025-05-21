"use client";
import { motion } from "framer-motion";
import { MessageCircle, Send, ChevronLeft, Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import scenariosData from "./chatbox.json";

export default function ChatBox({ onClose }) {
  /* ---------------- Text / scenario state ---------------- */
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeView, setActiveView] = useState("scenarios");
  const [selectedScenario, setSelectedScenario] = useState(null);

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

  /* ====================================================== */
  /* ===========  Chat / scenario-response logic  ========== */
  /* ====================================================== */

  const startScenarioChat = (scenario) => {
    setSelectedScenario(scenario);
    setMessages([
      { id: 1, text: "Hi Sunil, how can I help you today?", sender: "bot" },
      { id: 2, text: scenario.question, sender: "user" },
    ]);
    setActiveView("chat");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: 3, text: scenario.response, sender: "bot" },
      ]);
    }, 800);
  };

  const startCustomChat = () => {
    setSelectedScenario(null);
    setMessages([
      { id: 1, text: "Hi Sunil, how can I help you today?", sender: "bot" },
      {
        id: 2,
        text: "Please describe your scenario in your own words.",
        sender: "bot",
      },
    ]);
    setActiveView("chat");
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newMessage = {
      id: messages.length + 1,
      text: trimmed,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInputValue("");

    /* ------- find canned response if any -------- */
    const normalized = trimmed.toLowerCase();
    let response = scenariosData.fallbackResponse;

    for (const scenario of scenariosData.scenarios) {
      if (scenario.keywords.some((kw) => normalized.includes(kw))) {
        response = scenario.response;
        break;
      }
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: response, sender: "bot" },
      ]);
    }, 1000);
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
          "xi-api-key": "sk_cceab93ca33c2ed420b6a70873173ad0b51df20eeb89d4d7",
        },
        body: form,
      });

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

  /* ====================================================== */
  /* ========================== UI ======================== */
  /* ====================================================== */

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between border-b border-white/20 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          {activeView === "chat" && (
            <button
              onClick={goBackToScenarios}
              className="mr-2 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <MessageCircle className="text-[var(--primary-color)]" size={20} />
          <h2 className="font-medium text-[var(--primary-color)]">
            {activeView === "scenarios" ? "Choose Scenario" : "Coach Chat"}
          </h2>
        </div>
      </div>

      {/* ---- Scenario list ---- */}
      {activeView === "scenarios" ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-medium text-gray-800">
              Great Sunil! Choose your scenario!
            </h3>
          </div>

          <div className="space-y-3">
            {scenariosData.scenarios.slice(0, 6).map((sc) => (
              <motion.div
                key={sc.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                onClick={() => startScenarioChat(sc)}
              >
                <h4 className="font-medium text-[var(--primary-color)]">
                  {sc.title}
                </h4>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-[var(--primary-color)] px-6 py-2 text-white shadow-md"
              onClick={startCustomChat}
            >
              Define your own scenario
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          {/* ---- Message list ---- */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-32">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    m.sender === "user"
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ---- Input / audio area ---- */}
          {/* ---- Input / audio area ---- */}
          <div className="sticky bottom-16 z-20 border-t border-gray-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-b-xl bg-gray-100 px-4 py-2">
              {/* Multiline, scroll-after-max-height textarea */}
              <textarea
                rows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                disabled={isRecording || isProcessing}
                className="max-h-40 flex-1 resize-none overflow-y-auto border-none bg-transparent text-gray-800 outline-none"
              />

              {/* Mic / stop button - always visible */}
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

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isRecording || isProcessing}
                className="rounded-full bg-[var(--primary-color)] p-2 text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Hidden canvas for visualiser */}
            <canvas
              ref={canvasRef}
              width="300"
              height="40"
              className={`voice-visualizer ${isRecording ? "active" : ""} mt-2`}
            />
          </div>
        </>
      )}
    </main>
  );
}
