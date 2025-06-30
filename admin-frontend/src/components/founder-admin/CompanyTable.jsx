import { motion } from "framer-motion";
import { Building, ChevronDown, Eye, Lock, RefreshCw } from "lucide-react";
import { useState } from "react";

function CompanyTable({
  loading,
  companies,
  setSelectedCompany,
  setShowChangePassword,
  currentPage = 1,
  setCurrentPage,
}) {
  const [itemsPerPage] = useState(5);
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
                    <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800">
                      {company.INVITE_CODE}
                    </span>
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
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex flex-col gap-2 space-x-2">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="flex cursor-pointer items-center text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowChangePassword(true);
                        }}
                        className="flex cursor-pointer items-center text-gray-600 hover:text-gray-900"
                      >
                        <Lock className="mr-1 h-4 w-4" />
                        Change Password of HR
                      </button>
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
                  Previous
                  <ChevronDown className="h-5 w-5 rotate-90 transform" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={companies.length < itemsPerPage}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronDown className="h-5 w-5 -rotate-90 transform" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyTable;
