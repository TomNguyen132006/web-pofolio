# Personal Portfolio — Design Spec

**Date:** 2026-09-29
**Status:** Approved in brainstorming, awaiting written-spec review

## 1. Purpose

A one-page personal portfolio used to apply for **software development and AI internships**.

**Success looks like:** a recruiter can tell who I am, what I've built, and how to reach me within ~30 seconds, on any device, and the site feels polished and fast.

**Constraints**
- Visual quality, responsive design, and UX come first.
- Keep implementation simple: no backend, no contact form, no runtime API calls.
- Content must be easy to update by editing one data file and replacing files in `public/`.

## 2. Decisions

| Topic | Decision |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS (default `create-next-app` setup) |
| Animation | Motion (formerly Framer Motion), package `motion`, imported from `motion/react` |
| Hosting | Vercel, auto-deploy on `git push` |
| Data source | Local file `data/content.ts`. **No REST API / GitHub fetching in v1.** (Build-time GitHub stats may be added later.) |
| Theme | Follows the visitor's OS setting via `prefers-color-scheme`. No toggle. |
| Typography | Geist (headings and body) + Geist Mono (labels, chips, logo), loaded via `next/font` |
| Palette | "Mocha + Caramel" (see §3) |
| Project card layout | Wide rows, screenshot alternates sides on desktop, stacks on mobile |

## 3. Visual Design

### 3.1 Palette (CSS variables in `app/globals.css`)

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#efe9e3` | `#15110f` | Page background |
| `--surface` | `#faf7f3` | `#1f1a17` | Cards |
| `--fg` | `#2b221d` | `#efe8e2` | Main text |
| `--muted` | `#726359` | `#a3958a` | Secondary text |
| `--border` | `#ddd2c7` | `#322a25` | Card and button borders |
| `--accent` | `#7a5438` | `#c9a07a` | Links, primary button, section labels, focus ring |
| `--on-accent` | `#ffffff` | `#15110f` | Text on the accent button |
| `--chip-bg` | `#e6dacd` | `rgba(201,160,122,.14)` | Tech/skill chip background |
| `--chip-fg` | `#6a4730` | `#dcc0a4` | Tech/skill chip text |
| `--glow` | `rgba(190,150,110,.45)` | `rgba(201,160,122,.24)` | Hero background glow |

These are exposed to Tailwind as theme colors (`bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-border`, `text-accent`, …). Components never use raw hex values.

All text/background pairs must meet **WCAG AA** (4.5:1 for body text, 3:1 for large text). They are verified during implementation, and any failing value is nudged darker or lighter within the same hue.

**Link visibility:** the accent is close in hue to body text in light mode, so links must have **extra cues besides color**: an underline (offset ~3px), `→` arrows on action links, a hover color shift, and a visible accent focus ring.

### 3.2 Typography

- Name (h1): Geist Bold, very large (~56–72px desktop, ~40px mobile), tight letter-spacing (−0.03em).
- Section labels: Geist Mono, small, uppercase, letter-spaced, accent color.
- Body: Geist Regular, 16–18px, relaxed line-height.
- Chips, logo, small labels: Geist Mono.

### 3.3 Layout

- Content max-width ~1100px, centered, horizontal padding 20px (mobile) to 32px (desktop).
- Consistent vertical gap between sections (~96–128px desktop, ~72px mobile).
- Breakpoints: phone < 640px, tablet 640–1024px, desktop > 1024px.
- No horizontal scrolling at any width ≥ 320px.

## 4. Page Structure (top → bottom)

1. **Navbar** (sticky, slim)
   - Left: logo text in Geist Mono (e.g. `alex.dev`), links to top.
   - Right: `Projects · Skills · Contact`, which smooth-scroll to sections.
   - Transparent at top. After scrolling, translucent `--bg` with backdrop blur and a bottom border.
   - Phones: links stay inline (no hamburger).
2. **Hero** (~full viewport height)
   - Mono label "Hi, I'm", name with accent period (h1), one-line title.
   - Buttons: **Resume** (filled accent, opens `/resume.pdf` in new tab), **GitHub** (outlined, new tab).
   - Soft radial `--glow` blurred in the top-right corner.
3. **Projects** (`id="projects"`)
   - Section label + heading, then 2–4 `ProjectCard` wide rows.
   - Card: screenshot on one side (alternating left/right on desktop by index), text on the other.
   - Text: name, short description, "What I learned" label + line, tech chips, links (`GitHub →`, `Live demo →` only if `demo` exists).
   - Mobile/tablet: screenshot on top, text below.
   - No `image`: tinted placeholder (`--chip-bg`) showing the project's initials in Geist Mono.
4. **Skills** (`id="skills"`)
   - Three groups: **Languages**, **Frameworks**, **Cloud & AI**. Each has a small heading and chips.
   - Desktop: 3 columns. Mobile: stacked.
