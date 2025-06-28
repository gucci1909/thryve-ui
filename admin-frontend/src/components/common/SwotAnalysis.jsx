import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SwotAnalysis({ expandedSections, reportData, toggleSection }) {
  return (
    <div className="w-full">
      <h3 className="mb-3 mt-4 text-center text-2xl font-bold text-[var(--primary-color)]">
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
                    {reportData.insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-500">•</span>
                        <span className="text-green-800">{strength}</span>
                      </li>
                    ))}
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
              <h4 className="text-lg font-semibold text-red-800">Weaknesses</h4>
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
                    {reportData.insights.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-red-500">•</span>
                        <span className="text-red-800">{weakness}</span>
                      </li>
                    ))}
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
                          <span className="text-blue-800">{opportunity}</span>
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
              <h4 className="text-lg font-semibold text-yellow-800">Threats</h4>
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
  );
}

export default SwotAnalysis;
