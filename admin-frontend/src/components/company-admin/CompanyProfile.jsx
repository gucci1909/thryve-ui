import { motion } from "framer-motion";
import { Building } from "lucide-react";

function CompanyProfile({ dashboardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
            <Building className="text-white" size={32} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Company Profile
          </h2>
          <p className="text-gray-600">Your company information and settings</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Company Name
            </label>
            <p className="text-lg text-gray-900">Your Company Name</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Company Code
            </label>
            <p className="text-lg text-gray-900">
              {dashboardData?.highestStreakUser?.companyId || "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Total Users
            </label>
            <p className="text-lg text-gray-900">
              {dashboardData?.totalUsers || 0}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CompanyProfile;
