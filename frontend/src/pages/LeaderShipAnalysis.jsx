import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraText } from "../components/magicui/aurora-text";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import { RainbowButton } from "../components/magicui/rainbow-button";

function LeadershipAnalysis() {
  const reportData = useSelector((state) => state.user.reportData);
  const firstName = useSelector((state) => state.user.firstName);
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: false,
    opportunities: false,
    threats: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reportData) {
      setLoading(false);
    } else {
      setError("No report data found");
    }
  }, [reportData]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = () => {
    navigate("/personalize-home");
  };

  if (loading || !reportData?.persona) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-[var(--primary-color)]">
              Unable to load your leadership analysis
            </p>

            <div className="mt-6 flex w-full flex-col items-center gap-4">
              <p className="text-sm text-gray-500">
                The analysis couldn't be completed. Please try again.
              </p>

              <RainbowButton
                onClick={() => 
                  
                  navigate("/waiting", { state: { formData } })
                
                }
                className="focus:ring-opacity-50 w-full max-w-xs bg-[var(--primary-color)] px-6 py-2 text-sm font-medium transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              >
                Retry Analysis
              </RainbowButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-[var(--primary-color)] px-4 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const primaryPersona = reportData.persona[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-gray-50">
      {/* V-Shaped Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 60%)" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)]"
          style={{ clipPath: "polygon(0 60%, 100% 40%, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Header Bar */}
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

      {/* Main Content */}
      <div className="flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8 flex w-full flex-col items-center">
          <div className="mb-6 flex h-48 w-full items-center justify-center rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <img
              src="/a.svg"
              alt="Leadership Icon"
              className="h-full w-full object-contain"
            />
          </div>

          <AuroraText
            className="text-3xl leading-tight font-bold"
            colors={["#0029ff", "#3b82f6"]}
            speed={1.5}
          >
            Leadership Style
          </AuroraText>
          <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-blue-400" />
        </div>

        {/* Leadership Type Card */}
        <motion.div
          className="mb-8 w-full rounded-xl bg-white p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--primary-color)]">
            {primaryPersona.label} Leader
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            {primaryPersona.summary}
          </p>
        </motion.div>

        {/* SWOT Analysis Section */}
        <div className="w-full">
          <h3 className="mb-6 text-center text-2xl font-bold text-[var(--primary-color)]">
            SWOT Analysis
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Strengths & Weaknesses */}
            <div className="space-y-6">
              {/* Strengths Accordion */}
              <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50 shadow-sm">
                <button
                  onClick={() => toggleSection("strengths")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h4 className="text-lg font-semibold text-green-800">
                    Strengths
                  </h4>
                  {expandedSections.strengths ? (
                    <ChevronUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-green-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.strengths && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="space-y-3 px-4 pb-4">
                        {reportData.insights.strengths.map(
                          (strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-green-500">•</span>
                              <span className="text-green-800">{strength}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Weaknesses Accordion */}
              <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm">
                <button
                  onClick={() => toggleSection("weaknesses")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h4 className="text-lg font-semibold text-red-800">
                    Weaknesses
                  </h4>
                  {expandedSections.weaknesses ? (
                    <ChevronUp className="h-5 w-5 text-red-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-red-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.weaknesses && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="space-y-3 px-4 pb-4">
                        {reportData.insights.weaknesses.map(
                          (weakness, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-red-500">•</span>
                              <span className="text-red-800">{weakness}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Opportunities & Threats */}
            <div className="space-y-6">
              {/* Opportunities Accordion */}
              <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50 shadow-sm">
                <button
                  onClick={() => toggleSection("opportunities")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h4 className="text-lg font-semibold text-blue-800">
                    Opportunities
                  </h4>
                  {expandedSections.opportunities ? (
                    <ChevronUp className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.opportunities && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="space-y-3 px-4 pb-4">
                        {reportData.insights.opportunities.map(
                          (opportunity, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-blue-500">•</span>
                              <span className="text-blue-800">
                                {opportunity}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Threats Accordion */}
              <div className="overflow-hidden rounded-xl border border-yellow-200 bg-yellow-50 shadow-sm">
                <button
                  onClick={() => toggleSection("threats")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h4 className="text-lg font-semibold text-yellow-800">
                    Threats
                  </h4>
                  {expandedSections.threats ? (
                    <ChevronUp className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-yellow-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.threats && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="space-y-3 px-4 pb-4">
                        {reportData.insights.threats.map((threat, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-yellow-500">•</span>
                            <span className="text-yellow-800">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative">
        <div className="relative min-h-auto pb-24">
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mx-auto flex max-w-3xl justify-end">
              <button
                onClick={handleSubmit}
                className="focus:ring-opacity-50 min-w-[180px] rounded-lg bg-[var(--primary-color)] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)] hover:shadow-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              >
                Go Ahead →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LeadershipAnalysis;
