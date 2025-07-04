// scripts/build-episode-json.js
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = 'audio_lectures';          // top-level folder that holds modules
const INDENT = 2;                       // pretty-print JSON

// walk every sub-folder under audio_lectures
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    if (name === 'episode.js') convert(full);            // episode.js  ➜ episode.json
    if (name === 'config.js')  convertConfig(full);      // config.js   ➜ config.json
  }
}
// ---------------------------------------------------------------------------
// Convert episode.js (+ chapters / transcripts) → episode.json
// ---------------------------------------------------------------------------
// import the three JS files, merge, write JSON
async function convert(epPath) {
  const folder = path.dirname(epPath);
  const toURL  = p => pathToFileURL(path.join(folder, p)).href;

  // dynamic import so Node executes the ESM code and resolves its own imports
  const { default: episode } = await import(toURL('episode.js'));
  const { default: chapters } = await import(toURL('chapters.js'));
  const { default: transcripts } = await import(toURL('transcripts.js'));

  episode.chapters   = chapters;
  episode.transcripts = transcripts;

  const json   = JSON.stringify(episode, null, INDENT);
  const target = path.join(folder, 'episode.json');

  writeFileSync(target, json);
  console.log('✓', path.relative(process.cwd(), target));
}

// ---------------------------------------------------------------------------
// Convert config.js → config.json  (no merging needed)
// ---------------------------------------------------------------------------
async function convertConfig (cfgPath) {
  const folder  = path.dirname(cfgPath);
  const toURL   = p => pathToFileURL(path.join(folder, p)).href;

  const { default: config } = await import(toURL('config.js'));

  const json   = JSON.stringify(config, null, INDENT);
  const target = path.join(folder, 'config.json');

  writeFileSync(target, json);
  console.log('✓ config ', path.relative(process.cwd(), target));
}

walk(ROOT);
