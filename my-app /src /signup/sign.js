import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./sign.css";
import { auth, db } from "../firebaseConfig"; // Import Firebase auth and db

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "child" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // State for terms acceptance
  const [adminKey, setAdminKey] = useState(""); // State for admin key
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if terms are accepted
    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions and Permissions to sign up.");
      setLoading(false);
      return;
    }

    // Check if admin key is provided for admin role
    if (formData.role === "admin" && adminKey !== "your-secret-admin-key") {
      setError("Invalid admin key.");
      setLoading(false);
      return;
    }

    const { name, email, password, role } = formData;

    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Send email verification
      await sendEmailVerification(user);
      console.log("Verification email sent to:", user.email);

      // Step 3: Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Save the user's UID
        name,
        email,
        role,
        emailVerified: false, // Track email verification status
        createdAt: new Date().toISOString(), // Add a timestamp
      });

      alert("Signup successful! Please check your email to verify your account.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Signup Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* Admin Key Input (Only shown for Admin role) */}
          {formData.role === "admin" && (
            <div className="admin-key-container">
              <label>Admin Key:</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                required
              />
            </div>
          )}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Terms and Conditions Checkbox */}
          <div className="terms-container">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="/permissions" target="_blank" rel="noopener noreferrer">
                Permissions
              </a>
              .
            </label>
          </div>

          <button type="submit" disabled={loading || !acceptedTerms}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;