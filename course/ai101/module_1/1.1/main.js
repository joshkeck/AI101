import episode from "./episode.js";
import config from "./config.js";

// Function to resolve a relative path to an absolute GitHub Pages URL
function toAbsoluteURL(relPath) {
  // The base should match your deployed site
  const GH_PAGES_BASE = "https://joshkeck.github.io/AI101/course/ai101/";
  return GH_PAGES_BASE + relPath.replace(/^\.?\//, ""); // remove leading ./
}

// Fix playlist configs to be absolute URLs
if (Array.isArray(config.playlist)) {
  config.playlist.forEach(item => {
    if (item.config && !item.config.startsWith("http")) {
      item.config = toAbsoluteURL(item.config);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the player with fixed config
  window.podlovePlayer("#app", episode, config);
});