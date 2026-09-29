# Personal Portfolio — Design Spec

**Date:** 2026-09-29
**Status:** Approved in brainstorming, awaiting written-spec review

## 1. Purpose

A one-page personal portfolio used to apply for **software development and AI internships**.

**Success looks like:** a recruiter can tell who I am, what I've built, and how to reach me within ~30 seconds, on any device, and the site feels polished and fast.

**Constraints**
- Visual quality, responsive design, and UX come first.
- Keep implementation simple. The only server code is one REST endpoint, `POST /api/contact`, for the contact form (§6a). There is no database and no other runtime API calls.
- Content must be easy to update by editing one data file and replacing files in `public/`.

## 2. Decisions

| Topic | Decision |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS (default `create-next-app` setup) |
| Animation | Motion (formerly Framer Motion), package `motion`, imported from `motion/react` |
| Hosting | Vercel, auto-deploy on `git push` |
| Data source | Local file `data/content.ts`. **No GitHub fetching in v1.** (Build-time GitHub stats may be added later.) |
| Theme | Follows the visitor's OS setting via `prefers-color-scheme`. No toggle. |
| Typography | Geist (headings and body) + Geist Mono (labels, chips, logo), loaded via `next/font` |
| Palette | "Mocha + Caramel" (see §3) |
| Project card layout | Wide rows, screenshot alternates sides on desktop, stacks on mobile |
| Contact form | Name, email and message fields posting to `POST /api/contact` (a Next.js Route Handler on Vercel) |
| Email sending | Nodemailer through Gmail SMTP, using a Gmail **App Password** stored in environment variables |
| Email verification | ZeroBounce v2 validate API, server-side only, run once per submit. It **fails open** (see §6a) |
| Tests | Node's built-in test runner (`node --test`) on the TypeScript logic files. No test framework dependency |

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
| `--error` | `#b3261e` | `#f2a39c` | Form field errors and the send-failure notice |
| `--success` | `#3f6b3a` | `#a8d5a0` | "Sent ✓" confirmation |

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
5. **Contact** (`id="contact"`): one surface card, **side by side** on desktop (≥ 1024px), stacked on smaller screens (text first).
   - Left: "Contact" label, "Let's talk" heading, `profile.contactLine`, then links: the email address (`mailto:`), GitHub, LinkedIn.
   - Right: the contact form (§6a). Name and Email sit side by side (≥ 640px), with Message below and a **Send message →** button.
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
  ContactForm.tsx   client component, the form and its states
app/api/contact/
  route.ts          POST /api/contact: parses JSON, wires real Gmail + ZeroBounce into handleContact
lib/
  contact.ts        validation rules + subject formatting (shared by browser and server)
  verifyEmail.ts    ZeroBounce call → allow/reject decision (fails open)
  contactHandler.ts request logic with injected verify/send, so it can be tested without network
tests/
  *.test.ts         node --test unit tests for lib/
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

All components are Server Components except `FadeIn`, `Navbar`, `ContactForm`, and `MotionProvider` (wraps `<MotionConfig>`). The hero stagger reuses `FadeIn` with delays. Hover effects are plain CSS transitions (Tailwind `motion-safe:` variants), so cards stay server-rendered. This keeps the JS sent to the browser minimal.

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

## 6a. Contact Form & `POST /api/contact`

### Request / response

`POST /api/contact` with JSON `{ name, email, message, website }`. `website` is the hidden honeypot field.

| Case | Status | Body |
|---|---|---|
| Honeypot `website` is non-empty | 200 | `{ ok: true }` (nothing is sent) |
| Body isn't valid JSON, or fields are invalid | 400 | `{ ok: false, errors: { name?, email?, message? } }` |
| ZeroBounce rejects the email | 400 | `{ ok: false, errors: { email }, suggestion? }` |
| Sent | 200 | `{ ok: true }` |
| Gmail send fails / credentials missing | 500 | `{ ok: false, error: "Couldn't send your message." }` |

### Validation (`lib/contact.ts`, same rules in browser and server)

Inputs are trimmed first.
- **name:** required, ≤ 100 characters. "Please enter your name." / "Name must be 100 characters or fewer."
- **email:** matches `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` and is ≤ 254 characters. "Please enter a valid email address."
- **message:** 10–2000 characters. "Message should be at least 10 characters." / "Message must be 2000 characters or fewer."

