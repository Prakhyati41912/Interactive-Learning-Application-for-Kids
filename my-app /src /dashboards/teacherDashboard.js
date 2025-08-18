import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./dashboard.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Teacher");
  const [tempName, setTempName] = useState("Teacher");
  const [profilePic, setProfilePic] = useState("images.jpeg");
  const [tempProfilePic, setTempProfilePic] = useState("images.jpeg");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);
  const [logoutTime, setLogoutTime] = useState(1); // Default: 1 minute
  const [classes, setClasses] = useState([]); // List of classes taught by the teacher
  const [selectedClass, setSelectedClass] = useState(null); // Selected class for viewing details
  const [students, setStudents] = useState([]); // Students in the selected class
  const [moduleTitle, setModuleTitle] = useState(""); // Module title
  const [moduleDescription, setModuleDescription] = useState(""); // Module description
  const [moduleFile, setModuleFile] = useState(null); // Module file (video)
  const [modules, setModules] = useState([]); // List of uploaded modules
  let logoutTimer = null;

  // Add a ref for the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
        fetchClasses(user.uid); // Fetch classes taught by the teacher
        fetchModules(); // Fetch all modules
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
        setName(userData.name || "Teacher");
        setTempName(userData.name || "Teacher");
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

  // Fetch classes taught by the teacher
  const fetchClasses = async (uid) => {
    try {
      const classesQuery = query(collection(db, "classes"), where("teacherId", "==", uid));
      const querySnapshot = await getDocs(classesQuery);
      const classesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(classesList);
    } catch (error) {
      console.error("Error fetching classes:", error.message);
    }
  };

  // Fetch students in the selected class
  const fetchStudents = async (classId) => {
    try {
      const studentsQuery = query(collection(db, "students"), where("classId", "==", classId));
      const querySnapshot = await getDocs(studentsQuery);
      const studentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  // Fetch all modules
  const fetchModules = async () => {
    try {
      const modulesCollection = collection(db, "modules");
      const querySnapshot = await getDocs(modulesCollection);
      const modulesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setModules(modulesList);
    } catch (error) {
      console.error("Error fetching modules:", error.message);
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

  // Handle module file change
  const handleModuleFileChange = (e) => {
    setModuleFile(e.target.files[0]);
  };

  // Upload module to Firestore and Firebase Storage
  const uploadModule = async () => {
    if (!moduleTitle || !moduleFile) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    try {
      // Upload the file to Firebase Storage
      const fileRef = ref(storage, `modules/${moduleFile.name}`);
      await uploadBytes(fileRef, moduleFile);
      const fileUrl = await getDownloadURL(fileRef);

      // Save module metadata to Firestore
      await addDoc(collection(db, "modules"), {
        title: moduleTitle,
        description: moduleDescription,
        fileUrl: fileUrl,
        uploadedBy: userId,
        uploadedAt: new Date(),
      });

      alert("Module uploaded successfully!");
      setModuleTitle("");
      setModuleDescription("");
      setModuleFile(null);
      fetchModules(); // Refresh the modules list
    } catch (error) {
      console.error("Error uploading module:", error.message);
      alert("Failed to upload module. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <h2 className="sidebar-name">{name}</h2>

        <button className={`sidebar-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/dashboard")}>
          Modules
        </button>
        <button className={`sidebar-btn ${activeTab === "classes" ? "active" : ""}`} onClick={() => setActiveTab("classes")}>
          My Classes
        </button>
        <button className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          Profile Settings
        </button>
        <button className={`sidebar-btn ${activeTab === "modules" ? "active" : ""}`} onClick={() => setActiveTab("modules")}>
          Upload Modules
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
            <h2>Welcome to Your Dashboard, {name}!</h2>
            <p>Here you can manage your classes and upload modules for students and parents.</p>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="classes-section">
            <h2>My Classes</h2>
            <div className="classes-list">
              {classes.map((cls) => (
                <div key={cls.id} className="class-card" onClick={() => {
                  setSelectedClass(cls.id);
                  fetchStudents(cls.id);
                }}>
                  <h3>{cls.name}</h3>
                  <p>{cls.description}</p>
                </div>
              ))}
            </div>

            {selectedClass && (
              <div className="students-list">
                <h3>Students in {classes.find((cls) => cls.id === selectedClass).name}</h3>
                <ul>
                  {students.map((student) => (
                    <li key={student.id}>{student.name}</li>
                  ))}
                </ul>
              </div>
            )}
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

        {activeTab === "modules" && (
          <div className="modules-section">
            <h2>Upload Modules</h2>
            <div className="module-form">
              <label>Title:</label>
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />

              <label>Description:</label>
              <textarea
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
              />

              <label>Video File:</label>
              <input type="file" accept="video/*" onChange={handleModuleFileChange} />

              <button onClick={uploadModule}>Upload Module</button>
            </div>

            <h2>Uploaded Modules</h2>
            <div className="modules-list">
              {modules.map((module) => (
                <div key={module.id} className="module-item">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <video controls src={module.fileUrl} style={{ width: "100%", maxWidth: "500px" }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;