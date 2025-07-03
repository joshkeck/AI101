import chapters from "./chapters.js";
import transcripts from "./transcripts.js";
/**
 * Epsiode Meta Information
 */
export default {
  version: 5,
  /**
   * Show Related Information
   */
  show: {
    title: "Fundamentals of Artificial Intelligence",
    subtitle: "Audio Lectures by Josh Keck",
    summary: "This show is a collection of audio lectures on the fundamentals of artificial intelligence, covering various topics and concepts in the field.",
    poster: "/Assets/Futurism.jpg",
    link: "https://www.mctc.edu/profile/Josh-Keck/"
  },
  /**
   * Episode related Information
   */
  title: "Module 1 Introduction",
  subtitle: "",
  summary: "In this episode, we introduce the first module of our series on the fundamentals of artificial intelligence.",
  // ISO 8601 DateTime format, this is capable of adding a time offset, see https://en.wikipedia.org/wiki/ISO_8601
  publicationDate: "2025-07-03T11:58:58+00:00",
  poster: "/Assets/Futurism.jpg",
  // ISO 8601 Duration format ([hh]:[mm]:[ss].[sss]), capable of adding milliseconds, see https://en.wikipedia.org/wiki/ISO_8601
  duration: "00:08:59",
  link: "https://www.mctc.edu/profile/Josh-Keck/",
  /**
   * Audio Assets
   * - media Assets played by the audio player
   * - format support depends on the used browser (https://en.wikipedia.org/wiki/HTML5_audio#Supported_audio_coding_formats)
   * - also supports HLS streams
   *
   * Asset
   * - url: absolute path to media asset
   * - size: file size in  byte
   * - (title): title to be displayed in download tab
   * - mimeType: media asset mimeType
   */
  audio: [
    {
      url: "https://raw.githubusercontent.com/joshkeck/AI101/refs/heads/main/Audio%20Lectures/Module%201/1.0/Introduction.mp3",
      size: "7556669",
      title: "MP3 Audio (mp3)",
      mimeType: "audio/mpeg"
    }
  ],
    /**
   * Files
   * - list of files available for download
   * - if no files are present, audio assets will be used as downloads
   *
   * Asset
   * - url: absolute path to media asset
   * - size: file size in  byte
   * - title: title to be displayed in download tab
   * - (mimeType): media asset mimeType
   */
  files: [
    {
      url: "https://raw.githubusercontent.com/joshkeck/AI101/refs/heads/main/Audio%20Lectures/Module%201/1.0/Introduction.mp3",
      size: "7556669",
      title: "Download MP3 Audio (mp3)",
      mimeType: "audio/mpeg"
    },
    /**
    {
      url: "https://files.podlovers.org/LOV003.vtt",
      size: "108401",
      title: "Transkripte",
      mimeType: "text/plain"
    }
    */
  ],
  /**
   * Chapters:
   * - can be a plain list or a reference to a json file
   * - if present chapters tab will be available
   */
  chapters: chapters,
  contributors: [
    {
      id: "1",
      name: "Josh Keck",
      avatar: "/Assets/joshkecksquare.jpg",
      role: {
        id: "1",
        slug: "professor",
        title: "Professor"
      },
      group: {
        id: "2",
        slug: "on-air",
        title: "On Air"
      }
    }
  ],
  /**
   * Transcripts:
   * - can be a plain list or a reference to a json file
   * - if present transcripts tab will be available
   */
  transcripts: transcripts
}