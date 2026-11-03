#!/usr/bin/env node
// Builds workshops.nodebox.net into _site/. No dependencies.
//
//   node build.mjs          build for production
//   node build.mjs serve    build with local media and serve on http://localhost:8000
//
// content/workshops/<slug>.md   a workshop (front matter + about HTML/Markdown)
// content/posts/<slug>/*.md     its posts, named YYYY-MM-DD-<name>.md
// legacy/                       hand-made sites, copied as they are
// static/                       CSS and images for the generated pages
// _r2/                          large media, uploaded to the media bucket (not in git)

import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const ROOT = import.meta.dirname;
const OUT = path.join(ROOT, "_site");
const SERVE = process.argv[2] === "serve";
const PORT = Number(process.env.PORT || 8000);

// Where _r2/ is published. Post media lives under <MEDIA_URL>media/<slug>/.
const MEDIA_URL = SERVE ? "/_r2/" : process.env.MEDIA_URL || "https://workshops-media.nodebox.net/";
// Media images with a thumbnail in <MEDIA_URL>thumbs/<path>.webp, made by thumbs.mjs.
const THUMBS = new Set(fs.existsSync(path.join(ROOT, "thumbs.txt")) ? fs.readFileSync(path.join(ROOT, "thumbs.txt"), "utf8").split("\n").filter(Boolean) : []);

// --- Utilities --------------------------------------------------------------

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const encodePath = (p) => p.split("/").map((s) => encodeURIComponent(decodeURIComponent(s))).join("/");
const mkdirp = (d) => fs.mkdirSync(d, { recursive: true });
function write(rel, data, encoding = "utf8") {
  const f = path.join(OUT, rel);
  mkdirp(path.dirname(f));
  fs.writeFileSync(f, data, encoding);
}
function* walk(dir, rel = "") {
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    if (e.name === ".DS_Store") continue;
    const r = path.join(rel, e.name);
    if (e.isDirectory()) yield* walk(dir, r);
    else if (e.isFile()) yield r;
  }
}

const mediaUrl = (rel) => MEDIA_URL + "media/" + encodePath(rel);
function thumbUrl(src) {
  // src is either a site path ("/static/thumbs/x.jpg", already small and
  // deployed with the site) or a media path ("2008-helsinki/x.jpg"), which
  // uses its thumbnail when thumbs.mjs made one and the original otherwise.
  if (src.startsWith("/")) return encodePath(src);
  return THUMBS.has(src) ? MEDIA_URL + "thumbs/" + encodePath(src + ".webp") : mediaUrl(src);
}
const formatDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

// --- Front matter -----------------------------------------------------------
// A small subset of YAML: "key: value" pairs and lists of "- key: value" maps.

