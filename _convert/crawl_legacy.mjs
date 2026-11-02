// Crawl the 2004/2005/2007 workshop sites, served by the original PHP code
// (see _convert/README.md), and write them out as static HTML.
//
//   node _convert/crawl_legacy.mjs <origin> <docroot> <outdir> <section>...
//
// Pages are fetched over HTTP; every other file in the section is copied from
// <docroot>, minus PHP sources and wiki internals. Page links are rewritten to
// the generated .html files. Redirect aliases go to <outdir>/_redirects.legacy.

import fs from "node:fs";
import path from "node:path";

const [origin, docroot, outdir, ...sections] = process.argv.slice(2);
if (!sections.length) {
  console.error("usage: crawl_legacy.mjs <origin> <docroot> <outdir> <section>...");
  process.exit(1);
}

// Wiki actions and internal files that must not end up in the static site.
const SKIP_QUERY = /^(login|logout|edit|history|diff|layout|media|upload|delete|rename|perm|source|raw|new|search)\b/i;
const SKIP_COPY = [
  /\.php$/i, /\.inc$/i, /^\.htaccess$/, /\.DS_Store$/, /\.tgz$/i,
  /^config\.inc\.php$/, /(^|\/)lib\//, /(^|\/)data\/(text|cache|perm)\//,
  /(^|\/)themes\/[^/]+\/templates\//, /serverlog\.txt$/, /(^|\/)log\.txt$/, /^shopbar\.html$/,
];

const pages = new Map(); // url path+query -> output file (relative to outdir)
const aliases = new Map(); // requested path -> final path
const queue = [];

function wikiSection(section) {
  return fs.existsSync(path.join(docroot, section, "data", "text"));
}

function outputName(u) {
  // u is a URL object on origin.
  let p = decodeURIComponent(u.pathname);
  const q = u.search.slice(1);
  if (p.endsWith("/")) p += "index";
  else if (p.endsWith("/index.php")) p = p.slice(0, -4);
  if (p.endsWith(".php")) {
    const base = p.slice(0, -4);
    // A hand-written base.html may sit next to base.php.
    p = fs.existsSync(path.join(docroot, base + ".html")) ? base + "-php" : base;
  }
  if (q) p += "--" + decodeURIComponent(q).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-|-$/g, "");
  return p.replace(/^\//, "") + ".html";
}

function isPageUrl(u, section) {
  if (u.origin !== origin) return false;
  const p = decodeURIComponent(u.pathname);
  if (!p.startsWith(`/${section}/`) && p !== `/${section}`) return false;
  const q = u.search.slice(1);
  if (q && SKIP_QUERY.test(q)) return false;
  const local = path.join(docroot, p);
  if (/\.php$/i.test(p)) return true;
  if (fs.existsSync(local) && fs.statSync(local).isFile()) return false; // static file
  if (fs.existsSync(local) && fs.statSync(local).isDirectory()) return true; // dir index
  return wikiSection(section); // wiki pretty URL
}

