import fs from "fs";
import path from "path";

const root = process.cwd();

const threatDir = path.join(root, "public", "images", "threat");
const neutralDir = path.join(root, "public", "images", "neutral");

function readImages(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);

  return files
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

const threatFiles = readImages(threatDir).map((f) => `/images/threat/${f}`);
const neutralFiles = readImages(neutralDir).map((f) => `/images/neutral/${f}`);

const manifest = {
  threat: threatFiles,
  neutral: neutralFiles,
};

const outDir = path.join(root, "lib", "generated");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, "imageManifest.json");
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2), "utf-8");

console.log("✅ image manifest generated:", outFile);
console.log("Threat:", threatFiles.length, "Neutral:", neutralFiles.length);
