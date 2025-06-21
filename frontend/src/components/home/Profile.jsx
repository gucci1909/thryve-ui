import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiUser,
  FiMail,
  FiShield,
  FiLock,
  FiLogOut,
  FiChevronRight,
  FiUsers,
  FiSend,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, firstName } = useSelector((state) => state.user);
 
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md py-8"
      >
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary-color)] to-blue-600 shadow-xl"
          >
            <span className="text-4xl font-bold text-white">
              {firstName ? firstName[0].toUpperCase() : "U"}
            </span>
          </motion.div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {firstName || "User"}
          </h1>
          <p className="text-base text-gray-600">{email}</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          {/* Personal Information Section */}
          <div className="border-b border-gray-100 p-6">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <FiUser className="mr-2 text-[var(--primary-color)]" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {firstName || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-base font-medium break-all text-gray-900">
                    {email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Management Section */}
          <div className="border-b border-gray-100 p-6">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <FiUsers className="mr-2 text-[var(--primary-color)]" />
              Team Management
            </h2>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/personalize-add-team-members")}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-[var(--primary-color)]"
              >
                <div className="flex items-center">
                  <FiUsers className="mr-3 text-[var(--primary-color)]" />
                  <span className="font-medium text-[var(--primary-color)]">
                    Add Team Members
                  </span>
                </div>
                <FiChevronRight className="text-[var(--primary-color)]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/personalize-send-mail-to-existing-team-members")}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-[var(--primary-color)]"
              >
                <div className="flex items-center">
                  <FiSend className="mr-3 text-[var(--primary-color)]" />
                  <span className="font-medium text-[var(--primary-color)]">
                    Resend Emails
                  </span>
                </div>
                <FiChevronRight className="text-[var(--primary-color)]" />
              </motion.button>
            </div>
          </div>

          {/* Account Actions Section */}
          <div className="border-b border-gray-100 p-6">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <FiShield className="mr-2 text-[var(--primary-color)]" />
              Account Actions
            </h2>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/personalize-change-password")}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-[var(--primary-color)]"
              >
                <div className="flex items-center">
                  <FiLock className="mr-3 text-[var(--primary-color)]" />
                  <span className="font-medium text-[var(--primary-color)]">
                    Change Password
                  </span>
                </div>
                <FiChevronRight className="text-[var(--primary-color)]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/personalize-saved-post")}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-[var(--primary-color)]"
              >
                <div className="flex items-center">
                  <FiBookmark className="mr-3 text-[var(--primary-color)]" />
                  <span className="font-medium text-[var(--primary-color)]">
                    Saved Posts
                  </span>
                </div>
                <FiChevronRight className="text-[var(--primary-color)]" />
              </motion.button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <FiLogOut className="mr-2" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
