import episode from "./episode.js";
import config from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the player
  window.podlovePlayer("#app", episode, config);
});

