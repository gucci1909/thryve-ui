import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

function ChangePassword() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/change-password`,
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Navigate back after successful password change
      setTimeout(() => {
        navigate("/personalize-profile");
      }, 800);
    } catch (error) {
      setError(error.message || "Current password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20">
      <div className="mx-auto w-full max-w-md py-8">
        <div className="items-left" >
          <button
            onClick={() => navigate("/personalize-profile")}
            className="inline-flex items-center text-[var(--primary-color)] transition-colors hover:text-[#0020cc]"
          >
            <FiArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back to Profile</span>
          </button>
          <h2 className="mt-4 text-3xl font-bold text-[var(--primary-color)]">
            Change Password
          </h2>
          <p className="mt-2 text-gray-600">
            Secure your account with a new password
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-lg">
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 p-3 pr-10 text-gray-700 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] disabled:cursor-not-allowed disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[var(--primary-color)]"
                  disabled={loading}
                >
                  {showCurrentPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 p-3 pr-10 text-gray-700 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] disabled:cursor-not-allowed disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[var(--primary-color)]"
                  disabled={loading}
                >
                  {showNewPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 p-3 pr-10 text-gray-700 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] disabled:cursor-not-allowed disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[var(--primary-color)]"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[var(--primary-color)] px-4 py-3 font-medium text-white transition duration-200 hover:bg-[#0020cc] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
