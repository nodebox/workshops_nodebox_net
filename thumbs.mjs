// Makes the thumbnails for post images: a 440px wide WebP for every image in
// _r2/media/, written to _r2/thumbs/<path>.webp, and the list of images that
// have one in thumbs.txt (read by build.mjs). Existing thumbnails newer than
// their image are kept, so a rerun only does new work. Upload the result with
// _convert/upload_r2.mjs.
//
//   npm run thumbs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = import.meta.dirname;
const SRC = path.join(ROOT, "_r2", "media");
const OUT = path.join(ROOT, "_r2", "thumbs");
const LIST = path.join(ROOT, "thumbs.txt");
const WIDTH = 440;

const IMAGE = /\.(jpe?g|png|gif|webp|tiff?)$/i;
// Resized copies made by the old Django site; no post links them.
const DERIVED = /_(crop|scale)_\d+x\d+\.jpg$/i;

function* walk(dir, rel = "") {
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) yield* walk(dir, r);
    else if (e.isFile()) yield r;
  }
}

if (!fs.existsSync(SRC)) throw new Error(`${SRC} is missing; thumbnails are made where the media originals are`);
// Some old uploads are JPEGs without an extension.
const images = [...walk(SRC)].filter((f) => (IMAGE.test(f) || !path.basename(f).includes(".")) && !DERIVED.test(f));
const out = (f) => path.join(OUT, f + ".webp");
const todo = images.filter((f) => !fs.existsSync(out(f)) || fs.statSync(out(f)).mtimeMs < fs.statSync(path.join(SRC, f)).mtimeMs);
console.log(`${images.length} images, ${todo.length} thumbnails to make`);

let i = 0;
const failed = [];
async function worker() {
  while (i < todo.length) {
    const f = todo[i++];
    const dest = out(f);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      // rotate() applies the EXIF orientation; CMYK and other profiles end up as sRGB.
      await sharp(path.join(SRC, f), { failOn: "none", limitInputPixels: false })
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(dest + ".tmp");
      fs.renameSync(dest + ".tmp", dest);
    } catch (e) {
      fs.rmSync(dest + ".tmp", { force: true });
      failed.push(f);
      console.log(`FAIL ${f}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

const have = images.filter((f) => fs.existsSync(out(f))).sort();
fs.writeFileSync(LIST, have.join("\n") + "\n");
console.log(`${have.length} thumbnails listed in thumbs.txt, ${failed.length} failed`);
