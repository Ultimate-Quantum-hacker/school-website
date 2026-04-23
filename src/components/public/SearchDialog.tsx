"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { search, type SearchResult } from "@/actions/search";
import { formatDate } from "@/lib/utils";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  // Global shortcut: Ctrl/Cmd+K opens the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      // Defer focus so the input is mounted.
      requestAnimationFrame(() => inputRef.current?.focus());
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Debounced search. We keep the loading flag local to the timer so we
  // can avoid calling setState synchronously in the effect body.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      // Nothing to search; schedule the clear in a microtask so the effect
      // itself doesn't call setState synchronously.
      const id = setTimeout(() => {
        setResults([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    const id = setTimeout(async () => {
      setLoading(true);
      const res = await search(q);
      if (cancelled) return;
      setResults(res);
      setLoading(false);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query, open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        title="Search (Ctrl+K)"
        className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-primary transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <circle cx="11" cy="11" r="7" strokeWidth={2} />
          <path strokeLinecap="round" strokeWidth={2} d="m20 20-3.5-3.5" />
        </svg>
        <span>Search</span>
        <kbd className="ml-2 hidden lg:inline-block rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted">
          Ctrl K
        </kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="md:hidden p-2 rounded-lg text-muted hover:bg-background transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <circle cx="11" cy="11" r="7" strokeWidth={2} />
          <path strokeLinecap="round" strokeWidth={2} d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[15vh] animate-fade-in"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <circle cx="11" cy="11" r="7" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2} d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, events, gallery..."
                className="flex-1 py-4 bg-transparent text-text placeholder:text-muted focus:outline-none"
              />
              <button
                onClick={close}
                aria-label="Close search"
                className="text-xs text-muted hover:text-text px-2 py-1 rounded border border-border"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="p-6 text-sm text-muted text-center">
                  Type at least 2 characters to search.
                </p>
              ) : loading ? (
                <p className="p-6 text-sm text-muted text-center">Searching...</p>
              ) : results.length === 0 ? (
                <p className="p-6 text-sm text-muted text-center">
                  No results for &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {results.map((r) => (
                    <li key={`${r.kind}-${r.id}`}>
                      <ResultLink result={r} onNavigate={close} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResultLink({
  result,
  onNavigate,
}: {
  result: SearchResult;
  onNavigate: () => void;
}) {
  if (result.kind === "post") {
    return (
      <Link
        href={`/news/${result.slug}`}
        onClick={onNavigate}
        className="flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors"
      >
        <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5">
          {result.category === "announcement" ? "Announcement" : "News"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text truncate">{result.title}</p>
          {result.excerpt && (
            <p className="text-xs text-muted truncate mt-0.5">
              {result.excerpt}
            </p>
          )}
          <p className="text-[11px] text-muted mt-1">
            {formatDate(result.created_at)}
          </p>
        </div>
      </Link>
    );
  }
  if (result.kind === "event") {
    return (
      <Link
        href="/events"
        onClick={onNavigate}
        className="flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors"
      >
        <span className="mt-1 inline-flex items-center rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-semibold px-2 py-0.5">
          Event
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text truncate">{result.title}</p>
          <p className="text-xs text-muted truncate mt-0.5">
            {formatDate(result.starts_at)}
            {result.location ? ` · ${result.location}` : ""}
          </p>
        </div>
      </Link>
    );
  }
  // gallery
  return (
    <Link
      href="/gallery"
      onClick={onNavigate}
      className="flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors"
    >
      <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-semibold px-2 py-0.5">
        Gallery
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text truncate">{result.title}</p>
        {result.caption && (
          <p className="text-xs text-muted truncate mt-0.5">{result.caption}</p>
        )}
      </div>
    </Link>
  );
}
