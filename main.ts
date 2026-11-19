// gta6-meme-x-01 entry — "LUCIA'S OUT. SO IS GTA 6." (Node 22, standard library only).
//
// The entry is the X post itself: the meme picture (meme.png) is posted on X
// from a public account, and this program only hands the grader the post's
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

try {
  copyFileSync(postPath, join(outputDir, "POST.json"));
} catch (err) {
  console.error(`Could not copy POST.json from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
