const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// Initialize Firebase
const serviceAccount = require("./kidquest-2840b-eefa40221aeb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kidquest-2840b-default-rtdb.firebaseio.com/",
});

const db = admin.database();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only video files are allowed."), false);
    }
  },
});

// Upload video metadata to Firebase Realtime Database
app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileName = req.file.filename;
  const originalFileName = req.file.originalname;
  const videoUrl = `http://localhost:${PORT}/uploads/${fileName}`;

  try {
    const allVideosRef = db.ref("allVideos");
    const snapshot = await allVideosRef.once("value");
    const allVideos = snapshot.val() || {};

    // Check if a video with the same original name already exists
    const videoExists = Object.values(allVideos).some((video) => video.originalName === originalFileName);
    if (videoExists) {
      // Delete the uploaded file
      fs.unlink(path.join(uploadDir, fileName), (err) => {
        if (err) console.error("Failed to delete duplicate file:", err);
      });

      return res.status(400).json({ error: "This video is already uploaded." });
    }

    // Add new video to the database
    const newVideoRef = allVideosRef.push(); // Creates a new unique entry
    await newVideoRef.set({
      name: fileName,
      originalName: originalFileName,
      url: videoUrl,
      timestamp: Date.now(),
    });

    res.json({ success: true, fileUrl: videoUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to store video" });
  }
});

app.post("/upload-check", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing video name" });

  try {
    const allVideosRef = db.ref("allVideos");
    const snapshot = await allVideosRef.once("value");
    const allVideos = snapshot.val() || {};

    const videoExists = Object.values(allVideos).some((video) => video.originalName === name);
    res.json({ success: !videoExists });
  } catch (error) {
    res.status(500).json({ error: "Failed to check for duplicate videos" });
  }
});

// Submit a report to Firebase
app.post("/submit-report", async (req, res) => {
  const { title, description, reporter } = req.body;

  if (!title || !description || !reporter) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const reportsRef = db.ref("reports");
    const newReportRef = reportsRef.push(); // Creates a new unique entry
    await newReportRef.set({
      id: newReportRef.key,
      title,
      description,
      reporter,
      timestamp: Date.now(),
    });

    res.json({ success: true, message: "Report submitted successfully" });
  } catch (error) {
    console.error("Report submission error:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// Fetch all reports
app.get("/reports", async (req, res) => {
  try {
    const snapshot = await db.ref("reports").once("value");
    const reports = snapshot.val() || {};
    res.json(Object.values(reports));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Fetch all uploaded videos
app.get("/videos", async (req, res) => {
  try {
    const snapshot = await db.ref("allVideos").once("value");
    const allVideos = snapshot.val() || {};

    // Convert the object of videos into an array
    const videosArray = Object.values(allVideos);

    res.json(videosArray);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Fetch the latest 2 uploaded videos for preview
app.get("/preview-videos", async (req, res) => {
  try {
    const snapshot = await db.ref("allVideos").once("value");
    const allVideos = snapshot.val() || {};

    // Convert the object of videos into an array
    const videosArray = Object.values(allVideos);

    // Sort by timestamp and get the latest 2 videos
    videosArray.sort((a, b) => b.timestamp - a.timestamp);
    const previewVideos = videosArray.slice(0, 2);

    res.json(previewVideos);
  } catch (error) {
    console.error("Error fetching preview videos:", error);
    res.status(500).json({ error: "Failed to fetch preview videos" });
  }
});

// Delete a video from uploaded and saved videos
app.delete("/delete-video/:videoName", async (req, res) => {
  const videoName = req.params.videoName;
  const videosRef = db.ref("allVideos");
  const savedVideosRef = db.ref("savedVideos");

  try {
    // Delete from uploaded videos
    const snapshot = await videosRef.once("value");
    const allVideos = snapshot.val() || {};

    // Find the video to delete
    const videoKey = Object.keys(allVideos).find((key) => allVideos[key].name === videoName);
    if (!videoKey) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Remove the video from the database
    await videosRef.child(videoKey).remove();

    // Delete from saved videos
    const savedSnapshot = await savedVideosRef.once("value");
    const savedVideos = savedSnapshot.val() || {};

    const savedVideoKey = Object.keys(savedVideos).find((key) => savedVideos[key].name === videoName);
    if (savedVideoKey) {
      await savedVideosRef.child(savedVideoKey).remove();
    }

    // Delete the file from server storage
    fs.unlink(path.join(uploadDir, videoName), (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    res.json({ success: true, message: "Video deleted successfully from both uploaded and saved videos" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
});

// Delete a saved video
app.delete("/delete-saved-video/:videoName", async (req, res) => {
  const videoName = req.params.videoName;
  const savedVideosRef = db.ref("savedVideos");

  try {
    const snapshot = await savedVideosRef.once("value");
    const savedVideos = snapshot.val() || {};

    const savedVideoKey = Object.keys(savedVideos).find((key) => savedVideos[key].name === videoName);
    if (!savedVideoKey) {
      return res.status(404).json({ error: "Video not found in saved videos" });
    }

    await savedVideosRef.child(savedVideoKey).remove();
    res.json({ success: true, message: "Video deleted successfully from saved videos" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete video from saved videos" });
  }
});

// Save a video
app.post("/save-video", async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) return res.status(400).json({ error: "Invalid video data" });

  try {
    const savedVideosRef = db.ref("savedVideos");
    const snapshot = await savedVideosRef.once("value");
    const savedVideos = snapshot.val() || {};

    // Check if the video is already saved
    const videoExists = Object.values(savedVideos).some((video) => video.name === name);
    if (!videoExists) {
      const newVideoRef = savedVideosRef.push(); // Create a new unique entry
      await newVideoRef.set({ name, url });
    }

    res.json({ success: true, message: "Video saved successfully" });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save video" });
  }
});

// Fetch saved videos
app.get("/saved-videos", async (req, res) => {
  try {
    const snapshot = await db.ref("savedVideos").once("value");
    const savedVideos = snapshot.val() || {};

    // Convert the object of saved videos into an array
    const savedVideosArray = Object.values(savedVideos);

    res.json(savedVideosArray);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved videos" });
  }
});

// Add this endpoint to handle feedback
// Submit feedback
// Utility function to sanitize Firebase paths
const sanitizePath = (path) => {
  return path.replace(/[.#$\[\]]/g, "-"); // Replace invalid characters with "-"
};
app.post("/submit-feedback", async (req, res) => {
  const { videoName, feedbackType } = req.body;

  if (!videoName || !feedbackType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const sanitizedVideoName = sanitizePath(videoName); // Sanitize the video name
    const feedbackRef = db.ref("feedback").child(sanitizedVideoName);
    const snapshot = await feedbackRef.once("value");
    let feedbackData = snapshot.val() || { thumbsUp: 0, thumbsDown: 0 };

    if (feedbackType === "thumbsUp") {
      feedbackData.thumbsUp += 1;
    } else if (feedbackType === "thumbsDown") {
      feedbackData.thumbsDown += 1;
    }

    await feedbackRef.set(feedbackData);
    res.json({ success: true, feedbackData });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Fetch feedback counts
app.get("/feedback/:videoName", async (req, res) => {
  const videoName = req.params.videoName;

  try {
    const sanitizedVideoName = sanitizePath(videoName); // Sanitize the video name
    const feedbackRef = db.ref("feedback").child(sanitizedVideoName);
    const snapshot = await feedbackRef.once("value");
    const feedbackData = snapshot.val() || { thumbsUp: 0, thumbsDown: 0 };

    res.json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
module.exports = app;