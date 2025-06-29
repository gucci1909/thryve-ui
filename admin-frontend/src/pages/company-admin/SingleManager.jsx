import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Users,
  Target,
  MessageSquare,
  TrendingUp,
  Star,
  Plus,
  X,
  Calendar,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SingleManager = () => {
  const [manager, setManager] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "" });
  const [inviteLoading, setInviteLoading] = useState(false);

  const navigate = useNavigate();
  const { managerId } = useParams();
  const { token } = useSelector((state) => state.user);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch manager details
  const fetchManagerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/managers/single-manager?manager_id=${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setManager(data.manager);
      }
    } catch (error) {
      console.error("Error fetching manager details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch learning plans
  const fetchLearningPlans = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/managers/manager-learning-plan?manager_id=${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setLearningPlans(data.learningPlans || []);
      }
    } catch (error) {
      console.error("Error fetching learning plans:", error);
    }
  };

  // Invite team members
  const inviteTeamMembers = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/invite-team`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyCode: manager?.companyId,
          feedbackRequests: [inviteForm],
        }),
      });
      const data = await response.json();
      if (data.status === "OK") {
        setShowInviteModal(false);
        setInviteForm({ name: "", email: "" });
        alert("Team member invited successfully!");
      } else {
        alert(data.error || "Failed to invite team member");
      }
    } catch (error) {
      console.error("Error inviting team member:", error);
      alert("Failed to invite team member");
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchManagerDetails();
      fetchLearningPlans();
    }
  }, [managerId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-[#0029ff] border-t-transparent"
        ></motion.div>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Users className="text-gray-400" size={32} />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Manager Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The manager you're looking for doesn't exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-xl bg-gradient-to-r from-[#0029ff] to-[#1a4bff] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin-dashboard")}
            className="mb-6 flex items-center gap-3 text-gray-600 transition-colors duration-200 hover:text-[#0029ff]"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Dashboard</span>
          </motion.button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                {manager.name}
              </h1>
              <p className="text-lg text-gray-600">{manager.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#0029ff] to-[#1a4bff] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg"
            >
              <Plus size={20} />
              Invite Team Member
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-[#0029ff]/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Total Points
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {manager.points || 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">Earned points</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 shadow-lg">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-[#0029ff]/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Current Streak
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {manager.streak || 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">days</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 shadow-lg">
                <Award className="text-white" size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-[#0029ff]/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {manager.teamMembers || 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">Active members</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 shadow-lg">
                <Users className="text-white" size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-[#0029ff]/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  NPS Score
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {manager.scores_from_team_nps || 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">Team rating</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] p-4 shadow-lg">
                <Star className="text-white" size={28} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Activity Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff]">
                <Activity className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Activity Overview
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <MessageSquare className="text-[#0029ff]" size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Chats</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {manager.chats || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Target className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Goals</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {manager.goals || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                    <Users className="text-purple-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-700">Role Plays</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {manager.rolePlays || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                    <TrendingUp className="text-orange-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-700">
                    Learning Interactions
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {manager.learningInteractions || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff]">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Feedback Summary
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <span className="font-medium text-gray-700">
                  Coaching Feedback
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {manager.chatFeedbackCoaching || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <span className="font-medium text-gray-700">
                  Role Play Feedback
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {manager.chatFeedbackRolePlay || 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                <span className="font-medium text-gray-700">Reflections</span>
                <span className="text-xl font-bold text-gray-900">
                  {manager.reflections || 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Plans */}
        {learningPlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff]">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Learning Plans
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningPlans.slice(0, 3).map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 transition-all duration-200 hover:shadow-lg"
                >
                  <h4 className="mb-3 text-lg font-bold text-gray-900">
                    {plan.title || `Learning Plan ${index + 1}`}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {plan.description || "No description available"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Invite Team Member Modal */}
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
                  Invite Team Member
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
              <form onSubmit={inviteTeamMembers} className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Team Member Name
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#0029ff]"
                    placeholder="Enter team member name"
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
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#0029ff] to-[#1a4bff] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    {inviteLoading ? "Sending..." : "Send Invitation"}
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

export default SingleManager;
