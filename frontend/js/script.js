require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ DB Connected");

    // Insert demo videos if empty
    const count = await Video.countDocuments();
    if (count === 0) {
      console.log("🎬 Inserting demo videos...");
      await Video.insertMany(demoVideos);
      console.log("✅ Demo videos added");
    }
  })
  .catch((err) => console.error("❌ DB Error:", err));

// ================= MODELS =================
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

// ================= DEMO VIDEOS (HTTPS SAFE) =================
const demoVideos = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: "BunnyHop",
    description: "Big Buck Bunny 🐰 #funny",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    user: "Dreamer",
    description: "Elephant Dream 🎥 #creative",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: "FireMaster",
    description: "Blazing Demo 🔥 #tech",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    user: "FunZone",
    description: "More Fun 😎 #trending",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    user: "JoyRide",
    description: "Joy Ride 🚗 #travel",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    user: "MeltDown",
    description: "Meltdown 💥 #viral",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    user: "Sintel",
    description: "Epic Animation ⚔️ #movie",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    user: "CarGuru",
    description: "Car Test Drive 🚙 #auto",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    user: "SteelHero",
    description: "Tears of Steel 🤖 #sci-fi",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    user: "AutoReview",
    description: "GTI Review 🚘 #review",
  },
];

// ================= ROUTES =================
app.post("/api/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.json({ success: true, username: user.username });
  else res.status(401).json({ error: "Wrong credentials" });
});

app.get("/api/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// ================= FRONTEND FALLBACK =================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
