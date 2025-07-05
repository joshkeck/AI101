
import episodeUrl from './episodeUrl.js';
import configUrl  from './configUrl.js';

document.addEventListener('DOMContentLoaded', () => {
  podlovePlayer('#app', configUrl, episodeUrl);
});