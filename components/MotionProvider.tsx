"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";

// reducedMotion="user": if the OS "reduce motion" setting is on, Motion skips
// movement (slides, scales) and only animates opacity.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  // Turn on smooth scrolling for nav clicks only after the initial #anchor jump (see globals.css).
  useEffect(() => {
    const enable = () => document.documentElement.setAttribute("data-smooth-scroll", "");
    if (document.readyState === "complete") {
      enable();
      return;
    }
    window.addEventListener("load", enable, { once: true });
    return () => window.removeEventListener("load", enable);
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
