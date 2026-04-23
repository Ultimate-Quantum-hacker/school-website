"use client";

import { motion } from "framer-motion";

/**
 * Full-screen fixed background, placed behind all UI via `-z-10`.
 *
 * Layers, bottom-up:
 *   1. Soft light gradient base
 *   2. Subtle grid pattern (CSS lines + radial mask that fades at edges)
 *   3. Slow-rotating conic aurora, heavily blurred, low opacity
 *   4. 4 floating color orbs in blue / violet / cyan / sky
 *
 * Every animation is long (20–60s) and low-opacity so content always
 * remains comfortably readable.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — soft gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, #eef2f8 55%, #eaf0fb 100%)",
        }}
      />

      {/* 2 — grid pattern, masked to a central spotlight */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 45%, transparent 75%)",
        }}
      />

      {/* 3 — slow-rotating conic aurora */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "160vmax",
          height: "160vmax",
          marginLeft: "-80vmax",
          marginTop: "-80vmax",
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(37,99,235,0.12) 0deg, rgba(139,92,246,0.10) 90deg, rgba(14,165,233,0.10) 180deg, rgba(236,72,153,0.08) 270deg, rgba(37,99,235,0.12) 360deg)",
          filter: "blur(90px)",
          opacity: 0.55,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 80,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* 4 — color orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-12%",
          left: "-8%",
          width: "540px",
          height: "540px",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0) 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, 80, -20, 0],
          y: [0, 40, -30, 0],
          scale: [1, 1.06, 0.98, 1],
        }}
        transition={{ duration: 26, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.05, 0.96, 1],
        }}
        transition={{ duration: 34, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          top: "35%",
          left: "48%",
          width: "480px",
          height: "480px",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.16) 0%, rgba(14,165,233,0) 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: ["-50%", "-30%", "-70%", "-50%"],
          y: ["-50%", "-60%", "-40%", "-50%"],
        }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          top: "60%",
          left: "15%",
          width: "360px",
          height: "360px",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.14) 0%, rgba(56,189,248,0) 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />

      {/* 5 — thin scan line that drifts top→bottom */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(37,99,235,0.35), transparent)",
          opacity: 0.35,
        }}
        animate={{ y: ["-10vh", "110vh"] }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />
    </div>
  );
}
