"use client";

import { useEffect, useRef, useState } from "react";

type From = "up" | "left" | "right";

// Where the element waits while hidden: below, to the left, or to the right.
const hiddenOffset = (from: From, distance: number) =>
  from === "up" ? `0 ${distance}px` : from === "left" ? `-${distance}px 0` : `${distance}px 0`;

type Props = {
  children: React.ReactNode;
  from?: From;
  distance?: number; // px the element travels while sliding in (default 40)
  delay?: number; // milliseconds, only applied on the way in
  once?: boolean; // true: animate the first time only; false: replay every time it scrolls back in
  className?: string;
};

// Slides + fades its children in when they scroll into view.
//
// Visible by default: the server HTML has no hidden styles, so the content is readable even if
// JavaScript is off, slow, or fails. Only after the page is running, and only for elements that
// start below the screen, does it hide them and wait to animate them in. Anything already on screen
// stays put (no flash). With the OS "reduce motion" setting on, nothing is hidden or animated.
// Uses the browser's IntersectionObserver: no animation library needed.
export default function Reveal({ children, from = "up", distance = 40, delay = 0, once = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // "static": never hidden yet (server HTML, on-screen at load, reduced motion). "hidden" / "shown": animating.
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let armed = false; // true once the element has been hidden and is waiting to animate in
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show once 15% is on screen; hide only when it is completely off screen,
        // so it never vanishes while the reader can still see part of it.
        if (entry.intersectionRatio >= 0.15) {
          if (!armed) return;
          setState("shown");
          if (once) observer.disconnect();
        } else if (!entry.isIntersecting) {
          // On the first check, only hide things that start below the screen.
          const below = entry.boundingClientRect.top >= (entry.rootBounds?.height ?? window.innerHeight);
          if (armed || below || !once) {
            armed = true;
            setState("hidden");
          }
        }
      },
      { threshold: [0, 0.15] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      // The transition is only on while showing, so hiding (always off screen) is instant.
      style={
        state === "hidden"
          ? { opacity: 0, translate: hiddenOffset(from, distance) }
          : state === "shown"
            ? { transitionDelay: `${delay}ms` }
            : undefined
      }
      className={`${state === "shown" ? "transition-[opacity,translate] duration-700 ease-out" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
