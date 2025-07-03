import playlist from "./Audio Lectures/Module 1/1.0 Overview/playlist.js";

/**
 * Configuration Meta Information
 */

export default {
  "version": 5,
  "base": "player/",
  "activeTab": "chapters",
  "theme": {
    "tokens": {
      "brand": "#166255",
      "brandDark": "#166255",
      "brandDarkest": "#1A3A4A",
      "brandLightest": "#E5EAECFF",
      "shadeDark": "#807E7C",
      "shadeBase": "#807E7C",
      "contrast": "#000",
      "alt": "#fff"
    },
    "fonts": {
      "ci": {
        "name": "RobotoBlack",
        "family": [
          "RobotoBlack",
          "Calibri",
          "Candara",
          "Arial",
          "Helvetica",
          "sans-serif"
        ],
        "weight": 900,
        "src": ["./assets/Roboto-Black.ttf"]
      },
      "regular": {
        "name": "FiraSansLight",
        "family": [
          "FiraSansLight",
          "Calibri",
          "Candara",
          "Arial",
          "Helvetica",
          "sans-serif"
        ],
        "weight": 300,
        "src": ["./assets/FiraSans-Light.ttf"]
      },
      "bold": {
        "name": "FiraSansBold",
        "family": [
          "FiraSansBold",
          "Calibri",
          "Candara",
          "Arial",
          "Helvetica",
          "sans-serif"
        ],
        "weight": 700,
        "src": ["./assets/FiraSans-Bold.ttf"]
      }
    }
  },
  "playlist": "./Module 1/1.0 Overview/playlist.js",
  "share": {
    "channels": [
      "mail",
      "link"
    ],
    "sharePlaytime": true,
    "outlet": "/share.html"
  }
}