import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  X,
  Edit3,
  Save,
  Calendar,
  User,
  Target,
  TrendingUp,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Users,
  RefreshCw,
  Mail,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Zap,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const CompanyDetailsModal = ({ isOpen, onClose, company, token }) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editEmailLoading, setEditEmailLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [originalAboutText, setOriginalAboutText] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [originalHrEmail, setOriginalHrEmail] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isOpen && company?._id) {
      fetchCompanyDetails();
    }
  }, [isOpen, company?._id]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/all-companies/details/${company._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        showErrorToast("Session expired. Please login again.");
        return;
      }

      const data = await response.json();
      if (data.company) {
        setCompanyDetails(data);
        setAboutText(data.company.ABOUT_TEXT || "");
        setOriginalAboutText(data.company.ABOUT_TEXT || "");
        setHrEmail(data.company.hr_email || "");
        setOriginalHrEmail(data.company.hr_email || "");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      showErrorToast("Failed to fetch company details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditText = async () => {
    if (!aboutText.trim()) {
      showErrorToast("About text cannot be empty");
      return;
    }

    setEditLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/all-companies/edit-company-text`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: company._id,
            newText: aboutText,
          }),
        },
      );

      if (response.status === 401) {
        showErrorToast("Session expired. Please login again.");
        return;
      }

      const data = await response.json();
      if (data.message) {
        showSuccessToast("About text updated successfully! 🎉");
        setOriginalAboutText(aboutText);
        setIsEditing(false);
        // Update the company details with new text
        setCompanyDetails((prev) => ({
          ...prev,
          company: {
            ...prev.company,
            ABOUT_TEXT: aboutText,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating about text:", error);
      showErrorToast("Failed to update about text");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditHrEmail = async () => {
    if (!hrEmail.trim()) {
      showErrorToast("HR email cannot be empty");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hrEmail)) {
      showErrorToast("Please enter a valid email address");
      return;
    }

    setEditEmailLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/all-companies/edit-hr-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: companyDetails.company.hr_id,
            newEmail: hrEmail,
          }),
        },
      );

      if (response.status === 401) {
        showErrorToast("Session expired. Please login again.");
        return;
      }

      const data = await response.json();
      if (data.message) {
        showSuccessToast("HR Email updated successfully! 🎉");
        setOriginalHrEmail(hrEmail);
        setIsEditingEmail(false);
        // Update the company details with new email
        setCompanyDetails((prev) => ({
          ...prev,
          company: {
            ...prev.company,
            hr_email: hrEmail,
          },
        }));
      }
    } catch (error) {
      console.error("Error updating HR email:", error);
      showErrorToast("Failed to update HR email");
    } finally {
      setEditEmailLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setAboutText(originalAboutText);
    setIsEditing(false);
  };

  const handleCancelEditEmail = () => {
    setHrEmail(originalHrEmail);
    setIsEditingEmail(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const interactionIcons = {
    CoachingChatInteractionPoint: MessageCircle,
    LearningPlanInteractionPoint: BookOpen,
    ReflectionInteractionPoint: Lightbulb,
    RoleplayInteractionPoint: Users,
  };

  const interactionLabels = {
    CoachingChatInteractionPoint: "Coaching",
    LearningPlanInteractionPoint: "Learning",
    ReflectionInteractionPoint: "Reflection",
    RoleplayInteractionPoint: "Roleplay",
  };

  // Token Analytics Accordion Component
  const TokenAnalyticsAccordion = ({ tokenAnalytics }) => {
    const [openSections, setOpenSections] = useState(["total"]);

    const toggleSection = (sectionKey) => {
      setOpenSections((prev) =>
        prev.includes(sectionKey)
          ? prev.filter((key) => key !== sectionKey)
          : [...prev, sectionKey],
      );
    };

    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num);
    };

    const getSectionIcon = (key) => {
      switch (key) {
        case "total":
          return BarChart3;
        case "chat":
          return MessageCircle;
        case "roleplay":
          return Users;
        case "learningPlan":
          return BookOpen;
        case "leadershipReport":
          return Target;
        case "insights":
          return Lightbulb;
        default:
          return Zap;
      }
    };

    const getSectionColor = (key) => {
      switch (key) {
        case "total":
          return "from-blue-500 to-blue-600";
        case "chat":
          return "from-green-500 to-green-600";
        case "roleplay":
          return "from-purple-500 to-purple-600";
        case "learningPlan":
          return "from-orange-500 to-orange-600";
        case "leadershipReport":
          return "from-red-500 to-red-600";
        case "insights":
          return "from-indigo-500 to-indigo-600";
        default:
          return "from-gray-500 to-gray-600";
      }
    };

    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
          Token Analytics
        </h3>

        <div className="space-y-2">
          {Object.entries(tokenAnalytics).map(([key, data]) => {
            const Icon = getSectionIcon(key);
            const isOpen = openSections.includes(key);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <button
                  onClick={() => toggleSection(key)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`rounded-lg bg-gradient-to-r ${getSectionColor(key)} p-2`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {data.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {data.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">
                        Total Tokens
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatNumber(data.tokensUsed)}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-white"
                    >
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="rounded-lg bg-blue-50 p-4">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">
                                Total Tokens
                              </span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-blue-900">
                              {formatNumber(data.tokensUsed)}
                            </p>
                          </div>

                          <div className="rounded-lg bg-green-50 p-4">
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                Prompt Tokens
                              </span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-green-900">
                              {formatNumber(data.promptTokens)}
                            </p>
                          </div>

                          <div className="rounded-lg bg-purple-50 p-4">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-600">
                                Completion Tokens
                              </span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-purple-900">
                              {formatNumber(data.completionTokens)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative mx-auto flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-white/20 p-3 backdrop-blur-sm"
                >
                  <Building className="h-8 w-8" />
                </motion.div>
                <div>
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold"
                  >
                    {company?.COMPANY_NAME || "Company Details"}
                  </motion.h2>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-blue-100"
                  >
                    Comprehensive company information and analytics
                  </motion.p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="cursor-pointer rounded-full p-2 transition-colors hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-8 w-8 text-blue-600" />
                </motion.div>
              </div>
            ) : companyDetails ? (
              <div className="space-y-6 p-6">
                {/* Basic Info Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-600 p-2">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Invite Code
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {companyDetails.company?.INVITE_CODE || "N/A"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-green-600 p-2">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Daily Points
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {companyDetails.company?.POINTSSTREAKPERDAY || "0"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-purple-600 p-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-600">
                          HR Manager
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {companyDetails.company.hr_firstName}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-orange-600 p-2">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-600">
                          Created
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatDate(companyDetails.company.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* HR Email Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                      <Mail className="mr-2 h-5 w-5 text-blue-600" />
                      HR Email Address
                    </h3>
                    {!isEditingEmail ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditingEmail(true)}
                        className="flex cursor-pointer items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Email</span>
                      </motion.button>
                    ) : (
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancelEditEmail}
                          className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleEditHrEmail}
                          disabled={editEmailLoading}
                          className="transition-color flex cursor-pointer items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {editEmailLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Save Email</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {isEditingEmail ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="relative">
                        <input
                          type="email"
                          value={hrEmail}
                          onChange={(e) => setHrEmail(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-4 pr-12 text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter HR email address..."
                        />
                        <Mail className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>Please enter a valid email address</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4"
                    >
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">
                        {companyDetails.company?.hr_email ||
                          "No email available"}
                      </span>
                    </motion.div>
                  )}
                </motion.div>

                {/* About Text Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                      About Company
                    </h3>
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="flex cursor-pointer items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </motion.button>
                    ) : (
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancelEdit}
                          className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleEditText}
                          disabled={editLoading}
                          className="transition-color flex cursor-pointer items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {editLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              <span>Save</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <motion.textarea
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="h-32 w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company description..."
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="min-h-[8rem] rounded-lg bg-gray-50 p-4"
                    >
                      <p className="leading-relaxed text-gray-700">
                        {companyDetails.company?.ABOUT_TEXT ||
                          "No description available."}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Interaction Points */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                    <Target className="mr-2 h-5 w-5 text-blue-600" />
                    Interaction Points
                  </h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Object.entries(interactionIcons).map(
                      ([key, Icon], index) => (
                        <motion.div
                          key={key}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="cursor-pointer rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100"
                        >
                          <Icon className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                          <p className="text-sm font-medium text-gray-700">
                            {interactionLabels[key]}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {companyDetails.company?.[key] || "0"}
                          </p>
                        </motion.div>
                      ),
                    )}
                  </div>
                </motion.div>

                {/* Token Analytics Accordion */}
                {/* {companyDetails.tokenAnalytics && (
                  <TokenAnalyticsAccordion tokenAnalytics={companyDetails.tokenAnalytics} />
                )}  */}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <X className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No company details available</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanyDetailsModal;
