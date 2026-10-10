import fs from "node:fs";
import path from "node:path";

const categories = new Set(["gallery", "travel", "games"]);
const site = JSON.parse(fs.readFileSync(path.resolve("src/_data/site.json"), "utf8"));

function isRealDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
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
    const entries = collectionApi.getFilteredByGlob("src/content/entries/*.md");
    for (const entry of entries) {
      const { title, date, category, images = [] } = entry.data;
      if (!title || !isRealDate(date)) {
        throw new Error(`${entry.inputPath} must have a title and a real YYYY-MM-DD date string.`);
      }
      if (!categories.has(category)) {
        throw new Error(`${entry.inputPath} category must be gallery, travel, or games.`);
      }
      if (!Array.isArray(images)) {
        throw new Error(`${entry.inputPath} images must be a list.`);
      }
      if (entry.data.time && !/^\d{2}:\d{2}$/.test(entry.data.time)) {
        throw new Error(`${entry.inputPath} time must use HH:MM when supplied.`);
      }
      for (const image of images) {
        const imageDate = image.date || date;
        if (!image.src || !image.src.startsWith("/images/") || !image.alt || typeof image.caption !== "string" || !isRealDate(imageDate) || (image.time && !/^\d{2}:\d{2}$/.test(image.time))) {
          throw new Error(`${entry.inputPath} images need a /images/ path, alt text, caption, and valid date.`);
        }
        const sourceImage = path.resolve("src/assets/images", image.src.slice("/images/".length));
        if (!fs.existsSync(sourceImage)) {
          throw new Error(`${entry.inputPath} image file does not exist: ${image.src}`);
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
