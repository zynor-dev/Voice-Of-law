import React from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaGavel,
  FaIdCard,
} from "react-icons/fa";

const ProfileCard = ({ userData }) => {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://api.voiceoflaws.com";

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (!userData?.profilePicture) {
      return null;
    }
    if (userData.profilePicture.startsWith("http")) {
      return userData.profilePicture;
    }
    return `${API_BASE_URL}${userData.profilePicture}`;
  };

  const profilePictureUrl = getProfilePictureUrl();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt={userData?.fullName || "Profile"}
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <FaUser className="text-white text-3xl" />
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="flex-grow">
          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {userData?.fullName || "User Name"}
          </h2>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
            {/* Registration Date */}
            {userData?.createdAt && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">Дата регистрации:</span>{" "}
                <span className="font-medium">
                  {new Date(userData.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            )}

            {/* Location */}
            {(userData?.province || userData?.city) && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">Страна, город:</span>{" "}
                <span className="font-medium">
                  {[userData.province, userData.city]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            {/* Birth Date - Using trial end date as placeholder since birth date isn't in schema */}
            {userData?.trialEndDate && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">Дата рождения:</span>{" "}
                <span className="font-medium">
                  {new Date(userData.trialEndDate).toLocaleDateString("ru-RU")}
                </span>
              </div>
            )}

            {/* Email */}
            {userData?.email && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">E-mail:</span>{" "}
                <span className="font-medium">{userData.email}</span>
              </div>
            )}

            {/* Phone Number */}
            {userData?.phoneNumber && (
              <div className="text-sm text-gray-600 col-span-1 md:col-span-2">
                <span className="text-gray-500">Телефон:</span>{" "}
                <span className="font-medium">{userData.phoneNumber}</span>
              </div>
            )}

            {/* Court Name */}
            {userData?.courtName && (
              <div className="text-sm text-gray-600 col-span-1 md:col-span-2">
                <span className="text-gray-500">Court Name:</span>{" "}
                <span className="font-medium">{userData.courtName}</span>
              </div>
            )}

            {/* Bar Council Number */}
            {userData?.barCouncilNumber && (
              <div className="text-sm text-gray-600 col-span-1 md:col-span-2">
                <span className="text-gray-500">Bar Council Number:</span>{" "}
                <span className="font-medium">{userData.barCouncilNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
