import episode from "./episode.js";
import config from "./config.js";

// -- Your absolute URL logic as before --
function toAbsoluteURL(relPath) {
  const GH_PAGES_BASE = "https://joshkeck.github.io/AI101/course/ai101/";
  return GH_PAGES_BASE + relPath.replace(/^\.?\//, "");
}
if (Array.isArray(config.playlist)) {
  config.playlist.forEach(item => {
    if (item.config && !item.config.startsWith("http")) {
      item.config = toAbsoluteURL(item.config);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  window.podlovePlayer("#app", episode, config);

  window.addEventListener("podloveplayerready", function () {
    const player = document.querySelector("#app").podlove;
    if (!player) return;

    player.pause(); // Always start paused

    // --- NEW: Track if playback was started from playlist ---
    let playlistMode = false;
    const unsubscribe = player.store.subscribe(() => {
      // Listen for the PLAYLIST_SELECT action in the Redux store
      const lastAction = player.store.getState().lastAction;
      if (lastAction && lastAction.type === "PLAYLIST_SELECT") {
        playlistMode = true;
      }
    });

    // On playback end, advance only if playlistMode is true AND not at last episode
    window.addEventListener("podloveplayerplaybackend", function () {
      const state = player.store.getState();
      const { playlist, playlistIndex } = state;

      if (playlistMode && playlistIndex < playlist.length - 1) {
        player.store.dispatch({ type: "PLAYLIST_NEXT" });
        const unsub = player.store.subscribe(() => {
          const newIndex = player.store.getState().playlistIndex;
          if (newIndex === playlistIndex + 1) {
            player.play();
            unsub();
          }
        });
      }
      // At end or if not playlistMode, just pause (no repeat)
    });

    // OPTIONAL: If user pauses manually, reset playlistMode
    window.addEventListener("podloveplayerpause", () => {
      playlistMode = false;
    });
  }, { once: true });
});
