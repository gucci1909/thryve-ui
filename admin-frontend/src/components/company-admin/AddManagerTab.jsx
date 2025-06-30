import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  BarChart2,
  User,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";

function AddManagerTab({
  handleInviteSubmit,
  inviteForm,
  handleFormChange,
  formErrors,
  inviteLoading,
  totalUsers,
  dashboardData,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30"
    >
     
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-center"
        >
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-[#0029ff]"
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-2xl">
              <UserPlus className="text-white" size={32} />
            </div>
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-[#0029ff] to-[#1a4bff] bg-clip-text text-4xl font-bold text-transparent">
            Add New Manager
          </h1>
          <p className="text-lg text-gray-600">
            Invite a talented manager to join your team and boost productivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
              {/* Animated background elements */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50"></div>
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-50"></div>

              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Manager Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fill in the details below
                    </p>
                  </div>
                </div>

                <form onSubmit={handleInviteSubmit} className="space-y-6">
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={inviteForm.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        className={`w-full rounded-xl border ${
                          formErrors.name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-white"
                        } px-4 py-3 pl-12 text-gray-600 transition-all duration-200 focus:border-[#0029ff] focus:ring-2 focus:ring-[#0029ff]/20 focus:outline-none`}
                        placeholder="Enter manager's full name"
                        required
                      />
                    </div>
                    {formErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.name}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={inviteForm.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        className={`w-full rounded-xl border ${
                          formErrors.email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-white"
                        } px-4 py-3 pl-12 text-gray-600 transition-all duration-200 focus:border-[#0029ff] focus:ring-2 focus:ring-[#0029ff]/20 focus:outline-none`}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    {formErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-1 text-sm text-red-500"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={inviteLoading}
                      className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-[#0029ff] to-[#1a4bff] px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-[#0029ff]/25 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#1a4bff] to-[#0029ff] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {inviteLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                            />
                            <span>Sending Invitation...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            <span>Send Manager Invitation</span>
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Benefits Card */}
            <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Zap className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Benefits</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#0029ff]"></div>
                  <p className="text-sm text-gray-600">
                    Enhanced team collaboration
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#0029ff]"></div>
                  <p className="text-sm text-gray-600">
                    Improved productivity tracking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#0029ff]"></div>
                  <p className="text-sm text-gray-600">
                    Better performance insights
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#0029ff]"></div>
                  <p className="text-sm text-gray-600">
                    Streamlined communication
                  </p>
                </div>
              </div>
            </div>

            {/* Process Card */}
            <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <Shield className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Process</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0029ff] text-sm font-bold text-white">
                    1
                  </div>
                  <p className="text-sm text-gray-600">Fill manager details</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0029ff] text-sm font-bold text-white">
                    2
                  </div>
                  <p className="text-sm text-gray-600">Send invitation email</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0029ff] text-sm font-bold text-white">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Manager joins platform
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                  <BarChart2 className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Managers</span>
                  <span className="font-bold text-[#0029ff]">{totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Today</span>
                  <span className="font-bold text-green-600">
                    {dashboardData?.totalUsers
                      ? Math.floor(dashboardData.totalUsers * 0.8)
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg. Performance
                  </span>
                  <span className="font-bold text-purple-600">85%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AddManagerTab;
