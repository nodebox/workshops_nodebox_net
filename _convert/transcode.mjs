// Writes an H.264 .mp4 next to every old QuickTime/AVI/MPEG movie in a tree,
// so pages can show them with <video>. The originals stay for download.
// Needs ffmpeg.
//
//   node _convert/transcode.mjs _gather/legacy_all/2004 _gather/legacy_all/2005 _gather/legacy_all/2007

import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(mov|avi|mpe?g)$/i.test(e.name)) files.push(f);
  }
};
process.argv.slice(2).forEach(walk);

let i = 0;
const failed = [];
async function worker() {
  while (i < files.length) {
    const src = files[i++];
    const dst = src.replace(/\.\w+$/, ".mp4");
    if (fs.existsSync(dst)) continue;
    try {
      // prettier-ignore
      await run("ffmpeg", ["-v", "error", "-i", src, "-map", "0:v:0", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "slow", "-crf", "22",
        "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-y", dst]);
      console.log(`ok   ${src}`);
    } catch (e) {
      fs.rmSync(dst, { force: true });
      failed.push(src);
      console.log(`FAIL ${src}: ${String(e.stderr || e).split("\n")[0]}`);
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(`${files.length} movies, ${failed.length} failed`);
