// ---------- State ----------
let videos = [];
let currentMode = "Random";

// ---------- Helpers ----------
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

function toggleModeMenu() {
  qs("#mode-menu").classList.toggle("open");
}

function selectMode(mode) {
  currentMode = mode;
  qs("#current-mode").innerHTML = `${mode} <i class="fas fa-caret-down"></i>`;
  qs("#mode-menu").classList.remove("open");
  // Optional: filter videos client-side by mode/tag
}

// ---------- Search ----------
function toggleSearch() {
  qs("#search-modal").classList.toggle("open");
  if (qs("#search-modal").classList.contains("open")) {
    qs("#search-input").focus();
  }
}

// ---------- Comments ----------
function openComments(videoId) {
  qs("#comment-modal").classList.add("open");
  // TODO: fetch comments by videoId and render into #comments-list
}

function closeComments() {
  qs("#comment-modal").classList.remove("open");
}

function postComment() {
  const input = qs("#comment-input");
  if (!input.value.trim()) return;
  // TODO: POST /api/videos/:id/comments
  input.value = "";
}

// ---------- Login ----------
function checkLogin() {
  qs("#login-modal").classList.add("open");
}

function closeLogin() {
  qs("#login-modal").classList.remove("open");
}

function loginWithGoogle() {
  alert("Google login not yet implemented.");
}

async function performLogin(e) {
  e.preventDefault();
  const [emailEl, passEl] = qsa("#login-form input");
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: emailEl.value, password: passEl.value }),
    });
    if (!res.ok) throw new Error("Wrong credentials");
    const data = await res.json();
    alert(`Welcome ${data.username || "back"}!`);
    closeLogin();
  } catch (err) {
    alert(err.message || "Login failed");
  }
}

// ---------- Feed rendering ----------
function renderVideos(list) {
  const container = qs("#reels-container");
  container.innerHTML = "";
  list.forEach((v) => {
    const card = document.createElement("div");
    card.className = "reel-card";
    card.innerHTML = `
      <video class="reel-video" src="${v.url}" controls playsinline preload="metadata"></video>
      <div class="reel-meta">
        <div class="user">@${v.user || "anon"}</div>
        <div class="desc">${v.description || ""}</div>
        <div class="actions">
          <button class="btn glass" data-id="${v._id || ""}" onclick="openComments('${v._id || ""}')">
            <i class="fas fa-comment"></i> Comment
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ---------- Data fetch ----------
async function loadVideos() {
  try {
    const res = await fetch("/api/videos");
    videos = await res.json();
    renderVideos(videos);
  } catch (err) {
    console.error("Failed to load videos", err);
    qs("#reels-container").innerHTML =
      '<p style="color:#f66; text-align:center;">Failed to load videos.</p>';
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  loadVideos();

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const modeMenu = qs("#mode-menu");
    if (
      modeMenu &&
      modeMenu.classList.contains("open") &&
      !modeMenu.contains(e.target) &&
      !qs(".logo-container").contains(e.target)
    ) {
      modeMenu.classList.remove("open");
    }
  });
});
