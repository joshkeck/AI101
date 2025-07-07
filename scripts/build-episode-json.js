// scripts/build-episode-json.js
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// --- CONFIGURATION ---
const GH_RAW_BASE = 'https://raw.githubusercontent.com/joshkeck/AI101/main/course/';
const GH_PAGES_BASE = 'https://joshkeck.github.io/AI101/course/';
const GH_ROOT = '/AI101/course/'; // For root-relative playlist links!
const COURSE_ROOT = path.resolve('course');
const LINK_KEYS = ['link', 'url', 'transcript', 'slide']; // Add more if needed

const ROOT = COURSE_ROOT;
const INDENT = 2;

// --- DIRECTORY WALKER ---
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
function processLink(linkValue, folder, key, contextFolder) {
  if (linkValue.startsWith('http')) return linkValue;

  // ...rest as before...
  const ext = linkValue.toLowerCase().split('.').pop();
  if (ext === 'mp3') {
    const relFolder = path.relative(COURSE_ROOT, folder).replace(/\\/g, '/');
    return GH_RAW_BASE + relFolder + '/' + linkValue;
  }
  if (['md', 'html', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'pdf', 'json'].includes(ext)) {
    const absLinkedPath = path.resolve(folder, linkValue);
    const relFromRoot = path.relative(COURSE_ROOT, absLinkedPath).replace(/\\/g, '/');
    return GH_PAGES_BASE + relFromRoot;
  }
  return linkValue;
}

// --- EPISODE CONVERTER ---
async function convert(epPath) {
  const folder = path.dirname(epPath);
  const toURL  = p => pathToFileURL(path.join(folder, p)).href;

  const { default: episode } = await import(toURL('episode.js'));
  const { default: chapters } = await import(toURL('chapters.js'));
  const { default: transcripts } = await import(toURL('transcripts.js'));

  episode.chapters   = chapters;
  episode.transcripts = transcripts;

  replaceLinks(episode, folder, folder);

  const json   = JSON.stringify(episode, null, INDENT);
  const target = path.join(folder, 'episode.json');
  writeFileSync(target, json);
  console.log('✓', path.relative(process.cwd(), target));
}

// --- CONFIG CONVERTER ---
async function convertConfig(cfgPath) {
  const folder  = path.dirname(cfgPath);
  const toURL   = p => pathToFileURL(path.join(folder, p)).href;

  const { default: config } = await import(toURL('config.js'));

  replaceLinks(config, folder, folder);

  const json   = JSON.stringify(config, null, INDENT);
  const target = path.join(folder, 'config.json');
  writeFileSync(target, json);
  console.log('✓ config ', path.relative(process.cwd(), target));
}

// --- ENTRY POINT ---
(async () => {
  await walk(ROOT);
})();
