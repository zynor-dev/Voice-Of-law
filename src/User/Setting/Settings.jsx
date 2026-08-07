import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaUser,
  FaBell,
  FaShieldAlt,
  FaCog,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaTrash,
  FaGlobe,
  FaPalette,
  FaDownload,
  FaUpload,
  FaKey,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaLock,
  FaUserShield,
  FaHistory,
  FaQuestionCircle,
} from "react-icons/fa";
import { filesAPI, userAPI } from "../../services/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    province: "",
    courtName: "",
    chamberName: "",
    barCouncilNumber: "",
    bio: "",
    profilePicture: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    caseUpdates: true,
    weeklyDigest: false,
    marketingEmails: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    dataSharing: false
  });

  const settingsTabs = [
    { id: "profile", name: "Profile Settings", icon: <FaUser /> },
    { id: "account", name: "Account Preferences", icon: <FaBell /> },
    { id: "privacy", name: "Privacy & Security", icon: <FaShieldAlt /> },
    { id: "general", name: "General Settings", icon: <FaCog /> },
  ];

  const loginActivity = [
    { device: 'Chrome on Windows', location: 'Karachi, Pakistan', time: '2 minutes ago', current: true },
    { device: 'Mobile App', location: 'Lahore, Pakistan', time: '2 days ago', current: false },
    { device: 'Safari on MacOS', location: 'Islamabad, Pakistan', time: '1 week ago', current: false }
  ];

  const avatarUrl = useMemo(() => {
    const p = profileData.profilePicture;
    if (!p) return "";
    if (String(p).startsWith("http")) return p;
    return filesAPI.getFileUrl(p);
  }, [profileData.profilePicture]);

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await userAPI.getProfile();
        const u = data?.user;
        if (u) {
          setProfileData((prev) => ({
            ...prev,
            fullName: u.fullName || "",
            email: u.email || "",
            phoneNumber: u.phoneNumber || "",
            city: u.city || "",
            province: u.province || "",
            courtName: u.courtName || "",
            chamberName: u.chamberName || "",
            barCouncilNumber: u.barCouncilNumber || "",
            bio: u.bio || "",
            profilePicture: u.profilePicture || "",
          }));
        }
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await userAPI.updateProfile({
        fullName: profileData.fullName,
        city: profileData.city,
        courtName: profileData.courtName,
        province: profileData.province,
        phoneNumber: profileData.phoneNumber,
        barCouncilNumber: profileData.barCouncilNumber,
        chamberName: profileData.chamberName,
        bio: profileData.bio,
      });
      if (data?.user) {
        const merged = { ...profileData, ...data.user };
        setProfileData((prev) => ({ ...prev, ...data.user }));
        localStorage.setItem("user", JSON.stringify(merged));
        localStorage.setItem("voicelaw_user", JSON.stringify(merged));
      }
      setSuccess("Profile updated.");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await userAPI.uploadProfilePicture(file);
      if (data?.user) {
        setProfileData((prev) => ({ ...prev, ...data.user }));
        const merged = { ...profileData, ...data.user };
        localStorage.setItem("user", JSON.stringify(merged));
        localStorage.setItem("voicelaw_user", JSON.stringify(merged));
      }
      setSuccess("Photo updated.");
    } catch (e2) {
      setError(e2.response?.data?.message || "Failed to upload photo.");
    } finally {
      setSaving(false);
      e.target.value = "";
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const renderProfileSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Profile Settings</h2>
        <p>Manage your personal information and profile details</p>
      </div>

      {loading && (
        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            color: "#475569",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          Loading profile…
        </div>
      )}
      {error && (
        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: "12px",
            borderRadius: "12px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      <div className="profile-photo-section">
        <div className="photo-container">
          <div className="profile-photo">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  fontWeight: 700,
                }}
              >
                {profileData.fullName?.charAt(0)?.toUpperCase() ||
                  profileData.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
            )}
            <div className="photo-overlay">
              <FaCamera />
            </div>
          </div>
          <div className="photo-actions">
            <button
              className="photo-btn primary"
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={saving}
            >
              <FaUpload />
              Upload Photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              style={{ display: "none" }}
              onChange={onPickPhoto}
            />
            <button className="photo-btn secondary" type="button" disabled>
              <FaTrash />
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => handleProfileUpdate("fullName", e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileUpdate("email", e.target.value)}
            placeholder="Enter your email"
            disabled
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={profileData.phoneNumber}
            onChange={(e) => handleProfileUpdate("phoneNumber", e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={profileData.city}
            onChange={(e) => handleProfileUpdate("city", e.target.value)}
            placeholder="Enter city"
          />
        </div>

        <div className="form-group">
          <label>Province</label>
          <input
            type="text"
            value={profileData.province}
            onChange={(e) => handleProfileUpdate("province", e.target.value)}
            placeholder="Enter province"
          />
        </div>

        <div className="form-group">
          <label>Court Name</label>
          <input
            type="text"
            value={profileData.courtName}
            onChange={(e) => handleProfileUpdate("courtName", e.target.value)}
            placeholder="Enter court name"
          />
        </div>

        <div className="form-group">
          <label>Chamber Name</label>
          <input
            type="text"
            value={profileData.chamberName}
            onChange={(e) => handleProfileUpdate("chamberName", e.target.value)}
            placeholder="Enter chamber name"
          />
        </div>

        <div className="form-group">
          <label>Bar Council Number</label>
          <input
            type="text"
            value={profileData.barCouncilNumber}
            onChange={(e) =>
              handleProfileUpdate("barCouncilNumber", e.target.value)
            }
            placeholder="Enter bar council number"
          />
        </div>

        <div className="form-group full-width">
          <label>Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleProfileUpdate("bio", e.target.value)}
            placeholder="Tell us about yourself"
            rows="4"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="save-btn" type="button" onClick={saveProfile} disabled={saving}>
          <FaSave />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="cancel-btn"
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderAccountPreferences = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Account Preferences</h2>
        <p>Configure your account settings and notifications</p>
      </div>

      <div className="preferences-card">
        <h3>
          <FaBell className="card-icon" />
          Notification Settings
        </h3>
        <div className="toggle-list">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Email Notifications</h4>
              <p>Receive updates and alerts via email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Push Notifications</h4>
              <p>Get instant notifications on your device</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Case Updates</h4>
              <p>Notifications about your legal cases</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.caseUpdates}
                onChange={(e) => handleNotificationChange('caseUpdates', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Weekly Digest</h4>
              <p>Weekly summary of your activities</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) => handleNotificationChange('weeklyDigest', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Marketing Emails</h4>
              <p>Promotional content and feature updates</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.marketingEmails}
                onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="preferences-card">
        <h3>
          <FaGlobe className="card-icon" />
          Language & Region
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Language</label>
            <select>
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Time Zone</label>
            <select>
              <option value="PKT">Pakistan Standard Time (PKT)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
              <option value="EST">Eastern Standard Time (EST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySecurity = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Privacy & Security</h2>
        <p>Manage your account security and privacy settings</p>
      </div>

      <div className="preferences-card">
        <h3>
          <FaKey className="card-icon" />
          Change Password
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="password-input">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <button className="update-password-btn">
          <FaLock />
          Update Password
        </button>
      </div>

      <div className="preferences-card">
        <h3>
          <FaUserShield className="card-icon" />
          Privacy Settings
        </h3>
        <div className="toggle-list">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Profile Visibility</h4>
              <p>Control who can see your profile information</p>
            </div>
            <select 
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="privacy-select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Show Email Address</h4>
              <p>Allow others to see your email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Show Phone Number</h4>
              <p>Allow others to see your phone number</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Data Sharing</h4>
              <p>Allow anonymous usage data collection</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={privacy.dataSharing}
                onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="preferences-card">
        <h3>
          <FaHistory className="card-icon" />
          Login Activity
        </h3>
        <div className="activity-list">
          {loginActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-info">
                <div className="activity-device">
                 
                  <span>{activity.device}</span>
                  {activity.current && <span className="current-badge">Current</span>}
                </div>
                <div className="activity-details">
                  <span className="location">{activity.location}</span>
                  <span className="time">{activity.time}</span>
                </div>
              </div>
              {!activity.current && (
                <button className="revoke-btn">
                  <FaSignOutAlt />
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>General Settings</h2>
        <p>Customize your user panel experience and preferences</p>
      </div>

      <div className="preferences-card">
        <h3>
          <FaPalette className="card-icon" />
          Appearance
        </h3>
        <div className="appearance-options">
          <div className="theme-selector">
            <label>Theme Preference</label>
            <div className="theme-options">
              <button 
                className={`theme-option ${!isDarkMode ? 'active' : ''}`}
                onClick={() => setIsDarkMode(false)}
              >
                <FaSun />
                <span>Light</span>
              </button>
              <button 
                className={`theme-option ${isDarkMode ? 'active' : ''}`}
                onClick={() => setIsDarkMode(true)}
              >
                <FaMoon />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Sidebar Position</label>
            <select>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="form-group">
            <label>Font Size</label>
            <select>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      <div className="preferences-card">
        <h3>
          <FaDownload className="card-icon" />
          Data Management
        </h3>
        <div className="data-actions">
          <div className="data-item">
            <div className="data-info">
              <h4>Export Data</h4>
              <p>Download a copy of your account data</p>
            </div>
            <button className="data-btn export">
              <FaDownload />
              Export
            </button>
          </div>

          <div className="data-item">
            <div className="data-info">
              <h4>Import Data</h4>
              <p>Upload and restore your account data</p>
            </div>
            <button className="data-btn import">
              <FaUpload />
              Import
            </button>
          </div>

          <div className="data-item danger">
            <div className="data-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all data</p>
            </div>
            <button className="data-btn delete">
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="preferences-card">
        <h3>
          <FaQuestionCircle className="card-icon" />
          Support & Help
        </h3>
        <div className="support-options">
          <button className="support-btn">
            <FaQuestionCircle />
            Help Center
          </button>
          <button className="support-btn">
            <FaBell />
            Contact Support
          </button>
          <button className="support-btn">
            <FaDownload />
            User Manual
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      

      <div className="settings-layout">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-text">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'account' && renderAccountPreferences()}
          {activeTab === 'privacy' && renderPrivacySecurity()}
          {activeTab === 'general' && renderGeneralSettings()}
        </div>
      </div>

      <style>{`
        .settings-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: var(--dashboard-bg);
          height: 100%;
          min-height: 0;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .settings-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .settings-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 0.5rem;
        }

        .settings-header p {
          font-size: 1.1rem;
          color: var(--text-light-grey);
          margin: 0;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 3rem;
          align-items: start;
        }

        .settings-sidebar {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-grey);
          position: sticky;
          top: 2rem;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border: none;
          background: transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          color: var(--text-light-grey);
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(188, 155, 94, 0.1);
          color: var(--accent-gold);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: var(--accent-gold);
          color: white;
          box-shadow: 0 4px 15px rgba(188, 155, 94, 0.3);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-text {
          font-size: 0.95rem;
        }

        .settings-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-grey);
          overflow: hidden;
        }

        .settings-section {
          padding: 2.5rem;
        }

        .section-header {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-grey);
        }

        .section-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 0.5rem;
        }

        .section-header p {
          color: var(--text-light-grey);
          margin: 0;
          font-size: 1rem;
        }

        .profile-photo-section {
          margin-bottom: 2.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(188, 155, 94, 0.05) 0%, rgba(23, 22, 30, 0.05) 100%);
          border-radius: 16px;
          border: 1px solid rgba(188, 155, 94, 0.1);
        }

        .photo-container {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-photo {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid white;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-photo:hover {
          transform: scale(1.05);
        }

        .profile-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: linear-gradient(135deg, #f0f2f5, #e9ecef);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light-grey);
        }

        .photo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .profile-photo:hover .photo-overlay {
          opacity: 1;
        }

        .photo-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .photo-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
        }

        .photo-btn.primary {
          background: var(--accent-gold);
          color: white;
          box-shadow: 0 4px 15px rgba(188, 155, 94, 0.3);
        }

        .photo-btn.primary:hover {
          background: #a68a56;
          transform: translateY(-2px);
        }

        .photo-btn.secondary {
          background: var(--card-bg-light);
          color: var(--text-light-grey);
          border: 1px solid var(--border-grey);
        }

        .photo-btn.secondary:hover {
          background: #fee;
          color: #dc3545;
          border-color: #dc3545;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.875rem 1rem;
          border: 2px solid var(--border-grey);
          border-radius: 12px;
          font-size: 1rem;
          color: var(--text-dark);
          background: white;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 3px rgba(188, 155, 94, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .password-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input input {
          flex: 1;
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: var(--text-light-grey);
          cursor: pointer;
          font-size: 1.1rem;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: var(--text-dark);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-grey);
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--accent-gold);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(188, 155, 94, 0.3);
        }

        .save-btn:hover {
          background: #a68a56;
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: var(--card-bg-light);
          color: var(--text-light-grey);
          border: 1px solid var(--border-grey);
          padding: 0.875rem 2rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #f8f9fa;
          color: var(--text-dark);
        }

        .preferences-card {
          background: rgba(248, 249, 250, 0.5);
          border: 1px solid var(--border-grey);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .preferences-card:last-child {
          margin-bottom: 0;
        }

        .preferences-card h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-dark);
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 1.5rem;
        }

        .card-icon {
          color: var(--accent-gold);
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .toggle-info h4 {
          color: var(--text-dark);
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }

        .toggle-info p {
          color: var(--text-light-grey);
          font-size: 0.9rem;
          margin: 0;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 54px;
          height: 28px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 28px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-gold);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .privacy-select {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-grey);
          border-radius: 8px;
          background: white;
          color: var(--text-dark);
          cursor: pointer;
        }

        .update-password-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1.5rem;
        }

        .update-password-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .activity-device {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .device-icon {
          color: var(--accent-gold);
        }

        .current-badge {
          background: #28a745;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .activity-details {
          display: flex;
          gap: 1rem;
          color: var(--text-light-grey);
          font-size: 0.9rem;
        }

        .revoke-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          color: #dc3545;
          border: 1px solid #dc3545;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .revoke-btn:hover {
          background: #dc3545;
          color: white;
        }

        .appearance-options {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .theme-selector {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .theme-selector label {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 0.95rem;
        }

        .theme-options {
          display: flex;
          gap: 1rem;
        }

        .theme-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 2rem;
          border: 2px solid var(--border-grey);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.5rem;
          color: var(--text-light-grey);
        }

        .theme-option:hover {
          border-color: var(--accent-gold);
          color: var(--accent-gold);
        }

        .theme-option.active {
          border-color: var(--accent-gold);
          background: rgba(188, 155, 94, 0.1);
          color: var(--accent-gold);
        }

        .theme-option span {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .data-actions {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .data-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .data-item.danger {
          border-color: rgba(220, 53, 69, 0.2);
          background: rgba(220, 53, 69, 0.02);
        }

        .data-info h4 {
          color: var(--text-dark);
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }

        .data-item.danger .data-info h4 {
          color: #dc3545;
        }

        .data-info p {
          color: var(--text-light-grey);
          font-size: 0.9rem;
          margin: 0;
        }

        .data-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
        }

        .data-btn.export {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .data-btn.import {
          background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
          color: white;
        }

        .data-btn.delete {
          background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%);
          color: white;
        }

        .data-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .support-options {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .support-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--card-bg-light);
          border: 1px solid var(--border-grey);
          color: var(--text-dark);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .support-btn:hover {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .settings-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .settings-sidebar {
            position: static;
          }

          .settings-nav {
            flex-direction: row;
            overflow-x: auto;
            gap: 0.25rem;
          }

          .nav-item {
            min-width: 140px;
            justify-content: center;
            text-align: center;
            flex-direction: column;
            padding: 0.75rem 0.5rem;
            gap: 0.5rem;
          }

          .nav-text {
            font-size: 0.8rem;
          }

          .settings-section {
            padding: 1.5rem;
          }

          .section-header {
            margin-bottom: 2rem;
          }

          .section-header h2 {
            font-size: 1.5rem;
          }

          .photo-container {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .profile-photo {
            align-self: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .theme-options {
            justify-content: center;
          }

          .support-options {
            flex-direction: column;
          }

          .data-item,
          .toggle-item,
          .activity-item {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .settings-header h1 {
            font-size: 2rem;
          }

          .preferences-card {
            padding: 1.5rem;
          }

          .nav-item {
            min-width: 120px;
          }

          .nav-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;
