// --- 1. GLOBAL OBSERVER: Stops videos from playing at the same time ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  },
  { threshold: 0.8 },
);

// --- 2. AUTH CHECK: Redirects guests if they try to interact ---
function checkAuth(actionName) {
  const user = localStorage.getItem("user");
  if (!user) {
    sessionStorage.setItem("redirectAfterLogin", window.location.href);
    alert(`Please login to ${actionName}!`);
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

// --- 3. GESTURES: Double-tap to like, Single-tap to mute ---
function setupGestures(reel, video) {
  let lastTap = 0;
  const heart = reel.querySelector(".heart-animation");

  reel.addEventListener("click", () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double Tap Action
      if (checkAuth("like videos")) {
        heart.classList.add("animate");
        setTimeout(() => heart.classList.remove("animate"), 800);
        console.log("Liked by:", localStorage.getItem("user"));
      }
    } else {
      // Single Tap Action
      video.muted = !video.muted;
      const overlay = reel.querySelector(".volume-overlay");
      if (overlay) {
        overlay.querySelector("i").className = video.muted
          ? "fas fa-volume-mute"
          : "fas fa-volume-up";
        overlay.classList.add("show");
        setTimeout(() => overlay.classList.remove("show"), 1000);
      }
    }
    lastTap = now;
  });
}

// --- 4. LOAD VIDEOS: Fetches from your Port 3000 Backend ---
async function loadVideos() {
  const container = document.getElementById("reels-container");
  try {
    const res = await fetch("/api/videos");
    const videos = await res.json();
    container.innerHTML = "";

    videos.forEach((video) => {
      const reel = document.createElement("div");
      reel.className = "reel";
      reel.innerHTML = `
                <div class="video-wrapper">
                    <video class="video-player" src="${video.url}" loop muted playsinline></video>
                    <div class="volume-overlay"><i class="fas fa-volume-up"></i></div>
                    <div class="heart-animation"><i class="fas fa-heart"></i></div>
                </div>
                <div class="reel-details">
                    <strong>@${video.user}</strong>
                    <p>${video.description}</p>
                </div>`;

      const videoEl = reel.querySelector("video");
      container.appendChild(reel);
      setupGestures(reel.querySelector(".video-wrapper"), videoEl);
      observer.observe(videoEl);
    });
    updateUI();
  } catch (err) {
    console.error("Load Error:", err);
  }
}

// --- 5. UI UPDATE: Handles Logout ---
function updateUI() {
  const user = localStorage.getItem("user");
  const userIcon = document.querySelector(".fa-user");
  if (user && userIcon) {
    userIcon.parentElement.onclick = () => {
      if (confirm(`Logout from ${user}?`)) {
        localStorage.removeItem("user");
        location.reload();
      }
    };
  }
}

window.onload = loadVideos;
