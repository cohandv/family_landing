#!/usr/bin/env node
/**
 * Resize & compress album photos for the web.
 *
 * Usage:
 *   npm run convert
 *   npm run convert -- --force
 *   npm run convert -- --max-kb 250
 *
 * Originals are moved to images/_originals/<album>/ (not deleted).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "images");
const ORIGINALS_ROOT = path.join(IMAGES_DIR, "_originals");
const ALBUMS = ["family", "david", "veronica", "mia", "thiago", "luna"];

const SOURCE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".heic",
  ".heif",
  ".tif",
  ".tiff",
]);

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const maxKbIndex = args.indexOf("--max-kb");
const MAX_KB = maxKbIndex !== -1 ? Number(args[maxKbIndex + 1]) : 350;
const MAX_BYTES = Math.max(40, MAX_KB) * 1024;
const MAX_WIDTH = 1280;
const MAX_HEIGHT = 1600;
const OUTPUT_EXT = ".webp";
const QUALITY_MIN = 52;
const QUALITY_START = 82;

function formatKb(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

function isSourceFile(name) {
  if (name.startsWith(".")) return false;
  return SOURCE_EXT.has(path.extname(name).toLowerCase());
}

function outputName(sourceName) {
  return path.basename(sourceName, path.extname(sourceName)) + OUTPUT_EXT;
}

function shouldProcess(albumDir, fileName) {
  if (!isSourceFile(fileName)) return false;
  const ext = path.extname(fileName).toLowerCase();
  if (ext !== ".webp") return true;
  if (FORCE) return true;
  return fs.statSync(path.join(albumDir, fileName)).size > MAX_BYTES;
}

async function encodeWebp(buffer, quality) {
  return sharp(buffer).webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
}

async function convertFile(albumId, fileName) {
  const albumDir = path.join(IMAGES_DIR, albumId);
  const inputPath = path.join(albumDir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  const outName = ext === ".webp" ? fileName : outputName(fileName);
  const outputPath = path.join(albumDir, outName);
  const tempPath = outputPath + ".tmp";
  const originalsDir = path.join(ORIGINALS_ROOT, albumId);
  const archivePath = path.join(originalsDir, fileName);

  if (
    !FORCE &&
    ext !== ".webp" &&
    fs.existsSync(outputPath) &&
    fs.statSync(outputPath).mtimeMs >= fs.statSync(inputPath).mtimeMs
  ) {
    console.log("  skip (up to date): " + albumId + "/" + outName);
    return null;
  }

  const inputStat = fs.statSync(inputPath);
  const resized = await sharp(inputPath)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();

  let quality = QUALITY_START;
  let output = await encodeWebp(resized, quality);

  while (output.length > MAX_BYTES && quality > QUALITY_MIN) {
    quality -= 6;
    output = await encodeWebp(resized, quality);
  }

  fs.mkdirSync(originalsDir, { recursive: true });
  fs.writeFileSync(tempPath, output);

  if (path.resolve(inputPath) !== path.resolve(outputPath)) {
    if (!fs.existsSync(archivePath)) {
      fs.renameSync(inputPath, archivePath);
    } else {
      fs.unlinkSync(inputPath);
    }
  } else {
    if (!fs.existsSync(archivePath)) {
      fs.copyFileSync(inputPath, archivePath);
    }
    fs.unlinkSync(inputPath);
  }

  fs.renameSync(tempPath, outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(
    "  " +
      albumId +
      "/" +
      outName +
      "  " +
      formatKb(inputStat.size) +
      " → " +
      formatKb(output.length) +
      "  (" +
      (meta.width || "?") +
      "×" +
      (meta.height || "?") +
      ", q" +
      quality +
      ")"
  );

  return { albumId, outName, before: inputStat.size, after: output.length };
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("No images/ directory found.");
    process.exit(1);
  }

  console.log(
    "Converting to WebP — max " +
      MAX_WIDTH +
      "×" +
      MAX_HEIGHT +
      ", target ≤ " +
      MAX_KB +
      " KB each"
  );
  console.log("Originals → images/_originals/<album>/\n");

  const results = [];

  for (const albumId of ALBUMS) {
    const albumDir = path.join(IMAGES_DIR, albumId);
    if (!fs.existsSync(albumDir)) continue;

    const files = fs
      .readdirSync(albumDir, { withFileTypes: true })
      .filter(function (entry) {
        return entry.isFile();
      })
      .map(function (entry) {
        return entry.name;
      })
      .filter(function (name) {
        return shouldProcess(albumDir, name);
      });

    if (!files.length) continue;

    console.log(albumId + ":");

    for (const fileName of files) {
      try {
        const result = await convertFile(albumId, fileName);
        if (result) results.push(result);
      } catch (err) {
        console.error("  failed " + albumId + "/" + fileName + ": " + err.message);
      }
    }
  }

  if (!results.length) {
    console.log("\nNothing converted (already optimized?). Use --force to redo.");
    return;
  }

  var before = 0;
  var after = 0;
  results.forEach(function (r) {
    before += r.before;
    after += r.after;
  });
  console.log(
    "\nDone: " +
      results.length +
      " file(s), " +
      formatKb(before) +
      " → " +
      formatKb(after) +
      " total"
  );
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