function parseDoc(text) {
  const m = text.replace(/\r\n?/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const data = {};
  let list = null;
  let item = null;
  const value = (v) => (/^".*"$/.test(v) ? JSON.parse(v) : v);
  for (const line of m[1].split("\n")) {
    let r;
    if ((r = line.match(/^(\w+):\s*(.*)$/))) {
      if (r[2] === "") list = data[r[1]] = [];
      else data[r[1]] = value(r[2]);
      item = null;
    } else if ((r = line.match(/^\s*-\s+(\w+):\s*(.*)$/))) {
      item = { [r[1]]: value(r[2]) };
      list.push(item);
    } else if ((r = line.match(/^\s+(\w+):\s*(.*)$/)) && item) {
      item[r[1]] = value(r[2]);
    }
  }
  return { data, body: m[2] };
}

// --- Markdown ---------------------------------------------------------------
// Follows Python-Markdown, which rendered these posts in the Django CMS:
// block-level HTML passes through untouched, everything else is Markdown.

const BLOCK_TAGS = "address|article|aside|blockquote|center|dd|del|div|dl|dt|embed|fieldset|figure|footer|form|h[1-6]|header|hr|iframe|ins|li|map|noscript|object|ol|p|pre|script|section|style|table|tbody|td|tfoot|th|thead|tr|ul|video|audio|canvas";
const BLOCK_START = new RegExp(`^<(${BLOCK_TAGS})(?=[\\s/>])`, "i");

function markdown(src) {
  const lines = src.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  const out = [];
  let i = 0;
  const blank = (l) => /^\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (blank(line)) {
      i++;
      continue;
    }
    // Raw HTML block: runs until the start tag is balanced at a line end.
    const html = line.match(BLOCK_START);
    if (html) {
      const tag = html[1].toLowerCase();
      const open = new RegExp(`<${tag}(?=[\\s/>])`, "gi");
      const close = new RegExp(`</${tag}\\s*>`, "gi");
      // Unclosed tags (a <p> without </p>) end at the next blank line.
      const closable = new RegExp(`</${tag}\\s*>`, "i").test(lines.slice(i).join("\n"));
      let depth = 0;
      const buf = [];
      while (i < lines.length) {
        const l = lines[i++];
        buf.push(l);
        depth += (l.match(open) || []).length - (l.match(close) || []).length;
        if ((depth <= 0 || !closable) && (i >= lines.length || blank(lines[i]))) break;
      }
      out.push(buf.join("\n"));
      continue;
    }
    // Code block.
    if (/^ {4}/.test(line)) {
      const buf = [];
      while (i < lines.length && (/^ {4}/.test(lines[i]) || (blank(lines[i]) && /^ {4}/.test(lines[i + 1] || "")))) {
        buf.push(lines[i++].slice(4));
      }
      out.push(`<pre><code>${esc(buf.join("\n"))}\n</code></pre>`);
      continue;
    }
    // ATX header.
    let r;
    if ((r = line.match(/^(#{1,6})\s*(.*?)\s*#*\s*$/))) {
      const n = r[1].length;
      out.push(`<h${n}>${inline(r[2])}</h${n}>`);
      i++;
      continue;
    }
    // Horizontal rule.
    if (/^ {0,3}([-*_])( *\1){2,} *$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }
    // List.
    const listRe = /^ {0,3}([*+-]|\d+\.)\s+(.*)$/;
    if ((r = line.match(listRe))) {
      const ordered = /\d/.test(r[1]);
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(listRe);
        if (m && /\d/.test(m[1]) === ordered) items.push([m[2]]);
        else if (!blank(lines[i]) && items.length && /^\s+\S/.test(lines[i])) items[items.length - 1].push(lines[i].trim());
        else if (blank(lines[i]) && (lines[i + 1] || "").match(listRe)) {
          /* loose list continues */
        } else break;
        i++;
      }
      const t = ordered ? "ol" : "ul";
      out.push(`<${t}>\n${items.map((it) => `<li>${inline(it.join("\n"))}</li>`).join("\n")}\n</${t}>`);
      continue;
    }
    // Setext header.
    if (i + 1 < lines.length && /^(=+|-+)\s*$/.test(lines[i + 1]) && !blank(line)) {
      const n = lines[i + 1].trim()[0] === "=" ? 1 : 2;
      out.push(`<h${n}>${inline(line.trim())}</h${n}>`);
      i += 2;
      continue;
    }
    // Paragraph: up to a blank line, header, bullet list or block start.
    const buf = [];
    while (
      i < lines.length &&
      !blank(lines[i]) &&
      !(buf.length && (/^#{1,6}/.test(lines[i]) || BLOCK_START.test(lines[i]) || /^ {0,3}[*+-]\s+\S/.test(lines[i]) || /^(=+|-+)\s*$/.test(lines[i + 1] || "")))
    ) {
      buf.push(lines[i++]);
    }
    out.push(`<p>${inline(buf.join("\n"))}</p>`);
  }
  return out.join("\n\n");
}

function inline(text) {
  const keep = [];
  const hold = (s) => `\u0000${keep.push(s) - 1}\u0000`;
  let s = text;
  s = s.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, (m, t, c) => hold(`<code>${esc(c.trim())}</code>`));
  s = s.replace(/<(https?:\/\/[^>\s]+)>/g, (m, u) => hold(`<a href="${esc(u)}">${esc(u)}</a>`));
  s = s.replace(/<\/?[a-zA-Z][^>]*>|<!--[\s\S]*?-->/g, hold);
  s = s.replace(/&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (m, c) => hold(c));
  s = s.replace(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/g, (m, alt, u, t) => hold(`<img src="${u}" alt="${alt}"${t ? ` title="${t}"` : ""} />`));
  s = s.replace(/\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/g, (m, txt, u, t) => `<a href="${u}"${t ? ` title="${t}"` : ""}>${txt}</a>`);
  s = s.replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "<strong>$2</strong>");
  s = s.replace(/\*(?=\S)([\s\S]*?\S)\*/g, "<em>$1</em>");
  s = s.replace(/(^|[^\w])_(?=\S)([\s\S]*?\S)_(?!\w)/g, "$1<em>$2</em>");
  s = s.replace(/ {2,}\n/g, "<br />\n");
  return s.replace(/\u0000(\d+)\u0000/g, (m, n) => keep[n]).replace(/\u0000(\d+)\u0000/g, (m, n) => keep[n]);
}

// Media links in content are written as /media/<slug>/<file>.
const mediaLinks = (html) => html.replace(/((?:src|href|value|data)\s*=\s*["'])\/media\//gi, `$1${MEDIA_URL}media/`);

// --- Load content -----------------------------------------------------------

const workshops = fs
  .readdirSync(path.join(ROOT, "content/workshops"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const { data, body } = parseDoc(fs.readFileSync(path.join(ROOT, "content/workshops", f), "utf8"));
    const slug = f.slice(0, -3);
    return { slug, ...data, url: data.url || `/${slug}/`, legacy: Boolean(data.url), body, posts: [] };
  })
  .sort((a, b) => b.slug.localeCompare(a.slug));
const bySlug = new Map(workshops.map((w) => [w.slug, w]));

for (const w of workshops) {
  const dir = path.join(ROOT, "content/posts", w.slug);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const [, y, m, d, name] = f.match(/^(\d{4})-(\d\d)-(\d\d)-(.+)\.md$/);
    const { data, body } = parseDoc(fs.readFileSync(path.join(dir, f), "utf8"));
    w.posts.push({ ...data, workshop: w, date: new Date(`${y}-${m}-${d}T00:00:00Z`), url: `/${w.slug}/${y}/${m}/${d}/${name}/`, body, assets: data.assets || [] });
  }
  // Newest first, like the Jekyll site.
  w.posts.sort((a, b) => b.date - a.date || b.url.localeCompare(a.url));
}

// --- Templates --------------------------------------------------------------

// ASCII only: legacy pages get this bar re-encoded as Latin-1.
const shopbar = () => `<div id="shopbar">
  <input type="checkbox" id="shopbar-toggle" class="shopbar-toggle" aria-label="Show all workshops">
  <label for="shopbar-toggle" class="shopbar-burger"><span></span><span></span><span></span></label>
  <ul>
    <li class="popup">
      <a href="/"><span>All Workshops</span></a>
      <ul>
${workshops.map((w) => `        <li><a href="${w.url}">${esc(w.name)}</a></li>`).join("\n")}
      </ul>
    </li>
  </ul>
</div>`;

const page = ({ title, description, body, scripts = [] }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  ${description ? `<meta name="description" content="${esc(description)}">` : ""}
  <link rel="stylesheet" href="/static/css/base.css">
  <link rel="stylesheet" href="/static/css/skeleton.css">
  <link rel="stylesheet" href="/static/css/blog.css">
  <link rel="stylesheet" href="/static/css/shopbar.css">
${scripts.map((src) => `  <script src="${src}" defer></script>\n`).join("")}</head>
<body>
${shopbar()}
<div class="container">
${body}
  <footer id="footer" class="row">
    <div class="sixteen columns">
      <hr>
      <p>NodeBox Workshop blog &copy; 2004–${new Date().getFullYear()} <a href="https://www.emrg.be/">Experimental Media Research Group</a>.</p>
    </div>
  </footer>
</div>
</body>
</html>
`;

const header = (title, url) => `  <header id="header" class="row">
    <div class="sixteen columns">
      <h1 id="header-name">${url ? `<a href="${url}">${esc(title)}</a>` : esc(title)}</h1>
      <hr>
    </div>
  </header>`;

const thumbTile = ({ href, src, title, meta }) => `    <a href="${href}" class="thumb">
      ${src ? `<img class="thumb__image" src="${esc(src)}" alt="" width="220" height="220" loading="lazy">` : `<span class="thumb__image thumb__image--blank"></span>`}
      <h5>${esc(title)}</h5>${meta ? `\n      <p class="meta">${meta}</p>` : ""}
    </a>`;

function homePage() {
  const tiles = workshops.map((w) => thumbTile({ href: w.url, src: w.thumb && thumbUrl(w.thumb), title: w.name })).join("\n");
  return page({
    title: "NodeBox Workshops",
    description: "Workshops on generative design and data visualization with NodeBox, organized by EMRG since 2004.",
    body: `${header("NodeBox Workshops")}
  <div id="intro" class="row">
    <div class="sixteen columns">
      <p><a href="https://www.emrg.be/">EMRG</a> has organized design workshops internationally since
      2004. A workshop usually spans a 1-2 week period involving both theory, art &amp; design practice,
      and hands-on programming sessions. Here you will find the raw, unfinished work of our workshop
      participants.</p>
    </div>
  </div>
  <main id="content" class="sixteen columns">
    <div class="workshop-grid">
${tiles}
    </div>
  </main>`,
  });
}

const postMeta = (p) => `<span class="author">${esc(p.author)}</span>&nbsp;—&nbsp;<time datetime="${p.date.toISOString().slice(0, 10)}">${formatDate(p.date)}</time>`;
const isImage = (a) => a.type === "image" || /\.(jpe?g|png|gif|webp)$/i.test(a.filename);

function workshopPage(w) {
  const tiles = w.posts
    .map((p) => {
      const img = p.assets.find(isImage);
      return thumbTile({ href: p.url, src: img && thumbUrl(`${w.slug}/${img.filename}`), title: p.title, meta: postMeta(p) });
    })
    .join("\n");
  return page({
    title: `${w.name} — NodeBox Workshops`,
    description: w.description,
    body: `${header(w.name, w.url)}
  <main id="content" class="sixteen columns">
    <div id="intro" class="row">
      <div class="sixteen columns alpha omega"><p>${esc(w.description)}</p></div>
    </div>
    <div id="workshop-about" class="row">
      <div class="sixteen columns alpha omega">
${mediaLinks(markdown(w.body))}
${w.projects ? `<p class="projects-link"><a href="${w.projects}">See the student projects &rarr;</a></p>` : ""}
      </div>
    </div>
    <div class="workshop-posts">
${tiles}
    </div>
  </main>`,
  });
}

function postPage(p) {
  const w = p.workshop;
  const assets = p.assets
    .map((a) => {
      const href = mediaUrl(`${w.slug}/${a.filename}`);
      const name = a.filename.split("/").pop();
      const caption = a.description ? `<span class="asset__caption">${esc(a.description)}</span>` : "";
      if (isImage(a)) {
        return `    <a class="thumb" href="${esc(href)}"><img class="thumb__image" src="${esc(thumbUrl(`${w.slug}/${a.filename}`))}" width="220" height="220" alt="${esc(a.description || name)}" loading="lazy">${caption}</a>`;
      }
      if (a.video) {
        return `    <div class="asset-video"><video src="${esc(mediaUrl(`${w.slug}/${a.video}`))}" controls preload="metadata"></video><a class="file__name" href="${esc(href)}">${esc(name)}</a>${caption}</div>`;
      }
      const ext = (name.match(/\.(\w+)$/) || [, "file"])[1].toUpperCase();
      return `    <a class="thumb file" href="${esc(href)}"><span class="thumb__image file__icon">${esc(ext)}</span><span class="file__name">${esc(name)}</span>${caption}</a>`;
    })
    .join("\n");
  return page({
    title: `${p.title} — ${w.name}`,
    scripts: ["/static/js/lightbox.js"],
    body: `${header(w.name, w.url)}
  <main id="content" class="twelve columns">
    <article>
      <h2>${esc(p.title)}</h2>
      <p class="meta">By ${postMeta(p)}</p>
      <div class="post-body">
${mediaLinks(markdown(p.body))}
      </div>
      <div class="post-assets">
${assets}
      </div>
    </article>
  </main>`,
  });
}

const notFoundPage = () =>
  page({ title: "Not found — NodeBox Workshops", body: `${header("NodeBox Workshops", "/")}\n  <main id="content" class="sixteen columns"><h2>Page not found</h2><p>This page does not exist. <a href="/">Browse all workshops</a>.</p></main>` });

// --- Legacy sites -----------------------------------------------------------

const r2Files = new Set(
  fs
    .readFileSync(path.join(ROOT, "legacy/r2-files.txt"), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((f) => "/" + f),
);

// Ruffle 0.8.0-nightly.2026.10.15 from npm (@ruffle-rs/ruffle), kept local so the archive works on its own.
const RUFFLE = "/static/ruffle/ruffle.js";
const legacyFileExists = (p) => r2Files.has(p) || fs.existsSync(path.join(ROOT, "legacy", p));

// QuickTime plugin embeds become <video> when a transcoded .mp4 sits next to the movie.
function legacyVideo(html, base) {
  const mp4For = (src) => {
    try {
      const p = decodeURIComponent(new URL(src, base).pathname).replace(/\.(mov|avi|mpe?g)$/i, ".mp4");
      return /\.mp4$/.test(p) && legacyFileExists(p) ? p : null;
    } catch {
      return null;
    }
  };
  const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}\\s*=\\s*["']?([^"'\\s>]+)`, "i")) || [])[1];
  const video = (tag) => {
    const src = attr(tag, "src") || attr(tag, "value");
    const mp4 = src && mp4For(src);
    if (!mp4) return null;
    const w = attr(tag, "width"), h = attr(tag, "height");
    const auto = /autoplay\s*=\s*["']?true/i.test(tag);
    return `<video src="${encodePath(mp4)}"${w ? ` width="${w}"` : ""}${h && +h > 16 ? ` height="${h - (/controller\s*=\s*["']?true/i.test(tag) ? 16 : 0)}"` : ""} ${auto ? "autoplay muted loop playsinline" : "controls preload=\"metadata\""}></video>`;
  };
  html = html.replace(/<object\b[^>]*>(?:(?!<\/object>)[\s\S])*?\.(?:mov|avi|mpe?g)\b[\s\S]*?<\/object>/gi, (m) => {
    const inner = m.match(/<embed\b[^>]*>/i);
    return video(inner ? inner[0] : m) || m;
  });
  html = html.replace(/<embed\b[^>]*\.(?:mov|avi|mpe?g)\b[^>]*>(\s*<\/embed>)?/gi, (m) => video(m) || m);
  // Links to movies open the playable version.
  return html.replace(/(<a\b[^>]*\shref\s*=\s*["'])([^"']+\.(?:mov|avi|mpe?g))(["'])/gi, (m, a, src, q) => {
    const mp4 = mp4For(src);
    return mp4 ? a + encodePath(mp4) + q : m;
  });
}

function legacyHtml(html, rel) {
  const base = new URL("/" + rel, "http://x");
  html = legacyVideo(html, base);
  // Flash still plays through Ruffle.
  if (/\.swf\b/i.test(html)) html = html.replace(/<head[^>]*>/i, (h) => `${h}\n<script src="${RUFFLE}"></script>`);
  // Point links to large files at the media bucket.
  html = html.replace(/(\s(?:href|src|value|data)\s*=\s*)(["'])([^"']+)\2/gi, (m, attr, q, v) => {
    if (/^(#|[a-z]+:)/i.test(v)) return m;
    let p;
    try {
      p = decodeURIComponent(new URL(v, base).pathname);
    } catch {
      return m;
    }
    return r2Files.has(p) ? `${attr}${q}${MEDIA_URL}${encodePath(p.slice(1))}${q}` : m;
  });
  // The wiki's login links lead nowhere on a static site.
  html = html.replace(/<li class="nav-action"><a href="[^"]*\?login">[^<]*<\/a><\/li>|<a href="[^"]*\?login">[^<]*<\/a>/g, "");
  // The navigation bar lists every workshop, so it is regenerated.
  // The page is handled as latin1 to keep its bytes; inserted text is UTF-8.
  const bar = Buffer.from(`<link rel="stylesheet" href="/static/css/shopbar.css">\n${shopbar()}\n`, "utf8").toString("latin1");
  return html.replace(/<div id="shopbar">[\s\S]*?<\/div>\s*(\u00e2\u0080\u008b)?/, bar);
}

// --- Build ------------------------------------------------------------------

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  mkdirp(OUT);

  for (const rel of walk(path.join(ROOT, "legacy"))) {
    if (rel === "r2-files.txt" || rel === "_redirects") continue;
    const src = path.join(ROOT, "legacy", rel);
    if (rel.endsWith(".html")) write(rel, legacyHtml(fs.readFileSync(src, "latin1"), rel), "latin1");
    else {
      mkdirp(path.dirname(path.join(OUT, rel)));
      fs.copyFileSync(src, path.join(OUT, rel));
    }
  }
  for (const rel of walk(path.join(ROOT, "static"))) {
    mkdirp(path.dirname(path.join(OUT, "static", rel)));
    fs.copyFileSync(path.join(ROOT, "static", rel), path.join(OUT, "static", rel));
  }

  write("index.html", homePage());
  const redirects = [];
  let n = 0;
  for (const w of workshops) {
    if (w.legacy) continue;
    write(`${w.slug}/index.html`, workshopPage(w));
    for (const p of w.posts) {
      write(`${p.url}index.html`, postPage(p));
      if (p.redirect_from) redirects.push([p.redirect_from, p.url]);
      n++;
    }
  }
  for (const [from, to] of redirects) {
    write(`${from}index.html`, `<!DOCTYPE html><meta charset="utf-8"><title>Redirecting</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><a href="${to}">${to}</a>\n`);
  }
  write("404.html", notFoundPage());
  const legacyRedirects = fs.readFileSync(path.join(ROOT, "legacy/_redirects"), "utf8");
  write("_redirects", legacyRedirects + redirects.map(([f, t]) => `${f} ${t} 301\n`).join(""));
  console.log(`Built ${workshops.length} workshops, ${n} posts into _site/ (media: ${MEDIA_URL})`);
}

// --- Dev server -------------------------------------------------------------

const TYPES = { html: "text/html; charset=utf-8", css: "text/css", js: "text/javascript", json: "application/json", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", pdf: "application/pdf", mov: "video/quicktime", mp4: "video/mp4", mp3: "audio/mpeg", swf: "application/x-shockwave-flash", wasm: "application/wasm", txt: "text/plain; charset=utf-8" };

function serve() {
  http
    .createServer((req, res) => {
      const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
      const roots = url.startsWith("/_r2/") ? [[path.join(ROOT, "_r2"), url.slice(4)]] : [[OUT, url]];
      for (const [root, p] of roots) {
        const f = path.join(root, path.normalize(p));
        if (!f.startsWith(root)) break;
        for (const cand of [f, path.join(f, "index.html"), f + ".html"]) {
          if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
            if (cand === path.join(f, "index.html") && !url.endsWith("/")) {
              res.writeHead(301, { Location: url + "/" }).end();
              return;
            }
            const ext = cand.split(".").pop().toLowerCase();
            res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
            fs.createReadStream(cand).pipe(res);
            return;
          }
        }
      }
      res.writeHead(404, { "Content-Type": TYPES.html });
      fs.createReadStream(path.join(OUT, "404.html")).pipe(res);
    })
    .listen(PORT, () => console.log(`Serving on http://localhost:${PORT}/`));
}

build();
if (SERVE) serve();
