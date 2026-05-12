import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist");
const indexFile = resolve(distDir, "index.html");
const notFoundFile = resolve(distDir, "404.html");

if (existsSync(indexFile)) {
  copyFileSync(indexFile, notFoundFile);
  console.log("Created dist/404.html for static hosting fallback.");
} else {
  console.warn("dist/index.html not found. Skipped 404 fallback copy.");
}
