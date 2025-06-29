import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "../../components/common/Header";
import { FiUsers, FiUserPlus, FiBriefcase } from "react-icons/fi";
import { ManagersTab } from "../../components/company-admins/ManagerTabs";
import { AddManagerTab } from "../../components/company-admins/AddManagerTab";
import { CompanyProfileTab } from "../../components/company-admins/CompanyProfile";

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-center font-medium transition-colors ${active ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]" : "text-gray-500"}`}
  >
    <div className="flex items-center justify-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
  </button>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("managers");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 flex border-b bg-white shadow-sm">
        <TabButton
          active={activeTab === "managers"}
          onClick={() => setActiveTab("managers")}
          icon={<FiUsers />}
          label="Managers"
        />
        <TabButton
          active={activeTab === "add"}
          onClick={() => setActiveTab("add")}
          icon={<FiUserPlus />}
          label="Add New"
        />
        <TabButton
          active={activeTab === "company"}
          onClick={() => setActiveTab("company")}
          icon={<FiBriefcase />}
          label="Company"
        />
      </div>

      {/* Tab Content */}
      <main className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "managers" && <ManagersTab />}
          {activeTab === "add" && <AddManagerTab />}
          {activeTab === "company" && <CompanyProfileTab />}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
