import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making API calls
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate a unique user ID
import "../styles/quizzes.css";

const Quizzes = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [feedbackCounts, setFeedbackCounts] = useState({}); // Store feedback counts
  const [userId, setUserId] = useState(""); // Unique user identifier

  useEffect(() => {
    generateUserId(); // Generate a unique user ID when the component mounts
    fetchFeedbackCounts(); // Fetch feedback counts for quizzes
  }, []);

  // Generate a unique user ID
  const generateUserId = () => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
  };

  // Fetch feedback counts for quizzes
  const fetchFeedbackCounts = async () => {
    const quizzes = [
      "general-knowledge",
      "math",
      "fill-in-the-blanks",
      "true-false",
    ];
    const counts = {};
    for (const quiz of quizzes) {
      try {
        const response = await axios.get(`http://localhost:5000/feedback/${quiz}`);
        counts[quiz] = response.data;
      } catch (error) {
        console.error("Error fetching feedback counts:", error);
        counts[quiz] = { thumbsUp: 0, thumbsDown: 0 };
      }
    }
    setFeedbackCounts(counts);
  };

  const handleReportClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCancelReport = () => {
    setShowDropdown(false);
    setSelectedReason("");
    setCustomReason("");
  };

  const handleSubmitReport = async () => {
    if (selectedReason === "other" && customReason.trim() === "") {
      alert("Please provide a reason for your report.");
      return;
    }

    const reportData = {
      title: "Quiz Report", // You can customize this title
      description: selectedReason === "other" ? customReason : selectedReason,
      reporter: "Anonymous", // You can replace this with the actual reporter's name if available
    };

    try {
      const response = await axios.post("http://localhost:5000/submit-report", reportData);
      if (response.data.success) {
        alert(`Report submitted successfully: ${reportData.description}`);
        handleCancelReport();
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting the report.");
    }
  };

  const handleFeedback = async (quizName, feedbackType) => {
    try {
      const response = await axios.post("http://localhost:5000/submit-feedback", {
        videoName: quizName,
        feedbackType,
        userId, // Pass the user ID to the backend
      });

      if (response.data.success) {
        // Update feedback counts in state
        setFeedbackCounts((prev) => ({
          ...prev,
          [quizName]: response.data.feedbackData,
        }));
      } else if (response.data.error) {
        alert(response.data.error); // Show error message if feedback was already submitted
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="quizzes-container">
      {/* Report Button */}
      <button
        className="report-button"
        onClick={handleReportClick}
        style={{
          position: "fixed", // Fixed position to keep it in the top-right corner
          top: "20px", // Distance from the top
          left: "1700px", // Distance from the right
          zIndex: 1000, // Ensure it appears above other content
        }}
      >
        ⚠Report
      </button>

      {/* Report Dropdown */}
      {showDropdown && (
        <div className="report-dropdown-container">
          <h4>Report</h4>
          <select
            className="report-dropdown"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
          >
            <option value="">Select a reason</option>
            <option value="Invalid content">Invalid content</option>
            <option value="Offensive content">Offensive content</option>
            <option value="Incorrect content">Incorrect content</option>
            <option value="other">Other</option>
          </select>

          {selectedReason === "other" && (
            <textarea
              className="report-textarea"
              placeholder="Enter reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}

          <div className="report-buttons">
            <button className="submit-report" onClick={handleSubmitReport}>Submit</button>
            <button className="cancel-report" onClick={handleCancelReport}>Cancel</button>
          </div>
        </div>
      )}

      {/* Quiz Cards */}
      <h1 className="quizzes-title" style={{ textAlign: "center" }}>
  Welcome to the Quiz World!
</h1>
      <div className="quiz-cards">
        <div className="quiz-card-wrapper">
          <Link to="/quizzes/general-knowledge" className="quiz-card">
            <div className="card-content">
              <i className="fas fa-book quiz-icon"></i>
              <h2 className="quiz-category">General Knowledge</h2>
              <p className="quiz-description">Test your knowledge across a wide range of topics!</p>
            </div>
          </Link>
          {/* Feedback Section */}
          <div className="feedback">
            <button onClick={() => handleFeedback("general-knowledge", "thumbsUp")}>
              👍 {feedbackCounts["general-knowledge"]?.thumbsUp || 0}
            </button>
            <button onClick={() => handleFeedback("general-knowledge", "thumbsDown")}>
              👎 {feedbackCounts["general-knowledge"]?.thumbsDown || 0}
            </button>
          </div>
        </div>

        <div className="quiz-card-wrapper">
          <Link to="/quizzes/math" className="quiz-card">
            <div className="card-content">
              <i className="fas fa-square-root-alt quiz-icon"></i>
              <h2 className="quiz-category">Mathematical Puzzle</h2>
              <p className="quiz-description">Sharpen your math skills with brain-teasing puzzles!</p>
            </div>
          </Link>
          {/* Feedback Section */}
          <div className="feedback">
            <button onClick={() => handleFeedback("math", "thumbsUp")}>
              👍 {feedbackCounts["math"]?.thumbsUp || 0}
            </button>
            <button onClick={() => handleFeedback("math", "thumbsDown")}>
              👎 {feedbackCounts["math"]?.thumbsDown || 0}
            </button>
          </div>
        </div>

        <div className="quiz-card-wrapper">
          <Link to="/quizzes/fill-in-the-blanks" className="quiz-card">
            <div className="card-content">
              <i className="fas fa-edit quiz-icon"></i>
              <h2 className="quiz-category">Fill in the Blanks</h2>
              <p className="quiz-description">Complete the sentences and test your knowledge!</p>
            </div>
          </Link>
          {/* Feedback Section */}
          <div className="feedback">
            <button onClick={() => handleFeedback("fill-in-the-blanks", "thumbsUp")}>
              👍 {feedbackCounts["fill-in-the-blanks"]?.thumbsUp || 0}
            </button>
            <button onClick={() => handleFeedback("fill-in-the-blanks", "thumbsDown")}>
              👎 {feedbackCounts["fill-in-the-blanks"]?.thumbsDown || 0}
            </button>
          </div>
        </div>

        <div className="quiz-card-wrapper">
          <Link to="/quizzes/true-false" className="quiz-card">
            <div className="card-content">
              <i className="fas fa-check-circle quiz-icon"></i>
              <h2 className="quiz-category">True or False</h2>
              <p className="quiz-description">Answer simple true or false questions!</p>
            </div>
          </Link>
          {/* Feedback Section */}
          <div className="feedback">
            <button onClick={() => handleFeedback("true-false", "thumbsUp")}>
              👍 {feedbackCounts["true-false"]?.thumbsUp || 0}
            </button>
            <button onClick={() => handleFeedback("true-false", "thumbsDown")}>
              👎 {feedbackCounts["true-false"]?.thumbsDown || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;