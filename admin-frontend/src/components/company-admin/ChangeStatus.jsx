import { motion } from "framer-motion";
import { Lock, RefreshCw, Power, X } from "lucide-react";

const ChangeStatus = ({
  openModal,
  setOpenModal,
  manager,
  handleChangeStatus,
  isLoading
}) => {
  if (!openModal ) {
    return null;
  }
  
  const status = manager.status === "active" ? "Deactivate" : "Reactivate";
  const isDeactivating = manager.status === "active";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop (behind modal) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }} // Reduced opacity for better visibility
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-500"
        onClick={() => setOpenModal(false)}
      />

      {/* Modal Container (centered) */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="relative z-50 w-full max-w-md rounded-lg bg-white shadow-xl" // z-50 ensures modal is above backdrop
        >
          {/* Modal Content */}
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                <Lock className="h-6 w-6 text-[#0029ff]" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isDeactivating ? "Deactivate Manager" : "Reactivate Manager"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to {status.toLowerCase()} {manager.name}
                  ?
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setOpenModal(false)}
                className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#0029ff] focus:outline-none"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={isLoading}
                onClick={() => handleChangeStatus(manager._id, !isDeactivating)}
                className={`flex cursor-pointer items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                  isDeactivating
                    ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 focus:ring-red-500"
                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 focus:ring-green-500"
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Power className="mr-2 h-4 w-4" />
                )}
                {status}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChangeStatus;
