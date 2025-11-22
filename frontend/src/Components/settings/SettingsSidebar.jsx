import { FaUserCircle, FaTags, FaBell, FaShieldAlt } from "react-icons/fa";

export default function SettingsSidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { key: "Profile", label: "Profile", icon: <FaUserCircle /> },
    { key: "Categories", label: "Categories", icon: <FaTags /> },
    { key: "Notifications", label: "Notifications", icon: <FaBell /> },
    { key: "Security", label: "Security", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="bg-blue-50 w-1/3 h-[calc(100vh-120px)] rounded-xl p-4 shadow-customShadow">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveMenu(item.key)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${
              activeMenu === item.key
                ? "bg-white font-semibold shadow-sm"
                : "hover:bg-white/70 text-gray-600"
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
