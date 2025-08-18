import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUpload, FaVideo, FaDownload, FaQuestionCircle, FaPlayCircle, FaSave } from "react-icons/fa";
import { auth, db } from "./firebaseConfig"; // Make sure to import your Firebase config
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className={`dashboard ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FaBars />
      </button>
      <nav>
        <ul>
          {isAdmin && (
            <li>
              <Link to="/upload">
                <FaUpload className="icon" /> <span className="link-text">{!isCollapsed && "Upload Video"}</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/uploaded">
              <FaVideo className="icon" /> <span className="link-text">{!isCollapsed && "Uploaded Videos"}</span>
            </Link>
          </li>
          <li>
            <Link to="/saved">
              <FaSave className="icon" /> <span className="link-text">{!isCollapsed && "Saved Videos"}</span>
            </Link>
          </li>
          <li>
            <Link to="/downloads">
              <FaDownload className="icon" /> <span className="link-text">{!isCollapsed && "Downloads"}</span>
            </Link>
          </li>
          <li>
            <Link to="/quizzes">
              <FaQuestionCircle className="icon" /> <span className="link-text">{!isCollapsed && "Quizzes"}</span>
            </Link>
          </li>
          <li>
            <Link to="/preview">
              <FaPlayCircle className="icon" /> <span className="link-text">{!isCollapsed && "Preview Videos"}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;