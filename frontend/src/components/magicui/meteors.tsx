"use client";

import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";

interface CoachingBubblesProps {
  number?: number;
  delayBetween?: number;
  minDuration?: number;
  maxDuration?: number;
  className?: string;
}

export const CoachingBubbles = ({
  number = 8,
  delayBetween = 1,
  minDuration = 10,
  maxDuration = 20,
  className,
}: CoachingBubblesProps) => {
  const [activeBubbles, setActiveBubbles] = useState<number>(0);

  const coachingWords = [
      "Feedback", "Growth", "Empathy", "Goals", "Listen", 
    "Delegate", "Motivate", "Trust", "Resolve", "Align",
    "Strategy", "Vision", "Teamwork", "Balance", "Innovate",
    "Adapt", "Communicate", "Develop", "Inspire", "Coach"
  ];

  useEffect(() => {
    if (activeBubbles < number) {
      const timer = setTimeout(() => {
        setActiveBubbles(prev => prev + 1);
      }, delayBetween * 1000);
      return () => clearTimeout(timer);
    }
  }, [activeBubbles, number, delayBetween]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(activeBubbles)].map((_, idx) => {
        const style = {
          left: `${10 + (idx % 4) * 25}%`,
          animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
          opacity: 0.7,
          // fontSize: `${Math.random() * 0.5 + 1}rem`,
        };
        
        return (
          <div
            key={idx}
            style={style}
            className={cn(
              "absolute bottom-0 animate-float-up rounded-full p-3 text-center font-medium text-blue-800",
              "transform transition-all duration-300 ease-out",
              className
            )}
          >
            {coachingWords[idx % coachingWords.length]}
          </div>
        );
      })}
    </div>
  );
};