/**
 * Full-screen fixed background, placed behind all UI via `-z-10`.
 *
 * Theme-aware via CSS custom properties declared in globals.css
 * (`--bg-gradient`, `--bg-orb-*`, `--bg-grid`). The same markup renders
 * a soft white→blue→cyan gradient in light mode and a deep navy with
 * blue/cyan glow in dark mode; no JS involved in the swap.
 *
 * Performance notes:
 *   - Pure CSS. Only `transform: translate3d` is animated, so every
 *     blurred orb stays on its own compositor layer and never repaints
 *     during the loop — critical because re-blurring a `blur(80px)`
 *     surface per frame was what caused the earlier scroll jank.
 *   - Animations honour `prefers-reduced-motion`.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — theme-aware gradient base */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--bg-gradient)" }}
      />

      {/* 2 — grid, masked to a central spotlight; stronger in dark mode */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "var(--bg-grid)",
          backgroundSize: "44px 44px",
          opacity: "var(--bg-grid-opacity)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)",
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
          background: "var(--bg-orb-1)",
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
          background: "var(--bg-orb-2)",
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
          background: "var(--bg-orb-3)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
