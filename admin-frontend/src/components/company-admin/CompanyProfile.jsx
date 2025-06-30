import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Building,
  Info,
  Users,
  KeyRound,
  Sparkles,
  Star,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CompanyProfile() {
  const { token } = useSelector((state) => state.user);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${API_BASE_URL}/company-details/company`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch company details");
        const data = await response.json();
        setCompany(data.companyDetails);
      } catch (err) {
        setError("Could not load company details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [token]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="mx-auto max-w-3xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="mb-4 animate-spin text-[#0029ff]" size={36} />
            <span className="text-gray-500">Loading company details...</span>
          </div>
        ) : error ? (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span>{error}</span>
          </div>
        ) : company ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="space-y-8"
          >
            <div className="mb-10 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-2xl"
              >
                <Building className="text-white" size={40} />
              </motion.div>
              <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {company.COMPANY_NAME}
              </h2>
            </div>
            {/* Company Info Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div
                variants={cardVariants}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#eaf0ff] to-white p-6 shadow-md"
              >
                <KeyRound className="text-[#0029ff]" size={28} />
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Company Code
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {company.INVITE_CODE}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={cardVariants}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#eaf0ff] to-white p-6 shadow-md"
              >
                <Users className="text-[#0029ff]" size={28} />
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Points Streak/Day
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {company.POINTSSTREAKPERDAY}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={cardVariants}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#eaf0ff] to-white p-6 shadow-md"
              >
                <Sparkles className="text-[#0029ff]" size={28} />
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Coaching Chat
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {company.CoachingChatInteractionPoint}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={cardVariants}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#eaf0ff] to-white p-6 shadow-md"
              >
                <Award className="text-[#0029ff]" size={28} />
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Learning Plan
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {company.LearningPlanInteractionPoint}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={cardVariants}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#eaf0ff] to-white p-6 shadow-md"
              >
                <Star className="text-[#0029ff]" size={28} />
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Reflection
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {company.ReflectionInteractionPoint}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={cardVariants}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-[#eaf0ff] to-white p-6 shadow-md"
              >
                <Info className="text-[#0029ff]" size={28} />
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Roleplay
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {company.RoleplayInteractionPoint}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Company Name & About */}
            <motion.div
              variants={cardVariants}
              className="mt-8 rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-lg"
            >
              <div className="mb-4 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex-1">
                  <h3 className="mb-2 flex items-center gap-2 text-2xl font-bold text-[#0029ff]">
                    <Building size={28} className="inline-block" />{" "}
                    {company.COMPANY_NAME}
                  </h3>
                  <p className="text-base leading-relaxed whitespace-pre-line text-gray-700">
                    {company.ABOUT_TEXT}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default CompanyProfile;
