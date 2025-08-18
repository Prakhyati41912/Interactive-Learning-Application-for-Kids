import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/previewvideos.css";

const PreviewVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchPreviewVideos();

    const interval = setInterval(fetchPreviewVideos, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPreviewVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/preview-videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching preview videos:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>

      <h2>Preview Videos</h2>
      {videos.length === 0 ? (
        <p>No videos available for preview</p>
      ) : (
        <div>
          {videos.map((video) => (
            <div key={video.name} style={{ marginBottom: "20px" }}>
              <h4>{video.name}</h4>
              <video width="600" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewVideos;
