import { motion } from "framer-motion";
import {
  Building,
  Eye,
  Lock,
  RefreshCw,
  ChevronDown,
  Unlock,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const CompanyTable = ({
  loading,
  companies,
  setSelectedCompany,
  currentPage,
  setCurrentPage,
  setShowCompanyDetails,
  setShowChangePassword,

  setSelectedCompanyStatus,
  setOpenChangeStatusModal,
}) => {
  const itemsPerPage = 5;
  const [copiedCompanyId, setCopiedCompanyId] = useState(null);
  const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  const handleCopyInviteLink = async (inviteCode) => {
    const inviteLink = `${APP_BASE_URL}?invite-code=${inviteCode}`;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      showSuccessToast("Invite link copied to clipboard! 🎉");
      setCopiedCompanyId(inviteCode);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCompanyId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      showErrorToast("Failed to copy invite link");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Company Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Invite Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Interaction Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Daily Points
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No companies found
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <motion.tr
                  key={company._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {company.COMPANY_NAME}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                        {company.INVITE_CODE}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopyInviteLink(company.INVITE_CODE)}
                        className="flex items-center justify-center cursor-pointer rounded-lg bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
                        title="Copy invite link"
                      >
                        {copiedCompanyId === company.INVITE_CODE ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </motion.button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-900">
                        Coaching: {company.CoachingChatInteractionPoint}
                      </div>
                      <div className="text-sm text-gray-900">
                        Learning: {company.LearningPlanInteractionPoint}
                      </div>
                      <div className="text-sm text-gray-900">
                        Reflection: {company.ReflectionInteractionPoint}
                      </div>
                      <div className="text-sm text-gray-900">
                        Roleplay: {company.RoleplayInteractionPoint}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {company.POINTSSTREAKPERDAY}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {/* Top option (right-aligned) */}
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowCompanyDetails(true);
                        }}
                        className="flex cursor-pointer items-center text-sm text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </button>

                      {/* Middle options (slightly indented) */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowChangePassword(true);
                          }}
                          className="flex cursor-pointer items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <Lock className="mr-1 h-4 w-4" />
                          Change Password
                        </button>

                        {/* Status toggle - subtle text style */}
                        <span
                          onClick={() => {
                            setSelectedCompanyStatus(company);
                            setOpenChangeStatusModal(true);
                          }}
                          className={`flex cursor-pointer items-center text-sm ${
                            company.status === "active"
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {company.status === "active" ? (
                            <Lock className="mr-1 h-4 w-4" />
                          ) : (
                            <Unlock className="mr-1 h-4 w-4" />
                          )}
                          {company.status === "active"
                            ? "Deactivate"
                            : "Reactivate"}
                        </span>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {companies.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{companies.length}</span> of{" "}
                <span className="font-medium">{companies.length}</span>{" "}
                companies
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90 transform" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={companies.length < itemsPerPage}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 -rotate-90 transform" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
