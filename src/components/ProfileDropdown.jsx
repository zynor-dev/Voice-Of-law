import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://api.voiceoflaws.com";

  const getProfilePictureUrl = () => {
    if (!user?.profilePicture) {
      return null;
    }
    if (user.profilePicture.startsWith("http")) {
      return user.profilePicture;
    }
    return `${API_BASE_URL}${user.profilePicture}`;
  };

  const profilePictureUrl = getProfilePictureUrl();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={user?.fullName || "Profile"}
            className="w-9 h-9 rounded-full object-cover border-2 border-purple-300"
          />
        ) : (
          <FaUserCircle className="text-gray-300 text-3xl hover:text-white transition-colors" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={user?.fullName || "Profile"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile or show profile modal
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FaUser className="text-gray-400" />
              View Profile
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FaCog className="text-gray-400" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <FaSignOutAlt className="text-red-500" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
