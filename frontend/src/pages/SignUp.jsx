"use client";
import { motion } from "framer-motion";
import { User, Mail, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { WarpBackground } from "../components/magicui/warp-background";
import { AvatarCircles } from "../components/magicui/avatar-circles";
import { RainbowButton } from "../components/magicui/rainbow-button";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useDispatch } from "react-redux";
import { login, updateCompanyCode } from "../store/userSlice";
import { useCookies } from 'react-cookie';

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
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('invite-code');
  const [companyInfo, setCompanyInfo] = useState(null);
  const [inviteCodeError, setInviteCodeError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookie] = useCookies(['authToken']);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    password: "",
    phone: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyInviteCode = async () => {
      if (!inviteCode) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/verify-key`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inviteCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          setInviteCodeError(data.error || 'Invalid invite code');
          return;
        }

        setCompanyInfo(data.company);
        dispatch(updateCompanyCode(inviteCode));
      } catch (error) {
        console.error('Error verifying invite code:', error);
        setInviteCodeError('Failed to verify invite code');
      }
    };

    verifyInviteCode();
  }, [inviteCode, dispatch]);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone number is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handlePhoneChange = (value) => {
    const digitsOnly = value?.replace(/\D/g, "") || "";

    // Extract national digits (without country code)
    let nationalDigits;
    if (digitsOnly.startsWith("1")) {
      nationalDigits = digitsOnly.slice(1); // US/Canada
    } else if (digitsOnly.startsWith("91")) {
      nationalDigits = digitsOnly.slice(2); // India
    } else {
      nationalDigits = digitsOnly;
    }

    // Extract country code
    let countryCode = "";
    if (value?.startsWith("+1")) {
      countryCode = "+1";
    } else if (value?.startsWith("+91")) {
      countryCode = "+91";
    } else {
      const match = value?.match(/^\+\d{1,3}/);
      countryCode = match ? match[0] : "";
    }

    setPhoneCountryCode(countryCode);
    setPhone(nationalDigits);

    // Only validate phone field
    setErrors(prev => ({
      ...prev,
      phone: validateField("phone", nationalDigits)
    }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", firstName),
      email: validateField("email", email),
      password: validateField("password", password),
      phone: validateField("phone", phone)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(""); // Clear any previous API errors

    const formData = {
      firstName,
      email,
      phoneCountryCode,
      phoneNumber: phone,
      password,
      inviteCode: companyInfo?.inviteCode || null
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: 'include',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setApiError("Email is already registered");
      } else {
        const { token, user: { id, email, firstName } } = data;

           // Set the auth token cookie
        setCookie('authToken', token, {
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          sameSite: 'strict'
        });


        dispatch(login({ token, _id: id, email, firstName }));
        navigate("/selection-page");
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setApiError(error.message);
      setIsLoading(false);
    }
  };

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

            {/* Animated underline bar */}
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
        <form onSubmit={handleSubmit} className="space-y-4">

          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{apiError}</span>
            </div>
          )}

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
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors(prev => ({
                    ...prev,
                    firstName: validateField("firstName", e.target.value)
                  }));
                }}
                className={`block w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({
                    ...prev,
                    email: validateField("email", e.target.value)
                  }));
                }}
                className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
                placeholder="name@company.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({
                    ...prev,
                    password: validateField("password", e.target.value)
                  }));
                }}
                className={`block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-50 p-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="relative">
              <PhoneInput
                international
                defaultCountry="IN"
                value={phoneCountryCode + phone}
                limitMaxLength={true}
                onChange={handlePhoneChange}
                countryCallingCodeEditable={false}
                className={`block w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                  } bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Register Button */}
          <div className="pt-2">
            <RainbowButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-sm font-medium relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Registering...</span>
                </div>
              ) : (
                "Register"
              )}
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
