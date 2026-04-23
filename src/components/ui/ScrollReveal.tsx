"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = ".reveal, .reveal-left, .reveal-right, .reveal-scale";

/**
 * Observes `.reveal*` elements on the current page and adds the
 * `.revealed` class when they intersect the viewport.
 *
 * Rescans on every pathname change so newly mounted pages (via
 * client-side navigation) get picked up — without this, navigated-to
 * pages would stay at opacity 0 until a full refresh.
 *
 * Honors `prefers-reduced-motion`: everything is revealed immediately
 * so nothing is ever stuck invisible for motion-sensitive users.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealAll = () => {
      document
        .querySelectorAll(SELECTOR)
        .forEach((el) => el.classList.add("revealed"));
    };

    if (reduced) {
      // Defer one frame so newly mounted page content is in the DOM.
      const raf = requestAnimationFrame(revealAll);
      return () => cancelAnimationFrame(raf);
    }

    const run = () => {
      const elements = document.querySelectorAll(SELECTOR);
      if (elements.length === 0) return () => {};

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    };

    let cleanup: () => void = () => {};
    const raf = requestAnimationFrame(() => {
      cleanup = run();
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [pathname]);

  return null;
}
