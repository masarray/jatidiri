import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const indexFile = resolve(distDir, "index.html");
const notFoundFile = resolve(distDir, "404.html");

if (existsSync(indexFile)) {
  copyFileSync(indexFile, notFoundFile);
  console.log("Copied dist/index.html to dist/404.html for static hosting fallback.");
}
