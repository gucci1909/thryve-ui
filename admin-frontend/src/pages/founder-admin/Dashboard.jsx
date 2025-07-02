import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Briefcase, User, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { Toaster } from "react-hot-toast";
import AddCompanyTab from "../../components/founder-admin/AddCompanyTab";
import StatCard from "../../components/company-admin/StatCard";
import ManagerTabs from "../../components/company-admin/ManagerTabs";
import Sidebar from "../../components/common/Sidebar";
import CompanyProfiles from "../../components/founder-admin/CompanyProfiles";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all-companies");
  const [dashboardData, setDashboardData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, firstName } = useSelector((state) => state.user);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isSearching = searchTerm !== debouncedSearchTerm;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all-companies/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.companies && data.companies.length > 0) {
        setCompanies(data.companies);
        // Set the first company as default
        if (!selectedCompany) {
          setSelectedCompany(data.companies[0]);
        }
      } else {
        showErrorToast("No companies found");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      showErrorToast("Failed to fetch companies. Please try again.");
    }
  };

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
    setIsDropdownOpen(false);
  };

  const handleCompanyInviteSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/invite-companies/hr-invite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.status === 401) {
        dispatch(logout());
        navigate("/");
        return;
      }

      const data = await response.json();
      if (data.message) {
        showSuccessToast("Manager invitation sent successfully! 🎉");
        // Refresh companies list after adding new one
        fetchCompanies();
        return data;
      } else {
        showErrorToast(data.error || "Failed to send invitation");
        throw new Error(data.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting company:", error);
      showErrorToast("Failed to send invitation. Please try again.");
      throw error;
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedCompany) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/manager-dashboard?companyId=${selectedCompany._id}`,
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
    if (!selectedCompany) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/managers/all-managers?companyId=${selectedCompany._id}&search=${debouncedSearchTerm}&sort=${sortBy}&page=${currentPage}&limit=6`,
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
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchDashboardData();
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (activeTab === "all-companies" && selectedCompany) {
      fetchManagers();
    }
  }, [activeTab, selectedCompany, debouncedSearchTerm, sortBy, currentPage]);

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
      label: "All Managers",
      icon: <Briefcase size={20} />,
    },
    {
      id: "add-company",
      label: "Add New Company",
      icon: <Building size={20} />,
    },
    {
      id: "founder-profile",
      label: "Company Profiles",
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
        setIsDropdownOpen={setIsDropdownOpen}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-gray-900">
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Manage your team and monitor their progress
                </p>
              </div>

              {/* Company Dropdown */}
              {selectedCompany && activeTab === "all-companies" && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-[300px] cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">
                        {selectedCompany.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        INVITE-CODE: {selectedCompany.invite_code}
                      </span>
                    </div>
                    <ChevronDown
                      className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ring-opacity-5 absolute right-0 z-50 mt-2 w-[300px] origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black"
                      >
                        <div className="max-h-96 overflow-auto py-1">
                          <div className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Select Company
                          </div>
                          {companies.map((company) => (
                            <motion.button
                              key={company._id}
                              // whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleCompanyChange(company)}
                              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm ${
                                company._id === selectedCompany._id
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {company.name}
                                </span>
                                <div className="mt-1 flex items-center">
                                  <span className="mr-2 rounded bg-gray-100 px-2 py-0.5 text-xs">
                                    {company.invite_code}
                                  </span>
                                </div>
                              </div>
                              {company._id === selectedCompany._id && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "all-companies" && (
              <motion.div
                key="all-companies"
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
                  activeTab={activeTab}
                  companyId={selectedCompany?._id}
                  onStatusChange={fetchManagers}
                />
              </motion.div>
            )}

            {activeTab === "add-company" && (
              <motion.div
                key="add-company"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AddCompanyTab onSubmit={handleCompanyInviteSubmit} />
              </motion.div>
            )}

            {activeTab === "founder-profile" && (
              <motion.div
                key="founder-profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <CompanyProfiles />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
