"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/data/content";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

// Reads "has the page scrolled?" straight from the browser, including right after
// hydration, so a page opened at a #anchor gets the solid navbar immediately.
function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const isScrolled = () => window.scrollY > 8;
const isScrolledOnServer = () => false;

export default function Navbar() {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer);
  // At the top the navbar sits on the Hero's dark photo, so it uses white text;
  // once scrolled it gets its own light background and switches back to the normal colors.
  const linkColor = scrolled ? "text-muted hover:text-fg" : "text-white/85 hover:text-white";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${scrolled ? "border-border bg-bg/80 text-fg backdrop-blur-md" : "border-transparent text-white"
        }`}
    >
      <nav aria-label="Main" className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="min-w-0 truncate font-mono text-sm font-medium">
          {profile.logo}
        </a>
        <ul className="flex shrink-0 gap-3 text-sm sm:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={`transition-colors duration-200 ${linkColor}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
