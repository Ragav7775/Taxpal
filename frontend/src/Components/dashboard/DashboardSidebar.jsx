import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSync,
  FaChartPie,
  FaFileAlt,
  FaSignOutAlt,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import LogoutModal from "../ui/dialog-box/LogoutModal";
import Taxpal_logo from "../../assets/Taxpal-Logo.png";
import { useUserData } from "../../hooks/useUserData";

const SidebarItem = ({ icon, text, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-2 mb-2 rounded-lg cursor-pointer transition-colors
      ${active ? "bg-customBlue text-white font-semibold" : "text-gray-700 hover:bg-blue-200 hover:text-blue-600"}`}
  >
    {icon}
    <span className="text-sm">{text}</span>
  </div>
);

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const userData = useUserData();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("overdueCheckDone");
    localStorage.removeItem("CurrencySymbol");
    localStorage.removeItem("Country");
    navigate("/SignIn");
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-56 bg-[#F3F8FF] p-4 flex flex-col justify-between rounded-2xl h-screen shadow-sm">
        {/* Top Section */}
        <div>
          <h1 className="text-2xl font-bold text-center flex items-center gap-1 justify-center mb-4 text-black">
            <img src={Taxpal_logo} alt="Taxpal Logo" className="w-10 h-10" />
            TaxPal
          </h1>
          <div className="h-0.5 bg-gray-400 rounded-full mb-4" />

          {/* Navigation Items */}
          <SidebarItem
            icon={<FaHome />}
            text="Dashboard"
            active={location.pathname === "/Dashboard"}
            onClick={() => navigate("/Dashboard")}
          />
          <SidebarItem
            icon={<FaSync />}
            text="Transactions"
            active={location.pathname === "/Dashboard/Transactions"}
            onClick={() => navigate("/Dashboard/Transactions")}
          />
          <SidebarItem
            icon={<FaChartPie />}
            text="Budgets"
            active={location.pathname === "/Dashboard/Budgets"}
            onClick={() => navigate("/Dashboard/Budgets")}
          />
          <SidebarItem
            icon={<FaFileAlt />}
            text="Tax Estimator"
            active={
              location.pathname === "/Dashboard/TaxEstimator" ||
              location.pathname === "/Dashboard/TaxEstimator/TaxCalendar"
            }
            onClick={() => navigate("/Dashboard/TaxEstimator")}
          />
          <SidebarItem
            icon={<FaFileAlt />}
            text="Reports"
            active={location.pathname === "/Dashboard/Reports"}
            onClick={() => navigate("/Dashboard/Reports")}
          />
        </div>

        {/* Bottom Section */}
        <div>
          <div className="h-0.5 bg-gray-400 mb-4" />
          <div className="flex items-center mb-3 px-2">
            <FaUserCircle size={30} className="text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-bold">{userData?.name || "User"}</p>
              <p className="text-xs text-gray-500">{userData?.email}</p>
            </div>
          </div>
          <SidebarItem
            icon={<FaCog />}
            text="Settings"
            active={location.pathname === "/Dashboard/Settings"}
            onClick={() => navigate("/Dashboard/Settings")}
          />
          <SidebarItem
            icon={<FaSignOutAlt />}
            text="Logout"
            onClick={() => setIsLogoutOpen(true)}
          />
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
