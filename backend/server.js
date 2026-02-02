require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"));

// USER MODEL
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  }),
);

// VIDEO MODEL
const Video = mongoose.model(
  "Video",
  new mongoose.Schema({
    url: String,
    user: String,
    description: String,
  }),
);

// AUTH ROUTES
app.post("/api/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "User exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.json({ success: true, username: user.username });
  else res.status(401).json({ error: "Wrong credentials" });
});

// GET VIDEOS
app.get("/api/videos", async (req, res) => {
  res.json(await Video.find());
});

// Replace your old app.listen with this:
const PORT = process.env.PORT || 3000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