function normalize(raw, base) {
  if (!raw || /^(#|mailto:|javascript:|data:)/i.test(raw)) return null;
  let s = raw.trim().replace(/^https?:\/\/workshops\.nodebox\.net/i, "");
  try {
    const u = new URL(s, base);
    if (u.origin !== origin) return null;
    u.hash = "";
    return u;
  } catch {
    return null;
  }
}

function enqueue(u, section) {
  const key = u.pathname + u.search;
  if (pages.has(key) || queue.some((q) => q.key === key)) return;
  queue.push({ key, url: u, section });
}

const LINK_ATTR = /(\s(?:href|src|background|action)\s*=\s*)(["'])([^"']*)\2/gi;
const POP = /(pop\(\s*['"])([^'"]+)(['"])/g;
// PHP pages opened from scripts, e.g. window.open('movie.php?f=x.mov', ...).
const JSPHP = /((?:open|location(?:\.href)?\s*=)\s*\(?\s*['"])([^'"\s]+\.php\?[^'"\s]*)(['"])/g;

async function crawl() {
  for (const section of sections) {
    enqueue(new URL(`/${section}/`, origin), section);
    const dir = path.join(docroot, section);
    if (wikiSection(section)) {
      for (const f of fs.readdirSync(path.join(dir, "data", "text"))) {
        if (f.endsWith(".txt")) enqueue(new URL(`/${section}/${encodeURIComponent(f.slice(0, -4))}`, origin), section);
      }
    } else {
      for (const f of fs.readdirSync(dir)) {
        if (/\.php$/.test(f) && !/^(header|footer|image)\.php$/.test(f)) enqueue(new URL(`/${section}/${f}`, origin), section);
      }
    }
  }

  const html = new Map(); // final key -> {body, base, section}
  while (queue.length) {
    const { key, url, section } = queue.shift();
    if (pages.has(key)) continue;
    const res = await fetch(url, { redirect: "follow" });
    const final = new URL(res.url);
    const finalKey = final.pathname + final.search;
    if (finalKey !== key) aliases.set(key, finalKey);
    if (!res.ok) {
      console.warn(`${res.status} ${key}`);
      pages.set(key, null);
      continue;
    }
    if (!(res.headers.get("content-type") || "").includes("text/html")) {
      pages.set(key, null);
      continue;
    }
    const out = outputName(final);
    pages.set(key, out);
    pages.set(finalKey, out);
    if (html.has(finalKey)) continue;
    const body = await res.text();
    html.set(finalKey, { body, base: final, section, out });
    for (const re of [LINK_ATTR, POP, JSPHP]) {
      for (const m of body.matchAll(re)) {
        const u = normalize((re === LINK_ATTR ? m[3] : m[2]).replace(/&amp;/g, "&"), final);
        if (u && isPageUrl(u, section)) enqueue(u, section);
      }
    }
  }

  // Rewrite page links to output files and write pages.
  // Wiki links that differ from a page name only in case or "-", "_", " ".
  const loose = (k) => decodeURIComponent(k).toLowerCase().replace(/[-_ ]+/g, "-");
  const looseMap = new Map();
  for (const [k, out] of pages) if (out) looseMap.set(loose(k), out);
  const rewrite = (raw, base) => {
    const u = normalize(raw, base);
    if (!u) return raw.replace(/^https?:\/\/workshops\.nodebox\.net(?=\/)/i, "");
    const key = u.pathname + u.search;
    const target = pages.get(aliases.get(key) || key) || (!u.search && looseMap.get(loose(key)));
    if (target) return "/" + target.replace(/index\.html$/, "");
    return raw.replace(/^https?:\/\/workshops\.nodebox\.net(?=\/)/i, "");
  };
  for (const { body, base, out } of html.values()) {
    let b = body.replace(LINK_ATTR, (m, pre, qq, v) => pre + qq + rewrite(v, base) + qq);
    b = b.replace(POP, (m, a, v, c) => a + rewrite(v, base) + c);
    b = b.replace(JSPHP, (m, a, v, c) => a + rewrite(v.replace(/&amp;/g, "&"), base) + c);
    const file = path.join(outdir, out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, b);
  }
  console.log(`${html.size} pages`);

  // Copy static files.
  let copied = 0;
  for (const section of sections) {
    const walk = (rel) => {
      const abs = path.join(docroot, rel);
      for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
        const r = path.join(rel, e.name);
        const inner = r.slice(section.length + 1);
        if (SKIP_COPY.some((re) => re.test(inner) || re.test(e.name))) continue;
        if (e.isDirectory()) walk(r);
        else if (e.isFile() && !fs.existsSync(path.join(outdir, r))) {
          fs.mkdirSync(path.join(outdir, rel), { recursive: true });
          fs.copyFileSync(path.join(docroot, r), path.join(outdir, r));
          copied++;
        }
      }
    };
    walk(section);
  }
  console.log(`${copied} files copied`);

  // Old URLs -> new files, in Cloudflare Pages / Netlify _redirects format.
  const lines = [];
  for (const [key, out] of pages) {
    if (!out) continue;
    const to = "/" + out.replace(/index\.html$/, "");
    if (key !== to && !key.includes("?")) lines.push(`${key} ${to} 301`);
  }
  fs.writeFileSync(path.join(outdir, "_redirects.legacy"), [...new Set(lines)].sort().join("\n") + "\n");
}

await crawl();
