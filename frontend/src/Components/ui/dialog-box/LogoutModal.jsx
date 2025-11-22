import { FaTimes } from "react-icons/fa";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[clamp(300px,80vw,400px)]">
        {/* Header */}
        <div className="flex justify-between items-center relative border-gray-200 pb-3 mb-5">
          <button
            className="text-gray-500 hover:text-gray-700 right-0 absolute cursor-pointer"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14a2 2 0 01-2 2h-4a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v14z"
                />
              </svg>
            </div>
          </div>

                  <h4 className="text-lg font-bold text-center w-full">You are about to log out</h4>
          <p className="text-sm text-gray-600">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-bold hover:bg-gray-100 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
