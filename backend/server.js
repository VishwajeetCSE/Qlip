require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Serve the frontend (css/js/assets)
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- 1. MODELS (MUST BE FIRST) ----------
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  }),
);

const Video = mongoose.model(
  "Video",
  new mongoose.Schema({
    url: String,
    user: String,
    description: String,
  }),
);

// ---------- 2. DEMO DATA ----------
const demoVideos = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: "BunnyHop",
    description: "Big Buck Bunny 🐰 #funny",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: "FireMaster",
    description: "Blazing Demo 🔥 #tech",
  },
];

// ---------- 3. DATABASE CONNECTION ----------
const mongoUri = process.env.MONGO_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log("✅ DB Connected");
      const count = await Video.countDocuments();
      if (count === 0) {
        await Video.insertMany(demoVideos);
        console.log("✅ Demo videos added");
      }
    })
    .catch((err) => console.error("❌ DB Error:", err));
} else {
  console.warn("⚠️ MONGO_URI not set; serving demo videos only.");
}

// ---------- 4. ROUTES ----------
app.get("/api/videos", async (req, res) => {
  try {
    if (!mongoUri || mongoose.connection.readyState !== 1) {
      return res.json(demoVideos);
    }
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    console.error("❌ Error fetching videos:", err);
    res.json(demoVideos);
  }
});

// Fallback to index.html - use safe catch-all route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
