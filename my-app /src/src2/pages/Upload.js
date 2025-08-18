import React, { useState } from "react";
import axios from "axios";
import "../styles/upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage(`Selected: ${file.name}`);
    } else {
      setMessage("");
    }
  };

  // Check if the video is already uploaded
  const checkIfVideoExists = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/check-video?name=${fileName}`);
      return response.data.exists; // true if the video is already uploaded
    } catch (error) {
      console.error("Error checking video:", error);
      return false; // Assume it doesn't exist in case of an error
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file first.");
      return;
    }

    const fileName = selectedFile.name;

    // Check if the video is already uploaded
    const exists = await checkIfVideoExists(fileName);
    if (exists) {
      alert("Video is already uploaded.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    setIsUploading(true);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", response.data);
      if (response.data.success) {
        alert("Upload Successful!");
        window.location.href = "/uploaded-videos";
      } else {
        throw new Error("Upload failed.");
      }
    } catch (error) {
      console.error("Upload Failed:", error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error); // Display server error message
      } else {
        alert("Upload Failed.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h1>Upload Your Video</h1>
        <label htmlFor="file-upload" className="upload-label">
          {message || "Choose a Video File"}
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} accept="video/*" />
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {message && <p className="upload-message">{message}</p>}
      </div>
    </div>
  );
};

export default Upload;
