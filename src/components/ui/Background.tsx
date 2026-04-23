/**
 * Full-screen fixed background, placed behind all UI via `-z-10`.
 *
 * Implementation notes (performance):
 *   - Pure CSS, no framer-motion. Keyframes live in globals.css under
 *     `@keyframes orb-*`. Only `transform: translate3d` is animated, so each
 *     layer stays on its own compositor layer and never repaints during the
 *     animation — critical because these layers are blurred, and re-blurring
 *     a `blur(80px)` surface on every frame is what used to jank scrolling.
 *   - The earlier conic-gradient rotating aurora was removed: rotating a
 *     160vmax blurred layer forces a full GPU re-composite per frame on
 *     low-end hardware.
 *   - Users who prefer reduced motion get the gradient + grid + static orbs
 *     (no motion at all).
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
            "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)",
        }}
      />

      {/* 3 — 3 color orbs, CSS-animated via translate3d only */}
      <div
        className="bg-orb bg-orb-1"
        style={{
          top: "-12%",
          left: "-8%",
          width: "540px",
          height: "540px",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0) 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="bg-orb bg-orb-2"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="bg-orb bg-orb-3"
        style={{
          top: "55%",
          left: "10%",
          width: "420px",
          height: "420px",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.16) 0%, rgba(14,165,233,0) 70%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
