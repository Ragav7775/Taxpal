import { useState } from "react";
import SettingsSidebar from "../Components/settings/SettingsSidebar";
import CategoriesSettings from "../Components/settings/CategoriesSettings";
import ProfileSettings from "../Components/settings/ProfileSettings";
import NotificationsSettings from "../Components/settings/NotificationsSettings";
import SecuritySettings from "../Components/settings/SecuritySettings";


export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("Profile");

  const renderContent = () => {
    switch (activeMenu) {
      case "Profile":
        return <ProfileSettings />;
      case "Categories":
        return <CategoriesSettings />;
      case "Notifications":
        return <NotificationsSettings />;
      case "Security":
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Settings</h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage your account settings and preferences
      </p>

      <div className="flex gap-3">
        <SettingsSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="bg-white w-full rounded-xl p-6 shadow-customShadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
