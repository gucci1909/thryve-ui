import { motion } from "framer-motion";
import { AlertCircle, X, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const InviteCodeAlert = ({ isVisible, onClose, message, type = "error" }) => {
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef(null);

  const handleGoHome = () => {
    clearInterval(timerRef.current); // Clear the timer when manually navigating
    if (onClose) onClose();
  };

  const handleClose = () => {
    clearInterval(timerRef.current); // Clear the timer when closing
    if (onClose) onClose();
  };

  useEffect(() => {
    if (isVisible) {
      // Start countdown when component becomes visible
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimeout(() => handleGoHome(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Clean up interval on unmount
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else {
      // Reset countdown when not visible
      setCountdown(5);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex flex-row justify-between">
          {/* Logo and Header */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex items-center gap-2"
            >
              <img
                src="/logo-thryve.png"
                alt="Thryve Logo"
                className="h-8 w-auto bg-[#0029ff]"
              />
              <h1 className="text-xl font-bold text-[#0029ff]">thryve</h1>
            </motion.div>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Alert Icon */}
          <div className="flex flex-row justify-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-50"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
            </motion.div>
            <h2 className="mb-3 text-xl font-semibold text-gray-600">
              Access Restricted
            </h2>
          </div>
          <p className="mb-6 leading-relaxed text-gray-600">
            {message ||
              "You need a valid company invite code to access Thryve. Please contact your organization's administrator to get your invite code."}
          </p>

          {/* Countdown message */}
          <div className="mb-6 text-sm text-gray-500">
            <p>Redirecting to Home Page in {countdown} seconds...</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#0029ff] px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-[#001fcc]"
            >
              <Home size={18} />
              Go to Home
            </motion.button>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#0029ff]/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-[#0029ff]/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default InviteCodeAlert;
