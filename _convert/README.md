# Conversion scripts

One-off scripts that produced `content/`, `legacy/` and `_r2/`. They are kept to document where the material came from; the site is built from `content/` and `legacy/` now.

## Sources

Gathered into `_gather/` (not in git) from backups on the old iMac:

- `~/Backup/2019-10-25-workshops_nodebox_net`: a crawl of the live site (Django era). Used for comparison only.
- `~/Backup/2019-10-25-x_emrg_be/home/fdb/emrg/www/www/workshops.nodebox.net`: the 2013 server. Its `public_html` holds the 2004 PHP site, the 2005 and 2007 UltraWiki sites (with all their media), and the Movable Type / WordPress folders of 2008-2013. `home/fdb/emrg/fdb/` holds the SQL dumps.
- `~/Backup/2019-10-25-x_emrg_be/www/static.nodebox.net`: the 2015 student project sites and 2015 Digital Humanities.
- `~/Backup/2019-10-25-linode/www/workshops.nodebox.net`: the last server. The Django media for 2008-2016, `2016-antwerp` (PHP) and `2016-vilnius-projects`.

## Steps

1. `mysql_to_json.py`, `json_to_posts.py`: Django MySQL database to Jekyll `_posts/` and `_workshops/` (earlier).
2. `crawl_legacy.mjs`: renders 2004, 2005 and 2007 with their original PHP code and saves static HTML. Serve the docroot with `php:5.6-apache` and mod_rewrite (`AllowOverride All`), then run it against that origin.
3. `transcode.mjs`: H.264 copies of the old QuickTime movies, so pages can use `<video>`.
4. `wayback.mjs`: fetches WordPress uploads that no backup has from the Wayback Machine.
5. `migrate.mjs`: Jekyll posts to `content/`, fixes old WordPress / Movable Type URLs in posts, restores the Movable Type post that never reached Django (2013 Antwerp "End results"), adds 2014 Helsinki and the hand-made sites, and splits files of 1 MB or more into `_r2/`. It ran against commit d12a1ee; its Jekyll inputs were removed afterwards.
6. `upload_r2.mjs`: uploads `_r2/` to the R2 bucket with wrangler.

`missing-media.txt` lists old media URLs in posts that no source could provide.
