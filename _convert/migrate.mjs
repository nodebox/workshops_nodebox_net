// One-off migration from the Jekyll layout (_posts, _workshops) and the
// backups gathered in _gather/ to content/, legacy/ and _r2/.
// See _convert/README.md for where _gather/ comes from.
//
//   node _convert/migrate.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const G = path.join(ROOT, "_gather");
const R2 = path.join(ROOT, "_r2");
const BIG = 1024 * 1024; // files from this size go to R2

const p = (...a) => path.join(ROOT, ...a);
const mkdirp = (d) => fs.mkdirSync(d, { recursive: true });
const copy = (from, to) => {
  mkdirp(path.dirname(to));
  if (!fs.existsSync(to)) fs.copyFileSync(from, to);
};

// --- Front matter -----------------------------------------------------------

function parseJekyll(text) {
  text = text.replace(/\r\n?/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const data = {};
  let list = null;
  let item = null;
  for (const line of m[1].split("\n")) {
    if (/^\s+-\s*$/.test(line)) {
      item = {};
      list.push(item);
    } else if (/^\s+\w+:/.test(line) && item) {
      const [, k, v] = line.match(/^\s+(\w+):\s?(.*)$/);
      item[k] = v;
    } else if (/^\w+:/.test(line)) {
      const [, k, v] = line.match(/^(\w+):\s?(.*)$/);
      if (v === "") {
        list = data[k] = [];
      } else {
        data[k] = v.replace(/^"(.*)"$/, "$1").trim();
      }
      item = null;
    }
  }
  return { data, body: m[2] };
}

function quote(v) {
  v = String(v);
  return /^[\w .,()&'!?\/-]*$/.test(v) && v.trim() === v && v !== "" ? v : JSON.stringify(v);
}

function writeDoc(file, data, body) {
  let fm = "";
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      fm += `${k}:\n`;
      for (const it of v) {
        const entries = Object.entries(it).filter(([, x]) => x !== undefined && x !== "");
        entries.forEach(([ik, iv], i) => (fm += `${i ? "  " : " -"} ${ik}: ${quote(iv)}\n`));
      }
    } else fm += `${k}: ${quote(v)}\n`;
  }
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, `---\n${fm}---\n${body.replace(/\s+$/, "")}\n`);
}

// --- File index for resolving old media URLs --------------------------------

const index = new Map(); // normalized basename -> [abs path]
const norm = (s) => decodeURIComponent(s).toLowerCase().replace(/[^a-z0-9.]/g, "");
function indexDir(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) indexDir(f);
    else if (e.isFile()) {
      const k = norm(e.name);
      if (!index.has(k)) index.set(k, []);
      index.get(k).push(f);
    }
  }
}
indexDir(path.join(G, "media"));
indexDir(path.join(G, "wayback")); // see wayback.mjs
for (const s of ["xemrg_public", "linode_public"]) {
  for (const d of fs.readdirSync(path.join(G, s))) if (/^20\d\d-/.test(d)) indexDir(path.join(G, s, d));
}

// Old WordPress blog folders and the workshop they became.
const WP = { "2009": "2009-lahti", "2010": "2010-lahti", "2010-2": "2010-antwerp", "2011-1": "2011-antwerp", "2011-2": "2011-helsinki", "2011-3": "2011-lahti" };

function findFile(slug, name) {
  const tries = [name, name.replace(/-\d+x\d+(\.\w+)$/, "$1")];
  for (const t of tries) {
    const hits = index.get(norm(t)) || [];
    const ranked = [
      ...hits.filter((h) => h.includes(`/media/${slug}/`)),
      ...hits.filter((h) => h.includes(`/${slug}/`)),
      ...hits,
    ];
    if (ranked.length) return ranked[0];
  }
  return null;
}

// Returns the /media/... URL for a source file, copying it into _r2 if needed.
function mediaUrl(slug, abs) {
  const mediaRoot = path.join(G, "media") + "/";
  let rel;
  if (abs.startsWith(mediaRoot)) rel = abs.slice(mediaRoot.length);
  else {
    // Files that only survived in the Movable Type / WordPress folders.
    const m = abs.match(/(?:_public|wayback)\/(20[^/]+)\/(.*)$/);
    rel = `${m[1]}/old/${m[2]}`;
  }
  copy(abs, path.join(R2, "media", rel));
  return "/media/" + rel.split("/").map(encodeURIComponent).join("/");
}

