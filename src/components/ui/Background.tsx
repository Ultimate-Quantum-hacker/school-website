"use client";

import { motion } from "framer-motion";

/**
 * Full-screen fixed background with a soft gradient base and a few
 * slow-floating blurred "orbs". Sits behind all UI via -z-10.
 *
 * Animations are intentionally slow (~20s+) and low-opacity so they
 * never distract from content.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, #eef2f8 100%)",
        }}
      />

      {/* Orb 1 — top-left, primary blue */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-10%",
          left: "-10%",
          width: "540px",
          height: "540px",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 26,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Orb 2 — bottom-right, lighter blue */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle, rgba(96,165,250,0.16) 0%, rgba(96,165,250,0) 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Orb 3 — center-ish, subtle slate */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "40%",
          left: "50%",
          width: "420px",
          height: "420px",
          background:
            "radial-gradient(circle, rgba(148,163,184,0.14) 0%, rgba(148,163,184,0) 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: ["-50%", "-40%", "-60%", "-50%"],
          y: ["-50%", "-45%", "-55%", "-50%"],
        }}
        transition={{
          duration: 22,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
