# Personal Archive

A static, public personal archive for dated gallery, travel, and games entries. The source repository can remain private; Cloudflare Pages serves the built site publicly.

## Local preview and build

```sh
npm ci
npm run preview
npm run build:root
```

`npm run preview` serves the site at the root. `npm run build:root` writes the Cloudflare-ready site to `_site/`; the homepage and assets use root-relative paths. `npm run build` and `npm run preview:project` retain the legacy `/personal-site/` path prefix and are not used for the Cloudflare deployment.

The production origin is kept in `src/_data/site.json`. Leave `url` empty until Cloudflare provides the actual `*.pages.dev` address. Once known, set it to the HTTPS origin only (no trailing slash or path); canonical and Open Graph URLs and `sitemap.xml` are then generated from that value. No placeholder production address is published.

## Add or update an entry

1. Copy `templates/entry-example.md` to `src/content/entries/YYYY-short-name.md`.
2. Set a real quoted `YYYY-MM-DD` date, one of `gallery`, `travel`, or `games`, and `draft: true`.
3. Copy images into `src/assets/images/YYYY/short-name/`. Reference each image as `/images/YYYY/short-name/file.webp`; include useful alt text, its actual date, and its own caption.
4. Add optional entry text below the front matter. Keep each image's note with that image.
5. Preview the result, then set `draft: false` only when ready to publish. Entries appear newest first, grouped by year; category filters reuse the same timeline.

Use `YYYY-MM-DD` as a quoted string to avoid date or time-zone conversion. Add an image time only when it is known. Images retain their aspect ratio, load lazily, and open in the larger viewer when selected.

Replace a photo by replacing the file at the same path, or update its `src`. Edit a caption in the Markdown file. Delete the Markdown file to remove an entry. Drafts are excluded from the published timeline.

## Cloudflare Pages deployment

Create a Pages project using Git integration with these settings:

| Setting | Value |
|---|---|
| Project name | `quiet-canvas-archive` (if unavailable, add a neutral suffix) |
| Repository | `Jack311045/personal-site` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build:root` |
| Build output directory | `_site` |
| Node.js | 20 or later |

Do not authorize access to the career-site repository or other repositories. Keep the site public and do not add password protection, career links, or source-repository links to visitor-facing pages.
In the Pages project settings, set the `NODE_VERSION` environment variable to `20` for the Production environment (and Preview if it will be used).

## Maintenance

Add Markdown and images → run `npm run preview` → commit and push to `main` → wait for Cloudflare's automatic build → check the deployment result in Cloudflare → open the production URL.
