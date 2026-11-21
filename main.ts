// gta6-meme-x-01 entry — RESUBMIT: "13 YEARS WAITING FOR GTA 6.
// THE STORM IS FINALLY HERE." (Node 22, standard library only).
//
// The entry is the X post itself: the meme picture is the purple-ghost
// storm image (media-generation-meme-purple-ghost-caption-en2-0-0c426d0b-022a-48f4-a713-fd2b97f3cc64.webp),
// posted on X from a public account with the English caption
// "13 YEARS WAITING FOR GTA 6. THE STORM IS FINALLY HERE." and a large
// "make.fun" wordmark at the bottom so it stays readable when the picture
// is shrunk to 480x480. This program only hands the grader the post's
// address, by copying POST.json from the repository root into the output
// directory, byte for byte. Nothing about the post is judged from what this
// program writes — the house reads the post from X itself.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

// Read it first so a malformed POST.json fails loudly here, with a clear
// message, instead of a bad file being copied through to the gate.
const postPath = join(botDir, "POST.json");
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (err) {
  console.error(`POST.json in ${botDir} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string") {
  console.error("POST.json must be a JSON object with a string \"url\" field.");
  process.exit(1);
}

// The resubmit post is a live X status URL. Fail loudly here if POST.json
// was pointed at anything else (wrong link, homepage, search page), instead
// of copying a bad reference through to the gate.
const postUrl = (post as { url: string }).url;
if (!/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.test(postUrl)) {
  console.error(`POST.json "url" is not an X status URL: ${postUrl}`);
  process.exit(1);
}

try {
  copyFileSync(postPath, join(outputDir, "POST.json"));
  console.log(`Copied POST.json for post ${postUrl} to ${outputDir}`);
} catch (err) {
  console.error(`Could not copy POST.json from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
