# Personal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page, responsive, animated portfolio (Hero, Projects, Skills, Contact with a working email form) in Next.js, ready to deploy on Vercel.

**Architecture:** Next.js App Router with mostly Server Components. All personal content lives in `data/content.ts`. Colors are CSS variables in `app/globals.css` (light + dark via `prefers-color-scheme`), exposed to Tailwind v4 through `@theme inline`. Motion is used only in `FadeIn` and `Navbar`, and hover effects are CSS. The contact form posts to one REST endpoint, `POST /api/contact`, whose logic lives in small `lib/` files. Those files take their dependencies (email verification, email sending) as parameters, so Node's built-in test runner can test them without the network.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Motion 13 (`motion/react`), Nodemailer (Gmail SMTP), ZeroBounce v2 API, Node 24 (`node --test` with native TypeScript), npm, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-29-portfolio-design.md`

## Global Constraints

- Colors come only from the palette tokens (`bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-border`, `text-accent`, `bg-accent`, `text-on-accent`, `bg-chip-bg`, `text-chip-fg`, `text-error`, `border-error`, `bg-error/10`, `text-success`, `bg-success/15`). No raw hex values in components. The only exception is card shadows (spec §3.1).
- Files in `lib/` and `tests/` import each other with **relative paths ending in `.ts`** (e.g. `./contact.ts`) and use `import type` for type-only imports, because Node runs them directly. Components and routes may use the `@/` alias.
- Secrets (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ZEROBOUNCE_API_KEY`) live only in `.env.local` and Vercel. They are never committed, logged or sent to the browser.
- Unit tests must never touch the network or use ZeroBounce credits. Use fakes.
- Every text/background pair must be ≥ 4.5:1 contrast (WCAG AA), in light and dark.
- Fonts: Geist (sans) + Geist Mono via `next/font/google`.
- Content max width 1100px, side padding 20px mobile / 32px ≥ 640px (the `wrap` utility).
- Animations are 0.2–0.5s with the shared easing `[0.22, 1, 0.36, 1]` and respect `prefers-reduced-motion`.
- External links use `target="_blank" rel="noopener noreferrer"`.
- Exactly one `<h1>` (the name). Sections use `<section id aria-labelledby>`.
- The only server code is `app/api/contact/route.ts`. No database, rate limiting, CAPTCHA, theme toggle, or test framework dependency.
- No horizontal page scroll at any width ≥ 320px.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Double-clicking Send, or pressing Enter twice.** Exactly one email should arrive. The owner is Task 10, Step 5 (the button is disabled while sending; verify with the network tab).
2. **The send fails after the visitor typed a long message.** Their text should still be in the form, with a mailto fallback shown. The owner is Task 10, Step 5 (stop the server mid-send, or use a wrong App Password).
3. **Long text on a 320px phone** (long name, long email, long project name). It should wrap, with no horizontal scroll. The owner is Task 11, Step 3 (temporary long-content test).
4. **Nav link or direct URL `/#projects` under the sticky header.** The section heading should be fully visible and not hidden under the nav, and its content should fade in. The owner is Task 11, Step 4.
5. **OS "Reduce motion" turned on.** There should be no slide, lift or zoom, all content should still be visible, and the jump to sections should be instant. The owner is Task 11, Step 5.

(A project with no image or demo is covered by the placeholder data in Task 2 and checked in Task 5. File-path typos are caught by `check-content.mjs` in Task 2. ZeroBounce outages are covered by the unit tests in Task 8.)

---

## File Map

| File | Responsibility | Task |
|---|---|---|
| `package.json` | scripts: `dev`, `build`, `lint`, `check*` | 1, 2, 3 |
| `.gitignore` | ignore `.superpowers/` + Next defaults | 1 |
| `data/content.ts` | **All** personal content + types | 2 |
| `public/resume.pdf` | Resume (placeholder until replaced) | 2 |
| `scripts/check-content.mjs` | Validates content + referenced files exist | 2 |
| `scripts/check-contrast.mjs` | Validates palette contrast from `globals.css` | 3 |
| `app/globals.css` | Tailwind, palette tokens, `wrap`/`section-pad` utilities, base styles | 3 |
| `lib/motion.ts` | Shared `EASE` constant | 3 |
| `components/MotionProvider.tsx` | Client wrapper for `<MotionConfig reducedMotion="user">` | 3 |
| `app/layout.tsx` | Fonts, metadata, providers | 3 |
| `app/icon.svg` | Favicon | 3 |
| `components/FadeIn.tsx` | Reusable scroll/entrance reveal | 4 |
| `components/Navbar.tsx` | Sticky nav with scroll blur | 4 |
| `components/Hero.tsx` | Hero section | 4 |
| `components/Footer.tsx` | Footer line | 4 |
| `app/page.tsx` | Section order | 1, 4, 5, 6, 7 |
| `components/SectionHeading.tsx` | Mono label + h2 | 5 |
| `components/Chip.tsx` | Tech/skill pill (`<li>`) | 5 |
| `components/ArrowLink.tsx` | Underlined accent link with → | 5 |
| `components/ProjectCard.tsx` | One wide-row project | 5 |
| `components/Projects.tsx` | Projects section | 5 |
| `components/Skills.tsx` | Skills section | 6 |
| `tsconfig.json` | + `allowImportingTsExtensions` | 1 |
| `lib/contact.ts` | Contact validation + subject formatting (browser + server) | 7 |
| `lib/verifyEmail.ts` | ZeroBounce call → allow/reject (fails open) | 8 |
| `lib/contactHandler.ts` | Request logic with injected `verify`/`send` | 9 |
| `app/api/contact/route.ts` | `POST /api/contact`: real Gmail + ZeroBounce wiring | 9 |
| `.env.example` | Documents env vars (fake values) | 9 |
| `tests/*.test.ts` | Unit tests for `lib/` | 7, 8, 9 |
| `components/ContactForm.tsx` | Form UI + 5 states | 10 |
| `components/Contact.tsx` | Contact section (side by side) | 10 |

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: everything `create-next-app` generates, at the repo root
- Modify: `.gitignore` (merge), `app/page.tsx` (replace boilerplate), `tsconfig.json`, `package.json`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

**Interfaces:**
- Produces: a building Next.js app. `npm run dev`, `npm run build`, `npm run lint` and `npm test` work. The `@/*` import alias maps to the repo root. `.ts` extensions are allowed in imports. `nodemailer` is installed.

The repo root already contains `docs/`, `.gitignore` and `.superpowers/`. `create-next-app` refuses a non-empty folder, so we scaffold into a subfolder and move the files up.

- [ ] **Step 1: Scaffold into a temporary subfolder**

Run (Bash, from repo root):
```bash
npx create-next-app@16 _scaffold --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --skip-install --yes
```
Expected: `Success! Created _scaffold`. Because we're already inside a git repo, it will not create a nested repo.

- [ ] **Step 2: Move files to the root and merge `.gitignore`**

```bash
cat .gitignore >> _scaffold/.gitignore
printf '!.env.example\n' >> _scaffold/.gitignore
rm .gitignore
shopt -s dotglob
mv _scaffold/* .
rmdir _scaffold
grep -n "env\|superpowers" .gitignore
```
Expected: an `.env*` ignore line (from the scaffold), then `.superpowers/`, then `!.env.example`. The last line un-ignores the example file, so it can be committed while real `.env.local` secrets stay ignored.

- [ ] **Step 3: Install dependencies (Motion, Nodemailer)**

```bash
npm install
npm install motion nodemailer
npm install -D @types/nodemailer
npm pkg set scripts.test="node --test \"tests/*.test.ts\""
```
Expected: no errors. `package.json` lists `next`, `react`, `motion`, `nodemailer`, `tailwindcss`, and a `test` script.

- [ ] **Step 3b: Allow `.ts` extensions in imports**

`lib/` files are run directly by Node in tests, and Node needs explicit `.ts` extensions. In `tsconfig.json`, add this line inside `"compilerOptions"` (next to `"noEmit": true`):
```json
"allowImportingTsExtensions": true,
```

- [ ] **Step 4: Remove boilerplate assets and replace the starter page**

```bash
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

Replace `app/page.tsx` entirely with:
```tsx
export default function Home() {
  return <main>Portfolio coming soon</main>;
}
```

- [ ] **Step 5: Verify build and lint**

Run: `npm run build`
Expected: `✓ Compiled successfully`, and the route `/` is listed as static (○).

Run: `npm run lint`
Expected: no errors.

(`npm test` has no test files yet. The first ones arrive in Task 7.)

- [ ] **Step 6: Commit**

```bash
git add -A
git status --short | grep -c superpowers   # expected: 0 (mockups stay ignored)
git commit -m "chore: scaffold Next.js app with Tailwind, Motion, and Nodemailer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Content data file + content check

**Files:**
- Create: `scripts/check-content.mjs`, `data/content.ts`, `public/resume.pdf`
- Modify: `package.json` (add `check:content` script)

**Interfaces:**
- Produces (used by every later task):
```ts
export type Project = { name: string; description: string; learned: string; tech: string[]; github: string; demo?: string; image?: string };
export type Profile = { name: string; title: string; logo: string; email: string; github: string; linkedin: string; resume: string; contactLine: string };
export type Skills = { languages: string[]; frameworks: string[]; cloudAI: string[] };
export const profile: Profile;
export const projects: Project[];
export const skills: Skills;
```
- Produces the script `npm run check:content`.

- [ ] **Step 1: Write the content check (the test)**

Create `scripts/check-content.mjs`:
```js
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
```

Add the script:
```bash
npm pkg set scripts.check:content="node scripts/check-content.mjs"
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run check:content`
Expected: FAIL with `Cannot find module '.../data/content.ts'`.

- [ ] **Step 3: Write the content file**

Create `data/content.ts`:
```ts
// ✏️ Edit this file to update your portfolio. Nothing else needs to change.
// Screenshots go in public/projects/ and are referenced as "/projects/file.png".
// Replace public/resume.pdf to update your resume.

export type Project = {
  name: string;
  description: string; // 1–2 sentences
  learned: string; // 1 sentence
  tech: string[];
  github: string;
  demo?: string; // optional: link is hidden if missing
  image?: string; // optional: initials placeholder if missing
};

export type Profile = {
  name: string;
  title: string;
  logo: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  contactLine: string;
};

export type Skills = {
  languages: string[];
  frameworks: string[];
  cloudAI: string[];
};

export const profile: Profile = {
  name: "Your Name",
  title: "Computer science student building software & AI tools.",
  logo: "yourname.dev",
  email: "you@example.com",
  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-username",
  resume: "/resume.pdf",
  contactLine: "I'm open to software engineering and AI internships. Send me a message, or reach me directly:",
};

export const projects: Project[] = [
  {
    name: "Study Buddy AI",
    description: "A web app that turns lecture notes into practice quiz questions using a large language model.",
    learned: "How to design prompts, stream responses to the UI, and handle API rate limits.",
    tech: ["Python", "FastAPI", "React", "OpenAI API"],
    github: "https://github.com/your-username/study-buddy",
    demo: "https://study-buddy.example.com",
  },
  {
    name: "Campus Eats",
    description: "A food ordering app for students, with accounts, a menu, and order tracking.",
    learned: "Authentication, relational database design, and deploying a full-stack app.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: "https://github.com/your-username/campus-eats",
  },
  {
    name: "Digit Classifier",
    description: "A convolutional neural network that recognizes handwritten digits, with a small drawing demo.",
    learned: "Training loops, overfitting, and how data augmentation improves accuracy.",
    tech: ["Python", "PyTorch", "NumPy"],
    github: "https://github.com/your-username/digit-classifier",
  },
];

export const skills: Skills = {
  languages: ["Python", "TypeScript", "JavaScript", "Java", "SQL"],
  frameworks: ["React", "Next.js", "FastAPI", "Tailwind CSS", "PyTorch"],
  cloudAI: ["AWS", "Vercel", "Docker", "OpenAI API", "Git"],
};
```

- [ ] **Step 4: Run the check to see the next failure**

Run: `npm run check:content`
Expected: FAIL with `- Resume not found: public/resume.pdf`.

- [ ] **Step 5: Generate a placeholder resume PDF**

Create `scripts/placeholder-resume.mjs`, run it once, then delete it (it's only needed once):
```js
import { writeFileSync } from "node:fs";

const text = "Placeholder resume - replace public/resume.pdf with your real resume.";
const stream = `BT /F1 14 Tf 72 720 Td (${text}) Tj ET`;
const objs = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];
let out = "%PDF-1.4\n";
const offsets = objs.map((o, i) => {
  const at = out.length;
  out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  return at;
});
const xref = out.length;
out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
out += offsets.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("");
out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
writeFileSync("public/resume.pdf", out, "latin1");
```
```bash
node scripts/placeholder-resume.mjs && rm scripts/placeholder-resume.mjs
head -c 8 public/resume.pdf
```
Expected: `%PDF-1.4`

- [ ] **Step 6: Run the check to verify it passes**

Run: `npm run check:content`
Expected: `✓ Content OK (3 projects)`

- [ ] **Step 7: Verify the check catches a bad image path**

Temporarily add `image: "/projects/missing.png",` to the "Campus Eats" entry, then run `npm run check:content`.
Expected: FAIL with `- "Campus Eats": image not found at public/projects/missing.png`.
**Remove that line again**, re-run, and confirm `✓ Content OK (3 projects)`.

- [ ] **Step 8: Verify types and commit**

Run: `npm run build`. Expected: success.
```bash
git add data/content.ts scripts/check-content.mjs public/resume.pdf package.json
git commit -m "feat: add content data file, placeholder resume, and content check

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Theme tokens, fonts, layout, favicon + contrast check

**Files:**
- Create: `scripts/check-contrast.mjs`, `lib/motion.ts`, `components/MotionProvider.tsx`, `app/icon.svg`
- Modify: `app/globals.css` (replace entirely), `app/layout.tsx` (replace entirely), `package.json`
- Delete: `app/favicon.ico`

**Interfaces:**
- Consumes: `profile` from `@/data/content` (Task 2)
- Produces:
  - Tailwind color classes: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-border`, `text-accent`, `bg-accent`, `decoration-accent`, `text-on-accent`, `bg-chip-bg`, `text-chip-fg`, `text-error`, `border-error`, `text-success`. Opacity modifiers work (e.g. `bg-bg/80`, `bg-error/10`).
  - Font classes `font-sans` (Geist), `font-mono` (Geist Mono).
  - Utilities: `wrap` (centered 1100px container + side padding), `section-pad` (section vertical padding).
  - CSS var `--glow` (used inline by Hero).
  - `lib/motion.ts`: `export const EASE: readonly [number, number, number, number]`.
  - `npm run check` runs both checks.

- [ ] **Step 1: Write the contrast check (the test)**

Create `scripts/check-contrast.mjs`:
```js
// Reads the palette from app/globals.css and checks WCAG AA contrast (≥ 4.5:1)
// for every text/background pair the site uses, in light and dark mode.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function readBlock(start, label) {
  if (start < 0) throw new Error(`Could not find the ${label} :root block in globals.css`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

const light = readBlock(css.indexOf(":root {"), "light");
const darkMedia = css.indexOf("@media (prefers-color-scheme: dark)");
const dark = readBlock(darkMedia < 0 ? -1 : css.indexOf(":root {", darkMedia), "dark");

function parse(value) {
  if (value.startsWith("#")) return { rgb: [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)), a: 1 };
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error(`Unsupported color "${value}" (use #rrggbb or rgba())`);
  const parts = m[1].split(",").map((s) => parseFloat(s));
  return { rgb: parts.slice(0, 3), a: parts[3] ?? 1 };
}

// Flattens a translucent color onto the color underneath it.
function solid(value, under) {
  const c = parse(value);
  return c.rgb.map((x, i) => Math.round(x * c.a + (under?.[i] ?? 0) * (1 - c.a)));
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [text token, background token, what the background sits on (for translucent backgrounds)]
const pairs = [
  ["fg", "bg"],
  ["fg", "surface"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["accent", "bg"],
  ["accent", "surface"],
  ["on-accent", "accent"],
  ["chip-fg", "chip-bg", "surface"],
  ["error", "surface"],
  ["success", "surface"],
];

let failed = false;
for (const [mode, vars] of [["light", light], ["dark", dark]]) {
  for (const [text, bgName, under] of pairs) {
    for (const name of [text, bgName, under].filter(Boolean)) {
      if (!vars[name]) throw new Error(`Missing --${name} in the ${mode} palette`);
    }
    const underRgb = under ? solid(vars[under]) : undefined;
    const bg = solid(vars[bgName], underRgb);
    const r = ratio(solid(vars[text], bg), bg);
    const ok = r >= 4.5;
    if (!ok) failed = true;
    console.log(`${ok ? "✓" : "✗"} ${mode.padEnd(5)} ${`${text} on ${bgName}`.padEnd(22)} ${r.toFixed(2)}:1`);
  }
}

if (failed) {
  console.error("✗ Some colors are below WCAG AA (4.5:1). Adjust them in app/globals.css.");
  process.exit(1);
}
console.log("✓ All palette pairs pass WCAG AA");
```

Add the scripts:
```bash
npm pkg set scripts.check:contrast="node scripts/check-contrast.mjs"
npm pkg set scripts.check="npm run check:content && npm run check:contrast"
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run check:contrast`
Expected: FAIL with `Missing --fg in the light palette`, or `Could not find the dark :root block` (the scaffold's `globals.css` has different variable names).

- [ ] **Step 3: Write the palette and base styles**

Replace `app/globals.css` entirely with (the light `:root` block must come **before** the dark media query, because the check script relies on that order):
```css
@import "tailwindcss";

/* Palette: "Mocha + Caramel". Change colors here only. */
:root {
  --bg: #efe9e3;
  --surface: #faf7f3;
  --fg: #2b221d;
  --muted: #726359;
  --border: #ddd2c7;
  --accent: #7a5438;
  --on-accent: #ffffff;
  --chip-bg: #e6dacd;
  --chip-fg: #6a4730;
  --glow: rgba(190, 150, 110, 0.45);
  --error: #b3261e;
  --success: #3f6b3a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #15110f;
    --surface: #1f1a17;
    --fg: #efe8e2;
    --muted: #a3958a;
    --border: #322a25;
    --accent: #c9a07a;
    --on-accent: #15110f;
    --chip-bg: rgba(201, 160, 122, 0.14);
    --chip-fg: #dcc0a4;
    --glow: rgba(201, 160, 122, 0.24);
    --error: #f2a39c;
    --success: #a8d5a0;
  }
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-on-accent: var(--on-accent);
  --color-chip-bg: var(--chip-bg);
  --color-chip-fg: var(--chip-fg);
  --color-error: var(--error);
  --color-success: var(--success);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* Centered content column used by every section. */
@utility wrap {
  width: 100%;
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: 1.25rem;
  @media (width >= 40rem) {
    padding-inline: 2rem;
  }
}

/* Vertical rhythm between sections: ~72px mobile, ~96px tablet, ~128px desktop gaps. */
@utility section-pad {
  padding-block: 2.25rem;
  @media (width >= 40rem) {
    padding-block: 3rem;
  }
  @media (width >= 64rem) {
    padding-block: 4rem;
  }
}

html {
  color-scheme: light dark;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

body {
  background: var(--bg);
  color: var(--fg);
}

/* Keep section headings clear of the sticky navbar when jumping to #anchors. */
section[id] {
  scroll-margin-top: 4.5rem;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 6px;
}
```

- [ ] **Step 4: Run the contrast check to verify it passes**

Run: `npm run check:contrast`
Expected: 20 `✓` lines (lowest is `light muted on bg` at about 4.78:1), then `✓ All palette pairs pass WCAG AA`.

- [ ] **Step 5: Add the shared easing and the Motion provider**

Create `lib/motion.ts`:
```ts
// One easing curve for every animation, so they all feel related.
export const EASE = [0.22, 1, 0.36, 1] as const;
```

Create `components/MotionProvider.tsx`:
```tsx
"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user": if the OS "reduce motion" setting is on, Motion skips
// movement (slides, scales) and only animates opacity.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

- [ ] **Step 6: Write the root layout**

Replace `app/layout.tsx` entirely with:
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import { profile } from "@/data/content";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = `${profile.name}, Software & AI Developer`;
const description = `${profile.title} Projects, skills, and resume.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-bg font-sans text-fg antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```
(The font variables go on `<html>` so that Tailwind's base `font-family`, set on `html`, can resolve them.)

- [ ] **Step 7: Replace the favicon**

```bash
rm -f app/favicon.ico
```
Create `app/icon.svg` (a mocha tile with a caramel dot, echoing the dot after the name):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#2b221d"/>
  <circle cx="16" cy="16" r="6" fill="#c9a07a"/>
</svg>
```

- [ ] **Step 8: Verify**

Run: `npm run check && npm run build && npm run lint`
Expected: both checks print `✓`, build succeeds, lint has no errors.

Run `npm run dev` and open http://localhost:3000. Expected: "Portfolio coming soon" in Geist on the beige `#efe9e3` background (or the dark `#15110f` background if the OS is in dark mode), with the new tab icon. Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Mocha palette, fonts, layout, favicon, and contrast check

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Landing page (Navbar, Hero, Footer, FadeIn)

**Files:**
- Create: `components/FadeIn.tsx`, `components/Navbar.tsx`, `components/Hero.tsx`, `components/Footer.tsx`
- Modify: `app/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `profile` (Task 2); `EASE`, the `wrap` utility, palette classes and `--glow` (Task 3)
- Produces:
  - `FadeIn` with props `{ children: React.ReactNode; delay?: number; y?: number; className?: string }` (default `delay = 0`, `y = 24`). It animates once, when it enters the viewport.
  - Anchor targets used by the nav: `#top` (Hero). `#projects`, `#skills` and `#contact` are added by Tasks 5, 6 and 10.

- [ ] **Step 1: Create the reusable reveal animation**

Create `components/FadeIn.tsx`:
```tsx
"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

// Fades in and slides up the first time it scrolls into view.
export default function FadeIn({ children, delay = 0, y = 24, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create the Navbar**

Create `components/Navbar.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { profile } from "@/data/content";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-border bg-bg/80 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="font-mono text-sm font-medium">
          {profile.logo}
        </a>
        <ul className="flex gap-4 text-sm text-muted sm:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors duration-200 hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Create the Hero**

Create `components/Hero.tsx`:
```tsx
import FadeIn from "@/components/FadeIn";
import { profile } from "@/data/content";

export default function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Soft glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 -z-10 size-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
      />
      <div className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center py-24">
        <FadeIn y={16}>
          <p className="font-mono text-sm text-muted">Hi, I&apos;m</p>
        </FadeIn>
        <FadeIn y={16} delay={0.08}>
          <h1 className="mt-3 text-5xl font-bold tracking-[-0.03em] break-words sm:text-6xl lg:text-7xl">
            {profile.name}
            <span className="text-accent">.</span>
          </h1>
        </FadeIn>
        <FadeIn y={16} delay={0.16}>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">{profile.title}</p>
        </FadeIn>
        <FadeIn y={16} delay={0.24}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity duration-200 hover:opacity-90"
            >
              Resume
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create the Footer**

Create `components/Footer.tsx`:
```tsx
import { profile } from "@/data/content";

export default function Footer() {
  return (
    <footer className="wrap">
      <p className="border-t border-border py-8 text-sm text-muted">
        © {new Date().getFullYear()} {profile.name} · Built with Next.js
      </p>
    </footer>
  );
}
```

- [ ] **Step 5: Assemble the page**

Replace `app/page.tsx` entirely with:
```tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Automated checks**

Run: `npm run check && npm run build && npm run lint`
Expected: all pass. `/` is still static (○).

- [ ] **Step 7: Visual check**

Run `npm run dev` and open http://localhost:3000 at **1280px** and **375px** wide, in light and dark mode. (In Chrome DevTools, open Rendering and use "Emulate CSS media feature prefers-color-scheme".) Expected:
- The label, name, title and buttons fade up one after another on load.
- The name is very large, followed by a caramel dot, with a soft glow in the top-right.
- **Resume** opens the placeholder PDF in a new tab. **GitHub** opens in a new tab.
- On 375px, the nav fits on one line (logo + 3 links) and there's no horizontal scroll.
- Scrolling a little gives the nav a blurred background and a bottom border. (The page is short at this stage, so shrink the window height to test.)
- Tab key: every link shows a caramel focus ring.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add landing page with navbar, hero, and footer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Projects section

**Files:**
- Create: `components/SectionHeading.tsx`, `components/Chip.tsx`, `components/ArrowLink.tsx`, `components/ProjectCard.tsx`, `components/Projects.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Project`, `projects` (Task 2); `FadeIn` (Task 4); `wrap`, `section-pad` and palette classes (Task 3)
- Produces (reused by Tasks 6 and 10):
  - `SectionHeading` with props `{ id: string; label: string; title: string }`. Renders the mono label and an `<h2 id={id}>`.
  - `Chip` with props `{ children: React.ReactNode }`. Renders an `<li>` and must be placed inside a `<ul>`.
  - `ArrowLink` with props `{ href: string; children: React.ReactNode; external?: boolean; className?: string }` (default `external = true`, which adds new-tab attributes).
  - Section anchor `#projects`.

- [ ] **Step 1: Create SectionHeading**

Create `components/SectionHeading.tsx`:
```tsx
type Props = { id: string; label: string; title: string };

export default function SectionHeading({ id, label, title }: Props) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-accent uppercase">{label}</p>
      <h2 id={id} className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
```

- [ ] **Step 2: Create Chip**

Create `components/Chip.tsx`:
```tsx
export default function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-full bg-chip-bg px-2.5 py-1 font-mono text-xs text-chip-fg">{children}</li>;
}
```

- [ ] **Step 3: Create ArrowLink**

Create `components/ArrowLink.tsx`:
```tsx
type Props = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
};

// Accent link with an underline and a → that nudges right on hover. The underline
// makes links recognizable even though the accent is close in hue to the body text.
export default function ArrowLink({ href, children, external = true, className = "" }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-[3px] transition-colors duration-200 hover:decoration-accent ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}
```

- [ ] **Step 4: Create ProjectCard**

Create `components/ProjectCard.tsx`:
```tsx
import Image from "next/image";
import ArrowLink from "@/components/ArrowLink";
import Chip from "@/components/Chip";
import type { Project } from "@/data/content";

// "Study Buddy AI" -> "SB"
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

type Props = { project: Project; imageRight: boolean };

export default function ProjectCard({ project, imageRight }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_24px_-16px_rgba(43,34,29,0.35)] transition-[translate,box-shadow] duration-300 hover:shadow-[0_20px_40px_-20px_rgba(43,34,29,0.45)] motion-safe:hover:-translate-y-1 lg:grid lg:grid-cols-2">
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-chip-bg lg:aspect-auto lg:min-h-80 ${
          imageRight ? "lg:order-last" : ""
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(min-width: 1024px) 550px, 100vw"
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
          />
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center font-mono text-5xl font-medium text-chip-fg">
            {initials(project.name)}
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <h3 className="text-2xl font-bold tracking-tight break-words">{project.name}</h3>
        <p className="mt-3 text-muted">{project.description}</p>

        <p className="mt-5 font-mono text-xs tracking-widest text-accent uppercase">What I learned</p>
        <p className="mt-2">{project.learned}</p>

        <ul aria-label="Tech used" className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 lg:mt-auto lg:pt-6">
          <ArrowLink href={project.github}>GitHub</ArrowLink>
          {project.demo && <ArrowLink href={project.demo}>Live demo</ArrowLink>}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Create the Projects section**

Create `components/Projects.tsx`:
```tsx
import FadeIn from "@/components/FadeIn";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/content";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="wrap section-pad">
      <FadeIn>
        <SectionHeading id="projects-heading" label="Projects" title="Things I've built" />
      </FadeIn>
      <div className="mt-12 flex flex-col gap-8 lg:gap-12">
        {projects.map((project, i) => (
          <FadeIn key={project.name}>
            <ProjectCard project={project} imageRight={i % 2 === 0} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Add Projects to the page**

In `app/page.tsx`, add the import and render `<Projects />` after `<Hero />`:
```tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run check && npm run build && npm run lint`. Expected: all pass.

Run `npm run dev` and check:
- **1280px:** three wide cards. Card 1 has the placeholder on the right, card 2 on the left, card 3 on the right. The initials show as "SB", "CE" and "DC". Links sit at the bottom of the text column.
- **Only "Study Buddy AI" shows a "Live demo →" link.** The other two show only "GitHub →" (Review Focus #2).
- **Hovering a card** lifts it slightly and deepens its shadow. Hovering a link nudges the arrow and darkens the underline.
- **768px and 375px:** placeholder on top, text below, chips wrap, no horizontal scroll.
- Clicking **Projects** in the nav scrolls to the section with the "Projects" label visible below the nav.
- Screenshot path: copy any PNG to `public/projects/test.png`, set `image: "/projects/test.png"` on Campus Eats, and confirm it renders with a subtle zoom on hover. **Then revert both** (`rm public/projects/test.png` and remove the `image` line).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add projects section with wide-row cards

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Skills section

**Files:**
- Create: `components/Skills.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `skills` (Task 2); `FadeIn` (Task 4); `SectionHeading` and `Chip` (Task 5)
- Produces: section anchor `#skills`

- [ ] **Step 1: Create the Skills section**

Create `components/Skills.tsx`:
```tsx
import Chip from "@/components/Chip";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { skills } from "@/data/content";

const groups = [
  { title: "Languages", items: skills.languages },
  { title: "Frameworks", items: skills.frameworks },
  { title: "Cloud & AI", items: skills.cloudAI },
];

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="wrap section-pad">
      <FadeIn>
        <SectionHeading id="skills-heading" label="Skills" title="What I work with" />
      </FadeIn>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {groups.map((group, i) => (
          <FadeIn key={group.title} delay={i * 0.08} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-mono text-xs tracking-widest text-accent uppercase">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Skills to the page**

Replace `app/page.tsx` entirely with:
```tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run check && npm run build && npm run lint`. Expected: all pass.

Run `npm run dev` and check:
- **1280px and 768px:** three equal-height cards side by side, staggered fade-in.
- **375px:** the cards are stacked, and the chips wrap inside them.
- Clicking **Skills** in the nav lands with the heading visible.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add skills section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Contact validation (`lib/contact.ts`)

**Files:**
- Create: `tests/contact.test.ts`, `lib/contact.ts`

**Interfaces:**
- Produces (used by Tasks 9 and 10):
```ts
export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export const LIMITS: { readonly name: 100; readonly messageMin: 10; readonly messageMax: 2000 };
export function normalizeContact(raw: unknown): ContactInput; // trims strings; non-strings become ""
export function validateContact(input: ContactInput): ContactErrors; // {} when valid
export function subjectFor(name: string): string; // "Portfolio message from {name}", CR/LF → space
```

- [ ] **Step 1: Write the failing tests**

Create `tests/contact.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeContact, subjectFor, validateContact } from "../lib/contact.ts";

const good = {
  name: "Jane Smith",
  email: "jane@company.com",
  message: "Hi! I'd love to chat about an internship.",
};

test("a complete, well-formed message has no errors", () => {
  assert.deepEqual(validateContact(good), {});
});

test("normalizeContact trims strings and blanks out anything else", () => {
  assert.deepEqual(normalizeContact({ name: "  Jane ", email: 42, message: null }), {
    name: "Jane",
    email: "",
    message: "",
  });
  assert.deepEqual(normalizeContact(null), { name: "", email: "", message: "" });
  assert.deepEqual(normalizeContact("not an object"), { name: "", email: "", message: "" });
});

test("name is required and at most 100 characters", () => {
  assert.equal(validateContact({ ...good, name: "" }).name, "Please enter your name.");
  assert.equal(validateContact({ ...good, name: "a".repeat(101) }).name, "Name must be 100 characters or fewer.");
  assert.equal(validateContact({ ...good, name: "a".repeat(100) }).name, undefined);
});

test("malformed emails are rejected", () => {
  const bad = ["", "jane", "jane@company", "jane.company.com", "jane @company.com", "jane@company.c", `${"a".repeat(250)}@x.com`];
  for (const email of bad) {
    assert.equal(validateContact({ ...good, email }).email, "Please enter a valid email address.", email);
  }
});

test("common real-world email shapes are accepted", () => {
  for (const email of ["jane@company.com", "jane.smith+jobs@mail.company.co.uk"]) {
    assert.equal(validateContact({ ...good, email }).email, undefined, email);
  }
});

test("message must be 10–2000 characters", () => {
  assert.equal(validateContact({ ...good, message: "Too short" }).message, "Message should be at least 10 characters.");
  assert.equal(validateContact({ ...good, message: "a".repeat(10) }).message, undefined);
  assert.equal(validateContact({ ...good, message: "a".repeat(2000) }).message, undefined);
  assert.equal(validateContact({ ...good, message: "a".repeat(2001) }).message, "Message must be 2000 characters or fewer.");
});

test("subjectFor strips line breaks so a name can't inject email headers", () => {
  assert.equal(subjectFor("Jane Smith"), "Portfolio message from Jane Smith");
  assert.equal(subjectFor("Jane\r\nBcc: x@evil.com"), "Portfolio message from Jane Bcc: x@evil.com");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL with `Cannot find module '.../lib/contact.ts'`.

- [ ] **Step 3: Implement**

Create `lib/contact.ts`:
```ts
// Contact form rules, shared by the browser (instant feedback) and the server (the real gate).

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = { name: 100, messageMin: 10, messageMax: 2000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMAIL_MAX = 254;

export function normalizeContact(raw: unknown): ContactInput {
  const fields = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return { name: text(fields.name), email: text(fields.email), message: text(fields.message) };
}

export function validateContact({ name, email, message }: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (message.length < LIMITS.messageMin) {
    errors.message = `Message should be at least ${LIMITS.messageMin} characters.`;
  } else if (message.length > LIMITS.messageMax) {
    errors.message = `Message must be ${LIMITS.messageMax} characters or fewer.`;
  }

  return errors;
}

export function subjectFor(name: string): string {
  return `Portfolio message from ${name.replace(/[\r\n]+/g, " ")}`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `ℹ pass 7`, `ℹ fail 0`.

- [ ] **Step 5: Verify the build and commit**

Run: `npm run build && npm run lint`. Expected: pass.
```bash
git add lib/contact.ts tests/contact.test.ts
git commit -m "feat: add contact form validation with tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Email verification (`lib/verifyEmail.ts`)

**Files:**
- Create: `tests/verifyEmail.test.ts`, `lib/verifyEmail.ts`

**Interfaces:**
- Produces (used by Task 9):
```ts
export type VerifyResult = { ok: true } | { ok: false; message: string; suggestion?: string };
export function verifyEmail(
  email: string,
  options: { apiKey: string | undefined; fetchImpl?: typeof fetch; timeoutMs?: number },
): Promise<VerifyResult>; // never throws; fails open
```

ZeroBounce reference: `GET https://api.zerobounce.net/v2/validate?api_key=…&email=…&timeout=5` returns JSON with `status` (`valid | invalid | catch-all | unknown | spamtrap | abuse | do_not_mail`), `sub_status`, `did_you_mean` (string or null), and on account problems an `error` string.

- [ ] **Step 1: Write the failing tests**

Create `tests/verifyEmail.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyEmail } from "../lib/verifyEmail.ts";

// verifyEmail logs a warning when it fails open. Keep test output clean.
console.warn = () => {};

const INVALID = "This email address doesn't seem to exist.";
const DISPOSABLE = "Please use a permanent email address.";

// A fake fetch that returns `body` as JSON and records the URLs it was called with.
function fakeFetch(body: unknown, status = 200) {
  const calls: string[] = [];
  const impl = (async (url: string | URL | Request) => {
    calls.push(String(url));
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
  return { impl, calls };
}

const check = (body: unknown, status = 200) =>
  verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: fakeFetch(body, status).impl });

test("calls ZeroBounce with the key, the email, and a 5s server timeout", async () => {
  const { impl, calls } = fakeFetch({ status: "valid" });
  await verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: impl });
  assert.equal(calls.length, 1);
  const url = new URL(calls[0]);
  assert.equal(url.origin + url.pathname, "https://api.zerobounce.net/v2/validate");
  assert.equal(url.searchParams.get("api_key"), "KEY");
  assert.equal(url.searchParams.get("email"), "jane@company.com");
  assert.equal(url.searchParams.get("timeout"), "5");
});

test("valid → allowed", async () => {
  assert.deepEqual(await check({ status: "valid", sub_status: "" }), { ok: true });
});

test("invalid → rejected, with ZeroBounce's typo suggestion when it has one", async () => {
  assert.deepEqual(await check({ status: "invalid", sub_status: "mailbox_not_found", did_you_mean: "jane@gmail.com" }), {
    ok: false,
    message: INVALID,
    suggestion: "jane@gmail.com",
  });
  assert.deepEqual(await check({ status: "invalid", sub_status: "mailbox_not_found", did_you_mean: null }), {
    ok: false,
    message: INVALID,
  });
});

test("spamtrap → rejected", async () => {
  assert.deepEqual(await check({ status: "spamtrap", did_you_mean: null }), { ok: false, message: INVALID });
});

test("disposable address → rejected with its own message", async () => {
  assert.deepEqual(await check({ status: "do_not_mail", sub_status: "disposable" }), { ok: false, message: DISPOSABLE });
});

test("uncertain results are allowed so real recruiters are never blocked", async () => {
  for (const body of [
    { status: "catch-all" },
    { status: "unknown" },
    { status: "abuse" },
    { status: "do_not_mail", sub_status: "role_based" },
  ]) {
    assert.deepEqual(await check(body), { ok: true }, JSON.stringify(body));
  }
});

test("fails open: API error field (e.g. out of credits)", async () => {
  assert.deepEqual(await check({ error: "Invalid API Key or your account ran out of credits" }), { ok: true });
});

test("fails open: HTTP error", async () => {
  assert.deepEqual(await check({ message: "oops" }, 500), { ok: true });
});

test("fails open: network error", async () => {
  const failing = (async () => {
    throw new Error("network down");
  }) as typeof fetch;
  assert.deepEqual(await verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: failing }), { ok: true });
});

test("fails open: ZeroBounce too slow", async () => {
  // Never resolves on its own. It only rejects when verifyEmail aborts it.
  const hanging = ((_url: string | URL | Request, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init?.signal?.reason));
    })) as typeof fetch;
  assert.deepEqual(await verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: hanging, timeoutMs: 50 }), {
    ok: true,
  });
});

test("no API key → skips the call entirely and allows", async () => {
  const { impl, calls } = fakeFetch({ status: "invalid" });
  assert.deepEqual(await verifyEmail("jane@company.com", { apiKey: undefined, fetchImpl: impl }), { ok: true });
  assert.equal(calls.length, 0);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: the contact tests pass. `verifyEmail.test.ts` fails with `Cannot find module '.../lib/verifyEmail.ts'`.

- [ ] **Step 3: Implement**

Create `lib/verifyEmail.ts`:
```ts
// Asks ZeroBounce whether an email address really exists.
// Fails open: if ZeroBounce is unavailable, we allow the message rather than lose a real one.

export type VerifyResult = { ok: true } | { ok: false; message: string; suggestion?: string };

type Options = {
  apiKey: string | undefined;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

type ZeroBounceResponse = {
  status?: string;
  sub_status?: string;
  did_you_mean?: string | null;
  error?: string;
};

const ENDPOINT = "https://api.zerobounce.net/v2/validate";
const INVALID = "This email address doesn't seem to exist.";
const DISPOSABLE = "Please use a permanent email address.";

export async function verifyEmail(
  email: string,
  { apiKey, fetchImpl = fetch, timeoutMs = 8000 }: Options,
): Promise<VerifyResult> {
  if (!apiKey) {
    console.warn("[contact] ZEROBOUNCE_API_KEY is not set; skipping email verification.");
    return { ok: true };
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("email", email);
  url.searchParams.set("timeout", "5");

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`ZeroBounce HTTP ${res.status}`);
    const data = (await res.json()) as ZeroBounceResponse;
    if (data.error) throw new Error(`ZeroBounce: ${data.error}`);

    if (data.status === "invalid" || data.status === "spamtrap") {
      return data.did_you_mean
        ? { ok: false, message: INVALID, suggestion: data.did_you_mean }
        : { ok: false, message: INVALID };
    }
    if (data.status === "do_not_mail" && data.sub_status === "disposable") {
      return { ok: false, message: DISPOSABLE };
    }
    return { ok: true };
  } catch (err) {
    // Log the reason only. The API key is in the URL, so never log the URL.
    console.warn("[contact] Email verification unavailable; allowing message:", (err as Error).message);
    return { ok: true };
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `ℹ pass 18`, `ℹ fail 0`.

- [ ] **Step 5: Verify the build and commit**

Run: `npm run build && npm run lint`. Expected: pass.
```bash
git add lib/verifyEmail.ts tests/verifyEmail.test.ts
git commit -m "feat: add ZeroBounce email verification (fails open) with tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: `POST /api/contact` (handler + route)

**Files:**
- Create: `tests/contactHandler.test.ts`, `lib/contactHandler.ts`, `app/api/contact/route.ts`, `.env.example`

**Interfaces:**
- Consumes: `normalizeContact`, `validateContact`, `subjectFor`, `ContactErrors`, `ContactInput` (Task 7); `verifyEmail`, `VerifyResult` (Task 8)
- Produces:
```ts
export type Mail = { subject: string; text: string; replyTo: string };
export type ContactDeps = {
  verify: (email: string) => Promise<VerifyResult>;
  send: (mail: Mail) => Promise<void>;
};
export type ContactResponseBody =
  | { ok: true }
  | { ok: false; errors: ContactErrors; suggestion?: string }
  | { ok: false; error: string };
export function handleContact(raw: unknown, deps: ContactDeps): Promise<{ status: 200 | 400 | 500; body: ContactResponseBody }>;
```
- HTTP: `POST /api/contact` with JSON `{ name, email, message, website }` → the status and body above (spec §6a). Task 10's form relies on `res.ok`, `body.errors` and `body.suggestion`.

- [ ] **Step 1: Write the failing tests**

Create `tests/contactHandler.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleContact } from "../lib/contactHandler.ts";
import type { ContactDeps, Mail } from "../lib/contactHandler.ts";

// handleContact logs send failures. Keep test output clean.
console.error = () => {};

const good = {
  name: "Jane Smith",
  email: "jane@company.com",
  message: "Hi! I'd love to chat about an internship.",
  website: "",
};

// Fake dependencies that record what they were asked to do.
function fakes(overrides: Partial<ContactDeps> = {}) {
  const verified: string[] = [];
  const sent: Mail[] = [];
  const deps: ContactDeps = {
    verify: async (email) => {
      verified.push(email);
      return { ok: true };
    },
    send: async (mail) => {
      sent.push(mail);
    },
    ...overrides,
  };
  return { deps, verified, sent };
}

test("sends a plain-text email with Reply-To set to the visitor", async () => {
  const { deps, sent } = fakes();
  const res = await handleContact({ ...good, name: "  Jane Smith  " }, deps);
  assert.deepEqual(res, { status: 200, body: { ok: true } });
  assert.deepEqual(sent, [
    {
      subject: "Portfolio message from Jane Smith",
      replyTo: "jane@company.com",
      text: "Name: Jane Smith\nEmail: jane@company.com\n\nHi! I'd love to chat about an internship.\n",
    },
  ]);
});

test("honeypot filled → pretends success, verifies and sends nothing", async () => {
  const { deps, verified, sent } = fakes();
  const res = await handleContact({ ...good, website: "http://spam.example" }, deps);
  assert.deepEqual(res, { status: 200, body: { ok: true } });
  assert.equal(verified.length, 0);
  assert.equal(sent.length, 0);
});

test("invalid fields → 400 with field errors, without spending a verification credit", async () => {
  const { deps, verified, sent } = fakes();
  const res = await handleContact({ ...good, email: "jane@company", message: "Hi" }, deps);
  assert.equal(res.status, 400);
  assert.deepEqual(res.body, {
    ok: false,
    errors: { email: "Please enter a valid email address.", message: "Message should be at least 10 characters." },
  });
  assert.equal(verified.length, 0);
  assert.equal(sent.length, 0);
});

test("missing or non-JSON body → 400 with every field error", async () => {
  const { deps } = fakes();
  const res = await handleContact(null, deps);
  assert.equal(res.status, 400);
  assert.deepEqual(Object.keys((res.body as { errors: object }).errors).sort(), ["email", "message", "name"]);
});

test("email rejected by verification → 400 on the email field, with suggestion, nothing sent", async () => {
  const { deps, sent } = fakes({
    verify: async () => ({ ok: false, message: "This email address doesn't seem to exist.", suggestion: "jane@gmail.com" }),
  });
  const res = await handleContact({ ...good, email: "jane@gmial.com" }, deps);
  assert.deepEqual(res, {
    status: 400,
    body: { ok: false, errors: { email: "This email address doesn't seem to exist." }, suggestion: "jane@gmail.com" },
  });
  assert.equal(sent.length, 0);
});

test("rejection without a suggestion has no suggestion key", async () => {
  const { deps } = fakes({ verify: async () => ({ ok: false, message: "Please use a permanent email address." }) });
  const res = await handleContact(good, deps);
  assert.deepEqual(res.body, { ok: false, errors: { email: "Please use a permanent email address." } });
});

test("send failure → 500 with a generic message (no internal details leaked)", async () => {
  const { deps } = fakes({
    send: async () => {
      throw new Error("Invalid login: 535 Username and Password not accepted");
    },
  });
  const res = await handleContact(good, deps);
  assert.deepEqual(res, { status: 500, body: { ok: false, error: "Couldn't send your message." } });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: the earlier tests pass. `contactHandler.test.ts` fails with `Cannot find module '.../lib/contactHandler.ts'`.

- [ ] **Step 3: Implement the handler**

Create `lib/contactHandler.ts`:
```ts
// The logic behind POST /api/contact. Verification and sending are passed in,
// so tests can use fakes and the route can use the real Gmail and ZeroBounce.
import { normalizeContact, subjectFor, validateContact } from "./contact.ts";
import type { ContactErrors, ContactInput } from "./contact.ts";
import type { VerifyResult } from "./verifyEmail.ts";

export type Mail = { subject: string; text: string; replyTo: string };

export type ContactDeps = {
  verify: (email: string) => Promise<VerifyResult>;
  send: (mail: Mail) => Promise<void>;
};

export type ContactResponseBody =
  | { ok: true }
  | { ok: false; errors: ContactErrors; suggestion?: string }
  | { ok: false; error: string };

type ContactResponse = { status: 200 | 400 | 500; body: ContactResponseBody };

export async function handleContact(raw: unknown, deps: ContactDeps): Promise<ContactResponse> {
  // Bots fill in every field, including the hidden "website" one. Pretend it worked.
  const website = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>).website : undefined;
  if (typeof website === "string" && website.trim() !== "") {
    return { status: 200, body: { ok: true } };
  }

  const input = normalizeContact(raw);
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return { status: 400, body: { ok: false, errors } };
  }

  const verdict = await deps.verify(input.email);
  if (!verdict.ok) {
    const body: ContactResponseBody = verdict.suggestion
      ? { ok: false, errors: { email: verdict.message }, suggestion: verdict.suggestion }
      : { ok: false, errors: { email: verdict.message } };
    return { status: 400, body };
  }

  try {
    await deps.send({ subject: subjectFor(input.name), text: formatBody(input), replyTo: input.email });
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error("[contact] Failed to send email:", (err as Error).message);
    return { status: 500, body: { ok: false, error: "Couldn't send your message." } };
  }
}

function formatBody({ name, email, message }: ContactInput): string {
  return `Name: ${name}\nEmail: ${email}\n\n${message}\n`;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: `ℹ pass 25`, `ℹ fail 0`.

- [ ] **Step 5: Create the route (real wiring)**

Create `app/api/contact/route.ts`:
```ts
import nodemailer from "nodemailer";
import { handleContact } from "@/lib/contactHandler";
import type { Mail } from "@/lib/contactHandler";
import { verifyEmail } from "@/lib/verifyEmail";

// Nodemailer needs the full Node.js runtime (not Edge).
export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => null);
  const { status, body } = await handleContact(raw, {
    verify: (email) => verifyEmail(email, { apiKey: process.env.ZEROBOUNCE_API_KEY }),
    send: sendWithGmail,
  });
  return Response.json(body, { status });
}

async function sendWithGmail(mail: Mail): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transporter.sendMail({
    from: `Portfolio <${user}>`,
    to: user,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
}
```

Create `.env.example`:
```bash
# Copy this file to .env.local (never commit .env.local) and fill in real values.
# Also add the same variables in Vercel → Project → Settings → Environment Variables.

# The Gmail address that sends AND receives contact messages.
GMAIL_USER=you@gmail.com

# A Google App Password (not your normal password). Needs 2-Step Verification on.
# Create one at https://myaccount.google.com/apppasswords
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# Optional. Free key from https://www.zerobounce.net (100 checks/month).
# If empty, email verification is skipped and messages still go through.
ZEROBOUNCE_API_KEY=
```

- [ ] **Step 6: Verify the endpoint over HTTP (no credentials yet)**

Run `npm run build && npm run lint`. Expected: pass, and `/api/contact` is listed as a dynamic route (ƒ).

Start `npm run dev`, then in a second terminal:
```bash
# 1. Invalid input → 400 with field errors
curl -s -w "  [%{http_code}]\n" -X POST localhost:3000/api/contact -H "Content-Type: application/json" \
  -d '{"name":"","email":"nope","message":"hi"}'
# 2. Not JSON → 400
curl -s -w "  [%{http_code}]\n" -X POST localhost:3000/api/contact -d 'hello'
# 3. Honeypot → 200 and nothing sent
curl -s -w "  [%{http_code}]\n" -X POST localhost:3000/api/contact -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@example.com","message":"Buy cheap stuff now","website":"x"}'
# 4. Valid, but no Gmail credentials configured yet → 500
curl -s -w "  [%{http_code}]\n" -X POST localhost:3000/api/contact -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@company.com","message":"Hello from curl test"}'
```
Expected:
1. `{"ok":false,"errors":{"name":"Please enter your name.","email":"Please enter a valid email address.","message":"Message should be at least 10 characters."}}  [400]`
2. A `400` with all three field errors.
3. `{"ok":true}  [200]`
4. `{"ok":false,"error":"Couldn't send your message."}  [500]`. The dev-server log shows the ZeroBounce "not set" warning and `GMAIL_USER / GMAIL_APP_PASSWORD are not set`.

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add lib/contactHandler.ts tests/contactHandler.test.ts app/api/contact/route.ts .env.example
git status --short | grep -c "env.local"   # expected: 0
git commit -m "feat: add POST /api/contact with Gmail sending and tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Contact section with the form

**Files:**
- Create: `components/ContactForm.tsx`, `components/Contact.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `profile` (Task 2); `FadeIn` (Task 4); `ArrowLink` (Task 5); `validateContact`, `normalizeContact`, `ContactErrors`, `LIMITS` (Task 7); the `POST /api/contact` contract (Task 9)
- Produces: `ContactForm` with props `{ fallbackEmail: string }`, and the section anchor `#contact`

- [ ] **Step 1: Create the form**

Create `components/ContactForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { LIMITS, normalizeContact, validateContact, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "failure";
type Field = "name" | "email" | "message";

const EMPTY = { name: "", email: "", message: "" };

const inputBase =
  "mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 text-base text-fg placeholder:text-muted transition-colors duration-200 focus:outline-2 focus:outline-offset-1 focus:outline-accent";

export default function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [values, setValues] = useState(EMPTY);
  const [website, setWebsite] = useState(""); // honeypot: humans never see or fill this
  const [errors, setErrors] = useState<ContactErrors>({});
  const [suggestion, setSuggestion] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");

  function update(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    if (field === "email") setSuggestion(undefined);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const input = normalizeContact(values);
    const clientErrors = validateContact(input);
    setSuggestion(undefined);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSentName(input.name);
        setValues(EMPTY);
        setStatus("success");
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setSuggestion(data.suggestion);
        setStatus("idle");
      } else {
        setStatus("failure");
      }
    } catch {
      setStatus("failure");
    }
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: `${inputBase} ${errors[field] ? "border-error" : "border-border"}`,
  });

  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="mt-1.5 text-sm text-error">
        {errors[field]}
      </p>
    );

  return (
    <div aria-live="polite">
      {status === "success" ? (
        <div className="flex h-full flex-col items-center justify-center py-10 text-center">
          <div aria-hidden className="flex size-12 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
            ✓
          </div>
          <h3 className="mt-4 text-xl font-bold break-words">Thanks, {sentName}!</h3>
          <p className="mt-2 text-muted">Your message is on its way. I&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="relative">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="text-sm font-medium">
                Name
              </label>
              <input
                {...fieldProps("name")}
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name}
                placeholder="Jane Smith"
                onChange={(e) => update("name", e.target.value)}
              />
              {errorText("name")}
            </div>
            <div>
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </label>
              <input
                {...fieldProps("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="jane@company.com"
                onChange={(e) => update("email", e.target.value)}
              />
              {errorText("email")}
              {suggestion && (
                <button
                  type="button"
                  onClick={() => update("email", suggestion)}
                  className="mt-1 text-sm text-accent underline underline-offset-[3px]"
                >
                  Did you mean {suggestion}?
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="contact-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              {...fieldProps("message")}
              rows={5}
              maxLength={LIMITS.messageMax}
              placeholder="Hi! I'd love to chat about an internship on our team…"
              onChange={(e) => update("message", e.target.value)}
              style={{ resize: "vertical" }}
            />
            {errorText("message")}
          </div>

          {/* Honeypot: off-screen, hidden from assistive tech, skipped by Tab. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <span aria-hidden className="size-3.5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin" />
                Sending…
              </>
            ) : (
              "Send message →"
            )}
          </button>

          {status === "failure" && (
            <p className="mt-4 rounded-lg bg-error/10 px-3 py-2.5 text-sm text-error">
              Couldn&apos;t send your message. Please email me directly at{" "}
              <a href={`mailto:${fallbackEmail}`} className="font-semibold break-all underline">
                {fallbackEmail}
              </a>
              .
            </p>
          )}
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the Contact section**

Create `components/Contact.tsx`:
```tsx
import ArrowLink from "@/components/ArrowLink";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";
import { profile } from "@/data/content";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="wrap section-pad">
      <FadeIn>
        <div className="grid gap-10 rounded-3xl border border-border bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">Contact</p>
            <h2 id="contact-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s talk
            </h2>
            <p className="mt-4 max-w-md text-muted">{profile.contactLine}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <li className="min-w-0">
                <ArrowLink href={`mailto:${profile.email}`} external={false} className="break-all">
                  {profile.email}
                </ArrowLink>
              </li>
              <li>
                <ArrowLink href={profile.github}>GitHub</ArrowLink>
              </li>
              <li>
                <ArrowLink href={profile.linkedin}>LinkedIn</ArrowLink>
              </li>
            </ul>
          </div>
          <div className="min-w-0">
            <ContactForm fallbackEmail={profile.email} />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
```

- [ ] **Step 3: Add Contact to the page**

Replace `app/page.tsx` entirely with:
```tsx
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Automated checks**

Run: `npm test && npm run check && npm run build && npm run lint`
Expected: all pass.

- [ ] **Step 5: UI states without credentials**

Run `npm run dev`, go to the Contact section, and check each state against the approved HTML preview (`.superpowers/brainstorm/.../contact-form-design.html`):
- **Layout:** side by side at 1280px. At 768px and 375px it's stacked, with the text first. Name and Email sit side by side at 640px and above.
- **Invalid:** click Send with empty fields. Three red messages appear, and no request is sent (check the Network tab). Typing in a field clears its error.
- **Server 400:** enter `jane@company` (browser validation catches it). Then call the API with curl to confirm that the server rejects the same value.
- **Sending → Failed:** fill the form validly and click Send. You'll see the spinner and "Sending…" briefly, then the failure notice with a mailto link, because there are no Gmail credentials yet. **The typed text is still in the fields** (Review Focus #2).
- **Double submit (Review Focus #1):** double-click Send quickly. The Network tab should show exactly **one** `POST /api/contact`.
- Tab order: Name, Email, Message, Send. The honeypot is never focused.

- [ ] **Step 6: Real end-to-end send (needs the user's credentials)**

**Pause and ask the user** to:
1. Turn on 2-Step Verification for their Google account, then create an App Password at https://myaccount.google.com/apppasswords (name it "Portfolio").
2. Optionally, sign up at https://www.zerobounce.net and copy the API key.
3. Run `cp .env.example .env.local` and fill in the real values. **Never commit `.env.local`.**

Then restart `npm run dev` and submit the form using a **real address you can check** as the visitor email. Expected:
- The success state reads "Thanks, {name}!".
- The email arrives in the Gmail inbox with subject "Portfolio message from {name}", and **Reply** addresses the visitor email.
- With a ZeroBounce key set: submit `someone@gmial.com`. Expected: "This email address doesn't seem to exist." and possibly "Did you mean …?". Clicking the suggestion fills the field.

Run `git status --short` and confirm `.env.local` is **not** listed.

- [ ] **Step 7: Commit**

```bash
git add components/ContactForm.tsx components/Contact.tsx app/page.tsx
git commit -m "feat: add contact section with working email form

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Responsive, accessibility & performance QA

**Files:**
- Modify: only files where a check below finds a problem. `data/content.ts` is changed temporarily in Step 3 and reverted.

**Interfaces:**
- Consumes: the complete page from Tasks 1–10.
- Produces: a verified page. Any fixes are committed.

Use `npm run build && npm run start` (production mode) for this task. Dev mode is slower and not representative for Lighthouse.

- [ ] **Step 1: Width sweep, light and dark**

Check the page at **320, 375, 768, 1024 and 1280px**, each in **light** and **dark** mode. At every size:
- No horizontal scrollbar. In the console, `document.documentElement.scrollWidth <= window.innerWidth` must be `true`.
- The nav stays on one line.
- Project cards are stacked below 1024px and side-by-side at 1024px and above.
- Skills cards are stacked below 768px and in 3 columns at 768px and above.
- The contact card is stacked below 1024px and side-by-side at 1024px and above. The form inputs are full width and readable, and the error and success colors are legible in both themes.
- The glow, chips, cards and borders are visible in both themes.

Fix any issue in the relevant component, then re-run `npm run build`.

- [ ] **Step 2: Keyboard pass**

Starting from the top, press Tab through the page. Expected: the order is logo, nav links, Resume, GitHub, project links, contact links, then Name, Email, Message and Send. Every stop shows the caramel focus ring, and the honeypot is never focused. Enter on a nav link jumps to its section, and Enter in a text input submits the form.

- [ ] **Step 3: Long-content stress test (Review Focus #3)**

Temporarily edit `data/content.ts`:
- `name: "Maximilian Alexander Featherstonehaugh"`
- `email: "maximilian.featherstonehaugh.internships@university-example.edu"`
- First project `name: "Collaborative Realtime Whiteboard Platform"`

Rebuild and check at **320px**. Expected: the name, email (both the contact link and the failure notice) and project title wrap inside the viewport, with no horizontal scroll. If anything overflows, add `break-words` (or `min-w-0` on its flex/grid parent) in the owning component. Then **revert `data/content.ts`** (`git checkout data/content.ts`) and confirm `git diff data/content.ts` is empty.

- [ ] **Step 4: Anchors and deep links (Review Focus #4)**

Open `http://localhost:3000/#projects`, `/#skills` and `/#contact` directly in a new tab. Expected: the page lands on the section, the heading is fully visible below the sticky nav, and the content fades in rather than staying invisible.

- [ ] **Step 5: Reduced motion (Review Focus #5)**

In DevTools, open Rendering and set "Emulate CSS media feature prefers-reduced-motion: reduce", then reload. Expected: sections appear without sliding, cards don't lift and screenshots don't zoom on hover, the send spinner doesn't spin (the "Sending…" text remains), nav links jump instantly, and **all content is visible**.

- [ ] **Step 6: Lighthouse**

In DevTools, open Lighthouse, choose Mobile and all four categories, and run it against `http://localhost:3000`.
Expected: **≥ 90** in Performance, Accessibility, Best Practices and SEO. For anything below 90, fix the specific audits it lists (for example missing labels, contrast, or link names) and re-run.

- [ ] **Step 7: Final automated checks and commit**

Run: `npm test && npm run check && npm run build && npm run lint`. Expected: all pass.
If Steps 1–6 required fixes:
```bash
git add -A
git commit -m "fix: responsive and accessibility polish from QA

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Deploy to Vercel

**Files:** none (the user performs the account steps, and the executor provides the commands)

**Interfaces:**
- Consumes: the committed `main` branch, and the user's Gmail App Password and ZeroBounce key from Task 10.
- Produces: a live URL that redeploys automatically on every push to `main`, with a working contact form.

- [ ] **Step 1: The user creates an empty GitHub repo**

On github.com, click **New repository**, name it `portfolio`, make it **Public**, and do **not** add a README, .gitignore or license.

- [ ] **Step 2: Push**

```bash
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```
Expected: the branch `main` is pushed. On GitHub, confirm that **neither** `.superpowers/` **nor** `.env.local` is in the repo, and that `.env.example` is.

- [ ] **Step 3: The user imports the repo on Vercel and adds secrets**

On vercel.com, click **Add New… → Project** and import `portfolio`. Before clicking Deploy, open **Environment Variables** and add `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `ZEROBOUNCE_API_KEY`, using the same values as `.env.local`. Then click **Deploy**.
Expected: the build succeeds and the site is live at `https://portfolio-<something>.vercel.app`.

- [ ] **Step 4: Smoke-test the live site**

On the live URL, on both a phone and a desktop: the Resume PDF opens, the nav links scroll, and the GitHub and LinkedIn links open. **Send one real message through the form** and confirm it arrives in Gmail. If it fails, check Vercel → Project → Logs for the `[contact]` lines.

- [ ] **Step 5: Explain the update loop to the user**

Edit `data/content.ts`, replace `public/resume.pdf`, or add screenshots to `public/projects/`. Then run `npm run check`, commit and `git push`. Vercel redeploys in about a minute. Changing a secret in Vercel requires a **Redeploy** from the Vercel dashboard to take effect.
