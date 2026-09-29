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
        <a href="#top" className="min-w-0 truncate font-mono text-sm font-medium">
          {profile.logo}
        </a>
        <ul className="flex shrink-0 gap-3 text-sm text-muted sm:gap-6">
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
