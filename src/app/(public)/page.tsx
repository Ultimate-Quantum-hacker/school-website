import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { schoolConfig } from "@/config/school";
import { Button } from "@/components/ui/FormElements";
import { SectionHeader } from "@/components/ui/Card";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { getPublishedStaff } from "@/actions/staff";
import { leadershipFromRows } from "@/lib/staff";
import { getApprovedTestimonials } from "@/actions/testimonials";
import { testimonialsForCarousel } from "@/lib/testimonials";

/**
 * Render `schoolConfig.tagline` with the substrings listed in
 * `schoolConfig.taglineHighlights` wrapped in a primary→accent gradient.
 *
 * Alternates the gradient direction (primary→accent, accent→primary, …)
 * for visual variety. Highlights are applied in the order they first
 * appear in the tagline, not in config order, so the result reads
 * left-to-right regardless of how the config is authored.
 *
 * If a highlight string isn't found in the tagline (e.g. after a config
 * edit) it is skipped silently; the tagline still renders in full as
 * plain text.
 */
function renderTaglineWithHighlights(
  tagline: string,
  highlights: readonly string[],
): React.ReactNode[] {
  const matches = highlights
    .map((h) => ({ text: h, index: tagline.indexOf(h) }))
    .filter((m) => m.index !== -1)
    .sort((a, b) => a.index - b.index);

  if (matches.length === 0) return [tagline];

  const gradients = [
    "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
    "bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent",
  ] as const;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) {
      nodes.push(
        <Fragment key={`t-${i}`}>{tagline.slice(cursor, m.index)}</Fragment>,
      );
    }
    nodes.push(
      <span key={`h-${i}`} className={gradients[i % gradients.length]}>
        {m.text}
      </span>,
    );
    cursor = m.index + m.text.length;
  });
  if (cursor < tagline.length) {
    nodes.push(<Fragment key="t-end">{tagline.slice(cursor)}</Fragment>);
  }
  return nodes;
}

export const revalidate = 60;

export default async function HomePage() {
  const [staffRows, testimonialRows] = await Promise.all([
    getPublishedStaff(),
    getApprovedTestimonials(),
  ]);
  const headOfSchool = leadershipFromRows(staffRows)[0];
  const testimonials = testimonialsForCarousel(testimonialRows);
  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative">
        <div className="container-wide py-12 sm:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Admissions Open for {schoolConfig.admissions.currentSession}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text text-balance animate-fade-in-up">
              {renderTaglineWithHighlights(
                schoolConfig.tagline,
                schoolConfig.taglineHighlights,
              )}
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              {schoolConfig.description}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/admissions">
                <Button size="lg">Apply Now</Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { value: `Est. ${schoolConfig.foundedYear}`, label: "Founded" },
              { value: schoolConfig.studentCount, label: "Students" },
              { value: schoolConfig.staffCount, label: "Staff Members" },
              { value: schoolConfig.becePasses, label: "BECE Pass Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border transition-all duration-200 hover:scale-[1.02] hover:border-primary/30"
              >
                <p className="text-xl lg:text-2xl font-semibold text-text mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About Preview ─────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <SectionHeader
                title="Welcome to Our School"
                subtitle={`A tradition of excellence since ${schoolConfig.foundedYear}`}
                centered={false}
              />
              <p className="text-muted leading-relaxed mb-4">
                At {schoolConfig.name}, we believe every child deserves access
                to quality education. Our dedicated team of educators creates
                an environment where curiosity thrives, character develops, and
                dreams take flight.
              </p>
              <p className="text-muted leading-relaxed mb-8">
                From our innovative curriculum aligned with the Ghana Education
                Service standards to our vibrant extracurricular programmes, we
                provide the tools and support students need to excel
                academically and grow personally.
              </p>
              <Link href="/about">
                <Button variant="secondary">Discover Our Story</Button>
              </Link>
            </div>
            <div className="relative reveal-right">
              <div className="rounded-xl overflow-hidden border border-border img-zoom">
                <Image
                  src={schoolConfig.images.campus}
                  alt="School campus"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[380px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Programs Preview ──────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Academic Programmes"
              subtitle="Comprehensive education from Pre-School through Junior High School"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {schoolConfig.programs.map((program) => (
              <div
                key={program.title}
                className="reveal group bg-surface rounded-xl overflow-hidden border border-border transition-colors hover:border-primary/30"
              >
                <div className="aspect-[16/10] overflow-hidden img-zoom">
                  <Image
                    src={program.image}
                    alt={program.title}
                    width={400}
                    height={250}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-5">
                  <div className="text-2xl mb-2">{program.icon}</div>
                  <h3 className="text-lg font-medium text-text mb-1">
                    {program.title}
                  </h3>
                  <p className="text-xs font-medium text-primary mb-3">
                    {program.grades}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link href="/academics">
              <Button variant="secondary">View All Programmes</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Why Choose Greenfield?"
              subtitle="What makes our school stand out"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: "📖", title: "GES-Aligned Curriculum", desc: "Our curriculum meets all Ghana Education Service standards, ensuring thorough BECE preparation and holistic development." },
              { icon: "👩‍🏫", title: "Qualified Teachers", desc: "All our teachers hold professional teaching certificates and participate in continuous professional development." },
              { icon: "💻", title: "Modern ICT Labs", desc: "Fully equipped computer labs giving students practical ICT skills essential for the modern world." },
              { icon: "🏃", title: "Sports & Recreation", desc: "Dedicated sports fields for football, athletics, and inter-school competitions that build teamwork." },
              { icon: "🛡️", title: "Safe Environment", desc: "A secure, well-fenced campus with attentive supervision ensuring every child's safety." },
              { icon: "🤝", title: "Parent Partnership", desc: "Regular PTA meetings, parent-teacher conferences, and open communication channels." },
            ].map((item) => (
              <div
                key={item.title}
                className="reveal bg-surface rounded-xl p-6 border border-border transition-colors hover:border-primary/30"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-medium text-text mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────── */}
      <section className="section-padding bg-surface/30">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="What Families Say"
              subtitle="Hear from the parents, alumni, and students who make Greenfield who we are."
            />
          </div>
          <div className="reveal">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
          <div className="mt-8 text-center reveal">
            <Link
              href="/share-your-story"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Share your own story
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Quote Banner ──────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-narrow text-center reveal">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
            Our Promise
          </p>
          <blockquote className="text-2xl lg:text-3xl font-medium text-text max-w-3xl mx-auto leading-snug">
            &ldquo;Every child is capable of greatness — we provide the
            environment for it.&rdquo;
          </blockquote>
          <p className="text-sm text-muted mt-4">
            — {headOfSchool?.name ?? schoolConfig.leadership[0].name}, Head of School
          </p>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="bg-surface border border-border rounded-2xl p-10 lg:p-14 text-center reveal">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-text mb-3">
              Ready to Join Our Community?
            </h2>
            <p className="text-base text-muted max-w-2xl mx-auto mb-8">
              Applications for the {schoolConfig.admissions.currentSession}{" "}
              academic year are now open. Take the first step towards an
              exceptional education.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/admissions">
                <Button size="lg">Start Your Application</Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
