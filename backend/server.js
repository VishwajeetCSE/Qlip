require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// -------------------- MODELS --------------------
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

// -------------------- AUTH ROUTES --------------------
app.post("/api/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) {
    res.json({ success: true, username: user.username });
  } else {
    res.status(401).json({ error: "Wrong credentials" });
  }
});

// -------------------- VIDEO ROUTES --------------------
app.get("/api/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// -------------------- FRONTEND FALLBACK --------------------
// VERY IMPORTANT FOR RENDER
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
