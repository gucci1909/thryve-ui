import { motion } from "framer-motion";

export const AddManagerTab = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
  >
    <h2 className="mb-4 text-lg font-medium">Add New Manager</h2>
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Full Name</label>
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 p-2"
          placeholder="Enter name"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded-lg border border-gray-300 p-2"
          placeholder="Enter email"
        />
      </div>
      <button className="w-full rounded-lg bg-[var(--primary-color)] py-2 text-white">
        Invite Manager
      </button>
    </div>
  </motion.div>
);
