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
