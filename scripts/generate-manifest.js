#!/usr/bin/env node
/**
 * Scans images/{family,david,veronica,mia,thiago,luna}/ and writes images/manifest.json.
 * Run after adding or removing photos: node scripts/generate-manifest.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "images");
const ALBUMS = ["family", "david", "veronica", "mia", "thiago", "luna"];
const EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);

const manifest = {
  generatedAt: new Date().toISOString(),
  albums: {},
};

for (const albumId of ALBUMS) {
  const albumDir = path.join(IMAGES_DIR, albumId);
  if (!fs.existsSync(albumDir)) {
    fs.mkdirSync(albumDir, { recursive: true });
    manifest.albums[albumId] = [];
    continue;
  }

  const files = fs
    .readdirSync(albumDir, { withFileTypes: true })
    .filter(function (entry) {
      if (!entry.isFile() || entry.name.startsWith(".")) return false;
      return EXTENSIONS.has(path.extname(entry.name).toLowerCase());
    })
    .map(function (entry) {
      return entry.name;
    })
    .sort(function (a, b) {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    })
    .map(function (name) {
      return "images/" + albumId + "/" + name;
    });

  manifest.albums[albumId] = files;
}

const outPath = path.join(IMAGES_DIR, "manifest.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");

console.log("Wrote " + outPath);
for (const albumId of ALBUMS) {
  console.log("  " + albumId + ": " + manifest.albums[albumId].length + " image(s)");
}
