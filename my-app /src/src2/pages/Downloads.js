import React, { useEffect, useState, useRef } from "react";
import "../styles/downloads.css";

const Downloads = () => {
  const [downloadedVideos, setDownloadedVideos] = useState([]);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedDownloads = JSON.parse(localStorage.getItem("downloads")) || [];
    setDownloadedVideos(storedDownloads);
  }, []);

  const handleDelete = (index) => {
    const updatedDownloads = downloadedVideos.filter((_, i) => i !== index);
    setDownloadedVideos(updatedDownloads);
    localStorage.setItem("downloads", JSON.stringify(updatedDownloads));
  };

  const toggleMenu = (index) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  

  return (
    <div className="downloads-container">
      <h1>Downloaded Videos</h1>
      {downloadedVideos.length === 0 ? (
        <p>No videos downloaded yet.</p>
      ) : (
        <div className="video-list">
          {downloadedVideos.map((video, index) => (
            <div key={index} className="video-item">
              <video controls src={video} width="320" height="180" />
              
              {/* Three-dot menu */}
              <div className="menu">
                <span className="menu-dots" onClick={() => toggleMenu(index)}>
                  ⋮
                </span>
                {menuOpenIndex === index && (
                  <div className="dropdown" ref={menuRef}>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
