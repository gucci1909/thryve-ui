"use client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FiPieChart,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import { BsLightningCharge, BsRobot } from "react-icons/bs";
import { RiBrainFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Globe } from "../components/magicui/globe1"; // Make sure to import your Globe component

// Circle Component
const Circle = ({ className, children }) => {
  return (
    <div
      className={`z-10 flex size-12 items-center justify-center rounded-full border-2 border-[var(--primary-color)] bg-white ${className}`}
    >
      {children}
    </div>
  );
};

// FloatingIcon Component
const FloatingIcon = ({ icon, className, xOffset = 20, yOffset = 20 }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{ x: [0, xOffset], y: [0, yOffset] }}
    transition={{
      repeat: Infinity,
      repeatType: "mirror",
      duration: 2 + Math.random(),
      ease: "easeInOut",
    }}
  >
    <Circle>{icon}</Circle>
  </motion.div>
);

// Background with floating icons
const LearningPlanBackground = () => {
  const icons = [
    {
      icon: <BsRobot className="text-[var(--primary-color)]" size={24} />,
      className: "top-20 left-20",
      xOffset: 15,
      yOffset: 25,
    },
    {
      icon: <RiBrainFill className="text-[var(--primary-color)]" size={24} />,
      className: "top-20 right-20",
      xOffset: -20,
      yOffset: -15,
    },
    {
      icon: <FiTarget className="text-[var(--primary-color)]" size={24} />,
      className: "bottom-20 left-20",
      xOffset: 20,
      yOffset: -25,
    },
    {
      icon: <FiTrendingUp className="text-[var(--primary-color)]" size={24} />,
      className: "bottom-15 right-10",
      xOffset: -15,
      yOffset: 20,
    },
    {
      icon: <FiUsers className="text-[var(--primary-color)]" size={24} />,
      className: "top-10 left-1/3",
      xOffset: 10,
      yOffset: -20,
    },
    {
      icon: <FiPieChart className="text-[var(--primary-color)]" size={24} />,
      className: "bottom-10 right-1/3",
      xOffset: -10,
      yOffset: 15,
    },
    {
      icon: <FiAward className="text-[var(--primary-color)]" size={24} />,
      className: "top-1/2 left-1/4",
      xOffset: 15,
      yOffset: -15,
    },
    {
      icon: (
        <BsLightningCharge className="text-[var(--primary-color)]" size={24} />
      ),
      className: "top-1/2 right-1/4",
      xOffset: -15,
      yOffset: 15,
    },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
      {icons.map((item, idx) => (
        <FloatingIcon
          key={idx}
          icon={item.icon}
          className={item.className}
          xOffset={item.xOffset}
          yOffset={item.yOffset}
        />
      ))}
    </div>
  );
};

function LearningPlanReadyScreen() {
  const navigate = useNavigate();
  const firstName = useSelector((state) => state.user.firstName);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-[#f8f9ff] to-[#e6ecff]">
      {/* Background Elements */}
      <LearningPlanBackground />
      <Globe className="text-[var(--primary-color)] opacity-10" />

      <div className="relative z-10 w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] px-3 py-1.5">
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-6">
        <motion.div
          className="flex w-full max-w-md flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-auto bg-[var(--primary-color)]"
            />
            <h1 className="text-3xl font-bold text-[var(--primary-color)]">
              thryve
            </h1>
          </motion.div>

          <div className="w-full rounded-2xl border border-white/20 bg-white/95 p-10 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
            <div className="space-y-6">
              <motion.p
                className="text-xl font-medium tracking-wide text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Your personalized
              </motion.p>

              <div className="space-y-2">
                <motion.p
                  className="text-xl font-bold text-[var(--primary-color)]"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Learning Plan has been
                </motion.p>
                <motion.p
                  className="bg-gradient-to-r from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_30%)] bg-clip-text text-2xl font-extrabold text-transparent"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  generated
                </motion.p>
              </div>
            </div>

            <motion.button
              onClick={() => navigate("/personalize-home")}
              className="mt-10 w-full rounded-[14px] bg-[var(--primary-color)] px-8 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(0,41,255,0.4)] focus:ring-2 focus:ring-white focus:ring-offset-4 focus:outline-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 30px -5px rgba(0, 41, 255, 0.4)",
              }}
              whileTap={{
                scale: 0.98,
                boxShadow: "0 5px 15px -5px rgba(0, 41, 255, 0.3)",
              }}
            >
              <span className="drop-shadow-md">Take me there</span>
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
              >
                →
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LearningPlanReadyScreen;
