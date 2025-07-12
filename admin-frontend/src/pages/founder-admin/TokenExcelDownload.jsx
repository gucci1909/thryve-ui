import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Building,
  Users,
  MessageCircle,
  BookOpen,
  Target,
  Lightbulb,
  BarChart3,
  Zap,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { logout } from "../../store/userSlice";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

const TokenExcelDownload = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "COMPANY_NAME",
    direction: "asc",
  });
  const [showTokenDetails, setShowTokenDetails] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/all-companies/details-with-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        showErrorToast("Session expired. Please login again.");
        dispatch(logout());
        navigate("/");
        return;
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch companies data");
      }

      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to fetch companies data. Please try again.");
      showErrorToast("Failed to fetch companies data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    let aValue, bValue;

    // Handle nested object properties
    if (sortConfig.key.includes(".")) {
      const keys = sortConfig.key.split(".");
      aValue = keys.reduce((obj, key) => obj?.[key], a) || 0;
      bValue = keys.reduce((obj, key) => obj?.[key], b) || 0;
    } else {
      aValue = a[sortConfig.key] || "";
      bValue = b[sortConfig.key] || "";
    }

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredCompanies = sortedCompanies.filter(
    (company) =>
      company.COMPANY_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.INVITE_CODE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.hr_email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleTokenDetails = (companyId) => {
    setShowTokenDetails((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const downloadExcel = async () => {
    setDownloadLoading(true);
    try {
      // Check if xlsx is available
      if (typeof window !== "undefined" && !window.XLSX) {
        showErrorToast("Excel library not loaded. Please refresh the page.");
        return;
      }

      const XLSX = window.XLSX;

      // Prepare data for Excel with better formatting
      const excelData = companies.map((company) => ({
        "Company Name": company.COMPANY_NAME || "N/A",
        "Invite Code": company.INVITE_CODE || "N/A",
        "HR Email": company.hr_email || "N/A",
        "HR Manager": company.hr_firstName || "N/A",
        Status: company.status || "N/A",
        "Daily Points": company.POINTSSTREAKPERDAY || 0,
        "Total Tokens Used": company.tokenAnalytics?.total?.tokensUsed || 0,
        "Total Prompt Tokens": company.tokenAnalytics?.total?.promptTokens || 0,
        "Total Completion Tokens":
          company.tokenAnalytics?.total?.completionTokens || 0,
        "Chat Tokens": company.chatTokens?.overallTokensUsed || 0,
        "Chat Prompt Tokens": company.chatTokens?.overallPromptTokens || 0,
        "Chat Completion Tokens":
          company.chatTokens?.overallCompletionTokens || 0,
        "Roleplay Tokens": company.rolePlayTokens?.overallTokensUsed || 0,
        "Roleplay Prompt Tokens":
          company.rolePlayTokens?.overallPromptTokens || 0,
        "Roleplay Completion Tokens":
          company.rolePlayTokens?.overallCompletionTokens || 0,
        "Leadership Tokens": company.leadershipTokens?.overallTokensUsed || 0,
        "Leadership Prompt Tokens":
          company.leadershipTokens?.overallPromptTokens || 0,
        "Leadership Completion Tokens":
          company.leadershipTokens?.overallCompletionTokens || 0,
        "Learning Plan Tokens":
          company.learningPlanTokens?.overallTokensUsed || 0,
        "Learning Plan Prompt Tokens":
          company.learningPlanTokens?.overallPromptTokens || 0,
        "Learning Plan Completion Tokens":
          company.learningPlanTokens?.overallCompletionTokens || 0,
        "Insights Tokens": company.insightsTokens?.overallTokensUsed || 0,
        "Insights Prompt Tokens":
          company.insightsTokens?.overallPromptTokens || 0,
        "Insights Completion Tokens":
          company.insightsTokens?.overallCompletionTokens || 0,
        "Coaching Interactions": company.CoachingChatInteractionPoint || 0,
        "Learning Interactions": company.LearningPlanInteractionPoint || 0,
        "Reflection Interactions": company.ReflectionInteractionPoint || 0,
        "Roleplay Interactions": company.RoleplayInteractionPoint || 0,
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws["!cols"] = [
        { width: 25 }, // Company Name
        { width: 18 }, // Invite Code
        { width: 30 }, // HR Email
        { width: 18 }, // HR Manager
        { width: 12 }, // Status
        { width: 15 }, // Daily Points
        { width: 18 }, // Total Tokens
        { width: 18 }, // Prompt Tokens
        { width: 18 }, // Completion Tokens
        { width: 15 }, // Chat Tokens
        { width: 15 }, // Chat Tokens
        { width: 15 }, // Chat Tokens
        { width: 15 }, // Roleplay Tokens
        { width: 15 }, // Roleplay Tokens
        { width: 15 }, // Roleplay Tokens
        { width: 15 }, // Leadership Tokens
        { width: 15 }, // Leadership Tokens
        { width: 15 }, // Leadership Tokens
        { width: 15 }, // Learning Plan Tokens
        { width: 15 }, // Learning Plan Tokens
        { width: 15 }, // Learning Plan Tokens
        { width: 15 }, // Insights Tokens
        { width: 15 }, // Insights Tokens
        { width: 15 }, // Insights Tokens
        { width: 18 }, // Coaching Interactions
        { width: 18 }, // Learning Interactions
        { width: 18 }, // Reflection Interactions
        { width: 18 }, // Roleplay Interactions
      ];

      // Style the header row
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          fill: { fgColor: { rgb: "0029FF" } },
          font: { color: { rgb: "FFFFFF" }, bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }

      // Style data rows with alternating colors
      for (let R = 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[address]) continue;

          ws[address].s = {
            fill: { fgColor: { rgb: R % 2 === 0 ? "F8F9FA" : "FFFFFF" } },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Token Analytics");

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `thryve-token-analytics-${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, filename);

      showSuccessToast("Excel file downloaded successfully! 🎉");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      showErrorToast("Failed to download Excel file");
    } finally {
      setDownloadLoading(false);
    }
  };

  const getTokenCategoryData = (company) => {
    return [
      {
        name: "Chat",
        value: company.chatTokens?.overallTokensUsed || 0,
        color: "from-green-500 to-green-600",
        icon: MessageCircle,
      },
      {
        name: "Roleplay",
        value: company.rolePlayTokens?.overallTokensUsed || 0,
        color: "from-purple-500 to-purple-600",
        icon: Users,
      },
      {
        name: "Leadership",
        value: company.leadershipTokens?.overallTokensUsed || 0,
        color: "from-red-500 to-red-600",
        icon: Target,
      },
      {
        name: "Learning Plan",
        value: company.learningPlanTokens?.overallTokensUsed || 0,
        color: "from-orange-500 to-orange-600",
        icon: BookOpen,
      },
      {
        name: "Insights",
        value: company.insightsTokens?.overallTokensUsed || 0,
        color: "from-indigo-500 to-indigo-600",
        icon: Lightbulb,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center space-y-4"
        >
          <RefreshCw className="h-12 w-12 text-blue-600" />
          <p className="text-lg font-medium text-gray-600">
            Loading companies data...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
          >
            <AlertCircle className="h-8 w-8 text-red-600" />
          </motion.div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Error Loading Data
          </h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCompanies}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Token Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive overview of all companies' token usage and
                analytics
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadExcel}
              disabled={downloadLoading || companies.length === 0}
              className="flex cursor-pointer items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating Excel...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-5 w-5" />
                  <span>Download Excel</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-600 p-3">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Companies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-green-600 p-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">
                  Total Tokens Used
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(
                    companies.reduce(
                      (sum, company) =>
                        sum + (company.tokenAnalytics?.total?.tokensUsed || 0),
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-purple-600 p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Active Companies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-orange-600 p-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Avg Tokens/Company
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(
                    Math.round(
                      companies.reduce(
                        (sum, company) =>
                          sum +
                          (company.tokenAnalytics?.total?.tokensUsed || 0),
                        0,
                      ) / Math.max(companies.length, 1),
                    ),
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
        >
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredCompanies.length} of {companies.length} companies
            </span>
          </div>
        </motion.div>

        {/* Companies Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("COMPANY_NAME")}
                      className="flex items-center space-x-1 hover:text-blue-100"
                    >
                      <span>Company</span>
                      {sortConfig.key === "COMPANY_NAME" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">HR Manager</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Daily Points</th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() =>
                        handleSort("tokenAnalytics.total.tokensUsed")
                      }
                      className="flex items-center space-x-1 hover:text-blue-100"
                    >
                      <span>Total Tokens</span>
                      {sortConfig.key === "tokenAnalytics.total.tokensUsed" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredCompanies.map((company, index) => (
                    <motion.tr
                      key={company._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {company.COMPANY_NAME || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {company.INVITE_CODE || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {company.hr_firstName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {company.hr_email || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            company.status,
                          )}`}
                        >
                          {company.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {company.POINTSSTREAKPERDAY || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatNumber(
                            company.tokenAnalytics?.total?.tokensUsed || 0,
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTokenDetails(company._id)}
                          className="flex cursor-pointer items-center space-x-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
                        >
                          {showTokenDetails[company._id] ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              <span>Hide Details</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </>
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Token Details Accordion */}
          <AnimatePresence>
            {filteredCompanies.map((company) =>
              showTokenDetails[company._id] ? (
                <motion.div
                  key={`details-${company._id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-6">
                    <h4 className="mb-4 text-lg font-semibold text-gray-900">
                      Token Analytics for {company.COMPANY_NAME}
                    </h4>

                    {/* Token Categories */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                      {getTokenCategoryData(company).map((category, index) => {
                        const Icon = category.icon;
                        return (
                          <motion.div
                            key={category.name}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-lg bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`rounded-lg bg-gradient-to-r ${category.color} p-2`}
                              >
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  {category.name}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {formatNumber(category.value)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            Total Tokens
                          </span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-blue-900">
                          {formatNumber(
                            company.tokenAnalytics?.total?.tokensUsed || 0,
                          )}
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
                          {formatNumber(
                            company.tokenAnalytics?.total?.promptTokens || 0,
                          )}
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
                          {formatNumber(
                            company.tokenAnalytics?.total?.completionTokens ||
                              0,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No companies found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms."
                : "No companies data available."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TokenExcelDownload;
