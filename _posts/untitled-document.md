![Article cover image](/images/NbG-article-cover-image.jpeg)

# Building a Course Podcast with an AI Copilot

Love it or hate it, this is the Summer of AI. Every major employer is rushing to adopt AI into its workflows and there is heightened pressure on students coming into the workforce to know how to use the tools. Over the past couple of weeks, I've been trying to do my part to meet that demand by designing a course on AI, tentatively called *Fundamentals of Artificial Intelligence, *to be offered next Spring*.* There aren't really any textbooks that do what I need for this course, so I've been making a lot of the material myself. Much of the inspiration behind that material has come from listening to audiobooks. The great thing about audiobooks is that they're often less technical and can deliver up-to-date content in an accessible and enjoyable way. I enjoyed them so much, I decided I *needed* to add a podcast/audiobook-style companion to my new course. It's something I've tried and miserably failed to do for some time now. What I need is a "YouTube for audiobooks" but it seems no platform offers that. These are my requirements:

1. Needs to sound good.

2. Needs to be delivered in an engaging way to students within the LMS, on all of their devices, no login required, and at no cost for them *and me (I'm cheap!)*.

3. Needs to be scalable. Adding new episodes can't be a huge chore.

4. Needs to be accessible, which means access to the transcript.

5. Needs to be navigable with chapters. Some of these lectures could get very long. I don't want my LMS riddled with a bunch of 5-minute clips, but chapters accomplish the same thing with a cleaner interface.

After many hours of trial and error, I think I've finally got a working solution. You can check it out my 'prototype' for yourself here:

[The Fundamentals of AI Podcast](https://joshkeck.github.io/AI101/course/ai101/module_1/1.0/player.html)

Below is a look at the pipeline I stitched together, the pain points I hit, and the places where a new AI tool I had no prior experience with, GitHub Copilot, earned a permanent slot in my both my course and my instructor toolkit.

### **1. Recording the Raw Audio**

I capture the audio in Adobe Audition. A quiet room, a Rode NTG shotgun mic, and Audition let me record, punch-and-roll to cleanup mistakes on the fly, and apply audio effects to bring the noise floor down, remove breaths and mouth clicks, and de-ess my sibilance. I'm no audio engineer. I *struggled *with the effects rack. Tons of trial and error went into getting the audio right, only for it to sound good on my test speakers but* terrible *on my mobile phone. I was about to give up. Then I found[ ](https://auphonic.com/)[Auphonic](https://auphonic.com/), and I was blown away. They take my audio and really add the finishing touches it needs. Loudness normalization to ?16 LUFS, true-peak limiting, adaptive noise reduction, dynamic EQ, speech isolation, etc. It costs very little and takes just minutes. I tried to replicate the quality in Audition and fell flat, it's just that much better. It's still not *perfect* but it meets my standard for now.

Minimize image

Edit image

Delete image

![a screenshot of a program called adobe after effects](/images/nEg-screenshot-program-called-adobe-effects.png)

Adobe Audition. Scary stuff.

### **2. Transcripts and Accessibility**

Accessibility isn?t optional, and soon it will be the law. Once I've got the audio ready, I generate a transcript with Premiere Pro?s speech-to-text panel. The export is plain text, time-stamped by paragraph. That file later feeds the podcast player so students can search, skim, or follow along while listening. I had some formatting challenges with this that I'll come back to, but Premiere's functionality here is top-notch.

Minimize image

Edit image

Delete image

![a screen shot of a video that is unknown](/images/o3o-screen-shot-video-unknown.png)

Transcript

### **3. Free, Fast Hosting on GitHub - and a Public Home Page**

All finished assets - MP3 files, cover art, transcripts, and episode metadata - need to be published on the web so students can access them. I tried Microsoft Stream but I couldn't get the Office login to work on the Blackboard mobile app. I tried Spotify for Creators but it only showed a preview because it turns out you have to be a paid subscriber. I tried YouTube Music but I couldn't even find the file I uploaded. Anchor doesn't exist anymore. Ugh.

I *could *host the media on Blackboard natively, but that ties me down to this ugly audio player:

Minimize imageEdit imageDlete image

![an introduction.mp3 file is being played on a phone](/images/Pu2-introductionmp3-file-being-played-phone.png)

Blackboard's simple html mp3 player from 2005. Why is no one innovating these? Why was this so hard? Ugh.

I found the solution was a public GitHub repository. GitHub Pages then serves those files over HTTPS, which means my Blackboard LMS can serve the audio without any issues. There are no subscription fees, no file-size caps, and no paywalls for students or guests.

Better still, GitHub Pages lets me publish a simple, navigable website for the podcast at[ ](https://joshkeck.github.io/course/ai101)[https://joshkeck.github.io/course/ai101](https://joshkeck.github.io/course/ai101). As new episodes go live, I can update the site with show notes, transcripts, and direct download links. A future step is wiring an RSS feed to the same repo so that students who prefer something like Spotify or Apple podcasts can subscribe in one click and use the platform of their choice. No fooling around with Blackboard logins just to access the lectures.

### **4. Upgrading Web Player with Podlove**

As the last image shows, most web audio players are *just* *awful.* The good ones are only made by hosting platforms that want all of your money. I found a solution in the Podlove Web Player.

Minimize image

Edit image

Delete image

![](/images/Cwx_Image_5.png)

My amazing Podlove web player, I love it so much

This thing is beautiful and unlocks the features listeners expect in 2025:

- Chapters that jump straight to key concepts.

- Variable speeds (0.5x ? 2x) for quick review or deep focus. My wife speeds everything up, I don't know how she does it.

- Inline transcripts that follow as the audio plays. Good for accessibility, search, or just jumping around the audio.

- One-click sharing so students can revisit content outside of Blackboard.

- Playlists for letting it just play and play as you work on other things.

- RSS/Subscribe features that let your podcast be distributed on the major audio platforms.

But Podlove was a *massive* hurdle in this process. I *kinda* know my way around Github, VS Code, commits and pushes, that kind of stuff. But I am* not* a programmer and it's been years since I've used these tools. So, getting Podlove to work was a *nightmare*.

Yet, given the state of my choices, it was my best option. I chose to push through. Skipping past hours of headache, I've learned that each episode requires about 10 files that all work together in different ways and then call the Podlove player script in the public-facing html file. It is a bit of overhead, but the payoff is a player that feels modern, responsive, and far richer than Blackboard?s vanilla MP3 embed.

Minimize image

Edit image

Delete image

![](/images/CwD_Image_6.png)

The 10 files needed to create one podcast episode to my standard

### **5. Github Copilot?s 75-Liner**

After about 8 hours and 46 pushes from VS Studio, I got it working! I had *a lot* of help from my new friend Github Copilot. My biggest hurdle was converting Premiere?s text transcript into the format that Podlove needed. That's where Copilot was clutch. With a one-sentence prompt - ?create a script for converting this text file into Podlove transcript format [and I gave it some before-and-after samples]? - Copilot generated a 75-line Node script that parses the transcript file, aligns time codes, and outputs a transcripts.js file. It took a little trial and error, but it's instantaneous and works beautifully.

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

return <code>${h}:${m}:${s}.${msStr}</code>;

}

const blocks = input.split(/\r?\n\r?\n/);

const result = [];

let speakerIds = new Map();     // name ? numeric id

for (const blk of blocks){

const lines = blk.split(/\r?\n/);

if (lines.length < 3) continue;

const timeLine = lines[0].trim();

let speaker = lines[1].trim();

if (speaker.toLowerCase() === 'unknown') speaker = 'Josh Keck';

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

return <code>${key}: ${JSON.stringify(value)}</code>;

}

return <code>${key}: ${value}</code>;

});

