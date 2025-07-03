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

  result.push({
    start: start,
    start_ms: timecodeToMs(start),
    end: end,
    end_ms: timecodeToMs(end),
    speaker: speakerIds.get(speaker),
    voice: speaker,
    text: textLines.join(' ')
  });
}

fs.writeFileSync('transcript.js', 'export default ' +
                 JSON.stringify(result, null, 2) + ';\n');
console.log('✓ transcript.js written');
