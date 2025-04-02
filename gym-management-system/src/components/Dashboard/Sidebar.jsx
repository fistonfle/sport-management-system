import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SidePanel = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Track the logout confirmation modal state

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    // Clear authentication tokens or user session
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "/login";
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  return (
    <div className="flex flex-col h-screen justify-between">
      {/* Logo Section */}
      <div className="flex justify-center items-center py-6">
        <img
          src="/icons/logo.png" // Path to your logo image
          alt="Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation Section */}
      <nav className="space-y-6 text-[#6b7280]">
        {[
          { to: "/Dashboard", label: "Dashboard", icon: "/icons/homic.png" },
          { to: "/plans", label: "Plans", icon: "/icons/plansic.png" },
          { to: "/trainers", label: "Trainers", icon: "/icons/trainees-icon.png" },
          { to: "/Clients", label: "Clients", icon: "/icons/members-icon.png" },
        ].map((tab) => (
          <motion.div
            key={tab.to}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to={tab.to}
              onClick={() => handleTabClick(tab.to)}
              className={`p-3 rounded-lg flex items-center ${
                activeTab === tab.to
                  ? "bg-[#e6ebff] text-[#1a1a40]"
                  : "hover:bg-[#e6ebff]"
              }`}
            >
              <img src={tab.icon} alt={tab.label} className="h-8 w-8 mr-2" />
              <span>{tab.label}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-8">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button
            onClick={openLogoutModal}
            className="w-full flex items-center p-2 rounded-md bg-[#f8d7da] text-[#721c24] hover:bg-[#f5c6cb] shadow"
          >
            <img
              src="/icons/logout-icon.png"
              alt="Logout"
              className="h-6 w-6 mr-2"
            />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#f8d7da] text-[#721c24] rounded-md hover:bg-[#f5c6cb]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
