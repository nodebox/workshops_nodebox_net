// Fetches old WordPress uploads that no backup has from the Wayback Machine.
// Reads _convert/missing-media.txt (written by migrate.mjs) and saves files to
// _gather/wayback/<workshop>/<file>, where migrate.mjs picks them up.
//
//   node _convert/wayback.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "_gather/wayback");
const WP = { "2009": "2009-lahti", "2010": "2010-lahti", "2010-2": "2010-antwerp", "2011-1": "2011-antwerp", "2011-2": "2011-helsinki", "2011-3": "2011-lahti" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(90_000) });
      if (r.ok) return r;
      if (r.status === 404) return null;
    } catch {}
    await sleep(5000 * (i + 1));
  }
  return null;
}

const missing = fs.readFileSync(path.join(ROOT, "_convert/missing-media.txt"), "utf8").split("\n").filter((u) => u.includes("/wp-content/uploads/"));
const prefixes = [...new Set(missing.map((u) => u.split("/")[3]))];

// Archived URLs per blog folder.
const archived = new Map(); // lowercased url without scheme -> [original, timestamp]
for (const p of prefixes) {
  const r = await get(`https://web.archive.org/cdx/search/cdx?url=workshops.nodebox.net/${p}/wp-content/uploads/&matchType=prefix&filter=statuscode:200&collapse=urlkey&fl=original,timestamp&limit=10000`);
  const text = r ? await r.text() : "";
  if (text.startsWith("<")) {
    console.log(`${p}: listing unavailable`);
    continue;
  }
  const lines = text.split("\n").filter(Boolean);
  for (const l of lines) {
    const [orig, ts] = l.split(" ");
    archived.set(orig.replace(/^https?:\/\//, "").replace(/:80\//, "/").toLowerCase(), [orig, ts]);
  }
  console.log(`${p}: ${lines.length} archived`);
  await sleep(2000);
}

let got = 0;
for (const u of missing) {
  const key = u.replace(/^https?:\/\//, "").toLowerCase();
  const orig = key.replace(/-\d+x\d+(\.\w+)$/, "$1");
  const hit = archived.get(orig) || archived.get(key);
  if (!hit) continue;
  const slug = WP[u.split("/")[3]];
  const name = decodeURIComponent(hit[0].split("/").pop());
  const dst = path.join(OUT, slug, name);
  if (fs.existsSync(dst)) {
    got++;
    continue;
  }
  const r = await get(`https://web.archive.org/web/${hit[1]}id_/${hit[0]}`);
  if (!r) continue;
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, Buffer.from(await r.arrayBuffer()));
  got++;
  console.log(`got ${slug}/${name}`);
  await sleep(1000);
}
console.log(`${got} of ${missing.length} missing files recovered`);
