"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Observes `.reveal*` elements on the current page and adds the
 * `.revealed` class when they intersect the viewport.
 *
 * Rescans on every pathname change so newly mounted pages (via
 * client-side navigation) get picked up — without this, navigated-to
 * pages would stay at opacity 0 until a full refresh.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";

    const run = () => {
      const elements = document.querySelectorAll(selector);
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

    // Run after paint so newly mounted page content is in the DOM.
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
