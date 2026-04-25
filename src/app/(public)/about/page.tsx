import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { getPublishedStaff } from "@/actions/staff";
import { leadershipFromRows } from "@/lib/staff";
import { getSiteSettings } from "@/actions/site-settings";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${schoolConfig.name} — our history, mission, vision, and leadership team.`,
};

export const revalidate = 60;

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function AboutPage() {
  const [rows, settings] = await Promise.all([
    getPublishedStaff(),
    getSiteSettings(),
  ]);
  const leaders = leadershipFromRows(rows);
  const storyParagraphs = paragraphs(settings.content.aboutStory);
  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border py-10 sm:py-14">
        <div className="absolute inset-0">
          <Image
            src={schoolConfig.images.campus}
            alt="School campus"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
        </div>
        <div className="relative container-wide text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            About Us
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up">
            Discover the story, values, and people behind {schoolConfig.name}
          </p>
        </div>
      </section>

      {/* ─── School History ────────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <SectionHeader
                title="Our Story"
                subtitle={`A legacy of excellence since ${schoolConfig.foundedYear}`}
                centered={false}
              />
              <div className="space-y-4 text-muted leading-relaxed">
                {storyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative reveal-right">
              <div className="rounded-2xl overflow-hidden shadow-sm img-zoom">
                <Image
                  src={schoolConfig.images.library}
                  alt="School library"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[400px]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-secondary/20 -z-10" />
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-surface rounded-xl shadow-sm p-4 border border-border hover-lift">
                <p className="text-3xl font-bold text-primary">
                  <CountUp
                    to={new Date().getFullYear() - schoolConfig.foundedYear}
                    suffix="+"
                  />
                </p>
                <p className="text-xs text-muted">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <div className="bg-base">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px]">
          <path d="M0 30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0V30Z" fill="var(--section-alt)" />
        </svg>
      </div>

      {/* ─── Mission & Vision ──────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Mission & Vision"
              subtitle="Guiding principles that drive everything we do"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8 stagger-children">
            <div className="reveal bg-surface rounded-2xl p-8 shadow-sm border border-border hover:shadow-sm transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white text-2xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Our Mission
              </h3>
              <p className="text-muted leading-relaxed whitespace-pre-line">
                {settings.content.mission}
              </p>
            </div>
            <div className="reveal bg-surface rounded-2xl p-8 shadow-sm border border-border hover:shadow-sm transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-white text-2xl mb-6">
                🔭
              </div>
              <h3 className="text-xl font-bold text-text mb-4">
                Our Vision
              </h3>
              <p className="text-muted leading-relaxed whitespace-pre-line">
                {settings.content.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Values ───────────────────────────────────────── */}
      <section className="section-padding bg-warm">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Our Core Values"
              subtitle="The principles that shape our community"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              {
                icon: "⭐",
                title: "Excellence",
                desc: "We pursue the highest standards in academics, character, and service.",
              },
              {
                icon: "🤝",
                title: "Integrity",
                desc: "We foster honesty, respect, and ethical behaviour in all interactions.",
              },
              {
                icon: "💡",
                title: "Innovation",
                desc: "We embrace creativity and modern approaches to teaching and learning.",
              },
              {
                icon: "🌍",
                title: "Community",
                desc: "We build an inclusive environment where every voice is valued and heard.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="reveal text-center p-6 bg-surface rounded-xl border border-border hover:border-primary-200 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-lg font-bold text-text mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Image Banner ──────────────────────────────────────── */}
      <section className="relative h-[250px] overflow-hidden">
        <Image
          src={schoolConfig.images.sports}
          alt="Students at sports"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary-900/60" />
      </section>

      {/* ─── Leadership ────────────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Our Leadership"
              subtitle="Meet the team guiding our institution forward"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className="reveal bg-surface rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-sm transition-all duration-300 group"
              >
                <div className="aspect-[4/3] overflow-hidden img-zoom">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-3">
                    {leader.role}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link
              href="/staff"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              See the full staff directory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
