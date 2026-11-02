# NodeBox Workshops

Source for https://workshops.nodebox.net/: every NodeBox workshop EMRG ran from 2004 to 2016.

    node build.mjs          # build into _site/
    node build.mjs serve    # build with local media, serve on http://localhost:8000

No dependencies; Node 22 or newer.

- `content/workshops/<slug>.md`: one workshop. Front matter `name`, `description`, `thumb` (a media path, or a site path starting with `/`), optional `projects` (link to a student project site) or `url` (a hand-made site under `legacy/`; no page is generated).
- `content/posts/<slug>/YYYY-MM-DD-<name>.md`: a post, published at `/<slug>/YYYY/MM/DD/<name>/`. Front matter `title`, `author`, `assets` (files in the media bucket under `media/<slug>/`), optional `redirect_from`. The body is HTML or Markdown; links to `/media/...` point at the media bucket.
- `legacy/`: hand-made sites copied as they are (2004, 2005, 2007, 2015 Digital Humanities, the 2015/2016 student project sites, the 2016 Antwerp projects). The build regenerates their navigation bar, shows old QuickTime movies through `<video>`, loads Ruffle for Flash, and points links to large files at the media bucket.
- `static/`: CSS and images for the generated pages.
- `_r2/` (not in git): the media bucket. `media/` holds the post media; the other folders hold the files of 1 MB or more from `legacy/` (listed in `legacy/r2-files.txt`). Upload it to the bucket root and set `MEDIA_URL`.

`MEDIA_URL` (default `https://workshops-media.nodebox.net/`, the R2 bucket `nodebox-workshops`) is where `_r2/` is served. `THUMB_URL` is a prefix that resizes an absolute image URL (default: the Cloudinary fetch account); set it empty to use full images.

`_convert/` documents where the material came from.
