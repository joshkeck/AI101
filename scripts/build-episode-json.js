// scripts/build-episode-json.js
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const GH_RAW_BASE = 'https://raw.githubusercontent.com/joshkeck/AI101/main/course/';
const GH_PAGES_BASE = 'https://joshkeck.github.io/AI101/course/';
const COURSE_ROOT = path.resolve('course');
const LINK_KEYS = ['link', 'url', 'transcript', 'slide', 'config']; // Add more if needed

const ROOT = COURSE_ROOT;
const INDENT = 2;

// Helper: Recursively walk directory tree and process files
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

// Replace link/url fields as described above
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

// Main logic for links
function processLink(linkValue, folder, key, contextFolder) {
  if (linkValue.startsWith('http')) return linkValue;

  // For playlist/config keys, always make path relative to playlist/config location
  if (key === 'config') {
    const absTarget = path.resolve(folder, linkValue);
    const relPath = path.relative(contextFolder, absTarget).replace(/\\/g, '/');
    return relPath;
  }

  const ext = linkValue.toLowerCase().split('.').pop();

  // Full RAW url for mp3
  if (ext === 'mp3') {
    const relFolder = path.relative(COURSE_ROOT, folder).replace(/\\/g, '/');
    return GH_RAW_BASE + relFolder + '/' + linkValue;
  }

  // Full public url for .md, .html, .txt, .jpg, .jpeg, .png, .gif, .pdf, .json
  if (['md', 'html', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'pdf', 'json'].includes(ext)) {
    const absLinkedPath = path.resolve(folder, linkValue);
    const relFromRoot = path.relative(COURSE_ROOT, absLinkedPath).replace(/\\/g, '/');
    return GH_PAGES_BASE + relFromRoot;
  }

  // Otherwise, keep as-is (relative)
  return linkValue;
}

// Convert episode.js (+ chapters / transcripts) → episode.json
async function convert(epPath) {
  const folder = path.dirname(epPath);
  const toURL  = p => pathToFileURL(path.join(folder, p)).href;

  // dynamic import for ESM modules
  const { default: episode } = await import(toURL('episode.js'));
  const { default: chapters } = await import(toURL('chapters.js'));
  const { default: transcripts } = await import(toURL('transcripts.js'));

  episode.chapters   = chapters;
  episode.transcripts = transcripts;

  // Replace all links/urls (context = this episode's folder)
  replaceLinks(episode, folder, folder);

  const json   = JSON.stringify(episode, null, INDENT);
  const target = path.join(folder, 'episode.json');
  writeFileSync(target, json);
  console.log('✓', path.relative(process.cwd(), target));
}

// Convert config.js → config.json
async function convertConfig(cfgPath) {
  const folder  = path.dirname(cfgPath);
  const toURL   = p => pathToFileURL(path.join(folder, p)).href;

  const { default: config } = await import(toURL('config.js'));

  // Replace all links/urls (context = config folder, for playlist support)
  replaceLinks(config, folder, folder);

  const json   = JSON.stringify(config, null, INDENT);
  const target = path.join(folder, 'config.json');
  writeFileSync(target, json);
  console.log('✓ config ', path.relative(process.cwd(), target));
}

// Entry point
(async () => {
  await walk(ROOT);
})();