return <code>  {\n    ${entries.join(",\n    ")}\n  }</code>;

}

const output =

"/**\n * Transcripts\n * - start: start time following [hh]:[mm]:[ss].[sss] format\n * - end: end time following [hh]:[mm]:[ss].[sss] format\n * - speaker: contributor id of the speaker\n * - text: tanscribed text\n */\n\n" +

"export default [\n" +

result.map(jsObjectString).join(",\n") +

"\n];\n";

fs.writeFileSync("transcripts.js", output);

console.log("? transcripts.js written");

All of this code was made by AI. Maybe it will mean something to you, but it's gobbledy-gook to me. Hey, I'm guess I'm a *vibe coder* now thanks to Copilot.

### **6. Scaling the Workflow**

Putting everything together, adding a new episode looks like this:

1. Record and clean audio in Audition

2. Postprocess in Auphonic

3. Export transcript from Premiere and bring it all into the project in Visual Studio Code.

4. Run Copilot?s script to create transcripts.js file.

5. Add chapter timestamps to chapters.js file.

6. Update episode.js with all of the episode specific information - title, duration, picture, URL, etc.

7. Update the GitHub Pages index.html file to include the new episode.

8. Commit and push all changes to the Repo. That makes it live for the world.

9. Embed the iframe of the new episode page into Blackboard LMS for students to consume with the rest of the course material.

Total time: about 15 minutes once the audio is final, which is a tiny fraction of what it takes to actually write and record the audio.

### **Experimenting With GitBook**

Long-term, I want the podcast to anchor an open-access textbook for this course so that I can share what I've created with other institutions. GitBook handles markdown and syncs with my GitHub repo, but it blocks iframes for security. I think there's a way around that but if that fails, chapter pages will link to the public Podlove player pages instead. GitBooks seems like a great option for self-publishing OER. Unlike other options (Pressbooks), it costs nothing. *And I'm cheap! *Here's a trial page I made with Gitbook. It's nearly identical to what I have in Blackboard Ultra.

Minimize image

Edit image

Delete image

![](/images/nbw_Image_7.png)

Module 1 Overview, sans the audio player. Still need to figure out the iframe.

[AI 101 OER Textbook on Gitbook](https://joshkeck.gitbook.io/ai101)

### **Thoughts on Copilot**

Before this build, I wasn?t exactly cheering for the ?copilot? wave. Microsoft seemed determined to wedge an AI sidekick into every Office ribbon, at great annoyance to those of us who don't like change. So, I approached GitHub Copilot with the same cautious curiosity I bring to any shiny new tool: prove your worth or swiftly get out of my face please.

Copilot proved it, and fast. Converting a raw text transcript into Podlove-compatible JSON was a show-stopping bottleneck. I could visualize the structure, but writing the parser myself was never going to happen. One prompt later, Copilot produced a 75-line script that did exactly what I needed: read the text, split by time stamps, and output the file I needed. A few tweaks, a push to the repo, and the transcript lit up inside the audio player. Accessible, searchable, and synced with the audio. No Copilot, no transcript; no transcript, no accessibility. It was that stark. I got chills across my skin as I watched it work.

Minimize image

Edit image

Delete image

![](/images/SBu_Image_8.png)

GitHub Copilot in action

### **Bottom Line**

I know there's a ton of AI slop out there right now and it's hard to stay excited about what the AI future will bring, but I hope reading this fills you with a bit more optimism. For me, I now have another tangible experience to share with students about co-creation with A.I., one that hopefully has an extra impact because *they're the ones who benefit *from this accessibility. When Fundamentals of AI hits the course schedule this Spring, this will be the case study from which we discuss AI-human co-creation - exactly the kind of collaboration employers expect in the Summer of AI.
