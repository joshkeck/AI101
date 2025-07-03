// transform-transcript.js
import fs from 'node:fs';

const FPS = 25;                     // set to your timeline frame-rate
const input = fs.readFileSync('transcript.txt','utf8').trim();

function timecodeToMs(tc){
  if (!tc) return 0;
  const parts = tc.split(':');
  if (parts.length < 4) return 0; // Expecting hh:mm:ss:ff
  const [h, m, s, f] = parts;
  return (+h)*3600e3 + (+m)*60e3 + (+s)*1e3 + (+f)*(1000/FPS);
}

function msToTimecode(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  ms = ms % 3600000;
  const m = String(Math.floor(ms / 60000)).padStart(2, '0');
  ms = ms % 60000;
  const s = String(Math.floor(ms / 1000)).padStart(2, '0');
  const msStr = String(Math.floor(ms % 1000)).padStart(3, '0');
  return `${h}:${m}:${s}.${msStr}`;
}

const blocks = input.split(/\r?\n\r?\n/);
const result = [];

let speakerIds = new Map();     // name ➜ numeric id

for (const blk of blocks){
  const lines = blk.split(/\r?\n/);
  if (lines.length < 3) continue;
  const timeLine = lines[0].trim();
  const speaker = lines[1].trim();
  const textLines = lines.slice(2);

  // Split on ' - ' with optional spaces
  const [start, end] = timeLine.split(/\s*-\s*/);
  if (!start || !end) continue;
  if(!speakerIds.has(speaker)) speakerIds.set(speaker, String(speakerIds.size+1));

  const start_ms = timecodeToMs(start);
  const end_ms = timecodeToMs(end);

  result.push({
    start: msToTimecode(start_ms),
    start_ms,
    end: msToTimecode(end_ms),
    end_ms,
    speaker: speakerIds.get(speaker),
    voice: speaker,
    text: textLines.join(' ')
  });
}

function jsObjectString(obj) {
  // Convert a JS object to a string with unquoted property names
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === "string") {
      return `${key}: ${JSON.stringify(value)}`;
    }
    return `${key}: ${value}`;
  });
  return `  {\n    ${entries.join(",\n    ")}\n  }`;
}

const output =
  "/**\n * Transcripts\n * - start: start time following [hh]:[mm]:[ss].[sss] format\n * - end: end time following [hh]:[mm]:[ss].[sss] format\n * - speaker: contributor id of the speaker\n * - text: tanscribed text\n */\n\n" +
  "export default [\n" +
  result.map(jsObjectString).join(",\n") +
  "\n];\n";

fs.writeFileSync("transcripts.js", output);
console.log("✓ transcripts.js written");
