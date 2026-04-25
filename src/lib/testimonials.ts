import { schoolConfig } from "@/config/school";
import type { Testimonial } from "@/types";
import type { CarouselTestimonial } from "@/components/public/TestimonialsCarousel";

/**
 * Build the home-page carousel list from approved DB testimonials.
 * Falls back to the configured `schoolConfig.testimonials` array when no
 * approved rows exist yet (e.g. before the migration is run, or while the
 * table is empty), so the home page never renders an empty section.
 */
export function testimonialsForCarousel(
  rows: Testimonial[],
): CarouselTestimonial[] {
  if (rows.length > 0) {
    return rows.map((r) => ({
      quote: r.quote,
      author: r.author,
      role: r.role ?? "",
    }));
  }
  return schoolConfig.testimonials.map((t) => ({
    quote: t.quote,
    author: t.author,
    role: t.role,
  }));
}
