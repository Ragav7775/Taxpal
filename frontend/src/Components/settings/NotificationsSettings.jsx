export default function NotificationsSettings() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      <p className="text-gray-600 mb-4">
        Configure your notification preferences.
      </p>

      {/* Example future toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input type="checkbox" />
        </div>
        <div className="flex items-center justify-between">
          <span>Push Notifications</span>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  );
}
