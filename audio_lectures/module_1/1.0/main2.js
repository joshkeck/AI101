
import episodeUrl from './episode_URL.js';
import configUrl  from './config_URL.js';

document.addEventListener('DOMContentLoaded', () => {
  podlovePlayer('#app', configUrl, episodeUrl);
});