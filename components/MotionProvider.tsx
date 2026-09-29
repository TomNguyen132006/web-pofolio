"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user": if the OS "reduce motion" setting is on, Motion skips
// movement (slides, scales) and only animates opacity.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
