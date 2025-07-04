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
import CompanyDetailsModal from "./CompanyDetailsModal";
import ChangeStatusCompany from "./ChangeStatusCompany";

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
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
  const [selectedCompanyStatus, setSelectedCompanyStatus] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleChangeStatus = async (company_id, newStatus) => {
    setIsStatusLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/all-companies/change-status/${company_id}`,
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

      if (selectedCompanyStatus?.status === "active") {
        showSuccessToast(
          `${selectedCompanyStatus.COMPANY_NAME} has been deactivated. They will no longer have access.`,
        );
      } else {
        showSuccessToast(
          `${selectedCompanyStatus.COMPANY_NAME} has been reactivated. Access has been restored.`,
        );
      }
      fetchCompanies();
    } catch (error) {
      setIsStatusLoading(false);
      console.error("Error changing status:", error);
    }
  };

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
        setSelectedCompany={(company) => {
          setSelectedCompany(company);
        }}
        setShowCompanyDetails={setShowCompanyDetails}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setShowChangePassword={setShowChangePassword}
        setOpenChangeStatusModal={setOpenChangeStatusModal}
        setSelectedCompanyStatus={setSelectedCompanyStatus}
      />
      {/* Company Details Modal */}
      <CompanyDetailsModal
        isOpen={showCompanyDetails}
        onClose={() => setShowCompanyDetails(false)}
        company={selectedCompany}
        token={token}
      />

      {/* Change Password Modal */}
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

      {/* Change Password Modal */}
      <AnimatePresence>
        <ChangeStatusCompany
          openModal={openChangeStatusModal}
          setOpenModal={setOpenChangeStatusModal}
          company={selectedCompanyStatus}
          handleChangeStatus={handleChangeStatus}
          isLoading={isStatusLoading}
        />
      </AnimatePresence>
    </div>
  );
};

export default CompanyProfiles;
