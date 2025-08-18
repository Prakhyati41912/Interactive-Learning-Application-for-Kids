import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import "./dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Admin");
  const [tempName, setTempName] = useState("Admin");
  const [profilePic, setProfilePic] = useState("images.jpeg");
  const [tempProfilePic, setTempProfilePic] = useState("images.jpeg");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);
  const [logoutTime, setLogoutTime] = useState(1); // Default: 1 minute
  const [feedbacks, setFeedbacks] = useState([]); // State to store feedbacks
  const [parentFeedbacks, setParentFeedbacks] = useState([]); // State to store parent feedbacks
  let logoutTimer = null;

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
        setName(userData.name || "Admin");
        setTempName(userData.name || "Admin");
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

  // Fetch feedbacks from Firestore
  const fetchFeedbacks = async () => {
    try {
      const feedbacksCollection = collection(db, "feedback");
      const querySnapshot = await getDocs(feedbacksCollection);
      const feedbacksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(feedbacksList);
    } catch (error) {
      console.error("Error fetching feedbacks:", error.message);
    }
  };

  // Fetch parent feedbacks from Firestore
  const fetchParentFeedbacks = async () => {
    try {
      const parentFeedbacksCollection = collection(db, "parent_feedback");
      const querySnapshot = await getDocs(parentFeedbacksCollection);
      const parentFeedbacksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParentFeedbacks(parentFeedbacksList);
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
    };
  }, [autoLogoutEnabled, logoutTime]);

  const startLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(async () => {
      console.log("User logged out due to inactivity.");
      await signOut(auth);
      navigate("/");
    }, logoutTime * 60 * 1000); // Convert minutes to milliseconds
  };

  const resetLogoutTimer = () => {
    if (autoLogoutEnabled && logoutTime > 0) {
      clearTimeout(logoutTimer);
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

  // Fetch feedbacks when the "View Feedbacks" tab is active
  useEffect(() => {
    if (activeTab === "feedbacks") {
      fetchFeedbacks();
    }
  }, [activeTab]);

  // Fetch parent feedbacks when the "Parent Feedbacks" tab is active
  useEffect(() => {
    if (activeTab === "parent-feedbacks") {
      fetchParentFeedbacks();
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
        <button className={`sidebar-btn ${activeTab === "feedbacks" ? "active" : ""}`} onClick={() => setActiveTab("feedbacks")}>
          View Feedbacks
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>
          Modules
        </button>
        <button className={`sidebar-btn ${activeTab === "parent-feedbacks" ? "active" : ""}`} onClick={() => setActiveTab("parent-feedbacks")}>
          Parent Feedbacks
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
            <h2>Welcome to Your Admin Dashboard, {name}!</h2>
            <p>Here you can manage the platform and view user feedbacks.</p>
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

        {activeTab === "feedbacks" && (
          <div className="feedbacks-section">
            <h2>View Feedbacks</h2>
            {feedbacks.length === 0 ? (
              <p>No feedbacks submitted yet.</p>
            ) : (
              <div className="feedbacks-list">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-item">
                    <h3>Anonymous</h3> {/* Display as Anonymous */}
                    <p>{feedback.feedback}</p>
                    <small>Submitted on: {new Date(feedback.timestamp?.toDate()).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "parent-feedbacks" && (
          <div className="feedbacks-section">
            <h2>Parent Feedbacks</h2>
            {parentFeedbacks.length === 0 ? (
              <p>No parent feedbacks submitted yet.</p>
            ) : (
              <div className="feedbacks-list">
                {parentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-item">
                    <h3>{feedback.name}</h3> {/* Display parent's name */}
                    <p>{feedback.feedback}</p>
                    <small>Submitted on: {new Date(feedback.timestamp?.toDate()).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;