// Everything comes from the spaceclub package; this site's own settings are in spaceclub.json.
// The extras here are for this site's structured data (partials/schema.njk) and past gigs.
module.exports = (eleventyConfig) => {
  const config = require("spaceclub")(eleventyConfig);
  const site = require("./src/_data/site.json");

  // today's date in Canberra at build time, e.g. "2026-11-20" (a gig before this has happened)
  eleventyConfig.addGlobalData("today", () =>
    new Date().toLocaleDateString("en-CA", { timeZone: site.timezone || "Australia/Sydney" }));

  // a copy of an object with one more key, for building JSON-LD in Nunjucks
  eleventyConfig.addFilter("setAttribute", (obj, key, value) => ({ ...obj, [key]: value }));
  // drops keys whose value is empty, so JSON-LD never says "price": ""
  eleventyConfig.addFilter("removeEmpty", (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== null && v !== undefined)));

  return config;
};
