"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps a page's contents in a subtle fade-in on mount.
 * Duration kept short (0.35s) so navigation feels responsive.
 *
 * Honours `prefers-reduced-motion` — when set, we skip the
 * transform and only crossfade so the page still feels less abrupt
 * but no movement is introduced.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.18 : 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
