"use client";
import { AnimatedList } from "../components/magicui/animated-list";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "../components/magicui/animated-circular-progress-bar";
import { AuroraText } from "../components/magicui/aurora-text";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout, reportDatafunc } from "../store/userSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const AI_THINKING_MESSAGES = [
  "Analyzing your leadership patterns",
  "Processing decision-making skills",
  "Evaluating communication strengths",
  "Calculating emotional intelligence score",
  "Finalizing personalized recommendations",
  "Assessing strategic thinking capabilities",
  "Measuring team collaboration potential",
  "Evaluating conflict resolution approaches",
  "Analyzing adaptability quotient",
  "Processing innovation mindset metrics",
  "Calculating resilience factors",
  "Evaluating mentorship capabilities",
  "Analyzing problem-solving methodology",
  "Measuring organizational impact",
  "Processing stakeholder management style",
  "Evaluating change management aptitude",
  "Calculating growth potential indicators",
  "Analyzing decision consistency patterns",
  "Measuring leadership authenticity",
  "Processing cultural intelligence factors",
  "Evaluating time management efficiency",
  "Analyzing resource optimization skills",
  "Calculating influence and persuasion metrics",
  "Evaluating crisis management readiness",
  "Processing long-term vision alignment",
];

const MIN_PROGRESS_DURATION = 15000; // 15 seconds minimum
const MAX_PROGRESS_DURATION = 30000; // 30 seconds maximum
const MESSAGE_CHANGE_INTERVAL = 4000; // 4 seconds per message

function WaitingScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const firstName = useSelector((state) => state.user.firstName);
  const formData = location.state?.formData;
  const token = useSelector((state) => state.user.token);
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [apiCompleted, setApiCompleted] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchLeadershipReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/onboarding/leadership-report`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReportData(data.data);
        dispatch(reportDatafunc(data.data));
        setApiCompleted(true);
      } catch (err) {
        console.error("Error fetching leadership report:", err);
        setError(err.message);
        setApiCompleted(true); // Even on error, we consider the API call complete
      } finally {
        setLoading(false);
      }
    };

    fetchLeadershipReport();
  }, [formData, token]);

  useEffect(() => {
    let progressInterval;
    let messageInterval;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      let targetProgress;

      if (apiCompleted) {
        // If API is done, gradually move to 100%
        targetProgress = 100;
      } else {
        // Calculate progress based on elapsed time, with slower progression
        const progressRatio = Math.min(elapsed / MIN_PROGRESS_DURATION, 1);
        targetProgress = Math.min(progressRatio * 75, 75); // Cap at 75% until API completes

        // If taking longer than expected, slow down the progress even more
        if (elapsed > MIN_PROGRESS_DURATION) {
          const extraTime = elapsed - MIN_PROGRESS_DURATION;
          const extraProgress =
            (extraTime / (MAX_PROGRESS_DURATION - MIN_PROGRESS_DURATION)) * 15;
          targetProgress = Math.min(75 + extraProgress, 90); // Never exceed 90% before API completes
        }
      }

      setProgress((prev) => {
        // Smoothly transition to the target progress with slower easing
        const newProgress = prev + (targetProgress - prev) * 0.05; // Reduced from 0.1 to 0.05 for smoother transition

        if (apiCompleted && newProgress >= 99.5) {
          clearInterval(progressInterval);
          console.log({ navi: formData });
          setTimeout(() => {
            navigate("/leadership-swot-analysis", {
              state: { formData, reportData },
            });
          }, 1000); // Add a small delay before navigation
          return 100;
        }
        return newProgress;
      });
    };

    progressInterval = setInterval(updateProgress, 100);
    messageInterval = setInterval(() => {
      setCurrentMessageIndex(
        (prev) => (prev + 1) % AI_THINKING_MESSAGES.length,
      );
    }, MESSAGE_CHANGE_INTERVAL);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [navigate, apiCompleted, startTime, formData, reportData]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#f8f9ff] to-[#e6ecff]">
      {/* Compact Header */}
      <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] px-3 py-1.5">
        <div className="relative z-10 mx-auto flex h-10 max-w-4xl flex-row items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-8 drop-shadow-sm"
            />
            <h1 className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
              thryve
            </h1>
          </motion.div>

          <motion.h2
            className="cursor-default text-lg text-white hover:cursor-[url('/pointer.cur'),_pointer]"
            style={{
              fontWeight: 900,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Welcome, {firstName}
          </motion.h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-4">
        <motion.div
          className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-2xl backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ height: "80vh" }}
        >
          {/* Header */}
          <div className="text-center">
            <AuroraText
              className="text-2xl font-bold"
              colors={["#0029ff", "#3b82f6", "#2563eb"]}
            >
              Analyzing Your Results
            </AuroraText>
            <p className="mt-1 text-sm text-gray-500">
              This will only take a moment...
            </p>
          </div>

          {/* Scrollable Progress Section */}
          <div
            className="flex flex-col items-center gap-6 overflow-y-auto px-4"
            style={{ flex: 1 }}
          >
            {/* Circular Progress */}
            <div className="relative">
              <AnimatedCircularProgressBar
                value={progress}
                max={100}
                min={0}
                gaugePrimaryColor="var(--primary-color)"
                gaugeSecondaryColor="rgba(0, 41, 255, 0.1)"
                className="h-40 w-40"
              />
              <div className="absolute inset-0 m-auto flex flex-col items-center justify-center gap-1">
                <motion.div
                  animate={{
                    rotate: 360, // Rotate 360 degrees
                  }}
                  transition={{
                    duration: 5, // Duration of one rotation in seconds
                    repeat: Infinity, // Infinite rotation
                    ease: "linear", // Smooth linear rotation
                  }}
                >
                  <DotLottieReact
                    src="https://lottie.host/208e2bad-58e7-483f-8e67-e9c314ffef65/uy4hC8Z5Xg.lottie"
                    loop
                    autoplay
                  />
                </motion.div>
              </div>
            </div>
            {/* AI Thinking Messages */}
            <div className="w-full max-w-md space-y-2">
              <AnimatedList delay={MESSAGE_CHANGE_INTERVAL}>
                {AI_THINKING_MESSAGES.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-lg px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
                      index === currentMessageIndex
                        ? "bg-[var(--primary-color)] text-white shadow"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message}
                  </motion.div>
                ))}
              </AnimatedList>
            </div>

            {/* Animated Dots */}
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[1, 2, 3].map((dot) => (
                <motion.div
                  key={dot}
                  className="h-2 w-2 rounded-full bg-[var(--primary-color)]"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WaitingScreen;
