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
 * Renders the Cloudflare Turnstile challenge widget. Injects a hidden
 * `cf-turnstile-response` input into the surrounding form on success.
 *
 * The explicit-render pattern is used so React's concurrent renders
 * never leave duplicate widgets behind on fast navigation.
 */
export function TurnstileWidget({
  className = "",
  theme = "auto",
}: {
  className?: string;
  theme?: "light" | "dark" | "auto";
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
        size: "normal",
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
