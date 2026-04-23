"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { schoolConfig } from "@/config/school";

const AUTOPLAY_MS = 7000;

export function TestimonialsCarousel() {
  const testimonials = schoolConfig.testimonials;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || testimonials.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [reduced, testimonials.length]);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="relative rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-8 md:p-12 shadow-sm"
        aria-live="polite"
      >
        <svg
          aria-hidden
          className="absolute top-6 left-6 w-10 h-10 text-primary/20"
          viewBox="0 0 32 32"
          fill="currentColor"
        >
          <path d="M10 8C6 8 4 11 4 15v9h9V15H8c0-2 1-4 3-4V8Zm15 0c-4 0-6 3-6 7v9h9V15h-5c0-2 1-4 3-4V8Z" />
        </svg>

        <blockquote className="pt-6">
          <p className="text-lg md:text-xl leading-relaxed text-text">
            &ldquo;{current.quote}&rdquo;
          </p>
          <footer className="mt-6">
            <p className="font-semibold text-text">{current.author}</p>
            <p className="text-sm text-muted">{current.role}</p>
          </footer>
        </blockquote>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.author}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "bg-primary w-6"
                  : "bg-border w-2 hover:bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
