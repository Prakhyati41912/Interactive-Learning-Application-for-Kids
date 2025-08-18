import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/uploadedvideos.css";

const UploadedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [feedbackCounts, setFeedbackCounts] = useState({});

  useEffect(() => {
    fetchVideos();
    fetchSavedVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/videos");
      setVideos(response.data);
      // Fetch feedback counts for each video
      response.data.forEach(async (video) => {
        const feedbackResponse = await axios.get(`http://localhost:5000/feedback/${video.name}`);
        setFeedbackCounts((prev) => ({
          ...prev,
          [video.name]: feedbackResponse.data,
        }));
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchSavedVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/saved-videos");
      setSavedVideos(response.data.map((video) => video.name));
    } catch (error) {
      console.error("Error fetching saved videos:", error);
    }
  };

  const handleDelete = async (videoName) => {
    try {
      await axios.delete(`http://localhost:5000/delete-video/${videoName}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video.name !== videoName));
      alert("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleDownload = (videoUrl, videoName) => {
    const storedDownloads = JSON.parse(localStorage.getItem("downloads")) || [];

    if (storedDownloads.includes(videoUrl)) {
      alert("This video is already downloaded");
      return;
    }

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = videoName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    storedDownloads.push(videoUrl);
    localStorage.setItem("downloads", JSON.stringify(storedDownloads));
  };

  const handleSave = async (video) => {
    if (savedVideos.includes(video.name)) {
      alert("Video already saved!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/save-video", {
        name: video.name,
        url: video.url,
      });

      if (response.data.success) {
        setSavedVideos((prevSaved) => [...prevSaved, video.name]);
        alert("Video saved successfully!");
      } else {
        alert("Failed to save video.");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      alert("An error occurred while saving the video.");
    }
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleReportClick = () => {
    setShowReportDropdown(true);
  };

  const handleCancelReport = () => {
    setShowReportDropdown(false);
    setSelectedReason("");
    setCustomReason("");
  };

  const handleSubmitReport = async () => {
    if (selectedReason === "other" && customReason.trim() === "") {
      alert("Please provide a reason for your report.");
      return;
    }
  
    const reportData = {
      title: "Video Report", // You can customize this title
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
  const handleFeedback = async (videoName, feedbackType) => {
    try {
      const response = await axios.post("http://localhost:5000/submit-feedback", {
        videoName,
        feedbackType,
      });

      if (response.data.success) {
        // Update feedback counts in state
        setFeedbackCounts((prev) => ({
          ...prev,
          [videoName]: response.data.feedbackData,
        }));
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="videos-container">
      <h1 className="center-heading">Uploaded Videos</h1>
      {videos.length === 0 ? (
        <p className="no-videos">No videos uploaded yet.</p>
      ) : (
        <div className="video-list">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <video controls src={video.url} className="video-player" />
              <div className="menu">
                <span className="menu-dots" onClick={() => toggleMenu(index)}>
                  &#x22EE;
                </span>
                {openMenuIndex === index && (
                  <div className="dropdown">
                    <button onClick={() => handleDownload(video.url, video.name)}>Download</button>
                    <button onClick={() => handleSave(video)}>Save</button>
                    <button onClick={() => handleDelete(video.name)}>Delete</button>
                    <button
                      className="report-button"
                      style={{ color: "red", fontSize: "20px" }}
                      onClick={handleReportClick}
                    >
                      Report
                    </button>
                  </div>
                )}
              </div>
              {/* Feedback Section */}
              <div className="feedback">
                <button onClick={() => handleFeedback(video.name, "thumbsUp")}>
                  👍 {feedbackCounts[video.name]?.thumbsUp || 0}
                </button>
                <button onClick={() => handleFeedback(video.name, "thumbsDown")}>
                  👎 {feedbackCounts[video.name]?.thumbsDown || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReportDropdown && (
        <div className="report-container">
          <h3>Report Video</h3>
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
            <button className="submit-report" onClick={handleSubmitReport}>
              Submit
            </button>
            <button className="cancel-report" onClick={handleCancelReport}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadedVideos;