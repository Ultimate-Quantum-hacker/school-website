"use client";

import { useEffect, useRef } from "react";

/**
 * Count-up number animation that triggers the first time the element
 * scrolls into view.
 *
 * Pure RAF-based easing — no framer-motion dependency for a single
 * scalar so the bundle stays small. Honours `prefers-reduced-motion`
 * by skipping the animation and leaving the final value.
 *
 * SSR-safe: renders the final value on the server and during the
 * first client render, then on mount snaps to 0 (via direct DOM
 * write to avoid a hydration mismatch + a re-render cascade) and
 * animates up when the element scrolls into view.
 */
export interface CountUpProps {
  /** Target numeric value to count up to. */
  to: number;
  /** Optional prefix (e.g. "Est. "). */
  prefix?: string;
  /** Optional suffix (e.g. "+", "%"). */
  suffix?: string;
  /** Decimal places to preserve when formatting. Default 0. */
  decimals?: number;
  /** Animation duration in ms. Default 1400. */
  duration?: number;
  /** Class name forwarded to the wrapping span. */
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function format(value: number, decimals: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className,
}: CountUpProps) {
  const numberRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    // Snap to 0 immediately on mount; animate when in view.
    node.textContent = format(0, decimals);

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();

          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            const current = easeOutCubic(t) * to;
            node.textContent = format(current, decimals);
            if (t < 1) {
              raf = requestAnimationFrame(tick);
            } else {
              node.textContent = format(to, decimals);
            }
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, decimals, duration]);

  return (
    <span className={className}>
      {prefix}
      <span ref={numberRef}>{format(to, decimals)}</span>
      {suffix}
    </span>
  );
}