### Email verification (`lib/verifyEmail.ts`)

`GET https://api.zerobounce.net/v2/validate?api_key=…&email=…&timeout=5`, with an 8-second client abort.

| ZeroBounce `status` | Decision | Message shown |
|---|---|---|
| `valid` | allow | none |
| `invalid`, `spamtrap` | reject | "This email address doesn't seem to exist." + `did_you_mean` as `suggestion` when present |
| `do_not_mail` with `sub_status: "disposable"` | reject | "Please use a permanent email address." |
| `catch-all`, `unknown`, `abuse`, other `do_not_mail` | allow | none |
| HTTP error, timeout, `error` field in JSON (e.g. out of credits) | **allow** + `console.warn` | none |
| `ZEROBOUNCE_API_KEY` not set | **allow** + `console.warn` | none |

### Sending (Nodemailer + Gmail)

- `from: "Portfolio <GMAIL_USER>"`, `to: GMAIL_USER`, `replyTo: visitor email`.
- Subject: `Portfolio message from {name}`, with CR/LF in the name replaced by spaces.
- Body is **plain text only**: `Name: …\nEmail: …\n\n{message}`.
- Credentials are read from env at request time. If they're missing, that is treated as a send failure (500).

### Environment variables

| Name | Required | Purpose |
|---|---|---|
| `GMAIL_USER` | yes | Gmail address that sends and receives |
| `GMAIL_APP_PASSWORD` | yes | 16-character Google App Password (requires 2-Step Verification) |
| `ZEROBOUNCE_API_KEY` | no | Enables verification. Free plan: 100 checks/month |

They live in `.env.local` locally (git-ignored) and in Vercel project settings. `.env.example` documents them with fake values.

### Visitor-facing states (`components/ContactForm.tsx`)

1. **Idle:** empty fields.
2. **Invalid:** browser-side validation runs on submit. The error shows under each bad field (`aria-invalid`, `aria-describedby`). The error for a field clears when the visitor edits it. Server 400 errors display the same way. A `suggestion` shows as a clickable "Did you mean …?" that fills the email field.
3. **Sending:** the button is disabled, with a spinner and "Sending…".
4. **Sent:** the form is replaced by ✓ "Thanks, {name}!" and "Your message is on its way. I'll get back to you soon."
5. **Failed** (500 or network error): an error notice reads "Couldn't send your message. Please email me directly at {email}" (as a `mailto:` link). The entered text is kept.

The form uses `noValidate` (our messages, not browser bubbles). The component root is an `aria-live="polite"` region. The honeypot is visually hidden, `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`.

Not included: rate limiting, CAPTCHA, storing messages.

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

Verification per step:

0. `npm test` passes: `node --test` unit tests for `lib/contact.ts`, `lib/verifyEmail.ts` (fake `fetch`), and `lib/contactHandler.ts` (fake verify/send). Tests never hit the network or use ZeroBounce credits.
1. `npm run build` passes (types + build).
1a. `npm run check` passes: `scripts/check-contrast.mjs` (every text/background pair in `globals.css` ≥ 4.5:1, light and dark) and `scripts/check-content.mjs` (resume and screenshot files exist, 2–4 projects, links are valid `https:`, no empty skill groups).
2. `npm run lint` passes.
3. Browser check at **375px, 768px, 1280px**: no horizontal scroll, correct stacking, readable text.
4. Light and dark mode both checked.
5. Reduced-motion setting disables movement.
6. Lighthouse ≥ 90 in Performance, Accessibility, Best Practices, SEO.
7. Links: Resume opens in new tab; nav scrolls to correct sections; external links open in new tabs.
8. One real end-to-end send locally with `.env.local` filled in: the email arrives, and Reply goes to the visitor address.

## 10. Deployment

1. `git init`; `.gitignore` includes `.superpowers/`.
2. Push to a new GitHub repo (the user creates the repo).
3. Import the repo in Vercel, and add `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ZEROBOUNCE_API_KEY` under Environment Variables before the first deploy.
4. Every push to `main` redeploys automatically.
5. Optional later: custom domain.

## 11. Out of Scope (v1)

- GitHub data fetching
- Database, rate limiting, CAPTCHA, storing messages
- Theme toggle button
- About section, blog, multiple pages
- Test framework dependencies (Jest/Vitest/Playwright). Node's built-in runner is enough
