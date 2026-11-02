// Uploads _r2/ to the R2 bucket with wrangler, one object per file, keyed by
// the path relative to _r2/. Finished keys go to _r2/.uploaded so a rerun
// resumes. Needs `wrangler login` with access to the account.
//
//   CLOUDFLARE_ACCOUNT_ID=... node _convert/upload_r2.mjs [--dry-run]

import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "_r2");
const BUCKET = process.env.R2_BUCKET || "nodebox-workshops";
const JURISDICTION = process.env.R2_JURISDICTION || "eu";
const DONE = path.join(SRC, ".uploaded");
const DRY = process.argv.includes("--dry-run");

const TYPES = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", svg: "image/svg+xml", bmp: "image/bmp", tif: "image/tiff", tiff: "image/tiff", ico: "image/x-icon",
  mp4: "video/mp4", mov: "video/quicktime", avi: "video/x-msvideo", mpg: "video/mpeg", mpeg: "video/mpeg", m4v: "video/x-m4v", flv: "video/x-flv", wmv: "video/x-ms-wmv",
  mp3: "audio/mpeg", wav: "audio/wav", aif: "audio/aiff", aiff: "audio/aiff",
  pdf: "application/pdf", zip: "application/zip", swf: "application/x-shockwave-flash", dcr: "application/x-director",
  txt: "text/plain; charset=utf-8", py: "text/plain; charset=utf-8", csv: "text/csv; charset=utf-8", html: "text/html", htm: "text/html", css: "text/css", js: "text/javascript", json: "application/json", xml: "application/xml",
};
const typeOf = (f) => TYPES[path.extname(f).slice(1).toLowerCase()] || "application/octet-stream";

const files = [];
const walk = (rel) => {
  for (const e of fs.readdirSync(path.join(SRC, rel), { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(r);
    else if (e.isFile()) files.push(r);
  }
};
walk("");

const done = new Set(fs.existsSync(DONE) ? fs.readFileSync(DONE, "utf8").split("\n").filter(Boolean) : []);
const todo = files.filter((f) => !done.has(f));
const bytes = todo.reduce((n, f) => n + fs.statSync(path.join(SRC, f)).size, 0);
console.log(`${files.length} files, ${todo.length} to upload (${(bytes / 1e9).toFixed(2)} GB) to ${BUCKET} (${JURISDICTION})`);
const unknown = [...new Set(todo.filter((f) => typeOf(f) === "application/octet-stream").map((f) => path.extname(f).toLowerCase()))];
if (unknown.length) console.log(`uploaded as octet-stream: ${unknown.join(" ")}`);
const big = todo.filter((f) => fs.statSync(path.join(SRC, f)).size > 300e6);
if (big.length) throw new Error(`over wrangler's 300 MB limit: ${big.join(", ")}`);
if (DRY) process.exit(0);

let i = 0;
let ok = 0;
const failed = [];
async function worker() {
  while (i < todo.length) {
    const f = todo[i++];
    try {
      // prettier-ignore
      await run("wrangler", ["r2", "object", "put", `${BUCKET}/${f}`, "--file", path.join(SRC, f), "--content-type", typeOf(f), "--remote", "-J", JURISDICTION], { maxBuffer: 1 << 24 });
      fs.appendFileSync(DONE, f + "\n");
      if (++ok % 100 === 0) console.log(`${ok}/${todo.length}`);
    } catch (e) {
      failed.push(f);
      console.log(`FAIL ${f}: ${String(e.stderr || e).split("\n").find((l) => /ERROR|rror/.test(l)) || ""}`);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`${ok} uploaded, ${failed.length} failed`);
if (failed.length) process.exitCode = 1;
