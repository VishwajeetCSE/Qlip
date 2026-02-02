// === STATE ===
let isLoggedIn = false;
let currentModeIndex = 0;
const modes = ["Random", "Study", "Funny", "Tech"];

// === 1. GESTURE CONTROLS (Tap, Hold, Swipe) ===
document.addEventListener("DOMContentLoaded", () => {
  // Setup Video Observers for Autoplay
  const videos = document.querySelectorAll("video");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play();
          entry.target.muted = true; // Default mute for browsers
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.6 },
  );
  videos.forEach((v) => observer.observe(v));

  // Add Gesture Listeners to all Wrappers
  document.querySelectorAll(".video-wrapper").forEach((wrapper) => {
    setupGestures(wrapper);
  });
});

function setupGestures(wrapper) {
  const video = wrapper.querySelector("video");
  const muteIcon = wrapper.querySelector(".mute-indicator");
  let touchStartTime = 0;
  let touchStartX = 0;
  let isLongPress = false;
  let longPressTimer;

  // --- MUTE & LONG PRESS (PAUSE) ---
  wrapper.addEventListener("touchstart", (e) => {
    touchStartTime = Date.now();
    touchStartX = e.touches[0].clientX;
    isLongPress = false;

    // Start Long Press Timer
    longPressTimer = setTimeout(() => {
      isLongPress = true;
      video.pause(); // Pause video
      wrapper.style.opacity = "0.8"; // Dim effect
    }, 500); // 500ms = Long Press
  });

  wrapper.addEventListener("touchend", (e) => {
    clearTimeout(longPressTimer);
    wrapper.style.opacity = "1";
    const touchEndTime = Date.now();
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;

    // If Long Press was active, just resume play
    if (isLongPress) {
      video.play();
      return;
    }

    // --- SWIPE LOGIC (Left/Right) ---
    if (Math.abs(diffX) > 50) {
      // If swiped more than 50px
      if (diffX > 0) {
        // Swiped Right -> Forward 5s
        video.currentTime += 5;
        showSeek(wrapper, "right");
      } else {
        // Swiped Left -> Backward 5s
        video.currentTime -= 5;
        showSeek(wrapper, "left");
      }
      return;
    }

    // --- SINGLE TAP (MUTE TOGGLE) ---
    // If it was a short tap and no swipe
    if (touchEndTime - touchStartTime < 300) {
      video.muted = !video.muted;
      // Show icon briefly
      muteIcon.innerHTML = video.muted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';
      muteIcon.style.display = "block";
      setTimeout(() => {
        muteIcon.style.display = "none";
      }, 800);
    }
  });

  // Mouse support for desktop testing
  wrapper.addEventListener("mousedown", () => {
    longPressTimer = setTimeout(() => {
      video.pause();
      wrapper.style.opacity = "0.8";
    }, 500);
  });
  wrapper.addEventListener("mouseup", () => {
    clearTimeout(longPressTimer);
    video.play();
    wrapper.style.opacity = "1";
  });
  wrapper.addEventListener("click", () => {
    video.muted = !video.muted;
  });
}

function showSeek(wrapper, direction) {
  const el = wrapper.querySelector(`.seek-${direction}`);
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 800);
}

// === 2. MODE SWITCHING ===
function switchMode() {
  currentModeIndex = (currentModeIndex + 1) % modes.length;
  const modeName = modes[currentModeIndex];
  document.getElementById("current-mode").innerText = modeName;
  alert(`Switched to ${modeName} Mode! (Loading videos...)`);
  // In real backend, you would fetch new videos here
}

// === 3. SEARCH & LOGINS ===
function toggleSearch() {
  const modal = document.getElementById("search-modal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function checkLogin() {
  if (!isLoggedIn) {
    document.getElementById("login-modal").style.display = "flex";
    return false;
  }
  return true;
}

function closeLogin() {
  document.getElementById("login-modal").style.display = "none";
}

function loginWithGoogle() {
  // Simulated Google Login
  setTimeout(() => {
    isLoggedIn = true;
    closeLogin();
    alert("Logged in with Google as User_Google_123");
  }, 1000);
}

// === 4. COMMENTS & LIKES ===
function openComments() {
  if (checkLogin())
    document.getElementById("comment-modal").classList.add("open");
}
function closeComments() {
  document.getElementById("comment-modal").classList.remove("open");
}
function handleLike(btn) {
  if (checkLogin()) {
    const icon = btn.querySelector("i");
    icon.classList.toggle("liked");
    icon.style.color = icon.classList.contains("liked") ? "#ff2f92" : "white";
  }
}
function performLogin(e) {
  e.preventDefault();
  isLoggedIn = true;
  closeLogin();
  alert("Login Successful!");
}
