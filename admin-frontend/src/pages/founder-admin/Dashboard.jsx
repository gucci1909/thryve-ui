import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Building, Briefcase, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import AddCompanyTab from "../../components/founder-admin/AddCompanyTab";
import StatCard from "../../components/company-admin/StatCard";
import ManagerTabs from "../../components/company-admin/ManagerTabs";
import CompanyProfile from "../../components/company-admin/CompanyProfile";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/common/Sidebar";

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
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, firstName } = useSelector((state) => state.user);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isSearching = searchTerm !== debouncedSearchTerm;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 254) return "Email is too long";
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name is too long";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return "";
  };

  const validateForm = () => {
    const errors = {
      name: validateName(inviteForm.name),
      email: validateEmail(inviteForm.email),
    };

    setFormErrors(errors);
    const isValid = Object.values(errors).every((error) => error === "");
    setIsFormValid(isValid);
    return isValid;
  };

  const handleFormChange = (field, value) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast("Please fix the errors in the form");
      return;
    }

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

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      console.log("Invite response:", data);
      if (data.success) {
        showSuccessToast("Manager invitation sent successfully! 🎉");
        setInviteForm({
          name: "",
          email: "",
        });
        setFormErrors({});
        setIsFormValid(false);
      } else {
        showErrorToast(data.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting manager:", error);
      showErrorToast("Failed to send invitation. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

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

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }
      const data = await response.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

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

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "all-managers") {
      fetchManagers();
    }
  }, [activeTab, debouncedSearchTerm, sortBy, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const sidebarItems = [
    {
      id: "all-companies",
      label: "All Companies",
      icon: <Briefcase size={20} />,
    },
    {
      id: "add-company",
      label: "Add New Company",
      icon: <Building size={20} />,
    },
    {
      id: "founder-profile",
      label: "Founder Profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            duration: 0,
          },
          loading: {
            duration: 0,
          },
        }}
      />
      <Sidebar
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

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
                <StatCard
                  totalUsers={totalUsers}
                  dashboardData={dashboardData}
                />
                <ManagerTabs
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isSearching={isSearching}
                  loading={loading}
                  managers={managers}
                  setSortBy={setSortBy}
                  sortBy={sortBy}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
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
                <AddCompanyTab
                  handleInviteSubmit={handleInviteSubmit}
                  inviteForm={inviteForm}
                  handleFormChange={handleFormChange}
                  formErrors={formErrors}
                  inviteLoading={inviteLoading}
                />
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
                <CompanyProfile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
