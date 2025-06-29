import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/userSlice';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all-managers');
  const [dashboardData, setDashboardData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('new');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [inviteLoading, setInviteLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, firstName } = useSelector((state) => state.user);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/manager-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Fetch managers
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/managers/all-managers?search=${searchTerm}&sort=${sortBy}&page=${currentPage}&limit=6`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setManagers(data.users);
        setTotalPages(Math.ceil(data.total / 6));
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Invite new manager
  const inviteNewManager = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/invite-managers/new-manager`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteForm),
      });
      const data = await response.json();
      if (data.success) {
        setShowInviteModal(false);
        setInviteForm({ name: '', email: '' });
        fetchManagers();
        alert('Manager invited successfully!');
      } else {
        alert(data.error || 'Failed to invite manager');
      }
    } catch (error) {
      console.error('Error inviting manager:', error);
      alert('Failed to invite manager');
    } finally {
      setInviteLoading(false);
    }
  };

  // Invite existing manager
  const inviteExistingManager = async (managerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invite-managers/existing-manager`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manager_id: managerId }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Invitation sent successfully!');
      } else {
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error inviting manager:', error);
      alert('Failed to send invitation');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'all-managers') {
      fetchManagers();
    }
  }, [activeTab, searchTerm, sortBy, currentPage]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const sidebarItems = [
    { id: 'all-managers', label: 'All Managers', icon: <Users size={20} /> },
    { id: 'add-manager', label: 'Add New Manager', icon: <UserPlus size={20} /> },
    { id: 'company-profile', label: 'Company Profile', icon: <Building size={20} /> },
  ];

  const renderStatsCards = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0029ff]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
            <p className="text-4xl font-bold text-gray-900">
              {dashboardData?.totalUsers || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active managers</p>
          </div>
          <div className="bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 rounded-2xl shadow-lg">
            <Users className="text-white" size={28} />
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0029ff]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Highest Streak</p>
            <p className="text-4xl font-bold text-gray-900">
              {dashboardData?.highestStreakUser?.streak || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              by {dashboardData?.highestStreakUser?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 rounded-2xl shadow-lg">
            <TrendingUp className="text-white" size={28} />
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0029ff]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Company NPS Score</p>
            <p className="text-4xl font-bold text-gray-900">
              {dashboardData?.totalTeamMembers || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Team Members</p>
          </div>
          <div className="bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 rounded-2xl shadow-lg">
            <Star className="text-white" size={28} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderManagersList = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Managers</h2>
            <p className="text-gray-600">Manage and monitor your team's progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0029ff] focus:border-transparent bg-white shadow-sm transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0029ff] focus:border-transparent bg-white shadow-sm transition-all duration-200"
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
            className="w-12 h-12 border-4 border-[#0029ff] border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <p className="mt-4 text-gray-600 font-medium">Loading managers...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Streak
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <AnimatePresence>
                  {managers.map((manager, index) => (
                    <motion.tr 
                      key={manager._id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className="transition-colors duration-200"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] flex items-center justify-center shadow-lg">
                              <span className="text-lg font-bold text-white">
                                {manager.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-900">
                              {manager.name}
                            </div>
                            <div className="text-sm text-gray-500">{manager.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#0029ff] rounded-full"></div>
                            <span className="text-sm text-gray-700">Points: {manager.points || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">Chats: {manager.chats || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">Goals: {manager.goals || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white px-4 py-2 rounded-xl font-semibold">
                            {manager.streak || 0} days
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/manager/${manager._id}`)}
                            className="bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => inviteExistingManager(manager._id)}
                            className="bg-white border-2 border-[#0029ff] text-[#0029ff] px-4 py-2 rounded-xl hover:bg-[#0029ff] hover:text-white transition-all duration-200 flex items-center gap-2"
                          >
                            <Mail size={16} />
                            Invite
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
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">No managers found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
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
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0029ff] to-[#1a4bff] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Manager</h2>
          <p className="text-gray-600">Invite a new manager to join your team</p>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          setShowInviteModal(true);
        }} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Manager Name
            </label>
            <input
              type="text"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0029ff] focus:border-transparent transition-all duration-200"
              placeholder="Enter manager name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0029ff] focus:border-transparent transition-all duration-200"
              placeholder="Enter email address"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Send Invitation
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
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0029ff] to-[#1a4bff] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h2>
          <p className="text-gray-600">Your company information and settings</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <p className="text-lg text-gray-900">Your Company Name</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Code</label>
            <p className="text-lg text-gray-900">{dashboardData?.highestStreakUser?.companyId || 'N/A'}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Users</label>
            <p className="text-lg text-gray-900">{dashboardData?.totalUsers || 0}</p>
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
        className="w-72 bg-white shadow-2xl relative"
      >
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0029ff] to-[#1a4bff] rounded-xl flex items-center justify-center shadow-lg">
              <img src="/logo-thryve.png" alt="Thryve Logo" className="h-8 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">thryve</h1>
          </div>
        </div>

        <nav className="p-6 space-y-3">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#0029ff]'
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

        <div className="absolute bottom-6 left-6 right-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your team and monitor their progress
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'all-managers' && (
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

            {activeTab === 'add-manager' && (
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

            {activeTab === 'company-profile' && (
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Send Invitation</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <form onSubmit={inviteNewManager} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0029ff] focus:border-transparent transition-all duration-200"
                    placeholder="Enter manager name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0029ff] focus:border-transparent transition-all duration-200"
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
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={inviteLoading}
                    className="flex-1 bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
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