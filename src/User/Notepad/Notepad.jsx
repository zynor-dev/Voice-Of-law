// Notepad.jsx - COMPLETE WITH ALL FIXES
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaStickyNote,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import axios from "axios";
import SubscriptionBlocker from "../../components/SubscriptionBlocker";
import useSubscriptionCheck from "../../hooks/useSubscriptionCheck";
import "../Style/Notepad.css";

const API_URL = "https://voiceoflaw-backend.onrender.com/api/standalone/notes";

const Notepad = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", date: "" });
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Get subscription status properly
  const { canAccessFeature, subscriptionStatus } = useSubscriptionCheck();
  const [showBlocker, setShowBlocker] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Get auth headers for API requests
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch notes from backend (user-specific)
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, getAuthHeaders());
      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      if (error.response?.status === 401) {
        alert("Please login to view your notes.");
      } else {
        alert("Failed to fetch notes. Please check if the server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter notes based on search term
  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
    setShowAllNotes(false);
  }, [searchTerm, notes]);

  // Get notes to display based on mobile view and showAllNotes state
  const getNotesToDisplay = () => {
    if (!isMobile || showAllNotes) {
      return filteredNotes;
    }
    return filteredNotes.slice(0, 3);
  };

  const notesToDisplay = getNotesToDisplay();

  // Handle note selection
  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  // Handle new note creation
  const handleNewNote = () => {
    // ✅ CHECK SUBSCRIPTION - Block only if trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${currentDate.getDate()}, ${currentDate.getFullYear()} ${
      currentDate.getHours() < 12 ? "AM" : "PM"
    }`;

    setNewNote({
      title: "",
      content: "",
      date: formattedDate,
    });
    setSelectedNote(null);
    setIsEditing(true);
    setShowAllNotes(false);
  };

  // Save new note
  const handleSaveNote = async () => {
    // ✅ CHECK SUBSCRIPTION - Block only if trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }

    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      alert("Please enter both title and content");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_URL, newNote, getAuthHeaders());

      const updatedNotes = [response.data, ...notes];
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
      setSelectedNote(response.data);
      setIsEditing(false);
      setNewNote({ title: "", content: "", date: "" });
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      if (error.response?.status === 401) {
        alert("Please login to save notes.");
      } else if (error.response?.status === 403) {
        // Handle daily limit error
        alert(
          error.response.data.error ||
            "Daily limit reached. Upgrade to premium for unlimited notes."
        );
      } else {
        alert("Failed to save note. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update existing note
  const handleUpdateNote = async () => {
    // ✅ CHECK SUBSCRIPTION - Block only if trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }

    if (
      !selectedNote ||
      selectedNote.title.trim() === "" ||
      selectedNote.content.trim() === ""
    ) {
      alert("Please enter both title and content");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/${selectedNote._id}`,
        {
          title: selectedNote.title,
          content: selectedNote.content,
          date: selectedNote.date,
        },
        getAuthHeaders()
      );

      const updatedNotes = notes.map((note) =>
        note._id === selectedNote._id ? response.data : note
      );

      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
      setSelectedNote(response.data);
      setIsEditing(false);
      alert("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
      if (error.response?.status === 401) {
        alert("Please login to update notes.");
      } else {
        alert("Failed to update note. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const handleDeleteNote = async () => {
    // ✅ CHECK SUBSCRIPTION - Block only if trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }

    if (!selectedNote) return;

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${selectedNote._id}`, getAuthHeaders());

      const updatedNotes = notes.filter(
        (note) => note._id !== selectedNote._id
      );
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
      setSelectedNote(null);
      setIsEditing(false);
      setShowAllNotes(false);
      alert("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      if (error.response?.status === 401) {
        alert("Please login to delete notes.");
      } else {
        alert("Failed to delete note. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle show all notes on mobile
  const toggleShowAllNotes = () => {
    setShowAllNotes(!showAllNotes);
  };

  return (
    <div className="notepad-container">
      {/* ✅ SHOW TRIAL STATUS BANNER */}
      {subscriptionStatus?.isTrialActive && (
        <div
          className="trial-status-banner"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          🎉 Free Trial Active - {subscriptionStatus.daysRemaining} days
          remaining
          {subscriptionStatus.dailyLimits?.notes && (
            <span style={{ marginLeft: "1rem", opacity: 0.9 }}>
              | 📝 Notes: {subscriptionStatus.dailyLimits.notes.used}/
              {subscriptionStatus.dailyLimits.notes.limit} today
            </span>
          )}
        </div>
      )}

      <div className="notepad-header">
        <h2>My Notes</h2>
        <div className="notepad-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="new-note-btn"
          onClick={handleNewNote}
          disabled={loading}
        >
          <FaPlus /> New Note
        </button>
      </div>

      <div className="notepad-content">
        {/* Note Editor/Viewer */}
        <div className="note-editor">
          {isEditing ? (
            <div className="editor-container">
              <input
                type="text"
                placeholder="Note title"
                value={selectedNote ? selectedNote.title : newNote.title}
                onChange={(e) => {
                  if (selectedNote) {
                    setSelectedNote({ ...selectedNote, title: e.target.value });
                  } else {
                    setNewNote({ ...newNote, title: e.target.value });
                  }
                }}
                className="note-title-input"
              />
              <textarea
                placeholder="Start typing your note here..."
                value={selectedNote ? selectedNote.content : newNote.content}
                onChange={(e) => {
                  if (selectedNote) {
                    setSelectedNote({
                      ...selectedNote,
                      content: e.target.value,
                    });
                  } else {
                    setNewNote({ ...newNote, content: e.target.value });
                  }
                }}
                className="note-content-input"
              />
              <div className="editor-actions">
                <button
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={selectedNote ? handleUpdateNote : handleSaveNote}
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          ) : selectedNote ? (
            <div className="viewer-container">
              <div className="viewer-header">
                <h2>{selectedNote.title}</h2>
                <span className="note-date">
                  <FaCalendarAlt /> {selectedNote.date}
                </span>
              </div>
              <div className="note-content">
                {selectedNote.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="viewer-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteNote}
                  className="delete-btn"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FaStickyNote className="empty-icon" />
              <h3>Select a note or create a new one</h3>
              <p>
                Choose a note from the list or create a new note to get started
              </p>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="notes-list">
          <h3 className="notes-list-title">Recent Notes</h3>

          {loading && notes.length === 0 ? (
            <div className="no-notes-message">
              <p>Loading notes...</p>
            </div>
          ) : notesToDisplay.length > 0 ? (
            <>
              {notesToDisplay.map((note) => (
                <div
                  key={note._id}
                  className={`note-item ${
                    selectedNote?._id === note._id ? "active" : ""
                  }`}
                  onClick={() => handleNoteSelect(note)}
                >
                  <div className="note-item-header">
                    <h3>{note.title}</h3>
                    <span className="note-date">
                      <FaCalendarAlt /> {note.date}
                    </span>
                  </div>
                  <p>
                    {note.content.substring(0, 100)}
                    {note.content.length > 100 ? "..." : ""}
                  </p>
                </div>
              ))}

              {/* Show More/Less button for mobile */}
              {isMobile && filteredNotes.length > 3 && (
                <div className="show-more-container">
                  <button
                    className="show-more-btn"
                    onClick={toggleShowAllNotes}
                  >
                    {showAllNotes ? (
                      <>
                        <FaChevronUp /> Show Less
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> Show More ({filteredNotes.length - 3}{" "}
                        more)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-notes-message">
              <p>No notes found. Create your first note!</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Subscription Blocker - Only shows when trial expired AND not subscribed */}
      <SubscriptionBlocker
        isOpen={showBlocker}
        onClose={() => setShowBlocker(false)}
        featureName="Notepad"
      />
    </div>
  );
};

export default Notepad;
