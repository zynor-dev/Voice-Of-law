import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaChevronDown, FaUpload, FaFileAlt, FaStickyNote, FaCheck, FaClock, FaSpinner, FaFileContract, FaUserTie, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/CaseNavbar.css';

const CaseNavbar = ({ activeSection, setActiveSection, onBack, onStatusChange, currentStatus, loadingStatus }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  const menuSections = [
    {
      id: 'case-information',
      name: 'Case Information',
      subsections: [
        { id: 'party-information', name: 'Party Information', icon: <FaUsers /> },
        { id: 'case-info', name: 'Case Information', icon: <FaFileContract /> },
        { id: 'advocate-information', name: 'Advocate Information', icon: <FaUserTie /> },
      ],
    },
    {
      id: 'drafts',
      name: 'Drafts',
      icon: <FaFileAlt />,
      subsections: [{ id: 'upload-drafts', name: 'Upload Drafts' }],
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: <FaStickyNote />,
      subsections: [{ id: 'add-note', name: 'Add New Note' }],
    },
    {
      id: 'discussion',
      name: 'Discussion',
      icon: <FaFileAlt />,
      subsections: [],
    },
  ];

  const handleDropdownToggle = (sectionId) => {
    setDropdownOpen(dropdownOpen === sectionId ? null : sectionId);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  const handleSubSectionClick = (sectionId, subSectionId) => {
    setActiveSection(subSectionId);
    setDropdownOpen(null);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed-topbar" ref={dropdownRef}>
      <div className="topbar-container">
        <div className="case-title-section">
          <button className="back-btn" onClick={onBack || (() => navigate(-1))}>
            <FaArrowLeft />
          </button>
          <h2>Case Information</h2>
        </div>

        <div className="nav-buttons-container">
          {menuSections.map((section) => (
            <div key={section.id} className="nav-btn-wrapper">
              <button
                className={`nav-btn ${activeSection === section.id || section.subsections.some(sub => sub.id === activeSection) ? 'active' : ''}`}
                onClick={() => section.subsections.length > 0 ? handleDropdownToggle(section.id) : handleSubSectionClick(section.id, section.id)}
              >
                {section.name}
                {section.subsections.length > 0 && <FaChevronDown className="dropdown-arrow" />}
              </button>
              {section.subsections.length > 0 && dropdownOpen === section.id && (
                <div className="dropdown-menu">
                  {section.subsections.map((sub) => (
                    <div
                      key={sub.id}
                      className={`dropdown-item ${activeSection === sub.id ? 'active' : ''}`}
                      onClick={() => handleSubSectionClick(section.id, sub.id)}
                    >
                      {sub.name}
                    </div>
                  ))}
                  {section.dynamic && section.subsections.length === 0 && (
                    <div className="dropdown-item disabled">No items yet</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {onStatusChange && (
          <div className="topbar-actions">
            <div className="status-change-buttons">
              <button
                className={`status-btn pending ${currentStatus === 'pending' ? 'active' : ''}`}
                onClick={() => onStatusChange('pending')}
                disabled={loadingStatus || currentStatus === 'pending'}
              >
                {loadingStatus && currentStatus !== 'pending' ? <FaSpinner className="spinner" /> : <FaClock />}
                Pending
              </button>
              <button
                className={`status-btn completed ${currentStatus === 'completed' ? 'active' : ''}`}
                onClick={() => onStatusChange('completed')}
                disabled={loadingStatus || currentStatus === 'completed'}
              >
                {loadingStatus && currentStatus !== 'completed' ? <FaSpinner className="spinner" /> : <FaCheck />}
                Completed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseNavbar;