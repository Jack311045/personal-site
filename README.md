# Personal Archive

A static, public personal archive for dated gallery, travel, food, games, and daily entries. The source repository can remain private; Cloudflare Pages serves the built site publicly.

## Local preview and build

```sh
npm ci
npm run preview
npm run build:root
```

`npm run preview` serves the site at the root. `npm run build:root` writes the Cloudflare-ready site to `_site/`; the homepage and assets use root-relative paths. `npm run build` and `npm run preview:project` retain the legacy `/personal-site/` path prefix and are not used for the Cloudflare deployment.

The production origin is kept in `src/_data/site.json`. Leave `url` empty until Cloudflare provides the actual `*.pages.dev` address. Once known, set it to the HTTPS origin only (no trailing slash or path); canonical and Open Graph URLs and `sitemap.xml` are then generated from that value. No placeholder production address is published.

## Add or update an entry

1. Copy `templates/entry-example.md` to `src/content/entries/YYYY/YYYY.M.md` for a monthly collection. One Markdown entry can hold as many images as you want; you do not need one file per photo.
2. Set the entry's quoted `date` to `YYYY-MM` for a month-level collection or `YYYY-MM-DD` for an exact day, and keep `draft: true` while editing. The `title` can be the year (for example, `2026`); year-only titles are not repeated under the automatic year heading.
3. Copy images into `src/assets/images/YYYY/YYYY.M/`. Add each as an item under `images`, using `/images/YYYY/YYYY.M/file.webp`, a date, useful alt text, its own caption, a category (`gallery`, `travel`, `food`, `games`, or `daily`), and a tags list (use `[""]` if there are no tags).
4. A copied Windows path such as `personal-site\src\assets\images\2026\2026.2\photo.png` is also accepted and rendered as `/images/2026/2026.2/photo.png`.
5. Add optional entry text below the front matter.
6. Preview the result, then set `draft: false` only when ready to publish. Entries appear newest first, grouped by year; category filters apply to each image independently. Clicking an active category again clears the filter.

Use quoted dates to avoid date or time-zone conversion. A month-level entry sorts after exact-day entries in that month; use a full `YYYY-MM-DD` date if you need exact day ordering. A time can only be supplied with a full date. Images retain their aspect ratio, load lazily, and open in the larger viewer when selected.

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
