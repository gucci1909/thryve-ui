import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraText } from "../components/magicui/aurora-text";
import { ChevronDown, ChevronUp } from "lucide-react";

function LeadershipAnalysis() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: false,
    opportunities: false,
    threats: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = () => {
    navigate("/learning-plan-ready");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-gray-50">
      {/* V-Shaped Background - Enhanced with subtle gradient */}
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

      {/* Header Bar - Enhanced with subtle shadow */}
      <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] px-3 py-1.5 shadow-sm">
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
            Welcome, Sunil
          </motion.h2>
        </div>
      </div>

      {/* Main Content - Enhanced spacing and visual hierarchy */}
      <div className="flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        {/* Hero Section with SVG - Made more prominent */}
        <div className="mb-8 flex w-full flex-col items-center">
          <div className="mb-6 flex h-48 w-full items-center justify-center rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <img 
              src="/a.svg" 
              alt="Leadership Icon" 
              className="h-full w-full object-contain"
            />
          </div>
          
          <AuroraText
            className="text-3xl font-bold leading-tight"
            colors={["#0029ff", "#3b82f6"]}
            speed={1.5}
          >
            Leadership Style
          </AuroraText>
          <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-blue-400" />
        </div>

        {/* Leadership Type Card - Enhanced with subtle animation */}
        <motion.div 
          className="mb-8 w-full rounded-xl bg-white p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-3 text-2xl font-bold text-[var(--primary-color)]">
            Visionary Leader
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            You inspire and motivate your team through a shared vision and high
            expectations. Your leadership style fosters innovation and encourages
            team members to reach their full potential, driving collective
            success through a clear, compelling direction.
          </p>
        </motion.div>

        {/* SWOT Analysis Section - With accordion functionality */}
        <div className="w-full">
          <h3 className="mb-6 text-center text-2xl font-bold text-[var(--primary-color)]">
            SWOT Analysis
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Strengths & Weaknesses */}
            <div className="space-y-6">
              {/* Strengths Accordion */}
              <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('strengths')}
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
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="px-4 pb-4 space-y-3">
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">•</span>
                          <span className="text-green-800">Empowers others, encourages growth</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">•</span>
                          <span className="text-green-800">Inspires with purpose</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">•</span>
                          <span className="text-green-800">High emotional intelligence</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Weaknesses Accordion */}
              <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('weaknesses')}
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
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="px-4 pb-4 space-y-3">
                        <li className="flex items-start">
                          <span className="mr-2 text-red-500">•</span>
                          <span className="text-red-800">May over-index on consensus, delaying decisions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-red-500">•</span>
                          <span className="text-red-800">Struggles with underperformers needing direction</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-red-500">•</span>
                          <span className="text-red-800">May avoid confrontation to preserve harmony</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Opportunities & Threats */}
            <div className="space-y-6">
              {/* Opportunities Accordion */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('opportunities')}
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
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="px-4 pb-4 space-y-3">
                        <li className="flex items-start">
                          <span className="mr-2 text-blue-500">•</span>
                          <span className="text-blue-800">Build succession pipelines</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-blue-500">•</span>
                          <span className="text-blue-800">Lead change with buy-in</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-blue-500">•</span>
                          <span className="text-blue-800">Develop next-gen leaders</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Threats Accordion */}
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('threats')}
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
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="px-4 pb-4 space-y-3">
                        <li className="flex items-start">
                          <span className="mr-2 text-yellow-500">•</span>
                          <span className="text-yellow-800">Risk of burnout from being overly available</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-yellow-500">•</span>
                          <span className="text-yellow-800">Unclear accountability if over-democratizing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-yellow-500">•</span>
                          <span className="text-yellow-800">Resistance from results-driven stakeholders</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Submit Button - Fixed at bottom with animation */}
      <div className="relative">
        <div className="relative min-h-auto pb-24">
          <motion.div
            className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mx-auto flex max-w-3xl justify-end">
              <button
                onClick={handleSubmit}
                className="min-w-[180px] rounded-lg bg-[var(--primary-color)] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50"
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