import { motion } from "framer-motion";
import { Lock, RefreshCw } from "lucide-react";
import PasswordInput from "../common/PasswordInput";

function ChangePassword({
  setShowChangePassword,
  selectedCompany,
  handlePasswordSubmit,
  passwordForm,
  handlePasswordChange,
  passwordErrors,
  isPasswordLoading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop - separate from the modal content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-500"
        onClick={() => setShowChangePassword(false)}
      ></motion.div>

      {/* Modal content */}
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="inline-block w-full max-w-md transform text-left align-middle shadow-xl transition-all sm:my-8"
        >
          <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-center gap-4 sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Change Password for {selectedCompany.COMPANY_NAME}'s HR
              </h3>
            </div>
            <div className="flex">
              <div className="mt-3 w-full">
                <div className="mt-2">
                  <form onSubmit={handlePasswordSubmit}>
                    {/* New Password Input */}
                    <PasswordInput
                      id="newPassword"
                      label="New Password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      error={passwordErrors.newPassword}
                      showError={!!passwordErrors.newPassword}
                      disabled={isPasswordLoading}
                      className="mb-4"
                    />

                    {/* Confirm Password Input */}
                    <PasswordInput
                      id="confirmPassword"
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      error={passwordErrors.confirmPassword}
                      showError={!!passwordErrors.confirmPassword}
                      disabled={!passwordForm.newPassword || isPasswordLoading}
                      className="mb-4"
                    />

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={isPasswordLoading}
                        className="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        {isPasswordLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Changing Password...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isPasswordLoading}
                        className="mt-3 inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setShowChangePassword(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ChangePassword;
