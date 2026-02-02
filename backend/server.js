require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serving Frontend from Sibling Folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Video Schema
const VideoSchema = new mongoose.Schema({
  url: String,
  category: String,
  user: String,
  description: String,
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
});
const Video = mongoose.model("Video", VideoSchema);

// API Routes
app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === RESET & SEED ROUTE (Now using your local video) ===
app.get("/seed", async (req, res) => {
  try {
    // 1. Delete all existing videos
    await Video.deleteMany({});

    // 2. Add your personal video
    const dummyVideos = [
      {
        url: "/videos/myvideo.mp4", // Path to your file in Qlip/frontend/videos/
        category: "My Clips",
        user: "Vishwajeet",
        description: "Testing my own video in Qlip! 🎥",
        likes: 10,
        comments: 5,
      },
    ];

    await Video.insertMany(dummyVideos);
    res.send("✅ Database Cleared & Your Local Video Added!");
  } catch (err) {
    res.status(500).send("Error seeding data: " + err.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
