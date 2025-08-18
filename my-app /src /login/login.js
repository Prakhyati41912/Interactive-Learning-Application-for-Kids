import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig"; // Import Firebase auth and db
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./login.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "child" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(""); // State for password reset message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { email, password, role } = formData;

    try {
      // Step 1: Check network connection
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.");
      }

      // Step 2: Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User authenticated. UID:", user.uid);

      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      // Step 3: Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User data not found. Please sign up first.");
      }

      const userData = userDoc.data();
      console.log("User data:", userData);

      // Step 4: Compare the selected role with the role stored in Firestore
      if (userData.role !== role) {
        throw new Error(`Incorrect role selected. This email is registered as ${userData.role}.`);
      }

      // Step 5: Update login state and redirect
      localStorage.setItem("userName", userData.name);
      setIsLoggedIn(true); // Update login state

      // Redirect based on role
      const roleRoutes = {
        child: "/child-dashboard",
        parent: "/parent-dashboard",
        teacher: "/teacher-dashboard",
        admin: "/admin-dashboard", // Add admin route
      };

      navigate(roleRoutes[role]); // Redirect to the appropriate dashboard
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    setError(null);
    setResetMessage("");

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetMessage("A password reset email has been sent. Please check your inbox.");
    } catch (err) {
      console.error("Password Reset Error:", err.message);
      setError("Failed to send reset email. Please check if the email is correct.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        {resetMessage && <p className="login-success">{resetMessage}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Role:</label>
            <select
              className="form-input"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="child">Child</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option> {/* Add Admin option */}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password Link */}
          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;