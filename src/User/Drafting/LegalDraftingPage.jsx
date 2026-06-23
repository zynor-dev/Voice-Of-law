import React, { useState, useRef } from 'react';
import { FaPlus, FaFileAlt, FaEdit, FaSave, FaDownload, FaPrint, FaSearch, FaFilter, FaStar, FaClock, FaUser, FaBrain, FaBookOpen, FaArrowRight, FaTimes, FaCheck } from 'react-icons/fa';

const LegalDraftingPage = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const editorRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'contract', name: 'Contracts', count: 8 },
    { id: 'notice', name: 'Legal Notices', count: 6 },
    { id: 'agreement', name: 'Agreements', count: 5 },
    { id: 'petition', name: 'Petitions', count: 3 },
    { id: 'other', name: 'Others', count: 2 }
  ];

  const templates = [
    {
      id: 1,
      title: 'Rent Agreement',
      category: 'agreement',
      description: 'Standard rental agreement for residential properties in Pakistan',
      lastModified: '2 days ago',
      downloads: 1240,
      rating: 4.8,
      isPremium: false,
      content: `RENT AGREEMENT

This Rent Agreement is made on [DATE] between [LANDLORD_NAME], son/daughter of [LANDLORD_FATHER], resident of [LANDLORD_ADDRESS] (hereinafter called "Landlord") and [TENANT_NAME], son/daughter of [TENANT_FATHER], resident of [TENANT_ADDRESS] (hereinafter called "Tenant").

TERMS AND CONDITIONS:

1. PROPERTY DETAILS:
   The Landlord agrees to rent out the property located at [PROPERTY_ADDRESS], measuring [AREA] square feet.

2. RENT:
   The monthly rent is Rs. [RENT_AMOUNT], payable on or before [DUE_DATE] of each month.

3. SECURITY DEPOSIT:
   Tenant shall pay Rs. [SECURITY_AMOUNT] as security deposit.

4. DURATION:
   This agreement is for [DURATION] months, starting from [START_DATE].

[Continue with additional clauses...]`
    },
    {
      id: 2,
      title: 'Legal Notice for Recovery',
      category: 'notice',
      description: 'Legal notice template for debt recovery under Pakistani law',
      lastModified: '5 days ago',
      downloads: 892,
      rating: 4.9,
      isPremium: true,
      content: `LEGAL NOTICE

To,
[DEBTOR_NAME]
[DEBTOR_ADDRESS]

Subject: Legal Notice for Recovery of Outstanding Amount

Dear Sir/Madam,

I, [CLIENT_NAME], through my advocate [ADVOCATE_NAME], hereby serve you this Legal Notice under Section 80 of the Code of Civil Procedure, 1908.

FACTS:
1. You owe me a sum of Rs. [AMOUNT] which became due on [DUE_DATE].
2. Despite repeated requests, you have failed to pay the outstanding amount.

DEMAND:
You are hereby called upon to pay the outstanding amount of Rs. [AMOUNT] within 30 days of receipt of this notice.

CONSEQUENCES:
Failure to comply will result in legal proceedings against you for recovery of the amount along with interest and costs.

[Continue with legal formalities...]`
    },
    {
      id: 3,
      title: 'Employment Contract',
      category: 'contract',
      description: 'Comprehensive employment contract template',
      lastModified: '1 week ago',
      downloads: 567,
      rating: 4.7,
      isPremium: false,
      content: `EMPLOYMENT CONTRACT

This Employment Contract is executed on [DATE] between [COMPANY_NAME], a company incorporated under the laws of Pakistan (hereinafter called "Company") and [EMPLOYEE_NAME] (hereinafter called "Employee").

TERMS OF EMPLOYMENT:

1. POSITION AND DUTIES:
   The Employee is appointed as [POSITION] and shall perform duties as assigned.

2. SALARY:
   Monthly salary: Rs. [SALARY_AMOUNT]

3. WORKING HOURS:
   [WORKING_HOURS] hours per week

4. PROBATION PERIOD:
   [PROBATION_PERIOD] months

[Continue with employment terms...]`
    }
  ];

  const myDrafts = [
    {
      id: 1,
      title: 'Property Dispute Notice - Ahmed Case',
      lastModified: '2 hours ago',
      status: 'Draft',
      wordCount: 1245
    },
    {
      id: 2,
      title: 'Business Partnership Agreement',
      lastModified: '1 day ago',
      status: 'Completed',
      wordCount: 2134
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setDocumentContent(template.content);
    setDocumentTitle(template.title);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleSaveDraft = () => {
    // Save draft functionality
    alert('Draft saved successfully!');
  };

  const handleDownloadPDF = () => {
    // PDF download functionality
    alert('Downloading PDF...');
  };

  const renderTemplateCard = (template) => (
    <div key={template.id} className="template-card" onClick={() => handleTemplateSelect(template)}>
      <div className="template-header">
        <div className="template-icon">
          <FaFileAlt />
        </div>
        <div className="template-meta">
          {template.isPremium && <span className="premium-badge">Premium</span>}
          <div className="template-rating">
            <FaStar className="star-filled" />
            <span>{template.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="template-content">
        <h3 className="template-title">{template.title}</h3>
        <p className="template-description">{template.description}</p>
      </div>
      
      <div className="template-footer">
        <div className="template-stats">
          <span><FaDownload /> {template.downloads}</span>
          <span><FaClock /> {template.lastModified}</span>
        </div>
        <button className="use-template-btn">
          Use Template <FaArrowRight />
        </button>
      </div>
    </div>
  );

  return (
    <div className="legal-drafting-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Legal Document Drafting</h1>
          <p className="page-subtitle">Create professional legal documents with AI-powered templates</p>
        </div>
        
        {/* <div className="header-actions">
          <button 
            className="ai-assistant-btn"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
          >
            <FaBrain />
            AI Assistant
          </button>
          <button className="new-draft-btn" onClick={() => {setActiveTab('editor'); setIsEditing(true);}}>
            <FaPlus />
            New Draft
          </button>
        </div> */}
      </div>
          <div style={{textAlign: 'center',marginTop:'70px' ,fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-dark)'}}>
          Comming Soon...
        </div>
      {/* Navigation Tabs */}
      {/* <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <FaBookOpen />
          Templates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          <FaFileAlt />
          My Drafts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          <FaEdit />
          Editor
        </button>
      </div> */}

      {/* Templates Tab */}
      {/* {activeTab === 'templates' && (
        <div className="templates-section">
          <div className="templates-header">
            <div className="search-filter-bar">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-dropdown">
                <FaFilter className="filter-icon" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="templates-grid">
            {filteredTemplates.map(renderTemplateCard)}
          </div>
        </div>
      )} */}

      {/* My Drafts Tab */}
      {/* {activeTab === 'drafts' && (
        <div className="drafts-section">
          <div className="drafts-list">
            {myDrafts.map(draft => (
              <div key={draft.id} className="draft-item">
                <div className="draft-info">
                  <FaFileAlt className="draft-icon" />
                  <div className="draft-details">
                    <h3 className="draft-title">{draft.title}</h3>
                    <div className="draft-meta">
                      <span>Last modified: {draft.lastModified}</span>
                      <span>•</span>
                      <span>{draft.wordCount} words</span>
                    </div>
                  </div>
                </div>
                <div className="draft-status">
                  <span className={`status-badge ${draft.status.toLowerCase()}`}>
                    {draft.status}
                  </span>
                  <button className="edit-draft-btn" onClick={() => {setActiveTab('editor'); setIsEditing(true);}}>
                    <FaEdit />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Editor Tab */}
      {/* {activeTab === 'editor' && (
        <div className="editor-section">
          <div className="editor-header">
            <div className="document-info">
              <input
                type="text"
                className="document-title-input"
                placeholder="Document Title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>
            <div className="editor-actions">
              <button className="editor-btn" onClick={handleSaveDraft}>
                <FaSave />
                Save Draft
              </button>
              <button className="editor-btn" onClick={handleDownloadPDF}>
                <FaDownload />
                Download PDF
              </button>
              <button className="editor-btn">
                <FaPrint />
                Print
              </button>
            </div>
          </div>

          <div className="editor-container">
            <div className="editor-toolbar">
              <div className="formatting-tools">
                <button className="tool-btn">B</button>
                <button className="tool-btn">I</button>
                <button className="tool-btn">U</button>
                <span className="divider">|</span>
                <button className="tool-btn">Left</button>
                <button className="tool-btn">Center</button>
                <button className="tool-btn">Right</button>
              </div>
            </div>
            
            <div className="editor-content">
              <textarea
                ref={editorRef}
                className="document-editor"
                placeholder="Start typing your legal document here, or select a template to begin..."
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
              />
            </div>
          </div>
        </div>
      )} */}

      {/* AI Assistant Sidebar */}
      {/* {showAIAssistant && (
        <div className="ai-assistant-sidebar">
          <div className="assistant-header">
            <h3>AI Legal Assistant</h3>
            <button className="close-assistant" onClick={() => setShowAIAssistant(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="assistant-content">
            <div className="suggestion-card">
              <FaBrain className="suggestion-icon" />
              <h4>Smart Suggestions</h4>
              <p>Get AI-powered suggestions to improve your legal document</p>
              <button className="suggestion-btn">Analyze Document</button>
            </div>

            <div className="quick-actions">
              <h4>Quick Actions</h4>
              <button className="quick-action-btn">
                <FaCheck />
                Grammar Check
              </button>
              <button className="quick-action-btn">
                <FaFileAlt />
                Format Document
              </button>
              <button className="quick-action-btn">
                <FaStar />
                Legal Review
              </button>
            </div>
          </div>
        </div>
      )} */}

      <style jsx>{`
        .legal-drafting-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: var(--dashboard-bg);
          min-height: 100vh;
          position: relative;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-grey);
        }

        .header-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 0.5rem;
        }

        .header-content p {
          color: var(--text-light-grey);
          font-size: 1.1rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .ai-assistant-btn, .new-draft-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .ai-assistant-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .new-draft-btn {
          background: var(--accent-gold);
          color: white;
        }

        .ai-assistant-btn:hover, .new-draft-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: var(--card-bg-light);
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid var(--border-grey);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--text-light-grey);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .tab-btn:hover {
          background: rgba(188, 155, 94, 0.1);
          color: var(--accent-gold);
        }

        .tab-btn.active {
          background: var(--accent-gold);
          color: white;
          box-shadow: 0 2px 8px rgba(188, 155, 94, 0.3);
        }

        .templates-header {
          margin-bottom: 2rem;
        }

        .search-filter-bar {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light-grey);
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid var(--border-grey);
          border-radius: 12px;
          background: white;
          color: var(--text-dark);
          font-size: 1rem;
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 2px rgba(188, 155, 94, 0.1);
        }

        .filter-dropdown {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-grey);
          border-radius: 12px;
        }

        .filter-dropdown select {
          border: none;
          background: transparent;
          color: var(--text-dark);
          cursor: pointer;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .template-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border-grey);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .template-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: var(--accent-gold);
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .template-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--accent-gold), #a68a56);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }

        .template-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .premium-badge {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .template-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-light-grey);
          font-size: 0.9rem;
        }

        .star-filled {
          color: #ffd700;
        }

        .template-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0 0 0.5rem;
        }

        .template-content p {
          color: var(--text-light-grey);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .template-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f2f5;
        }

        .template-stats {
          display: flex;
          gap: 1rem;
          color: var(--text-light-grey);
          font-size: 0.8rem;
        }

        .template-stats span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .use-template-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent-gold);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .use-template-btn:hover {
          background: #a68a56;
          transform: translateX(2px);
        }

        .drafts-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-grey);
        }

        .drafts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .draft-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border: 1px solid var(--border-grey);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .draft-item:hover {
          border-color: var(--accent-gold);
          background: rgba(188, 155, 94, 0.02);
        }

        .draft-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .draft-icon {
          color: var(--accent-gold);
          font-size: 1.2rem;
        }

        .draft-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0 0 0.25rem;
        }

        .draft-meta {
          display: flex;
          gap: 0.5rem;
          color: var(--text-light-grey);
          font-size: 0.9rem;
        }

        .draft-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.completed {
          background: #d4edda;
          color: #155724;
        }

        .edit-draft-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-draft-btn:hover {
          background: var(--accent-gold);
          color: white;
        }

        .editor-section {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-grey);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-grey);
          background: #fafbfc;
        }

        .document-title-input {
          font-size: 1.3rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-dark);
          min-width: 300px;
        }

        .document-title-input:focus {
          outline: none;
          border-bottom: 2px solid var(--accent-gold);
        }

        .editor-actions {
          display: flex;
          gap: 0.5rem;
        }

        .editor-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg-light);
          border: 1px solid var(--border-grey);
          color: var(--text-dark);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .editor-btn:hover {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
        }

        .editor-toolbar {
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--border-grey);
          background: #fafbfc;
        }

        .formatting-tools {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tool-btn {
          width: 32px;
          height: 32px;
          border: 1px solid var(--border-grey);
          background: white;
          color: var(--text-dark);
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .tool-btn:hover {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
        }

        .divider {
          color: var(--border-grey);
          margin: 0 0.5rem;
        }

        .editor-content {
          padding: 2rem;
        }

        .document-editor {
          width: 100%;
          min-height: 500px;
          border: none;
          font-family: 'Times New Roman', serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-dark);
          resize: none;
        }

        .document-editor:focus {
          outline: none;
        }

        .ai-assistant-sidebar {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          width: 320px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-grey);
          z-index: 1000;
          animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }

        .assistant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-grey);
        }

        .assistant-header h3 {
          margin: 0;
          color: var(--text-dark);
          font-weight: 600;
        }

        .close-assistant {
          background: none;
          border: none;
          color: var(--text-light-grey);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .close-assistant:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-dark);
        }

        .assistant-content {
          padding: 1.5rem;
        }

        .suggestion-card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .suggestion-icon {
          font-size: 2rem;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .suggestion-card h4 {
          color: var(--text-dark);
          margin: 0 0 0.5rem;
          font-weight: 600;
        }

        .suggestion-card p {
          color: var(--text-light-grey);
          margin: 0 0 1rem;
          font-size: 0.9rem;
        }

        .suggestion-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .suggestion-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .quick-actions h4 {
          color: var(--text-dark);
          margin: 0 0 1rem;
          font-weight: 600;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          background: var(--card-bg-light);
          border: 1px solid var(--border-grey);
          color: var(--text-dark);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        .quick-action-btn:hover {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .legal-drafting-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .templates-grid {
            grid-template-columns: 1fr;
          }

          .search-filter-bar {
            flex-direction: column;
            gap: 1rem;
          }

          .search-box {
            max-width: none;
          }

          .editor-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .editor-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .document-title-input {
            min-width: auto;
            width: 100%;
          }

          .ai-assistant-sidebar {
            position: fixed;
            right: 1rem;
            left: 1rem;
            width: auto;
            max-height: 70vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 480px) {
          .tab-navigation {
            overflow-x: auto;
            white-space: nowrap;
          }

          .template-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .draft-item {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .draft-status {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalDraftingPage;