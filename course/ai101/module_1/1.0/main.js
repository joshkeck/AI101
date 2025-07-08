import episode from "./episode.js";
import config from "./config.js";

// Fix up playlist paths as before
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

// Utility to extract the config URL of the currently loaded episode
function getCurrentEpisodeConfigUrl(episode) {
  // Try to match the property you use for config references, for example:
  // If you have a unique "config" field in your playlist, try to match that.
  // This example assumes episode JSON is loaded from a URL like .../module_1/1.1/episode.json
  // and your playlist config URLs are absolute.
  // You might need to adapt this function depending on your actual structure.
  return episode?.config || window.location.href.split('/').slice(0, -1).join('/') + '/episode.json';
}

document.addEventListener("DOMContentLoaded", () => {
  window.podlovePlayer("#app", episode, config);

  window.addEventListener("podloveplayerready", function () {
    const player = document.querySelector("#app").podlove;
    if (!player) return;

    // Try to match the currently loaded episode to the playlist index
    const currentConfigUrl = getCurrentEpisodeConfigUrl(episode);

    // Find matching index in the playlist
    const playlistIdx = config.playlist.findIndex(item => item.config === currentConfigUrl);

    if (playlistIdx !== -1) {
      // Dispatch selection so the playlist state is correct
      player.store.dispatch({ type: "PLAYLIST_SELECT", index: playlistIdx });
    }

    // Autoplay next logic as before
    window.addEventListener("podloveplayerplaybackend", function () {
      const state = player.store.getState();
      const { playlist, playlistIndex } = state;

      if (playlistIndex < playlist.length - 1) {
        player.store.dispatch({ type: "PLAYLIST_NEXT" });
        const unsubscribe = player.store.subscribe(() => {
          const newIndex = player.store.getState().playlistIndex;
          if (newIndex === playlistIndex + 1) {
            player.play();
            unsubscribe();
          }
        });
      }
    });
  }, { once: true });
});
