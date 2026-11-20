#!/usr/bin/env node
// Brings Dissent's gigs in from its Humanitix collection (the same list the old site's
// What's On widget showed) as ordinary SpaceClub events, so they can still be edited in SpaceDash.
//
//   npm run sync-gigs
//
// Each gig becomes src/events/<date>_<humanitix-slug>.md with `humanitix:` set to its page.
// A file without `humanitix:` is never touched. On a second run a gig's details are refreshed
// but its text (the body) is kept, so anything written in SpaceDash stays.
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const site = JSON.parse(fs.readFileSync(path.join(root, "src/_data/site.json"), "utf8"));
const collection = process.argv[2] || site.humanitix;
if (!collection) throw new Error("Set humanitix (the collection name) in src/_data/site.json");

const eventsDir = path.join(root, "src/events");
const imagesDir = path.join(root, "src/assets/images/gigs");

const decode = (s) => String(s || "")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

// "2026-11-20T19:30:00+1100" is already Canberra time, so read it as written
const day = (iso) => iso.slice(0, 10);
const clock = (iso) => {
  let [h, m] = iso.slice(11, 16).split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
};

function price(offers) {
  const prices = (offers || []).filter((o) => o["@type"] === "Offer" && typeof o.price === "number").map((o) => o.price);
  if (!prices.length) return "";
  const low = Math.min(...prices);
  if (low === 0 && Math.max(...prices) === 0) return "Free";
  const fmt = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
  return prices.length > 1 && Math.max(...prices) !== low ? `From ${fmt(low || Math.min(...prices.filter((p) => p > 0)))}` : fmt(low);
}

// "2026-11-20T19:30:00+1100" to "2026-11-20T19:30:00+11:00", the form search engines expect
const iso = (s) => s.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
const priceMin = (offers) => {
  const p = (offers || []).filter((o) => o["@type"] === "Offer" && typeof o.price === "number").map((o) => o.price);
  return p.length ? Math.min(...p) : null;
};

const yamlString = (s) => JSON.stringify(String(s));

function readExisting() {
  const byUrl = new Map();
  for (const f of fs.readdirSync(eventsDir)) {
    if (!f.endsWith(".md")) continue;
    const text = fs.readFileSync(path.join(eventsDir, f), "utf8");
    const m = text.match(/^humanitix:\s*"?([^"\n]+)"?\s*$/m);
    if (!m) continue;
    const date = (text.match(/^eventDate:\s*"?(\d{4}-\d{2}-\d{2})/m) || [])[1];
    const body = text.replace(/^---\n[\s\S]*?\n---\n?/, "");
    if (!byUrl.has(m[1])) byUrl.set(m[1], []);
    byUrl.get(m[1]).push({ file: f, date, body });
  }
  return byUrl;
}

async function poster(image, slug) {
  if (!image) return "";
  // Humanitix only serves 500px sizes (or the multi-megabyte original); 500px suits a poster card
  const src = image.replace(/@[^/]+$/, "") + "@responsive-500.webp";
  const out = path.join(imagesDir, `${slug}.webp`);
  if (!fs.existsSync(out)) {
    const res = await fetch(src);
    if (!res.ok) return "";
    fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  }
  return `/assets/images/gigs/${slug}.webp`;
}

(async () => {
  const res = await fetch(`https://collections.humanitix.com/${collection}`);
  if (!res.ok) throw new Error(`Humanitix said ${res.status} for ${collection}`);
  const html = await res.text();
  const list = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .find((d) => d["@type"] === "ItemList");
  if (!list) throw new Error("No gig list found on the Humanitix page");

  fs.mkdirSync(imagesDir, { recursive: true });
  const existing = readExisting();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: site.timezone || "Australia/Sydney" });
  let made = 0, updated = 0;

  for (const { item: e } of list.itemListElement) {
    const url = e.url.split("?")[0];
    const slug = url.split("/").pop();
    const date = day(e.startDate);
    const file = `${date}_${slug}.md`;

    // a recurring gig (open mic) lists only its next date: its one file moves along to it,
    // so it keeps a single page at /whats-on/<slug>/ instead of a new address every week
    const mine = existing.get(url) || [];
    const same = mine.find((x) => x.file === file);
    const moving = !same && mine[0];
    if (moving) fs.renameSync(path.join(eventsDir, moving.file), path.join(eventsDir, file));
    const kept = same || moving;

    const description = decode(e.description);
    const fm = [
      "---",
      `title: ${yamlString(decode(e.name).replace(/\s*@\s*Dissent\s*$/i, "").replace(/\s*[|,+-]\s*(w\/)?\s*$/i, ""))}`,
      `description: ${yamlString(description)}`,
      `eventDate: ${date}`,
      `startTime: ${yamlString(clock(e.startDate))}`,
      e.endDate ? `endTime: ${yamlString(clock(e.endDate))}` : null,
      `startDate: ${yamlString(iso(e.startDate))}`,
      e.endDate ? `endDate: ${yamlString(iso(e.endDate))}` : null,
      `image: ${yamlString(await poster(e.image, slug))}`,
      `price: ${yamlString(price(e.offers))}`,
      priceMin(e.offers) !== null ? `priceMin: ${priceMin(e.offers)}` : null,
      `link: ${yamlString(url)}`,
      `text: "Get tickets"`,
      `humanitix: ${yamlString(url)}`,
      "---",
    ].filter(Boolean).join("\n");
    const body = kept && kept.body.trim() ? kept.body : "";
    fs.writeFileSync(path.join(eventsDir, file), `${fm}\n${body}`);
    kept ? updated++ : made++;
  }

  console.log(`Humanitix ${collection}: ${made} new, ${updated} updated`);
})().catch((err) => { console.error(err.message + (err.cause ? ` (${err.cause.code || err.cause.message})` : "")); process.exit(1); });
