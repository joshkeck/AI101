/*
 *   Podlove Player Factory
 *   @param {string, dom node}   selector        - CSS selector or dom node
 *   @param {string, object}     episode         - Path to JSON episode or episode object
 *   @param {string, object}     configuration   - Path to JSON config or configuration object
 *   @returns {Promise}          store           - Promise returning a redux store
 */

window
  .podlovePlayer("#app", "./Module 1/1.0/episode.json", "./Module 1/1.0/config.json")
  .then(store => {
    store.subscribe(() => {
      console.log(store.getState());
    });
  });
