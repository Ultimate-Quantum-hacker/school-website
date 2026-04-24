"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { turnstileSiteKey } from "@/lib/turnstile";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible";
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

/**
 * Renders the Cloudflare Turnstile challenge widget in invisible mode.
 * The challenge runs silently in the background on render and injects a
 * hidden `cf-turnstile-response` input into the surrounding form. No
 * visible UI — the Cloudflare "Success!" box and the test-key warning
 * banner do not render.
 *
 * The explicit-render pattern is used so React's concurrent renders
 * never leave duplicate widgets behind on fast navigation.
 *
 * `resetSignal` triggers a fresh challenge — increment it after a
 * successful form submission so the next submission gets a new token.
 * Without this, calling `form.reset()` clears the hidden input but
 * leaves Turnstile in its "passed" state, and subsequent submits fail
 * with an empty token.
 */
export function TurnstileWidget({
  className = "",
  theme = "auto",
  resetSignal = 0,
}: {
  className?: string;
  theme?: "light" | "dark" | "auto";
  resetSignal?: number;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    function tryRender() {
      if (!window.turnstile || !hostRef.current) return false;
      if (widgetIdRef.current) return true;
      widgetIdRef.current = window.turnstile.render(hostRef.current, {
        sitekey: turnstileSiteKey,
        theme,
        size: "invisible",
      });
      return true;
    }

    // Poll briefly in case the script hasn't finished loading yet.
    if (!tryRender()) {
      const id = window.setInterval(() => {
        if (tryRender()) window.clearInterval(id);
      }, 200);
      return () => {
        window.clearInterval(id);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* widget may already be gone on navigation */
          }
          widgetIdRef.current = null;
        }
      };
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, [theme]);

  // Reset the widget after a successful form submission so the user
  // can submit again without a stale (now-empty) token.
  useEffect(() => {
    if (resetSignal === 0) return;
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* widget already gone */
      }
    }
  }, [resetSignal]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={hostRef} className={className} aria-label="Spam protection" />
    </>
  );
}
