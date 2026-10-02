// Reads the palette from app/globals.css and checks WCAG AA contrast (≥ 4.5:1)
// for every text/background pair the site uses.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function readBlock(start, label) {
  if (start < 0) throw new Error(`Could not find the ${label} :root block in globals.css`);
  const body = css.slice(start, css.indexOf("}", start));
  const vars = Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  // Follow aliases like "--accent: var(--primary)" to the actual color.
  for (const name of Object.keys(vars)) {
    for (let hops = 0; vars[name].startsWith("var(") && hops < 10; hops++) {
      const target = vars[name].match(/^var\(--([\w-]+)\)$/)?.[1];
      if (!target || !vars[target]) throw new Error(`--${name} points to an unknown variable: ${vars[name]}`);
      vars[name] = vars[target];
    }
  }
  return vars;
}

// The site is light-only (globals.css sets color-scheme: light). A dark palette is checked
// too, but only if a "@media (prefers-color-scheme: dark)" block is added back.
const modes = [["light", readBlock(css.indexOf(":root {"), "light")]];
const darkMedia = css.indexOf("@media (prefers-color-scheme: dark)");
if (darkMedia >= 0) modes.push(["dark", readBlock(css.indexOf(":root {", darkMedia), "dark")]);

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
for (const [mode, vars] of modes) {
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
