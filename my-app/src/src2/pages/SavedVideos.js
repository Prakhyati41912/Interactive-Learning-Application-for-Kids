import React, { useEffect, useState, useRef } from "react";
import "../styles/savedvideos.css";

const SavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  // Fetch saved videos from backend
  const fetchSavedVideos = async () => {
    try {
      const response = await fetch("http://localhost:5000/saved-videos");
      const data = await response.json();

      console.log("Fetched saved videos:", data); // Debugging log

      if (Array.isArray(data) && data.length > 0) {
        setSavedVideos(data);
      } else {
        console.warn("No saved videos found or incorrect format:", data);
        setSavedVideos([]); // Ensure empty state is handled
      }
    } catch (err) {
      console.error("Error fetching saved videos:", err);
    }
  };

  // Delete video from backend and update state
  const handleDelete = async (videoName) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-saved-video/${videoName}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setSavedVideos((prev) => prev.filter((video) => video.name !== videoName));
      } else {
        console.error("Failed to delete video:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };
  

  // Handle video download
  const handleDownload = (video) => {
    const storedDownloads = JSON.parse(localStorage.getItem("downloads")) || [];

    // Check if the video is already downloaded
    if (storedDownloads.includes(video.url)) {
      alert("Video is already in downloads.");
      return;
    }

    // Download the video
    const link = document.createElement("a");
    link.href = video.url;
    link.download = video.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Store in localStorage
    storedDownloads.push(video.url);
    localStorage.setItem("downloads", JSON.stringify(storedDownloads));
  };

  // Toggle menu visibility
  const toggleMenu = (index) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  return (
    <div className="saved-videos-container">
      <h2>Saved Videos</h2>

      {savedVideos.length === 0 ? (
        <p className="no-videos">No saved videos yet.</p>
      ) : (
        <div className="saved-videos-list">
          {savedVideos.map((video, index) =>
            video?.url && video?.name ? (
              <div key={index} className="video-card">
                <video controls src={video.url} />
                <p>{video.name}</p>

                {/* Three-dot menu */}
                <div className="menu">
                  <span className="menu-dots" onClick={() => toggleMenu(index)}>
                    ⋮
                  </span>
                  {menuOpenIndex === index && (
                    <div className="dropdown" ref={menuRef}>
                      <button onClick={() => handleDownload(video)}>Download</button>
                      <button onClick={() => handleDelete(video.name)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p key={index} className="no-videos">Invalid video data</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SavedVideos;
