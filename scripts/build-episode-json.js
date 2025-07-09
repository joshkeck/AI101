// Import filesystem, path, and URL utilities from Node.js
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// --- CONSTANTS & SETTINGS ---

// Where your files are hosted on GitHub (raw and GitHub Pages)
const GH_RAW_BASE = 'https://raw.githubusercontent.com/joshkeck/joshkeck.github.io/main/course/';
const GH_PAGES_BASE = 'https://joshkeck.github.io/course/';

// The local root of your course directory
const COURSE_ROOT = path.resolve('course');

// Keys that indicate a file path we want to convert to a URL
const LINK_KEYS = ['link', 'url', 'transcript', 'slide', 'poster', 'avatar', 'config'];

// Where the script should start walking the file tree
const ROOT = COURSE_ROOT;
const INDENT = 2; // JSON indentation

// --- DIRECTORY WALKER ---
// Recursively walk through the directory tree starting at `dir`
// For each folder, if it finds episode.js or config.js, process them
async function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      await walk(full);
    }
    if (name === 'episode.js') await convert(full);
    if (name === 'config.js')  await convertConfig(full);
  }
}

// --- LINK REPLACER ---
// Recursively look through an object/array for keys like 'config', 'transcript', etc.
// When found, update the value to a proper URL using processLink
function replaceLinks(obj, folder, contextFolder) {
  if (Array.isArray(obj)) {
    obj.forEach(item => replaceLinks(item, folder, contextFolder));
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (
        LINK_KEYS.includes(key) &&
        typeof obj[key] === 'string'
      ) {
        obj[key] = processLink(obj[key], folder, key, contextFolder);
      } else {
        replaceLinks(obj[key], folder, contextFolder);
      }
    }
  }
}

// --- LINK PROCESSOR ---
// Turn a relative file path into a full GitHub Pages or Raw URL,
// depending on the file type and where it's found.
function processLink(linkValue, folder, key, contextFolder) {
  if (linkValue.startsWith('http')) return linkValue; // Already a URL

  // Use contextFolder (e.g. playlist.js location) if provided, otherwise use the folder where the file lives
  const baseFolder = contextFolder || folder;
  const ext = linkValue.toLowerCase().split('.').pop();

  // If it's an mp3, make a raw GitHub URL
  if (ext === 'mp3') {
    const relFolder = path.relative(COURSE_ROOT, baseFolder).replace(/\\/g, '/');
    return GH_RAW_BASE + relFolder + '/' + linkValue;
  }

  // If it's any other listed file type, make a GitHub Pages URL
  if (['md', 'html', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'pdf', 'json'].includes(ext)) {
    const absLinkedPath = path.resolve(baseFolder, linkValue);
    const relFromRoot = path.relative(COURSE_ROOT, absLinkedPath).replace(/\\/g, '/');
    return GH_PAGES_BASE + relFromRoot;
  }

  // If it's some other type, just return it unchanged
  return linkValue;
}

// --- EPISODE CONVERTER ---
// Imports episode.js, chapters.js, and transcripts.js from a module directory,
// adds the chapters and transcripts to the episode object,
// replaces any links with URLs, and writes an episode.json.
async function convert(epPath) {
  const folder = path.dirname(epPath);
  const toURL  = p => pathToFileURL(path.join(folder, p)).href;

  // Dynamically import the source files (using ESM syntax)
  const { default: episode } = await import(toURL('episode.js'));
  const { default: chapters } = await import(toURL('chapters.js'));
  const { default: transcripts } = await import(toURL('transcripts.js'));

  // Attach chapters and transcripts to the episode object
  episode.chapters   = chapters;
  episode.transcripts = transcripts;

  // Convert all links in the episode object to URLs
  replaceLinks(episode, folder, folder);

  // Write the final episode.json file
  const json   = JSON.stringify(episode, null, INDENT);
  const target = path.join(folder, 'episode.json');
  writeFileSync(target, json);
  console.log('✓', path.relative(process.cwd(), target));
}

// --- FIND-UP HELPER FOR PLAYLIST.JS ---
// Looks for a playlist.js in the current directory or any parent directory
// Returns the first found, or null if not found
function findUpPlaylist(startDir) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, 'playlist.js');
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break; // Stop if we've reached the root directory
    dir = parent;
  }
  return null;
}

// --- CONFIG CONVERTER ---
// Imports config.js, finds the nearest playlist.js if there's a playlist property,
// makes sure links in the playlist are resolved from where playlist.js lives,
// then replaces all other links, and writes out config.json.
async function convertConfig(cfgPath) {
  const folder  = path.dirname(cfgPath);
  const toURL   = p => pathToFileURL(path.join(folder, p)).href;
  const { default: config } = await import(toURL('config.js'));

  // If config includes a playlist property,
  // find the right playlist.js (walking up the directory tree if necessary)
  if (config.playlist) {
    const playlistPath = findUpPlaylist(folder);
    if (!playlistPath) {
      throw new Error(`playlist.js not found for config.js at ${cfgPath}`);
    }
    const playlistFolder = path.dirname(playlistPath);
    // Replace links in the playlist using the location of playlist.js
    replaceLinks(config.playlist, playlistFolder, playlistFolder);
  }

  // Replace all other links using the config.js folder as context
  replaceLinks(config, folder, folder);

  // Write the final config.json file
  const json   = JSON.stringify(config, null, INDENT);
  const target = path.join(folder, 'config.json');
  writeFileSync(target, json);
  console.log('✓ config ', path.relative(process.cwd(), target));
}

// --- MAIN SCRIPT ENTRY POINT ---
// Starts the recursive directory walk from the course root.
(async () => {
  await walk(ROOT);
})();
