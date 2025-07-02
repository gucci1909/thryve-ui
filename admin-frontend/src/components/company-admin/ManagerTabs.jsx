import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Star,
  Eye,
  MessageSquare,
  Target,
  BookOpen,
  MessageCircle,
  Lock,
  Unlock,
} from "lucide-react";
import { useNavigate } from "react-router";
import ChangeStatus from "./ChangeStatus";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSuccessToast } from "../../utils/toast";

function ManagerTabs({
  searchTerm,
  setSearchTerm,
  isSearching,
  loading,
  managers,
  setSortBy,
  sortBy,
  totalPages,
  currentPage,
  setCurrentPage,
  activeTab,
  companyId,
  onStatusChange,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const handleChangeStatus = async (managerId, newStatus) => {
    setIsStatusLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/managers/login/change-status/${managerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      setIsStatusLoading(false);
      setOpenChangeStatusModal(false);

      if (selectedManager?.status === "active") {
        showSuccessToast(
          `${selectedManager.name} has been deactivated. They will no longer have access.`,
        );
      } else {
        showSuccessToast(
          `${selectedManager.name} has been reactivated. Access has been restored.`,
        );
      }
      if (onStatusChange) onStatusChange();
      console.log(data.message);
    } catch (error) {
      setIsStatusLoading(false);
      console.error("Error changing status:", error);
    }
  };

  const handleOpenModal = (manager) => {
    setSelectedManager(manager);
    setOpenChangeStatusModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
    >
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-[#0029ff]">
              All Managers
            </h2>
            <p className="max-w-2xl text-[#0029ff]">
              Manage and monitor your team's progress with comprehensive
              insights and analytics
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-gray-600 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
              />
              {isSearching && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-4 w-4 rounded-full border-2 border-[#0029ff] border-t-transparent"
                  />
                </div>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-1 text-gray-600 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
            >
              <option value="new">Newest First</option>
              <option value="old">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto h-12 w-12 rounded-full border-4 border-[#0029ff] border-t-transparent"
          ></motion.div>
          <p className="mt-4 font-medium text-gray-600">Loading managers...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                    Manager
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                    Stats
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                    Routine
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold tracking-wider text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {managers.map((manager, index) => (
                    <motion.tr
                      key={manager._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{
                        backgroundColor: "#f8fafc",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                      }}
                      className="cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    >
                      {/* Profile Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md">
                              <span className="text-xl font-bold text-white">
                                {manager.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {manager.name}
                              </h3>
                              {manager.streak > 0 && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  🔥 {manager.streak}d streak
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {manager.email}
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              Joined:{" "}
                              {new Date(manager.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stats Column */}
                      <td className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-blue-50 p-3">
                            <div className="flex items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                <MessageSquare size={16} />
                              </div>
                              <div className="ml-2">
                                <div className="text-xs font-medium text-gray-500">
                                  Chats
                                </div>
                                <div className="text-lg font-semibold text-blue-600">
                                  {manager.chats || 0}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg bg-purple-50 p-3">
                            <div className="flex items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                <Users size={16} />
                              </div>
                              <div className="ml-2">
                                <div className="text-xs font-medium text-gray-500">
                                  Role Plays
                                </div>
                                <div className="text-lg font-semibold text-purple-600">
                                  {manager.rolePlays || 0}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg bg-green-50 p-3">
                            <div className="flex items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                <Target size={16} />
                              </div>
                              <div className="ml-2">
                                <div className="text-xs font-medium text-gray-500">
                                  Goals
                                </div>
                                <div className="text-lg font-semibold text-green-600">
                                  {manager.goals || 0}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg bg-amber-50 p-3">
                            <div className="flex items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                <Star size={16} />
                              </div>
                              <div className="ml-2">
                                <div className="text-xs font-medium text-gray-500">
                                  Points
                                </div>
                                <div className="text-lg font-semibold text-amber-600">
                                  {manager.points || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-4">
                          {/* Learning Interactions */}
                          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                  <BookOpen size={18} />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Learning Plans Read
                                  </h4>
                                  <div className="mt-1 flex items-baseline">
                                    <span className="text-2xl font-semibold text-gray-900">
                                      {manager.learningInteractions || 0}
                                    </span>
                                    <span className="text-md ml-1 text-gray-500">
                                      times
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Feedback Received */}
                          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                                  <MessageCircle size={18} />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Feedback Received
                                  </h4>
                                  <div className="mt-1 flex items-baseline">
                                    <span className="text-2xl font-semibold text-gray-900">
                                      {manager.teamMembers || 0}
                                    </span>
                                    <span className="text-md ml-1 text-gray-500">
                                      responses
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleOpenModal(manager);
                            }}
                            className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md ${
                              manager.status === "active"
                                ? "bg-gradient-to-r from-red-600 to-red-500" // Red for deactivate
                                : "bg-gradient-to-r from-green-600 to-green-500" // Green for reactivate
                            }`}
                          >
                            {manager.status === "active" ? (
                              <Lock size={16} />
                            ) : (
                              <Unlock size={16} />
                            )}
                            {manager.status === "active"
                              ? "Deactivate"
                              : "Reactivate"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              activeTab === "all-managers"
                                ? navigate(`/manager/${manager._id}`)
                                : navigate(`/founder-manager/${manager._id}`, {
                                    state: {
                                      companyId: companyId,
                                    },
                                  })
                            }
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {managers.length === 0 && !loading && (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Users className="text-gray-400" size={32} />
              </div>
              <p className="text-lg font-medium text-gray-500">
                No managers found
              </p>
              <p className="mt-2 text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="border-t border-gray-100 bg-gray-50 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Modal */}
          <AnimatePresence>
            <ChangeStatus
              openModal={openChangeStatusModal}
              setOpenModal={setOpenChangeStatusModal}
              manager={selectedManager}
              handleChangeStatus={handleChangeStatus}
              isLoading={isStatusLoading}
            />
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default ManagerTabs;
