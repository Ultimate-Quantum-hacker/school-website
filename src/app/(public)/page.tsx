import Link from "next/link";
import Image from "next/image";
import { schoolConfig } from "@/config/school";
import { Button } from "@/components/ui/FormElements";
import { SectionHeader } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative gradient-hero text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0">
          <Image
            src={schoolConfig.images.heroStudents}
            alt="Students learning"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/85 to-primary-700/75" />
        </div>

        {/* Decorative blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative container-wide py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Admissions Open for {schoolConfig.admissions.currentSession}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-fade-in-up">
                {schoolConfig.tagline}
              </h1>
              <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-xl animate-fade-in-up animate-delay-200">
                {schoolConfig.description}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
                <Link href="/admissions">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="shadow-lg hover:shadow-xl"
                  >
                    Apply Now →
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="hidden lg:block relative animate-fade-in animate-delay-300">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 img-zoom">
                  <Image
                    src={schoolConfig.images.classroom}
                    alt="Classroom learning"
                    width={600}
                    height={400}
                    className="object-cover w-full h-[350px]"
                    priority
                  />
                </div>
                {/* Floating mini image */}
                <div className="absolute -bottom-6 -left-6 rounded-xl overflow-hidden shadow-xl border-4 border-white/20 w-40 h-32 img-zoom">
                  <Image
                    src={schoolConfig.images.students}
                    alt="Students"
                    width={200}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-secondary text-primary-900 px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
                  Est. {schoolConfig.foundedYear}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in-up animate-delay-500">
            {[
              { value: `Est. ${schoolConfig.foundedYear}`, label: "Founded" },
              { value: schoolConfig.studentCount, label: "Students" },
              { value: schoolConfig.staffCount, label: "Staff Members" },
              { value: schoolConfig.becePasses, label: "BECE Pass Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
              >
                <p className="text-2xl lg:text-3xl font-bold text-secondary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path
              d="M0 50L48 45C96 40 192 30 288 33C384 37 480 53 576 58C672 63 768 57 864 48C960 40 1056 28 1152 25C1248 22 1344 28 1392 32L1440 35V100H0V50Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* ─── About Preview ─────────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <SectionHeader
                title="Welcome to Our School"
                subtitle={`A tradition of excellence since ${schoolConfig.foundedYear}`}
                centered={false}
              />
              <p className="text-gray-600 leading-relaxed mb-4">
                At {schoolConfig.name}, we believe every child deserves access
                to quality education. Our dedicated team of educators
                creates an environment where curiosity thrives, character
                develops, and dreams take flight.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From our innovative curriculum aligned with the Ghana Education
                Service standards to our vibrant extracurricular programmes,
                we provide the tools and support students need to
                excel academically and grow personally.
              </p>
              <Link href="/about">
                <Button variant="outline">
                  Discover Our Story →
                </Button>
              </Link>
            </div>
            <div className="relative reveal-right">
              <div className="rounded-2xl overflow-hidden shadow-xl img-zoom">
                <Image
                  src={schoolConfig.images.campus}
                  alt="School campus"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[400px]"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-secondary/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-accent/20 -z-10" />
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

      {/* ─── Programs Preview ──────────────────────────────────── */}
      <section className="section-padding bg-soft">
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
                className="reveal group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
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
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                    {program.title}
                  </h3>
                  <p className="text-xs font-medium text-primary mb-3">
                    {program.grades}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link href="/academics">
              <Button variant="outline">View All Programmes →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <div className="bg-soft">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px]">
          <path d="M0 20C360 45 720 5 1080 25C1260 35 1380 30 1440 20V60H0V20Z" fill="var(--section-warm)" />
        </svg>
      </div>

      {/* ─── Why Choose Us ─────────────────────────────────────── */}
      <section className="section-padding bg-warm">
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
                className="reveal bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Image Banner ──────────────────────────────────────── */}
      <section className="relative h-[300px] lg:h-[400px] overflow-hidden">
        <Image
          src={schoolConfig.images.students}
          alt="School students"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/60 flex items-center justify-center">
          <div className="text-center text-white px-4 reveal-scale">
            <p className="text-lg text-white/80 mb-2">Our Promise</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold max-w-2xl">
              &ldquo;Every child is capable of greatness — we provide the environment for it.&rdquo;
            </h2>
            <p className="text-white/60 mt-4">— {schoolConfig.leadership[0].name}, Head of School</p>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative container-wide py-20 text-center reveal">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Applications for the {schoolConfig.admissions.currentSession} academic
            year are now open. Take the first step towards an exceptional education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admissions">
              <Button variant="secondary" size="lg">
                Start Your Application
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
