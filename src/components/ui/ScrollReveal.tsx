"use client";

import { useEffect } from "react";

/**
 * Observes `.reveal*` elements as they enter the viewport and adds the
 * `.revealed` class so CSS can fade them in.
 *
 * Uses a long-lived IntersectionObserver plus a MutationObserver so that
 * elements which mount AFTER the initial commit still get picked up.
 * This matters during client-side navigation: the public layout has a
 * `loading.tsx` fallback, so navigating between sections (e.g. /news →
 * /) commits the loading shell first and then streams in the real page.
 * Without the MutationObserver, newly-mounted `.reveal*` elements would
 * never be observed and would stay at `opacity: 0` until a hard refresh.
 */
export function ScrollReveal() {
  useEffect(() => {
    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";

    // If the user prefers reduced motion, skip the observer and
    // mark every reveal element as already revealed so they render
    // statically. The CSS rules also force `opacity: 1` for safety.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const markAll = () => {
        document.querySelectorAll(selector).forEach((el) => {
          el.classList.add("revealed");
        });
      };
      markAll();
      const reduceObserver = new MutationObserver(markAll);
      reduceObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      return () => reduceObserver.disconnect();
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const observed = new WeakSet<Element>();
    const observeAll = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          intersectionObserver.observe(el);
        }
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
