// Use a safe query selector to prevent null errors
const qs = (sel) => document.querySelector(sel);

async function loadVideos() {
  const container = qs("#reels-container");
  if (!container) return; // Prevents the crash if element isn't found

  try {
    // Using the absolute URL ensures it works on both Local and Render
    const res = await fetch("https://qlip-q0fa.onrender.com/api/videos");
    const videos = await res.json();

    container.innerHTML = "";
    videos.forEach((v) => {
      const card = document.createElement("div");
      card.className = "reel-card";
      card.innerHTML = `
        <video class="reel-video" src="${v.url}" loop playsinline></video>
        <div class="side-actions"> <div class="action-btn"><i class="fas fa-heart"></i><span>12k</span></div>
          <div class="action-btn"><i class="fas fa-comment"></i><span>450</span></div>
          <div class="action-btn"><i class="fas fa-share"></i></div>
        </div>
        <div class="reel-meta">
          <div class="user">@${v.user || "anon"}</div>
          <div class="desc">${v.description || ""}</div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load videos", err);
    container.innerHTML =
      '<p style="color:#f66; text-align:center;">Connect your MongoDB Cluster to see videos!</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadVideos);
