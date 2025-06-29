import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Building,
  LogOut,
  Search,
  Filter,
  Mail,
  TrendingUp,
  Star,
  Eye,
  Plus,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Activity,
  X,
  MessageSquare,
  Target,
  BookOpen,
  MessageCircle,
  Flame,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { showSuccessToast, showInfoToast } from "../../utils/toast";
import { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all-managers");
  const [dashboardData, setDashboardData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitingManagerId, setInvitingManagerId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, firstName } = useSelector((state) => state.user);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Show loading indicator when search term is different from debounced term
  const isSearching = searchTerm !== debouncedSearchTerm;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/manager-dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch managers
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/managers/all-managers?search=${debouncedSearchTerm}&sort=${sortBy}&page=${currentPage}&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setTotalUsers(data.total);
        setManagers(data.users);
        setTotalPages(Math.ceil(data.total / 6));
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Invite new manager
  const inviteNewManager = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/invite-managers/new-manager`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inviteForm),
        },
      );
      const data = await response.json();
      if (data.success) {
        setShowInviteModal(false);
        setInviteForm({ name: "", email: "" });
        fetchManagers();
        showSuccessToast("Manager invited successfully!");
      } else {
        showInfoToast(data.error || "Failed to invite manager");
      }
    } catch (error) {
      console.error("Error inviting manager:", error);
      showInfoToast("Failed to invite manager");
    } finally {
      setInviteLoading(false);
    }
  };

  // Invite existing manager
  const inviteExistingManager = async (managerId) => {
    setInvitingManagerId(managerId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/invite-managers/existing-manager`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ manager_id: managerId }),
        },
      );
      const data = await response.json();
      if (data.success) {
        showSuccessToast("Invitation sent successfully!");
      } else {
        showInfoToast(data.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting manager:", error);
      showInfoToast("Failed to send invitation");
    } finally {
      setInvitingManagerId(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "all-managers") {
      fetchManagers();
    }
  }, [activeTab, debouncedSearchTerm, sortBy, currentPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  console.log("Dashboard Data:", dashboardData);

  const sidebarItems = [
    { id: "all-managers", label: "All Managers", icon: <Users size={20} /> },
    {
      id: "add-manager",
      label: "Add New Manager",
      icon: <UserPlus size={20} />,
    },
    {
      id: "company-profile",
      label: "Company Profile",
      icon: <Building size={20} />,
    },
  ];

  const renderStatsCards = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {/* Total Users Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative overflow-hidden cursor-pointer rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm"
      >
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200 opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-blue-500" size={18} />
              <p className="text-sm font-medium text-blue-600">Total Users</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {totalUsers || 0}
            </p>
            <p className="mt-1 text-xs text-blue-500">
              <span
                className={`inline-block h-2 w-2 rounded-full ${totalUsers > 0 ? "bg-green-500" : "bg-gray-400"}`}
              ></span>
              <span className="ml-1">Active managers</span>
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
            }}
            className="rounded-lg bg-blue-100 p-2 text-blue-600"
          >
            <Users size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* Highest Streak Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative overflow-hidden rounded-xl cursor-pointer border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-5 shadow-sm"
      >
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-200 opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="text-amber-500" size={18} />
              <p className="text-sm font-medium text-amber-600">
                Highest Streak
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData?.highestStreakUser?.streak || 0}
              <span className="ml-1 text-sm font-normal text-gray-500">
                {dashboardData?.highestStreakUser?.streak > 1 ? "days" : "day"}
              </span>
            </p>
            <p className="mt-1 max-w-[160px] truncate text-xs text-amber-500">
              <span className="font-medium">
                {dashboardData?.highestStreakUser?.name || "N/A"}
              </span>
              <span className="mx-1">•</span>
              <span>
                {dashboardData?.highestStreakUser?.totalPoints || 0} pts
              </span>
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-lg bg-amber-100 p-2 text-amber-600"
          >
            <Flame size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* NPS Score Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative overflow-hidden rounded-xl border cursor-pointer border-green-100 bg-gradient-to-br from-white to-green-50 p-5 shadow-sm"
      >
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-200 opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="text-green-500" size={18} />
              <p className="text-sm font-medium text-green-600">Company NPS</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {dashboardData?.scores_from_company_nps || 0}%
            </p>
            <div className="mt-1 flex items-center text-green-500">
              by team members from respective managers.
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-lg bg-green-100 p-2 text-green-600"
          >
            <Star size={20} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderManagersList = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#0029ff",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #0029ff",
              background: "#f0f4ff",
            },
          },
          error: {
            duration: 0, // Disable error toasts
          },
          loading: {
            duration: 0, // Disable loading toasts
          },
        }}
      />
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
              className="rounded-xl border border-gray-200 bg-white p-1 text-gray-600 shadow-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
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
                                <div className="text-lg font-semibold text-[#0029ff]">
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
                                <div className="text-lg font-semibold text-[#0029ff]">
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
                                <div className="text-lg font-semibold text-[#0029ff]">
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
                                <div className="text-lg font-semibold text-[#0029ff]">
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
                            onClick={() => navigate(`/manager/${manager._id}`)}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => inviteExistingManager(manager._id)}
                            disabled={invitingManagerId === manager._id}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {invitingManagerId === manager._id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail size={16} />
                                Send Invite
                              </>
                            )}
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
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
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
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );

  const renderAddManager = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
            <UserPlus className="text-white" size={32} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Add New Manager
          </h2>
          <p className="text-gray-600">
            Invite a new manager to join your team
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowInviteModal(true);
          }}
          className="space-y-6"
        >
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Manager Name
            </label>
            <input
              type="text"
              value={inviteForm.name}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
              placeholder="Enter manager name"
              required
            />
          </div>
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, email: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
              placeholder="Enter email address"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-[#0029ff] to-[#1a4bff] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg"
          >
            {inviteLoading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                />
                <span>Sending...</span>
              </div>
            ) : (
              "Send Invitation"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );

  const renderCompanyProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
            <Building className="text-white" size={32} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Company Profile
          </h2>
          <p className="text-gray-600">Your company information and settings</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Company Name
            </label>
            <p className="text-lg text-gray-900">Your Company Name</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Company Code
            </label>
            <p className="text-lg text-gray-900">
              {dashboardData?.highestStreakUser?.companyId || "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Total Users
            </label>
            <p className="text-lg text-gray-900">
              {dashboardData?.totalUsers || 0}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative w-72 bg-white shadow-2xl"
      >
        <div className="border-b border-gray-100 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
              <img
                src="/logo-thryve.png"
                alt="Thryve Logo"
                className="h-8 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">thryve</h1>
          </div>
        </div>

        <nav className="space-y-3 p-6">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-4 rounded-xl px-6 py-4 text-left transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#0029ff]"
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight className="ml-auto" size={20} />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="absolute right-6 bottom-6 left-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-left text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Manage your team and monitor their progress
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "all-managers" && (
              <motion.div
                key="all-managers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderStatsCards()}
                {renderManagersList()}
              </motion.div>
            )}

            {activeTab === "add-manager" && (
              <motion.div
                key="add-manager"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderAddManager()}
              </motion.div>
            )}

            {activeTab === "company-profile" && (
              <motion.div
                key="company-profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderCompanyProfile()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Send Invitation
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={inviteNewManager} className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
                    placeholder="Enter manager name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={inviteLoading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#0029ff] to-[#1a4bff] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {inviteLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                        />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send Invitation"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
