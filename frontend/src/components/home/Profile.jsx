import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiBookmark, FiPlay } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, firstName, token } = useSelector((state) => state.user);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSavedLearning, setShowSavedLearning] = useState(false);
  const [savedLearningPlans, setSavedLearningPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/onboarding/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchSavedLearning = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/onboarding/leadership-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved learning plans");
      }

      const data = await response.json();
      const savedPlans = data.data.assessment.learning_plan.filter(
        (plan) => plan.saved
      );
      setSavedLearningPlans(savedPlans);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSavedLearning) {
      fetchSavedLearning();
    }
  }, [showSavedLearning]);

  return (
    <div className="flex-1 overflow-y-auto px-5">
      <div className="flex flex-col items-center justify-start p-6 w-full max-w-md mx-auto mt-4">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-md">
          <span className="text-3xl text-blue-600 font-semibold">
            {firstName ? firstName[0].toUpperCase() : "U"}
          </span>
        </div>
        
        <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
              <p className="text-lg font-medium text-gray-700">{firstName || "Not provided"}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-lg font-medium text-gray-700 break-all">{email || "Not provided"}</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Account Status</p>
              <p className="text-lg font-medium text-green-600">Active</p>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full bg-white border border-[#0029ff] text-[#0029ff] py-3 px-4 rounded-lg hover:bg-[#0029ff] hover:text-white transition duration-200 font-medium"
            >
              Change Password
            </button>

            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff className="text-gray-500" />
                      ) : (
                        <FiEye className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="text-gray-500" />
                      ) : (
                        <FiEye className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
                {success && (
                  <p className="text-sm text-green-600 mt-2">{success}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0029ff] text-white py-2 px-4 rounded-lg hover:bg-[#0020cc] transition duration-200"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>

          {/* Saved Learning Section */}
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowSavedLearning(!showSavedLearning)}
              className="w-full bg-white border border-[#0029ff] text-[#0029ff] py-3 px-4 rounded-lg hover:bg-[#0029ff] hover:text-white transition duration-200 font-medium"
            >
              Saved Learning
            </button>

            {showSavedLearning && (
              <div className="mt-4 space-y-4">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : savedLearningPlans.length > 0 ? (
                  <div className="grid gap-4">
                    {savedLearningPlans.map((plan, index) => (
                      <motion.div
                        key={index}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() =>
                          navigate("/personalize-dashboard", {
                            state: { selectedPlan: plan },
                          })
                        }
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-[#0029ff]">
                            {plan.title}
                          </h3>
                          <FiBookmark className="h-5 w-5 text-[#0029ff] fill-current" />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {plan.content}
                        </p>
                        {plan.video && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FiPlay className="mr-1 h-4 w-4" />
                            Video Available
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No saved learning plans found
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-8 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium shadow-md hover:shadow-lg active:transform active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 