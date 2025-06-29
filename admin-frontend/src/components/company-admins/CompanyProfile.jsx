import { motion } from "framer-motion";

export const CompanyProfileTab = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
  >
    <h2 className="mb-4 text-lg font-medium">Company Profile</h2>
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Company Name</label>
        <p className="rounded-lg border border-gray-200 p-2">TechCorp Inc.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Admin Email</label>
        <p className="rounded-lg border border-gray-200 p-2">
          admin@techcorp.com
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Total Managers</label>
        <p className="rounded-lg border border-gray-200 p-2">24</p>
      </div>
    </div>
  </motion.div>
);
