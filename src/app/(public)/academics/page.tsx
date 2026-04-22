import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/FormElements";

export const metadata: Metadata = {
  title: "Academics",
  description: `Explore academic programmes and curriculum at ${schoolConfig.name}. From Pre-School through Junior High School (JHS).`,
};

export default function AcademicsPage() {
  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <div className="absolute inset-0">
          <Image
            src={schoolConfig.images.classroom}
            alt="Classroom"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
        </div>
        <div className="relative container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Academics
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up">
            A rigorous, well-rounded curriculum aligned with Ghana Education Service standards
          </p>
        </div>
      </section>

      {/* ─── Curriculum Overview ───────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Our Curriculum"
              subtitle="A comprehensive approach to education that develops the whole child"
            />
          </div>
          <div className="max-w-3xl mx-auto reveal">
            <div className="space-y-4 text-muted leading-relaxed text-center">
              <p>
                At {schoolConfig.name}, our curriculum follows the Ghana Education
                Service (GES) guidelines while incorporating modern teaching
                methodologies. We prepare students thoroughly for the Basic
                Education Certificate Examination (BECE) while ensuring they
                develop critical thinking, creativity, and practical skills.
              </p>
              <p>
                Our programmes span from Pre-School through Junior High School,
                with small class sizes that allow for personalised attention
                and differentiated instruction. We integrate ICT across all
                levels to equip students for the digital age.
              </p>
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

      {/* ─── Programs ──────────────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Academic Programmes"
              subtitle="Tailored education for every stage of development"
            />
          </div>
          <div className="space-y-12">
            {schoolConfig.programs.map((program, index) => (
              <div
                key={program.title}
                className={`reveal flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="lg:w-2/5">
                  <div className="rounded-2xl overflow-hidden shadow-sm img-zoom">
                    <Image
                      src={program.image}
                      alt={program.title}
                      width={500}
                      height={350}
                      className="object-cover w-full h-[280px]"
                    />
                  </div>
                </div>
                <div className="lg:w-3/5">
                  <div className="bg-surface rounded-2xl p-8 shadow-sm border border-border hover:shadow-sm transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{program.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-text">
                          {program.title}
                        </h3>
                        <p className="text-sm font-medium text-primary">
                          {program.grades}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted leading-relaxed mb-6">
                      {program.description}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {getProgramFeatures(program.title).map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted"
                        >
                          <svg
                            className="w-4 h-4 text-accent flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Enrichment ────────────────────────────────────────── */}
      <section className="section-padding bg-warm">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Beyond the Classroom"
              subtitle="Extracurricular activities that enrich the student experience"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: "⚽", title: "Sports", desc: "Football, athletics, table tennis, and inter-school competitions" },
              { icon: "🎨", title: "Creative Arts", desc: "Visual arts, music, drumming, dance, and cultural performances" },
              { icon: "💻", title: "ICT Club", desc: "Computer skills, coding basics, and digital literacy workshops" },
              { icon: "🌱", title: "Environmental Club", desc: "Tree planting, campus beautification, and sustainability projects" },
              { icon: "🗣️", title: "Debate & Quiz", desc: "Public speaking, inter-school quizzes, and spelling bees" },
              { icon: "📚", title: "Reading Club", desc: "Library sessions, reading competitions, and storytelling" },
            ].map((activity) => (
              <div
                key={activity.title}
                className="reveal p-6 bg-surface rounded-xl border border-border hover:border-primary-200 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {activity.icon}
                </div>
                <h3 className="font-semibold text-text mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-muted">{activity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-wide text-center reveal">
          <h2 className="text-3xl font-bold text-text mb-4">
            Join Our Academic Community
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8">
            Experience the difference of a {schoolConfig.name} education.
            Applications are open for the {schoolConfig.admissions.currentSession} session.
          </p>
          <Link href="/admissions">
            <Button size="lg">Apply Now →</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

function getProgramFeatures(programTitle: string): string[] {
  const features: Record<string, string[]> = {
    "Pre-School & KG": [
      "Play-based learning",
      "Phonics & early reading",
      "Number recognition & counting",
      "Creative arts & crafts",
    ],
    "Lower Primary": [
      "Core literacy & numeracy",
      "Natural science exploration",
      "Religious & moral education",
      "Physical education & sports",
    ],
    "Upper Primary": [
      "Advanced English & maths",
      "Integrated science",
      "ICT & computer studies",
      "French language basics",
    ],
    "Junior High School": [
      "BECE preparation programme",
      "Mathematics & English mastery",
      "Science & social studies",
      "Career guidance & counselling",
    ],
  };
  return features[programTitle] || ["Comprehensive curriculum", "Expert faculty", "Modern facilities", "Individual attention"];
}
