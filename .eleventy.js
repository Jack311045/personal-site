import fs from "node:fs";
import path from "node:path";

const categories = new Set(["gallery", "travel", "food", "games", "daily"]);
const site = JSON.parse(fs.readFileSync(path.resolve("src/_data/site.json"), "utf8"));

function isRealDate(value) {
  if (typeof value !== "string") return false;
  const precision = /^\d{4}-\d{2}$/.test(value) ? 7 : /^\d{4}-\d{2}-\d{2}$/.test(value) ? 10 : 0;
  if (!precision) return false;
  const parsed = new Date(`${value}${precision === 7 ? "-01" : ""}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, precision) === value;
}

function normalizeImageSource(value) {
  if (typeof value !== "string") {
    throw new Error("Image src must be a site image URL or a copied src/assets/images path.");
  }
  const normalized = value.trim().replace(/\\/g, "/");
  const directPath = normalized.match(/^\/?images\/(.+)$/i);
  const copiedPath = normalized.match(/(?:^|\/)src\/assets\/images\/(.+)$/i);
  const relativePath = directPath?.[1] || copiedPath?.[1];
  if (!relativePath || relativePath.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Invalid image src "${value}". Use /images/... or a copied src/assets/images/... path.`);
  }
  return {
    url: `/images/${relativePath}`,
    relativePath,
  };
}

export default function (eleventyConfig) {
  if (!site.title || !site.description || typeof site.url !== "string" || (site.url && !/^https:\/\/[a-z0-9.-]+$/i.test(site.url))) {
    throw new Error("Site metadata needs a title, description, and an HTTPS origin without a path or trailing slash.");
  }

  eleventyConfig.on("eleventy.before", async () => {
    await fs.promises.rm(path.resolve("_site"), { recursive: true, force: true });
  });

  eleventyConfig.on("eleventy.after", async () => {
    if (!site.url) return;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}/</loc></url></urlset>\n`;
    await fs.promises.writeFile(path.resolve("_site/sitemap.xml"), sitemap, "utf8");
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets/css": "assets/css",
    "src/assets/js": "assets/js",
    "src/assets/images": "images",
  });
  eleventyConfig.addFilter("imageUrl", (value) => normalizeImageSource(value).url);
  eleventyConfig.addFilter("groupByYear", (entries) => {
    const groups = [];
    for (const entry of entries) {
      const year = entry.data.date.slice(0, 4);
      let group = groups.find((item) => item.year === year);
      if (!group) {
        group = { year, entries: [] };
        groups.push(group);
      }
      group.entries.push(entry);
    }
    return groups;
  });

  eleventyConfig.addCollection("timeline", (collectionApi) => {
    const entries = collectionApi.getFilteredByGlob("src/content/entries/**/*.md");
    for (const entry of entries) {
      const { title, date, images = [] } = entry.data;
      if (!title || !isRealDate(date)) {
        throw new Error(`${entry.inputPath} must have a title and a real YYYY-MM or YYYY-MM-DD date string.`);
      }
      if (!Array.isArray(images)) {
        throw new Error(`${entry.inputPath} images must be a list.`);
      }
      if (!images.length && !entry.data.draft) {
        throw new Error(`${entry.inputPath} must include at least one image unless it is a draft placeholder.`);
      }
      if (entry.data.time && (date.length !== 10 || !/^\d{2}:\d{2}$/.test(entry.data.time))) {
        throw new Error(`${entry.inputPath} time must use HH:MM and a full YYYY-MM-DD date.`);
      }
      for (const image of images) {
        if (!image.date || !isRealDate(image.date) || !image.alt?.trim() || typeof image.caption !== "string" || !image.caption.trim() || !categories.has(image.category) || !Array.isArray(image.tags) || image.tags.some((tag) => typeof tag !== "string")) {
          throw new Error(`${entry.inputPath} images need a valid date, alt text, caption, category, and tags list.`);
        }
        if (image.time && (image.date.length !== 10 || !/^\d{2}:\d{2}$/.test(image.time))) {
          throw new Error(`${entry.inputPath} image time must use HH:MM and a full YYYY-MM-DD date.`);
        }
        const normalizedImage = normalizeImageSource(image.src);
        const sourceImage = path.resolve("src/assets/images", ...normalizedImage.relativePath.split("/"));
        if (!fs.existsSync(sourceImage)) {
          throw new Error(`${entry.inputPath} image file does not exist: ${normalizedImage.url}`);
        }
      }
    }

    return entries
      .filter((entry) => !entry.data.draft)
      .sort((a, b) => b.data.date.localeCompare(a.data.date));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
