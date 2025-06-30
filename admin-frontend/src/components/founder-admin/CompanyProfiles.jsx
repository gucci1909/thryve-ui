import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useDebounce } from "../../hooks/useDebounce";
import ChangePassword from "./ChangePassword";
import CompanyTable from "./CompanyTable";

const CompanyProfiles = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/all-companies/details?search=${debouncedSearchTerm}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.companies) {
        setCompanies(data.companies);
      } else {
        showErrorToast("Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      showErrorToast("Failed to fetch companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearchTerm, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for the current field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Real-time validation for password matching
    if (name === "newPassword" || name === "confirmPassword") {
      const newPassword =
        name === "newPassword" ? value : passwordForm.newPassword;
      const confirmPassword =
        name === "confirmPassword" ? value : passwordForm.confirmPassword;

      if (confirmPassword && newPassword !== confirmPassword) {
        setPasswordErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (confirmPassword && newPassword === confirmPassword) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsPasswordLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/all-companies/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: selectedCompany?._id || "",
            newPassword: passwordForm.newPassword,
          }),
        },
      );

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.message) {
        showSuccessToast("Password changed successfully!");
        setShowChangePassword(false);
        setPasswordForm({
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showErrorToast("Failed to change password. Please try again.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Profiles</h2>
          <p className="text-gray-600">
            View and manage all company information
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-gray-600 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <CompanyTable
        loading={loading}
        companies={companies}
        setSelectedCompany={setSelectedCompany}
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        setShowChangePassword={setShowChangePassword}
      />

      {/* Company Detail Modal */}
      {/* <AnimatePresence>
        {selectedCompany && !showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-gray-500 opacity-75"
                  onClick={() => setSelectedCompany(null)}
                ></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedCompany.COMPANY_NAME}
                      </h3>
                      <div className="mt-2">
                        <div className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
                          <div>
                            <p className="text-sm text-gray-500">Invite Code</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany.INVITE_CODE}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Company ID</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany._id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Daily Points Streak
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany.POINTSSTREAKPERDAY}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Coaching Points
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany.CoachingChatInteractionPoint}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Learning Points
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany.LearningPlanInteractionPoint}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Reflection Points
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany.ReflectionInteractionPoint}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Roleplay Points
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedCompany.RoleplayInteractionPoint}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">About Company</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCompany.ABOUT_TEXT}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setSelectedCompany(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <AnimatePresence>
        {showChangePassword && selectedCompany && (
          <ChangePassword
            setShowChangePassword={setShowChangePassword}
            selectedCompany={selectedCompany}
            handlePasswordSubmit={handlePasswordSubmit}
            passwordForm={passwordForm}
            handlePasswordChange={handlePasswordChange}
            passwordErrors={passwordErrors}
            isPasswordLoading={isPasswordLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyProfiles;
