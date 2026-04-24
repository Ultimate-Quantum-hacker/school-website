"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Dark-mode toggle.
 *
 * The initial theme is applied **before hydration** by the inline
 * `<script>` in RootLayout (see `theme-init.ts`) so there is no flash
 * of wrong theme. This component only handles the click to flip it.
 *
 * Persists the user's choice to `localStorage["theme"]`. If no choice
 * is stored, the system preference wins on first load.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer the setState off the effect's render path so we don't
    // trigger a cascading synchronous render. The DOM class is already
    // correct (applied by the pre-hydration script in RootLayout);
    // this effect only teaches React what the initial value is.
    const id = setTimeout(() => {
      setMounted(true);
      const current = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      setTheme(current);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode, quota, etc. — ignore */
    }
  }

  // Avoid hydration mismatch: render a placeholder until mounted.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        className="w-9 h-9 rounded-lg border border-border"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-lg border border-border text-muted hover:text-text hover:bg-background flex items-center justify-center transition-colors"
    >
      {isDark ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
