"use client";
import { Lock, Mail } from "lucide-react";
import { FiSettings, FiPieChart, FiBarChart2 } from "react-icons/fi";
import { BsLightningCharge } from "react-icons/bs";
import { motion } from "framer-motion";
import { forwardRef, useRef } from "react";
import { cn } from "../../lib/utils";

// Circle Component
const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

// FloatingIcon Component
const FloatingIcon = ({ icon, className, xOffset = 20, yOffset = 20 }) => (
  <motion.div
    className={cn("absolute", className)}
    animate={{ x: [0, xOffset], y: [0, yOffset] }}
    transition={{
      repeat: Infinity,
      repeatType: "mirror",
      duration: 2 + Math.random(), // small variation
      ease: "easeInOut",
    }}
  >
    <Circle>{icon}</Circle>
  </motion.div>
);

// Main Background Component
const LoginBackground = () => {
  const containerRef = useRef(null);

  const icons = [
    {
      icon: <Mail className="text-[var(--primary-color)]" size={24} />,
      className: "top-20 left-20",
      xOffset: 20,
      yOffset: 30,
    },
    {
      icon: <Lock className="text-[var(--primary-color)]" size={24} />,
      className: "top-20 right-20",
      xOffset: -15,
      yOffset: -25,
    },
    {
      icon: <FiSettings className="text-[var(--primary-color)]" size={24} />,
      className: "bottom-20 left-20",
      xOffset: 25,
      yOffset: -20,
    },
    {
      icon: <FiBarChart2 className="text-[var(--primary-color)]" size={24} />,
       className: "bottom-15 left-10",
      xOffset: -15,
      yOffset: 25,
    },
    {
      icon: <FiPieChart className="text-[var(--primary-color)]" size={24} />,
      className: "top-10 right-1/2",
      xOffset: 12,
      yOffset: -15,
    },
    {
      icon: (
        <BsLightningCharge className="text-[var(--primary-color)]" size={24} />
      ),
      className: "bottom-10 left-1/2",
      xOffset: -12,
      yOffset: 18,
    },
  ];

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden opacity-20"
      ref={containerRef}
    >
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

export default LoginBackground;