5. **Contact** (`id="contact"`)
   - One friendly line (e.g. "Open to software & AI internships. Say hi!").
   - Links: Email (`mailto:`), GitHub, LinkedIn.
6. **Footer**: `© 2026 {name} · Built with Next.js`, muted.

No About section in v1.

## 5. Code Structure

```
app/
  layout.tsx        fonts, metadata (title, description, Open Graph), <MotionConfig>
  page.tsx          renders sections in order
  globals.css       Tailwind import, palette variables (light + dark), base styles
components/
  Navbar.tsx        client component (scroll state for blur)
  Hero.tsx
  Projects.tsx
  ProjectCard.tsx
  Skills.tsx
  Contact.tsx
  Footer.tsx
  FadeIn.tsx        client component, the single reusable scroll-reveal wrapper
data/
  content.ts        ALL personal content + TypeScript types
public/
  resume.pdf        replace to update resume
  projects/         project screenshots
```

### 5.1 Content model (`data/content.ts`)

```ts
export type Project = {
  name: string;
  description: string;   // 1–2 sentences
  learned: string;       // 1 sentence
  tech: string[];
  github: string;
  demo?: string;         // optional, link hidden if absent
  image?: string;        // optional, path under /public, placeholder if absent
};

export const profile: {
  name: string; title: string; logo: string;
  email: string; github: string; linkedin: string;
  contactLine: string;   // friendly line in the Contact section
  resume: string;        // "/resume.pdf"
};

export const projects: Project[];   // 2–4 entries

export const skills: {
  languages: string[];
  frameworks: string[];
  cloudAI: string[];
};
```

Until real content is provided, the file holds clearly fake placeholder data. `public/resume.pdf` is a placeholder PDF.

### 5.2 Client vs server

All components are Server Components except `FadeIn`, `Navbar`, and `MotionProvider` (wraps `<MotionConfig>`). The hero stagger reuses `FadeIn` with delays. Hover effects are plain CSS transitions (Tailwind `motion-safe:` variants), so cards stay server-rendered. This keeps the JS sent to the browser minimal.

## 6. Animation & Motion

| Where | Behavior | Duration |
|---|---|---|
| Hero (page load) | Label → name → title → buttons fade in + rise 16px, staggered ~0.08s | 0.5s each |
| Sections (scroll) | Fade in + rise 24px when entering viewport, **once** | 0.5s |
| Project card (hover) | Lift 4px, shadow deepens, screenshot scales 1.02 | 0.3s |
| Links/buttons (hover) | Color shift, `→` nudges 2px right | 0.2s |
| Nav links | Native smooth scroll; `scroll-margin-top` on sections to clear sticky nav | n/a |

- One shared easing curve (e.g. `[0.22, 1, 0.36, 1]`) for all Motion animations.
- **Reduced motion:** `<MotionConfig reducedMotion="user">` wraps the app. CSS sets `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`. CSS hover transforms are disabled under `prefers-reduced-motion: reduce`.

## 7. Accessibility

- Landmarks: `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`. Exactly one `<h1>`.
- Visible `:focus-visible` ring in `--accent` on all interactive elements.
- Screenshots have meaningful `alt` text (from project name).
- External links: `target="_blank" rel="noopener noreferrer"`.
- WCAG AA contrast for all text (see §3.1).

## 8. SEO & Sharing

- `metadata` in `layout.tsx`: title (`{name}, Software & AI Developer`), description, Open Graph title/description.
- Favicon (simple monogram).
- `lang="en"` on `<html>`.

## 9. Testing & Verification

No unit-test framework (no logic to test). Verification per step:

1. `npm run build` passes (types + build).
1a. `npm run check` passes: `scripts/check-contrast.mjs` (every text/background pair in `globals.css` ≥ 4.5:1, light and dark) and `scripts/check-content.mjs` (resume and screenshot files exist, 2–4 projects, links are valid `https:`, no empty skill groups).
2. `npm run lint` passes.
3. Browser check at **375px, 768px, 1280px**: no horizontal scroll, correct stacking, readable text.
4. Light and dark mode both checked.
5. Reduced-motion setting disables movement.
6. Lighthouse ≥ 90 in Performance, Accessibility, Best Practices, SEO.
7. Links: Resume opens in new tab; nav scrolls to correct sections; external links open in new tabs.

## 10. Deployment

1. `git init`; `.gitignore` includes `.superpowers/`.
2. Push to a new GitHub repo (the user creates the repo).
3. Import the repo in Vercel (zero config).
4. Every push to `main` redeploys automatically.
5. Optional later: custom domain.

## 11. Out of Scope (v1)

- REST API / GitHub data fetching
- Contact form or any backend
- Theme toggle button
- About section, blog, multiple pages
- Unit/E2E test framework
