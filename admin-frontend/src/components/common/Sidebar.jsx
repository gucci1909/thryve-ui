import { motion } from "framer-motion";
import { LogOut, ChevronRight } from "lucide-react";

function Sidebar({ sidebarItems, activeTab, setActiveTab, handleLogout, setIsDropdownOpen }) {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="relative w-72 bg-white shadow-2xl"
    >
      <div className="border-b border-gray-100 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0029ff] to-[#1a4bff] shadow-lg">
            <img
              src="/logo-thryve.png"
              alt="Thryve Logo"
              className="h-8 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#0029ff]">thryve</h1>
        </div>
      </div>

      <nav className="space-y-3 p-6">
        {sidebarItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsDropdownOpen(false);
              setActiveTab(item.id);
            }}
            className={`flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-4 text-left transition-all duration-200 ${
              activeTab === item.id
                ? "bg-gradient-to-r from-[#0029ff] to-[#1a4bff] text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#0029ff]"
            }`}
          >
            {item.icon}
            <span className="font-semibold">{item.label}</span>
            {activeTab === item.id && (
              <ChevronRight className="ml-auto" size={20} />
            )}
          </motion.button>
        ))}
      </nav>

      <div className="absolute right-6 bottom-6 left-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-4 rounded-xl px-6 py-4 text-left text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Sidebar;
