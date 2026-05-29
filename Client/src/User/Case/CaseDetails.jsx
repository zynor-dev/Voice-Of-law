// CaseDetails.jsx - Backend Integrated with Original UI/UX
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChevronDown, FaUpload, FaFileAlt, FaStickyNote, FaTrash, FaPlus, FaGavel, FaUserTie, FaFileContract, FaShieldAlt, FaBalanceScale, FaCalendarAlt, FaImage, FaFilePdf, FaEdit, FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { casesAPI, filesAPI, notesAPI, handleApiError, validateFile, formatFileSize } from '../../services/api';
import '../Style/CaseDetails.css';

const CaseDetails = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  
  const [caseData, setCaseData] = useState(null);
  const [activeSection, setActiveSection] = useState('case-info');
  const [activeSubSection, setActiveSubSection] = useState('case-information');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState('');

  // Fetch case data from backend
  useEffect(() => {
    if (caseId && caseId !== 'undefined') {
      fetchCaseData();
    } else {
      setError('Invalid Case ID');
      console.error('Invalid caseId:', caseId);
    }
  }, [caseId]);

  const fetchCaseData = async () => {
    if (!caseId || caseId === 'undefined') {
      setError('Case ID is missing');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Fetching case data for ID:', caseId);
      
      const response = await casesAPI.getById(caseId);
      console.log('Case API Response:', response);
      
      if (response.data) {
        setCaseData(response.data);
        console.log('Case data set successfully:', response.data);
      } else {
        setError('Case data not found in response');
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error fetching case:', err);
      
      if (err.response?.status === 404) {
        setError('Case not found. It may have been deleted.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload to backend
  const handleFileUpload = async (event, sectionType) => {
    if (!caseId || caseId === 'undefined') {
      alert('Case ID is missing');
      return;
    }

    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.message);
        return;
      }
    }

    try {
      setLoading(true);
      await casesAPI.uploadFiles(caseId, files, sectionType);
      await fetchCaseData();
      alert('Files uploaded successfully!');
    } catch (err) {
      setError(handleApiError(err));
      alert('Failed to upload files: ' + handleApiError(err));
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  // Add note to backend
  const addNoteItem = async (sectionType) => {
    if (!caseId || caseId === 'undefined') {
      alert('Case ID is missing');
      return;
    }

    const noteName = prompt('Enter note name:');
    if (!noteName?.trim()) return;
    
    try {
      setLoading(true);
      await casesAPI.createNote(caseId, sectionType, noteName.trim());
      await fetchCaseData();
      alert('Note created successfully!');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Delete item from backend
  const handleDeleteItem = async (item, sectionType) => {
    if (!caseId || caseId === 'undefined') {
      alert('Case ID is missing');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    
    try {
      setLoading(true);
      const itemId = item.type === 'file' ? item.fileId?._id : item.noteId?._id;
      await casesAPI.deleteItem(caseId, itemId, sectionType, item.type);
      await fetchCaseData();
      alert('Item deleted successfully!');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Edit note in backend
  const handleEditNote = async (noteId, newTitle, newContent) => {
    try {
      setLoading(true);
      await notesAPI.updateNote(noteId, newTitle, newContent);
      await fetchCaseData();
      setEditingNote(null);
      alert('Note updated successfully!');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Add file from sidebar
  const handleAddFile = (sectionType) => {
    if (!caseId || caseId === 'undefined') {
      alert('Case ID is missing');
      return;
    }
    document.getElementById(`file-input-sidebar-${sectionType}`).click();
  };

  // Get file icon based on type
  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) return <FaImage className="file-icon-img" />;
    if (mimetype === 'application/pdf') return <FaFilePdf className="file-icon-pdf" />;
    return <FaFileAlt />;
  };

  // Get section data for sidebar
  const getSectionData = (sectionType) => {
    return caseData?.[sectionType] || [];
  };

  // Get section title
  const getSectionTitle = (sectionId) => {
    const titles = {
      'case-info': 'Case Information',
      'drafts': 'Drafts',
      'opponentDrafts': 'Opponent Drafts',
      'courtOrders': 'Court Orders',
      'evidence': 'Evidence',
      'relevantSections': 'Relevant Sections'
    };
    return titles[sectionId] || 'Section';
  };

  // Render file preview component
  const FilePreview = ({ file }) => {
    if (!file) {
      return <div className="error">File not found</div>;
    }

    const fileUrl = filesAPI.getFileUrl(file.url);

    return (
      <div className="file-preview">
        <div className="preview-container">
          {file.mimetype.startsWith('image/') ? (
            <div className="image-preview">
              <img 
                src={fileUrl} 
                alt={file.name}
                className="preview-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="file-preview-content">
              {getFileIcon(file.mimetype)}
              <h3>{file.name}</h3>
              <p>Document ready for viewing</p>
            </div>
          )}
          
          <div className="file-info">
            <span>Type: {file.mimetype}</span>
            <span>Size: {formatFileSize(file.size)}</span>
            <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="file-actions">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="action-btn view-btn"
            >
              <FaFileAlt /> Open File
            </a>
            <a 
              href={fileUrl} 
              download={file.name}
              className="action-btn download-btn"
            >
              <FaUpload /> Download
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Render note editor component
  const NoteEditor = ({ note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);

    const handleSave = () => {
      handleEditNote(note._id, editTitle, editContent);
    };

    if (isEditing) {
      return (
        <div className="note-content">
          <div className="note-editor">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="note-title-input"
              placeholder="Note Title"
            />
            <textarea 
              className="note-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your note content here..."
              rows="15"
            />
            <div className="note-actions">
              <button 
                className="action-btn save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="action-btn cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(note.title);
                  setEditContent(note.content);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="note-content">
        <div className="note-display">
          <div className="content-header">
            <h2>{note.title}</h2>
            <div className="item-meta">
              <span className="item-date">
                <FaCalendarAlt /> Updated: {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="content-body">
            <pre className="note-text">{note.content || 'No content added yet.'}</pre>
            <div className="note-actions">
              <button 
                className="action-btn save-btn"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit Note
              </button>
              <button className="action-btn delete-btn">
                <FaTrash /> Delete Note
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render upload interface for file-based sections
  const renderUploadSection = (sectionType, title) => {
    return (
      <div className="upload-section-container">
        <div className="upload-options">
          <div className="upload-option-card">
            <div className="upload-icon">
              <FaUpload />
            </div>
            <h3>Upload Files</h3>
            <p>Upload images (JPEG, PNG, GIF, WebP) or PDF documents</p>
            <button 
              className="upload-option-btn"
              onClick={() => document.getElementById(`file-input-${sectionType}`).click()}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Choose Files'}
            </button>
            <input
              id={`file-input-${sectionType}`}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e, sectionType)}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="upload-option-card">
            <div className="upload-icon">
              <FaStickyNote />
            </div>
            <h3>Create Note</h3>
            <p>Add a quick note or memo</p>
            <button 
              className="upload-option-btn"
              onClick={() => addNoteItem(sectionType)}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render content for a specific subsection item
  const renderSubsectionContent = (sectionType, itemIndex) => {
    const sectionItems = getSectionData(sectionType);
    const item = sectionItems[itemIndex];
    
    if (!item) {
      return (
        <div className="subsection-content">
          <div className="item-not-found">
            <h3>Item not found</h3>
            <p>The selected item could not be found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="subsection-content">
        <div className="content-header">
          <h2>{item.name}</h2>
          <div className="item-meta">
            <span className="item-date">
              <FaCalendarAlt /> Added: {new Date(item.addedAt).toLocaleDateString()}
            </span>
            {item.type === 'file' && item.fileId && (
              <span className="item-size">Size: {formatFileSize(item.fileId.size)}</span>
            )}
            <span className="item-type">{item.type === 'file' ? 'File' : 'Note'}</span>
          </div>
        </div>
        
        <div className="content-body">
          {item.type === 'file' && item.fileId ? (
            <FilePreview file={item.fileId} />
          ) : item.type === 'note' && item.noteId ? (
            <NoteEditor note={item.noteId} />
          ) : (
            <div className="error">Failed to load item content</div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeSection === 'case-info') {
      return (
        <div className="case-form-container">
          <form className="case-form">
            {activeSubSection === 'case-information' && (
              <div className="form-section">
                <h3>Case Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Case Title</label>
                    <input type="text" value={caseData?.title || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Case Number</label>
                    <input type="text" value={caseData?.caseNo || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Case Type</label>
                    <input type="text" value={caseData?.type || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Court Name</label>
                    <input type="text" value={caseData?.court || ''} readOnly />
                  </div>
                </div>
              </div>
            )}

            {activeSubSection === 'party-information' && (
              <div className="form-section">
                <h3>Party Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Party Name</label>
                    <input type="text" value={caseData?.partyName || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="text" value={caseData?.contactNumber || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Respondent</label>
                    <input type="text" value={caseData?.respondent || ''} readOnly />
                  </div>
                </div>
              </div>
            )}

            {activeSubSection === 'advocate-information' && (
              <div className="form-section">
                <h3>Advocate Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Lawyer Name</label>
                    <input type="text" value={caseData?.lawyer || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Advocate Contact</label>
                    <input type="text" value={caseData?.advocateContactNumber || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Adverse Advocate</label>
                    <input type="text" value={caseData?.adversePartyAdvocateName || ''} readOnly />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      );
    } else {
      const isViewingItem = activeSubSection.includes('-');
      
      if (isViewingItem) {
        const [sectionType, itemIndex] = activeSubSection.split('-');
        return renderSubsectionContent(sectionType, parseInt(itemIndex));
      } else {
        const sectionTitles = {
          'drafts': 'Drafts',
          'opponentDrafts': 'Opponent Drafts',
          'courtOrders': 'Court Orders',
          'evidence': 'Evidence',
          'relevantSections': 'Relevant Sections'
        };
        
        return renderUploadSection(activeSection, sectionTitles[activeSection]);
      }
    }
  };

  const sections = [
    {
      id: 'case-info',
      name: 'Case Information',
      icon: <FaGavel />,
      subsections: [
        { id: 'case-information', name: 'Case Information' },
        { id: 'party-information', name: 'Party Information' },
        { id: 'advocate-information', name: 'Advocate Information' }
      ]
    },
    {
      id: 'drafts',
      name: 'Drafts',
      icon: <FaFileContract />,
      subsections: getSectionData('drafts').map((item, index) => ({ 
        id: `drafts-${index}`, 
        name: item.name 
      }))
    },
    {
      id: 'opponentDrafts',
      name: 'Opponent Drafts',
      icon: <FaUserTie />,
      subsections: getSectionData('opponentDrafts').map((item, index) => ({ 
        id: `opponentDrafts-${index}`, 
        name: item.name 
      }))
    },
    {
      id: 'courtOrders',
      name: 'Court Orders',
      icon: <FaBalanceScale />,
      subsections: getSectionData('courtOrders').map((item, index) => ({ 
        id: `courtOrders-${index}`, 
        name: item.name 
      }))
    },
    {
      id: 'evidence',
      name: 'Evidence',
      icon: <FaShieldAlt />,
      subsections: getSectionData('evidence').map((item, index) => ({ 
        id: `evidence-${index}`, 
        name: item.name 
      }))
    },
    {
      id: 'relevantSections',
      name: 'Relevant Sections',
      icon: <FaFileAlt />,
      subsections: getSectionData('relevantSections').map((item, index) => ({ 
        id: `relevantSections-${index}`, 
        name: item.name 
      }))
    }
  ];

  const handleSectionClick = (sectionId, subsectionId) => {
    setActiveSection(sectionId);
    setActiveSubSection(subsectionId);
    setDropdownOpen(null);
  };

  const currentSection = sections.find(section => section.id === activeSection);

  if (loading && !caseData) {
    return (
      <div className="case-details-container">
        <div className="loading-spinner">Loading case details...</div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="case-details-container">
        <div className="case-not-found">
          <h2>Error Loading Case</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate('/user-panel')}>
            <FaArrowLeft /> Back to Cases
          </button>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="case-details-container">
        <div className="case-not-found">
          <h2>Case not found</h2>
          <button className="back-btn" onClick={() => navigate('/user-panel')}>
            <FaArrowLeft /> Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="case-details-container">
      {error && (
        <div className="error-message">
          {error}
          <button className="retry-btn" onClick={fetchCaseData}>Retry</button>
        </div>
      )}

      <div className="case-details-topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={() => navigate('/user-panel')}>
            <FaArrowLeft /> 
          </button>
          <div className="case-title-section">
            <h2>{caseData.title}</h2>
            <span className={`case-status ${caseData.status}`}>
              {caseData.status}
            </span>
          </div>
        </div>

        <div className="topbar-nav">
          {sections.map(section => (
            <div key={section.id} className="nav-dropdown">
              <button
                className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(section.id);
                  if (section.subsections.length > 0) {
                    setActiveSubSection(section.subsections[0].id);
                  }
                  setDropdownOpen(dropdownOpen === section.id ? null : section.id);
                }}
              >
                {section.icon}
                <span>{section.name}</span>
                {section.subsections.length > 0 && (
                  <FaChevronDown className={`dropdown-arrow ${dropdownOpen === section.id ? 'open' : ''}`} />
                )}
              </button>
              
              {dropdownOpen === section.id && section.subsections.length > 0 && (
                <div className="dropdown-menu">
                  {section.subsections.map(subsection => (
                    <button
                      key={subsection.id}
                      className={`dropdown-item ${activeSubSection === subsection.id ? 'active' : ''}`}
                      onClick={() => handleSectionClick(section.id, subsection.id)}
                    >
                      {subsection.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="case-details-content-area">
        <div className="content-wrapper">
          <div className="case-details-content">
            <div className="case-sidebar">
              <div className="sidebar-header">
                <h3 className="sidebar-title">{currentSection?.name || 'Case Details'}</h3>
                {activeSection !== 'case-info' && (
                  <button 
                    className="add-file-btn"
                    onClick={() => handleAddFile(activeSection)}
                    disabled={loading || !caseId || caseId === 'undefined'}
                  >
                    <FaPlus /> Add File
                    <input
                      id={`file-input-sidebar-${activeSection}`}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, activeSection)}
                      style={{ display: 'none' }}
                    />
                  </button>
                )}
              </div>
              
              {currentSection?.subsections && currentSection.subsections.length > 0 ? (
                <div className="subsection-list">
                  {currentSection.subsections.map(subsection => {
                    const sectionItems = getSectionData(currentSection.id);
                    const itemIndex = parseInt(subsection.id.split('-')[1]);
                    const item = sectionItems[itemIndex];
                    
                    return (
                      <div 
                        key={subsection.id} 
                        className={`subsection-item ${activeSubSection === subsection.id ? 'active' : ''}`}
                        onClick={() => handleSectionClick(activeSection, subsection.id)}
                      >
                        <div className="subsection-item-content">
                          <div className="file-icon">
                            {item?.type === 'file' ? 
                              getFileIcon(item.fileId?.mimetype) : 
                              <FaStickyNote />
                            }
                          </div>
                          <div className="subsection-details">
                            <span className="subsection-name">{subsection.name}</span>
                            <span className="subsection-date">
                              <FaCalendarAlt /> {item ? new Date(item.addedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-subsections">
                  <p>No items available. Add content to see them here.</p>
                </div>
              )}
            </div>

            <div className="case-main-content">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;