
import episodeUrl from './episodeurl.js';
import configUrl  from './configurl.js';

document.addEventListener('DOMContentLoaded', () => {
  podlovePlayer('#app', configUrl, episodeUrl);
});