const missing = new Set();

// --- Posts ------------------------------------------------------------------

const posts = []; // {slug, file, data, body}
for (const f of fs.readdirSync(p("_posts")).sort()) {
  const { data, body } = parseJekyll(fs.readFileSync(p("_posts", f), "utf8"));
  // Jekyll slugified the name part of the file name to build the URL.
  const [, date, name] = f.match(/^(\d{4}-\d\d-\d\d)-(.*)\.md$/);
  // Jekyll's "pretty" slug mode.
  const jekyllName = name.replace(/[^\p{L}\p{N}._~!$&'()+,;=@]+/gu, "-").replace(/^-+|-+$/g, "");
  posts.push({ slug: data.workshop_slug, file: name ? `${date}-${jekyllName}.md` : f, data, body });
}

// Post URL lookup for old permalinks: by workshop + name.
const postUrl = (po) => {
  const [, y, mo, d, name] = po.file.match(/^(\d{4})-(\d\d)-(\d\d)-(.*)\.md$/);
  return `/${po.slug}/${y}/${mo}/${d}/${name}/`;
};
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function findPost(slug, oldSlug) {
  const k = slugify(oldSlug);
  if (!k) return null;
  const cands = posts.filter((po) => po.slug === slug);
  const byName = cands.find((po) => slugify(po.file.slice(11, -3)) === k);
  const byTitle = cands.find((po) => slugify(po.data.title || "") === k);
  const byPrefix = cands.find((po) => k.startsWith(slugify(po.file.slice(11, -3))) && po.file.length > 18);
  return byName || byTitle || byPrefix || null;
}

// Hand fixes for content that does not render as its author meant.
const FIXES = [["<em><Sorry, a bit of a lousy joke", "<em>&lt;Sorry, a bit of a lousy joke"], ["the-you-know-what.</em>", "the-you-know-what.&gt;</em>"]];

function fixBody(body, slug) {
  for (const [a, b] of FIXES) body = body.replace(a, b);
  // WordPress shortcodes. The post's asset list already shows gallery images.
  body = body.replace(/\[caption([^\]]*)\]([\s\S]*?)\[\/caption\]/g, (m, attrs, inner) => {
    const cap = (attrs.match(/caption=(["'])(.*?)\1/) || [, , ""])[2];
    const text = inner.replace(/<img[^>]*>|<a\b[^>]*>|<\/a>/g, (t) => t).match(/(?:<\/a>|\/>)\s*([^<]+)$/);
    return `<figure>${inner.replace(/(?:<\/a>|\/>)\s*[^<]+$/, (t) => t.replace(/\s*[^<>]+$/, ""))}<figcaption>${cap || (text ? text[1].trim() : "")}</figcaption></figure>`;
  });
  body = body.replace(/\[gallery[^\]]*\]/g, "");
  return body.replace(/((?:src|href)\s*=\s*)(["'])(.*?)\2/gi, (all, attr, q, url) => {
    const out = fixUrl(url.trim(), slug);
    return out === url ? all : `${attr}${q}${out}${q}`;
  });
}

function fixUrl(url, slug) {
  const m = url.match(/^(?:https?:\/\/workshops\.nodebox\.net)?\/([^/?#]+)\/(.*)$/i);
  if (!m || !/^https?:\/\/workshops\.nodebox\.net\//i.test(url) && !url.startsWith("/")) return url;
  const [, first, rest] = m;
  // http://workshops.nodebox.net/media/<slug>/<file>
  if (first === "media") return "/media/" + rest;
  // WordPress uploads.
  if (WP[first] && rest.startsWith("wp-content/uploads/")) {
    const target = WP[first];
    const name = rest.split("/").pop();
    const f = findFile(target, name);
    if (f) return mediaUrl(target, f);
    missing.add(url);
    return url;
  }
  // WordPress / Movable Type post permalinks.
  const wpSlug = WP[first] || (/^20\d\d-/.test(first) ? first : null);
  if (wpSlug) {
    // A file in the old Movable Type folder?
    for (const s of ["xemrg_public", "linode_public"]) {
      const f = path.join(G, s, first, decodeURIComponent(rest.split(/[?#]/)[0]));
      if (rest && fs.existsSync(f) && fs.statSync(f).isFile() && !/\.html$/.test(f)) return mediaUrl(first, f);
    }
    const last = rest.replace(/\/$/, "").replace(/\.html$/, "").split("/").pop();
    const po = findPost(wpSlug, last);
    if (po) return postUrl(po);
    // WordPress attachment page (/<post>/<attachment>/): link the file itself, or else its post.
    const segs = rest.replace(/\/$/, "").split("/");
    if (WP[first] && segs.length === 2) {
      const att = decodeURIComponent(segs[1]).replace(/-\d+$/, "");
      for (const ext of [".png", ".jpg", ".jpeg", ".gif", ".pdf", ".zip", ".mov"]) {
        const f = findFile(wpSlug, att + ext) || findFile(wpSlug, att.replace(/-/g, "_") + ext);
        if (f) return mediaUrl(wpSlug, f);
      }
      const parent = findPost(wpSlug, decodeURIComponent(segs[0]));
      if (parent) return postUrl(parent);
    }
    if (!rest || rest.startsWith("?") || rest === "wp-admin/") return `/${wpSlug}/`;
    missing.add(url);
  }
  if (first === "2008" && rest.startsWith("students")) return "/2008-helsinki/";
  return url;
}

// The Movable Type post that never reached the Django database.
posts.push({
  slug: "2013-antwerp",
  file: "2013-03-24-end_results.md",
  data: {
    title: "End results",
    author: "pink panthers",
    assets: [{ filename: "old/2013-antwerp/Poster oscars.jpg", type: "image" }, { filename: "old/2013-antwerp/Poster oscars.pdf", type: "pdf" }],
  },
  body:
    "After we made the part where you can see the oscar winners by year (and move your mouse across to see the characters in detail), we did a part where you can put your own data (sex, age, height) next to the data from the oscar winners. We made this possible by using Touch OSC (and a lot of nodes).<br />We put this in a short video to show the effect.<br /><br /><a href=\"http://vimeo.com/62079951\">VIDEO</a><br /><br />The next thing we had to do was making a poster out of it. Here you can see the end result.<br />",
});
for (const f of ["Poster oscars.jpg", "Poster oscars.pdf"]) copy(path.join(G, "xemrg_public/2013-antwerp", f), path.join(R2, "media/2013-antwerp/old/2013-antwerp", f));


fs.rmSync(p("content"), { recursive: true, force: true });
for (const po of posts) {
  const { title, author, assets } = po.data;
  let redirect_from;
  if (/^\d{4}-\d\d-\d\d-\.md$/.test(po.file)) {
    // Jekyll gave this nameless post the date folder itself as its URL.
    redirect_from = postUrl(po).replace(/\/\/$/, "/");
    const name = po.file.replace(/-\.md$/, `-${kebab(title).slice(0, 40) || "post"}`);
    po.file = posts.some((o) => o.slug === po.slug && o.file === name + ".md") ? name + "-2.md" : name + ".md";
  }
  // Movies with an H.264 copy (transcode.mjs) can play in the page.
  const withVideo = assets?.map((a) => {
    const mp4 = a.filename.replace(/\.(mov|avi|mpe?g)$/i, ".mp4");
    return mp4 !== a.filename && fs.existsSync(path.join(G, "media", po.slug, mp4)) ? { ...a, video: mp4 } : a;
  });
  writeDoc(p("content/posts", po.slug, po.file), { title, author, redirect_from, assets: withVideo }, fixBody(po.body, po.slug));
}
console.log(`${posts.length} posts`);

// --- Workshops --------------------------------------------------------------

for (const f of fs.readdirSync(p("_workshops"))) {
  const { data, body } = parseJekyll(fs.readFileSync(p("_workshops", f), "utf8"));
  // "." was a placeholder for an empty about text.
  writeDoc(p("content/workshops", f), { name: data.name.trim(), description: data.description, thumb: data.thumb }, body.trim() === "." ? "" : fixBody(body, data.slug));
}

const blogs = JSON.parse(fs.readFileSync(p("_convert/blogs.json"), "utf8"));
const h14 = blogs.find((b) => b.slug === "2014-helsinki");
writeDoc(p("content/workshops/2014-helsinki.md"), { name: h14.name, description: h14.description }, h14.about.replace(/\r/g, ""));

// 2016 Antwerp: the about text plus the project grid from its PHP index.
{
  const about = fs.readFileSync(p("2016-antwerp.html"), "utf8");
  const intro = about.match(/<div class="row">\s*<div class="sixteen columns alpha omega">([\s\S]*?)<\/div>\s*<\/div>/)[1];
  const grid = fs.readFileSync(path.join(G, "linode_public/2016-antwerp/index.php"), "utf8").replace(/<\?php[\s\S]*?\?>/g, "");
  // Dedent: four leading spaces would make these lines a Markdown code block.
  const body = `${intro.trim()}\n\n<div class="projects">\n${grid.trim()}\n</div>`.replace(/^[ \t]+/gm, "");
  writeDoc(p("content/workshops/2016-antwerp.md"), { name: "2016 Antwerp", description: "Actually Useful, 14-18 March 2016.", thumb: "/2016-antwerp/day1/thumb-dries.jpg" }, body.replace(/<div class="thumb">/g, '<div class="thumb">'));
}

// Hand-made sites that keep their own design.
const legacyWorkshops = [
  ["2004-lahti", "2004 Lahti", "Automation, Lahti, Finland, 2004.", "/2004/", "/2004/day03/day3.jpg"],
  ["2005-lahti", "2005 Lahti", "Lahti, Finland, 23 January - 3 February 2005.", "/2005/", "/2005/data/media/zztyposhow.jpg"],
  ["2007-lahti", "2007 Lahti", "Lahti, Finland, 8-16 February 2007.", "/2007/", "/2007/data/media/letters.jpg"],
  ["2015-dighum", "2015 Digital Humanities", "Digital Humanities Spring Academy 2015: NodeBox Data Visualisation, 10-12 June 2015, Antwerp.", "/2015-dighum/", "/2015-dighum/_img/thumb-alexa.png"],
];
for (const [slug, name, description, url, thumb] of legacyWorkshops) {
  writeDoc(p("content/workshops", slug + ".md"), { name, description, url, thumb }, "");
}
// Student project sites belonging to a blog workshop.
for (const [slug, url] of [["2015-antwerp", "/2015-antwerp-projects/"], ["2015-vilnius", "/2015-vilnius-projects/"], ["2015-warsaw", "/2015-warsaw-projects/"], ["2016-vilnius", "/2016-vilnius-projects/"]]) {
  const file = p("content/workshops", slug + ".md");
  const t = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, t.replace(/\n---\n/, `\nprojects: ${url}\n---\n`));
}

// --- Legacy sites -----------------------------------------------------------

fs.rmSync(p("legacy"), { recursive: true, force: true });
const r2List = [];
function placeLegacy(src, rel) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const r = path.join(rel, e.name);
    if (e.isDirectory()) placeLegacy(s, r);
    else if (e.isFile()) {
      if (fs.statSync(s).size >= BIG) {
        copy(s, path.join(R2, r));
        r2List.push(r);
      } else copy(s, p("legacy", r));
    }
  }
}
placeLegacy(path.join(G, "legacy_all"), "");
fs.copyFileSync(path.join(G, "legacy_out/_redirects.legacy"), p("legacy/_redirects"));
// 2004/index.php redirected to the last day.
fs.writeFileSync(p("legacy/2004/index.html"), '<!DOCTYPE html><meta charset="utf-8"><title>Automation</title><meta http-equiv="refresh" content="0; url=day12.html"><a href="day12.html">Day 12</a>\n');
fs.writeFileSync(p("legacy/r2-files.txt"), r2List.sort().join("\n") + "\n");
console.log(`${r2List.length} legacy files moved to _r2`);

// All remaining post media goes to R2 as well, in the bucket's media/ layout.
function copyTree(src, dst) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    if (e.isDirectory()) copyTree(s, path.join(dst, e.name));
    else if (e.isFile() && e.name !== ".DS_Store") copy(s, path.join(dst, e.name));
  }
}
copyTree(path.join(G, "media"), path.join(R2, "media"));

fs.writeFileSync(p("_convert/missing-media.txt"), [...missing].sort().join("\n") + "\n");
console.log(`${missing.size} old URLs could not be resolved (see _convert/missing-media.txt)`);
