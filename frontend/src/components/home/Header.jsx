import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { updatePoints } from "../../store/userSlice";

function Header({ pointAdded, setPointAdded }) {
  const firstName = useSelector((state) => state.user.firstName);
  const token = useSelector((state) => state.user.token);
  const [showPointsUpdate, setShowPointsUpdate] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(0);
  const [eventSource, setEventSource] = useState(null);
  const dispatch = useDispatch();
  const points = useSelector((state) => state.user.points);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/feed/points`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include", // Include cookies in the request
          },
        );
        if (!response.ok) throw new Error("Failed to fetch points");
        const data = await response.json();
        dispatch(updatePoints(data.points));
        setPreviousPoints(data.points);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPoints();

  }, [token, points, dispatch]);

  useEffect(() => {
    if (pointAdded) {
      const fetchPoints = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/feed/points`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include", // Include cookies in the request
            },
          );
          if (!response.ok) throw new Error("Failed to fetch points");
          const data = await response.json();
          dispatch(updatePoints(data.points));
          setPreviousPoints(data.points);
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      };
      fetchPoints();
      setPointAdded(false);
    }
  }, [pointAdded]);

  return (
    <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] py-3 shadow-md">
      {/* Top center-aligned logo + title */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <img
            src="/logo-thryve.png"
            alt="Thryve Logo"
            className="h-8 w-8 drop-shadow-md"
          />
          <h1 className="text-2xl font-semibold tracking-wide text-white drop-shadow-sm">
            thryve
          </h1>
        </div>
      </div>

      {/* Separator line */}
      <div className="my-2 h-[1px] w-full bg-white/30" />

      {/* Bottom row: greeting and trophy */}
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
        {/* Left: Menu + greeting */}
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm font-medium">Good Morning, {firstName}</span>
        </div>

        {/* Right: Trophy + score */}
        <div className="relative flex items-center gap-1 text-white">
          <motion.div
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),black_20%)] px-3 py-1.5 text-sm font-bold text-white shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              boxShadow: "0 4px 12px rgba(0, 41, 255, 0.25)",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.2,
            }}
            whileHover={{
              y: -2,
              boxShadow: "0 6px 16px rgba(0, 41, 255, 0.35)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 5, 0, -5, 0],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              <FaTrophy className="text-yellow-300" />
            </motion.div>

            <motion.div className="relative">
              <motion.span
                key={points || 0}
                initial={showPointsUpdate ? { y: -20, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {points || 0}
              </motion.span>

              {showPointsUpdate && points > previousPoints && (
                <motion.span
                  className="absolute -top-4 left-0 text-xs text-green-300"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -10 }}
                  exit={{ opacity: 0 }}
                >
                  +{points - previousPoints}
                </motion.span>
              )}
            </motion.div>

            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-yellow-300/80"
                initial={{
                  opacity: 0,
                  y: 0,
                  x: 0,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [0, -8, -15],
                  x: i % 2 === 0 ? [0, 3, 0] : [0, -3, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-[var(--primary-color)]/20 blur-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1.1,
              opacity: 0.3,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
