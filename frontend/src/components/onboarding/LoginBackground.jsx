"use client";
import { Lock, Mail } from "lucide-react";
import { FiSettings } from "react-icons/fi";
import { forwardRef, useRef } from "react";
import { cn } from "../../lib/utils";
import { BsLightningCharge } from "react-icons/bs";

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

const LoginBackground = () => {
  const containerRef = useRef(null);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden opacity-20"
      ref={containerRef}
    >
      <div className="absolute top-20 left-20">
        <Circle>
          <Mail className="text-[var(--primary-color)]" size={24} />
        </Circle>
      </div>

      {/* Top Right Icon */}
      <div className="absolute top-20 right-20">
        <Circle>
          <Lock className="text-[var(--primary-color)]" size={24} />
        </Circle>
      </div>

      {/* Bottom Left Icon */}
      <div className="absolute bottom-20 left-20">
        <Circle>
          <FiSettings className="text-[var(--primary-color)]" size={24} />
        </Circle>
      </div>

      {/* Bottom Right Icon */}
      <div className="absolute right-20 bottom-20">
        <Circle>
          <BsLightningCharge
            className="text-[var(--primary-color)]"
            size={24}
          />
        </Circle>
      </div>
    </div>
  );
};

export default LoginBackground;
