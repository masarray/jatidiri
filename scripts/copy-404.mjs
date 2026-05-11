import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist");
const indexFile = resolve(distDir, "index.html");
const fallbackFile = resolve(distDir, "404.html");
const noJekyllFile = resolve(distDir, ".nojekyll");

if (!existsSync(indexFile)) {
  throw new Error("dist/index.html tidak ditemukan. Jalankan vite build terlebih dahulu.");
}

copyFileSync(indexFile, fallbackFile);
writeFileSync(noJekyllFile, "");

console.log("GitHub Pages SPA fallback ready: dist/404.html + dist/.nojekyll");
