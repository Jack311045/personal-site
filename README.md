# Personal archive

A standalone Eleventy static site for a dated gallery, travel, and games timeline. Entries are Markdown files; there is no database or admin panel.

## Preview and build

```sh
npm ci
npm run preview
npm run build
```

`npm run preview` serves the site at the root for local preview. `npm run build` uses `/personal-site/` as its base path for a GitHub Pages project site. Use `npm run preview:project` to preview with that base path. If deployed at a domain root instead, build with `npm run build:root`. Built files go to `_site/`.

## Add or update an entry

1. Copy `templates/entry-example.md` to `src/content/entries/YYYY-short-name.md`.
2. Set a real `YYYY-MM-DD` date, one of `gallery`, `travel`, or `games`, and `draft: true`.
3. Copy images into `src/assets/images/YYYY/short-name/`. Reference each image as `/images/YYYY/short-name/file.webp`; include useful alt text, its actual date, and its own caption.
4. Add any optional entry text below the front matter. Each image's note is kept with that image rather than replaced by the entry text.
5. Preview, then change `draft: true` to `draft: false` when the entry is ready to publish. Published entries appear in date-descending order, grouped by year; category filters reuse the same timeline.

Use `YYYY-MM-DD` quoted as a string to avoid date or time-zone conversion. Add an image time only when the actual time is known. Images retain their aspect ratio, load lazily, and open in a larger viewer when selected.

Replace a photo by replacing the file at the same path, or update its `src`. Edit a caption in the Markdown file. Delete the Markdown file to remove its entry. The example entry under `src/content/entries/` is a draft used to verify the format and is never published.

## GitHub web editing

Open the repository on GitHub and use **Add file → Create new file** at `src/content/entries/YYYY-short-name.md`, or upload the Markdown file and its images into their matching paths. Set `draft: false` only when ready. Commit to `main`; the Pages workflow builds the site. Check **Actions** for the deployment result, then open the Pages URL from the workflow.

## Local workflow

Install Node.js 20 or later, run `npm ci`, add Markdown and image files as described above, and run `npm run preview` to review the result. Commit the files to `main` and push to the GitHub repository.

## Deploy

This folder is intended to be the root of its own `personal-site` repository. The included workflow builds with the `/personal-site/` base path and deploys to GitHub Pages. In repository settings, enable Pages with **GitHub Actions** as the source. The workflow assumes a repository published at `https://jack311045.github.io/personal-site/`; update the build base path in `.github/workflows/pages.yml` and package scripts if the final URL changes.
