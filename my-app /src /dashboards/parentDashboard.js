import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import "./dashboard.css";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("User");
  const [tempName, setTempName] = useState("User");
  const [profilePic, setProfilePic] = useState("images.jpeg");
  const [tempProfilePic, setTempProfilePic] = useState("images.jpeg");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);
  const [logoutTime, setLogoutTime] = useState(1); // Default: 1 minute
  const [feedback, setFeedback] = useState(""); // Feedback input
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // Feedback submission status
  const [myFeedbacks, setMyFeedbacks] = useState([]); // State to store user-specific feedbacks
  const [editingFeedbackId, setEditingFeedbackId] = useState(null); // State to track which feedback is being edited
  const [editedFeedback, setEditedFeedback] = useState(""); // State to store edited feedback text
  const [showLogoutWarning, setShowLogoutWarning] = useState(false); // State to control logout warning modal
  let logoutTimer = null;
  let warningTimer = null;

  // Add a ref for the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "User");
        setTempName(userData.name || "User");
        setProfilePic(userData.profile_pic || "default-profile.png");
        setTempProfilePic(userData.profile_pic || "default-profile.png");
        setAutoLogoutEnabled(userData.autoLogoutEnabled || false);
        setLogoutTime(userData.logoutTime || 1);
      } else {
        console.error("User data not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Fetch parent-specific feedbacks
  const fetchMyFeedbacks = async () => {
    if (!userId) return;

    try {
      const feedbacksCollection = collection(db, "parent_feedback");
      const querySnapshot = await getDocs(feedbacksCollection);
      const feedbacksList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((feedback) => feedback.userId === userId); // Filter feedbacks by userId
      setMyFeedbacks(feedbacksList);
    } catch (error) {
      console.error("Error fetching parent feedbacks:", error.message);
    }
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    if (!userId) return;

    try {
      const userDocRef = doc(db, "users", userId);
      console.log("Saving profile with data:", {
        name: tempName,
        profile_pic: tempProfilePic,
        autoLogoutEnabled,
        logoutTime,
      });

      await updateDoc(userDocRef, {
        name: tempName,
        profile_pic: tempProfilePic,
        autoLogoutEnabled,
        logoutTime,
      });

      await fetchUserData(userId); // Refresh the data after saving
      setIsEditing(false);
      console.log("Profile updated successfully");

      // Reset the file input after saving
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("New profile picture selected:", reader.result);
        setTempProfilePic(reader.result);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setTempProfilePic("default-profile.png"); // Reset to default image
    setIsEditing(true); // Enable save button

    // Reset the file input after removing the picture
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Auto Logout Logic
  useEffect(() => {
    if (autoLogoutEnabled && logoutTime > 0) {
      startLogoutTimer();
    }
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [autoLogoutEnabled, logoutTime]);

  const startLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    if (warningTimer) clearTimeout(warningTimer);

    // Show warning 30 seconds before logout
    warningTimer = setTimeout(() => {
      setShowLogoutWarning(true);
    }, (logoutTime * 60 * 1000) - 30000); // 30 seconds before logout

    // Logout after the specified time
    logoutTimer = setTimeout(async () => {
      console.log("User logged out due to inactivity.");
      await signOut(auth);
      navigate("/");
    }, logoutTime * 60 * 1000); // Convert minutes to milliseconds
  };

  const resetLogoutTimer = () => {
    if (autoLogoutEnabled && logoutTime > 0) {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      setShowLogoutWarning(false); // Hide the warning modal
      startLogoutTimer();
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetLogoutTimer);
    window.addEventListener("keydown", resetLogoutTimer);

    return () => {
      window.removeEventListener("mousemove", resetLogoutTimer);
      window.removeEventListener("keydown", resetLogoutTimer);
    };
  }, [autoLogoutEnabled, logoutTime]);

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim()) {
      alert("Please enter your feedback.");
      return;
    }

    try {
      // Save feedback to Firestore in the "parent_feedback" collection
      await addDoc(collection(db, "parent_feedback"), {
        userId: userId,
        name: name, // Use parent's name
        feedback: feedback,
        timestamp: new Date(),
      });

      setFeedback(""); // Clear the feedback input
      setFeedbackSubmitted(true); // Show success message
      setTimeout(() => setFeedbackSubmitted(false), 3000); // Hide success message after 3 seconds
      fetchMyFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  // Handle feedback edit
  const handleEditFeedback = (feedbackId, currentFeedback) => {
    setEditingFeedbackId(feedbackId);
    setEditedFeedback(currentFeedback);
  };

  // Save edited feedback
  const saveEditedFeedback = async (feedbackId) => {
    try {
      const feedbackDocRef = doc(db, "parent_feedback", feedbackId);
      await updateDoc(feedbackDocRef, {
        feedback: editedFeedback,
      });
      setEditingFeedbackId(null); // Exit edit mode
      fetchMyFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error("Error updating feedback:", error.message);
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    try {
      const feedbackDocRef = doc(db, "parent_feedback", feedbackId);
      await deleteDoc(feedbackDocRef);
      fetchMyFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error("Error deleting feedback:", error.message);
    }
  };

  // Fetch feedbacks when the "My Feedbacks" tab is active
  useEffect(() => {
    if (activeTab === "my-feedbacks") {
      fetchMyFeedbacks();
    }
  }, [activeTab]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <h2 className="sidebar-name">{name}</h2>

        <button className={`sidebar-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          Profile Settings
        </button>
        <button className={`sidebar-btn ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
          Feedback
        </button>
        <button className={`sidebar-btn ${activeTab === "my-feedbacks" ? "active" : ""}`} onClick={() => setActiveTab("my-feedbacks")}>
          My Feedbacks
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>
          Modules
        </button>
        <button className="sidebar-btn logout" onClick={async () => {
          await signOut(auth);
          navigate("/");
        }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-section">
            <h2>Welcome to Your Parent Dashboard, {name}!</h2>
            <p>Here you can manage your child's activities and progress.</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="profile-settings-container">
            <h2 className="profile-title">Profile Settings</h2>

            <div className="profile-settings">
              {/* Name Input */}
              <label className="profile-label">Name:</label>
              <input
                type="text"
                className="profile-input"
                value={tempName}
                onChange={(e) => {
                  setTempName(e.target.value);
                  setIsEditing(true);
                }}
              />

              {/* Profile Picture Input */}
              <label className="profile-label">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                ref={fileInputRef} // Add ref to the file input
              />

              {/* Remove Profile Picture Button */}
              {tempProfilePic !== "default-profile.png" && (
                <button
                  className="remove-pic-btn"
                  onClick={removeProfilePicture}
                >
                  Remove Profile Picture
                </button>
              )}

              {/* Auto Logout Toggle */}
              <label className="profile-label">Enable Auto Logout:</label>
              <input
                type="checkbox"
                checked={autoLogoutEnabled}
                onChange={(e) => {
                  setAutoLogoutEnabled(e.target.checked);
                  setIsEditing(true);
                }}
              />

              {/* Logout Time Input (Minutes) */}
              {autoLogoutEnabled && (
                <>
                  <label className="profile-label">Logout Time (minutes):</label>
                  <input
                    type="number"
                    className="profile-input"
                    min="1"
                    value={logoutTime}
                    onChange={(e) => {
                      const value = Math.max(1, Number(e.target.value)); // Ensure minimum 1 min
                      setLogoutTime(value);
                      setIsEditing(true);
                    }}
                  />
                </>
              )}

              {/* Save / Cancel Buttons */}
              {isEditing && (
                <div className="profile-actions">
                  <button className="save-btn" onClick={saveProfileChanges}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="feedback-section">
            <h2>Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <label htmlFor="feedback">Your Feedback:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here..."
                required
              />
              <button type="submit">Submit Feedback</button>
            </form>
            {feedbackSubmitted && (
              <p className="feedback-success">Thank you for your feedback!</p>
            )}
          </div>
        )}

        {activeTab === "my-feedbacks" && (
          <div className="my-feedbacks-section">
            <h2>My Feedbacks</h2>
            {myFeedbacks.length === 0 ? (
              <p>No feedbacks submitted by you yet.</p>
            ) : (
              <div className="my-feedbacks-list">
                {myFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-item">
                    {editingFeedbackId === feedback.id ? (
                      <>
                        <textarea
                          value={editedFeedback}
                          onChange={(e) => setEditedFeedback(e.target.value)}
                        />
                        <button onClick={() => saveEditedFeedback(feedback.id)}>Save</button>
                        <button onClick={() => setEditingFeedbackId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <p>{feedback.feedback}</p>
                        <small>Submitted on: {new Date(feedback.timestamp?.toDate()).toLocaleString()}</small>
                        <button onClick={() => handleEditFeedback(feedback.id, feedback.feedback)}>Edit</button>
                        <button onClick={() => deleteFeedback(feedback.id)}>Delete</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Warning Modal */}
      {showLogoutWarning && (
        <div className="logout-warning-modal">
          <div className="logout-warning-content">
            <h2>Inactivity Warning</h2>
            <p>You will be logged out due to inactivity in 30 seconds. Click "Stay Logged In" to continue.</p>
            <button onClick={() => resetLogoutTimer()}>Stay Logged In</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;