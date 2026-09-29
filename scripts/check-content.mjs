// Validates data/content.ts before deploy: catches typos in file paths and links.
// Node 24 strips TypeScript types natively, so we can import the .ts file directly.
import { existsSync } from "node:fs";
import { profile, projects, skills } from "../data/content.ts";

const errors = [];
const inPublic = (p) => new URL(`../public${p}`, import.meta.url);
const fileExists = (p) => typeof p === "string" && p.startsWith("/") && existsSync(inPublic(p));
const isHttps = (u) => {
  try {
    return new URL(u).protocol === "https:";
  } catch {
    return false;
  }
};

if (!fileExists(profile.resume)) errors.push(`Resume not found: public${profile.resume}`);
for (const key of ["github", "linkedin"]) {
  if (!isHttps(profile[key])) errors.push(`profile.${key} must be an https:// URL, got "${profile[key]}"`);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errors.push(`profile.email looks invalid: "${profile.email}"`);

if (projects.length < 2 || projects.length > 4) errors.push(`Expected 2–4 projects, found ${projects.length}`);
const seen = new Set();
for (const p of projects) {
  if (seen.has(p.name)) errors.push(`Duplicate project name: "${p.name}"`);
  seen.add(p.name);
  if (!isHttps(p.github)) errors.push(`"${p.name}": github must be an https:// URL`);
  if (p.demo !== undefined && !isHttps(p.demo)) errors.push(`"${p.name}": demo must be an https:// URL`);
  if (p.image !== undefined && !fileExists(p.image)) errors.push(`"${p.name}": image not found at public${p.image}`);
  if (p.tech.length === 0) errors.push(`"${p.name}": tech list is empty`);
}

for (const [group, items] of Object.entries(skills)) {
  if (items.length === 0) errors.push(`Skill group "${group}" is empty`);
}

if (errors.length > 0) {
  console.error("✗ Content check failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Content OK (${projects.length} projects)`);
