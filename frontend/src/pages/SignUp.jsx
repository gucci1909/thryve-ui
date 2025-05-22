"use client";
import { motion } from "framer-motion";
import { User, Mail, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { WarpBackground } from "../components/magicui/warp-background";
import { AvatarCircles } from "../components/magicui/avatar-circles";
import { RainbowButton } from "../components/magicui/rainbow-button";

const avatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
    profileUrl: "https://github.com/dillionverma",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
    profileUrl: "https://github.com/tomonarifeehan",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://github.com/BankkRoll",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "https://github.com/safethecode",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59442788",
    profileUrl: "https://github.com/sanjay-mali",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://github.com/itsarghyadas",
  },
];

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  return (
    <WarpBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 m-auto w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        {/* Logo and Header */}
         <div className="mb-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 flex items-center gap-2"
          >
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-auto bg-[var(--primary-color)]"
            />
            <h1 className="text-lg font-bold text-[var(--primary-color)]">
              thryve
            </h1>
          </motion.div>

          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <motion.span
              className="relative inline-block overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3,
              }}
            >
              {/* Text with gradient shine animation */}
              <motion.span
                className="relative inline-block overflow-hidden rounded-lg px-3 py-1.5"
                initial={{
                  scale: 0.96,
                  opacity: 0,
                  backgroundColor: "rgba(236, 244, 255, 0)",
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  backgroundColor: "rgba(236, 244, 255, 0.4)",
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3,
                }}
              >
                <motion.span
                  className="text-md relative z-10 font-semibold"
                  initial={{
                    backgroundPosition: "100% 50%",
                    letterSpacing: "-0.02em",
                  }}
                  animate={{
                    backgroundPosition: "0% 50%",
                    letterSpacing: "0.01em",
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4,
                    ease: [0.83, 0, 0.17, 1],
                  }}
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #3b82f6, #93c5fd, #3b82f6)",
                    backgroundSize: "200% auto",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Register Yourself
                </motion.span>

                {/* Soft rounded underline effect */}
                <motion.span
                  className="absolute right-3 bottom-1 left-3 h-1 rounded-full bg-blue-100"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                {/* Floating bubble decoration */}
                <motion.div
                  className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-200 opacity-70"
                  initial={{ y: 5, x: 5, opacity: 0 }}
                  animate={{ y: 0, x: 0, opacity: 0.7 }}
                  transition={{
                    delay: 1,
                    duration: 0.6,
                    ease: "backOut",
                  }}
                />
              </motion.span>

              {/* Animated underline bar */}
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-[var(--primary-color)] to-blue-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.7,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* Floating particles decoration */}
              <motion.div
                className="absolute -top-2 -right-2 h-2 w-2 rounded-full bg-[var(--primary-color)] opacity-70"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 0.7 }}
                transition={{
                  delay: 1,
                  duration: 0.4,
                  ease: "backOut",
                }}
              />
            </motion.span>

            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ delay: 0.8 }}
            >
              <span className="h-px w-8 bg-gray-300" />
              <motion.span
                className="px-2 text-xs font-medium tracking-wider text-[var(--primary-color)] uppercase"
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.2em", opacity: 1 }}
                transition={{
                  delay: 0.9,
                  duration: 0.5,
                  ease: "backOut",
                }}
              >
                Elevate Your Leadership
              </motion.span>
              <span className="h-px w-8 bg-gray-300" />
            </motion.div>
          </motion.h2>
        </div>

        {/* Signup Form */}
        <form className="space-y-4">
          {/* First Name Input */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="John"
                required
              />
            </div>
          </div>

          {/* Last Name Input */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          {/* Mobile Input */}
          <div>
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mobile
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Smartphone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="+1 (123) 456-7890"
                required
              />
            </div>
          </div>

          {/* Register Button */}
          <div className="pt-2">
            <RainbowButton
              // type="submit"
              onClick={() => {
                navigate("/selection-page");
              }}
              className="w-full py-3 text-sm font-medium"
            >
              Register
            </RainbowButton>
          </div>
        </form>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span>Join</span>
          <AvatarCircles numPeople={99} avatarUrls={avatars} size="sm" />
          <span>users already thriving</span>
        </div>

        {/* Login Link */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Already Registered?{" "}
          <Link
            to="/login"
            className="font-medium text-[var(--primary-color)] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </WarpBackground>
  );
};

export default SignupPage;
