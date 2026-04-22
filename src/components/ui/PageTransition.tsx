"use client";

import { motion } from "framer-motion";

/**
 * Wraps a page's contents in a subtle fade-in on mount.
 * Duration kept short (0.35s) so navigation feels responsive.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
