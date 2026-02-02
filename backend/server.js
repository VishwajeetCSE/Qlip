require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Required for file paths

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// === CRITICAL CHANGE: Serving Frontend from Sibling Folder ===
// This tells the server: "Go up one level (..), then into 'frontend'"
app.use(express.static(path.join(__dirname, "../frontend")));

// Database Connection (Local)
const MONGO_URI = "mongodb://127.0.0.1:27017/qlipDB";

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

// Seed Route (Test Data)
app.get("/seed", async (req, res) => {
  const count = await Video.countDocuments();
  if (count > 0) return res.send("Data already exists.");

  await Video.insertMany([
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
      category: "Tech",
      user: "NeonGirl",
      description: "Cyberpunk vibes! 🤖 #tech",
      likes: 120,
    },
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
      category: "Nature",
      user: "NatureLover",
      description: "Peaceful 🌼",
      likes: 850,
    },
  ]);
  res.send("✅ Dummy Videos Added!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
