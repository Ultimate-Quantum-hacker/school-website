import type { Metadata } from "next";
import Image from "next/image";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${schoolConfig.name} — our history, mission, vision, and leadership team.`,
};

export default function AboutPage() {
  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="relative gradient-hero text-white py-24 overflow-hidden">
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
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4 animate-fade-in">
            About Us
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up">
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
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in {schoolConfig.foundedYear}, {schoolConfig.name} began
                  with a simple yet powerful vision: to create a school in Accra
                  where every child could reach their full potential regardless of background.
                  What started as a small nursery has grown into one of the most respected
                  basic schools in the Greater Accra Region.
                </p>
                <p>
                  Over the years, we have evolved our teaching methods,
                  expanded our facilities, and embraced modern educational
                  practices — all while staying true to our founding principles
                  of academic rigour, discipline, and inclusive community.
                </p>
                <p>
                  Today, with over {schoolConfig.studentCount} students and{" "}
                  {schoolConfig.staffCount} dedicated staff members, we continue
                  to produce outstanding BECE results and well-rounded graduates
                  who go on to excel in the best senior high schools across Ghana.
                </p>
              </div>
            </div>
            <div className="relative reveal-right">
              <div className="rounded-2xl overflow-hidden shadow-xl img-zoom">
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
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <p className="text-3xl font-bold text-primary">{new Date().getFullYear() - schoolConfig.foundedYear}+</p>
                <p className="text-xs text-gray-500">Years of Excellence</p>
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
            <div className="reveal bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-white text-2xl mb-6">
                🎯
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide quality basic education that empowers students with
                knowledge, critical thinking skills, and strong moral values. We
                are committed to fostering an inclusive learning environment where
                every child is encouraged to explore, innovate, and excel, while
                being prepared for the challenges of secondary education and beyond.
              </p>
            </div>
            <div className="reveal bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-white text-2xl mb-6">
                🔭
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be a leading basic school in Ghana that produces
                well-rounded, confident, and socially responsible young people who
                contribute meaningfully to national development. We envision a
                community where education transforms lives and empowers the next
                generation of Ghanaian leaders.
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
                className="reveal text-center p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
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
            {schoolConfig.leadership.map((leader) => (
              <div
                key={leader.name}
                className="reveal bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
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
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-3">
                    {leader.role}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
