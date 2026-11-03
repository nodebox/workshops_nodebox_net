# workshops.nodebox.net

- Build: `node build.mjs` writes `_site/`. Verify: `node build.mjs serve` and look at http://localhost:8000/ (home, a workshop, a post, /2004/, /2005/, /2007/, /2016-antwerp/).
- Zero dependencies: keep `build.mjs` on Node built-ins only.
- `content/` is the source of truth for the blog workshops; `legacy/` is copied verbatim, only `build.mjs` may transform it at build time.
- Large files live in `_r2/` (gitignored), mirrored to the media bucket; files of 1 MB or more from `legacy/` are listed in `legacy/r2-files.txt`.
- Media bucket: R2 `nodebox-workshops`, Cloudflare account "Sint Lucas" (40728e030c0e1a608b66d84b0de7ac62), EU jurisdiction (`-J eu`). Upload: `CLOUDFLARE_ACCOUNT_ID=40728e030c0e1a608b66d84b0de7ac62 node _convert/upload_r2.mjs` (resumes from `_r2/.uploaded`). `MEDIA_URL` must point at the bucket's public URL.
- Home tiles for hand-made sites use small copies in `static/thumbs/`, served directly; media thumbs are WebP files in `_r2/thumbs/` made by `npm run thumbs` (sharp), listed in the committed `thumbs.txt`. Only `thumbs.mjs` has npm dependencies; CI needs just `node build.mjs`.
- Post URLs must stay `/<slug>/YYYY/MM/DD/<name>/` (Jekyll's old permalinks).
- Branch: `master`. Deploy: Cloudflare Pages project `nodebox-workshops` (direct upload, Sint Lucas account), `node build.mjs && CLOUDFLARE_ACCOUNT_ID=40728e030c0e1a608b66d84b0de7ac62 wrangler pages deploy _site --project-name nodebox-workshops --branch master`. Check https://nodebox-workshops.pages.dev/ after deploying.
- R2 keys are case-sensitive and macOS is not: never add two media files whose names differ only in case, and keep `..` out of key names (the R2 API rejects them with 403).
- The site is an archive: do not add runtime dependencies on CDNs. Ruffle (Flash player) is vendored in `static/ruffle/` from the npm package `@ruffle-rs/ruffle`; to update, replace ruffle.js, the two .wasm files and package.json together.
