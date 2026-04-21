import type { Metadata } from "next";
import Image from "next/image";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";
import { ApplicationForm } from "@/components/public/ApplicationForm";

export const metadata: Metadata = {
  title: "Admissions",
  description: `Apply to ${schoolConfig.name}. Learn about our admission process, requirements, and submit your application online.`,
};

export default function AdmissionsPage() {
  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="relative gradient-hero text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={schoolConfig.images.students}
            alt="Students"
            fill
            className="object-cover opacity-15"
            sizes="100vw"
          />
        </div>
        <div className="relative container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4 animate-fade-in">
            Admissions
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up">
            Begin your journey with {schoolConfig.name} — Applications open for{" "}
            {schoolConfig.admissions.currentSession}
          </p>
        </div>
      </section>

      {/* ─── Admission Process ─────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Admission Process"
              subtitle="A simple, transparent process to join our school community"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 stagger-children">
            {[
              {
                step: "01",
                title: "Submit Application",
                desc: "Fill out our online application form with student and parent/guardian information.",
              },
              {
                step: "02",
                title: "Document Review",
                desc: "Our admissions team reviews your application, previous report cards, and supporting documents.",
              },
              {
                step: "03",
                title: "Assessment & Interview",
                desc: "Students complete an age-appropriate placement assessment. Parents meet with the Head of Admissions.",
              },
              {
                step: "04",
                title: "Enrollment",
                desc: "Accepted students receive an admission letter to complete their enrollment and pay fees.",
              },
            ].map((item) => (
              <div key={item.step} className="relative reveal">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <div className="bg-base">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px]">
          <path d="M0 30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0V30Z" fill="var(--section-alt)" />
        </svg>
      </div>

      {/* ─── Requirements ──────────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Requirements"
              subtitle="What you'll need to prepare for your application"
            />
          </div>
          <div className="max-w-2xl mx-auto reveal">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <ul className="space-y-4">
                {[
                  "Completed application form (below)",
                  "Copy of student's birth certificate",
                  "Recent passport-sized photographs (2)",
                  "Last academic report card / terminal report",
                  "Immunization / health records (GHS card)",
                  "Copy of parent/guardian Ghana Card or valid ID",
                  "Application processing fee (payable upon submission)",
                ].map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Fee Structure Hint ────────────────────────────────── */}
      <section className="section-padding bg-warm">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="reveal-left">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                School Fees & Financial Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We strive to make quality education accessible. Our fees are
                competitive and cover tuition, textbooks, ICT access, and
                co-curricular activities. Payment plans are available to
                support families.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                For a detailed fee schedule, please contact our admissions
                office or visit the school in person. We are happy to discuss
                options that work for your family.
              </p>
              <a href={`tel:${schoolConfig.contact.phone}`}>
                <span className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Admissions: {schoolConfig.contact.phone}
                </span>
              </a>
            </div>
            <div className="reveal-right">
              <div className="rounded-2xl overflow-hidden shadow-lg img-zoom">
                <Image
                  src={schoolConfig.images.campus}
                  alt="School campus"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Application Form ──────────────────────────────────── */}
      <section className="section-padding bg-base" id="apply">
        <div className="container-wide">
          <div className="reveal">
            <SectionHeader
              title="Online Application"
              subtitle="Fill out the form below to begin your application"
            />
          </div>
          <div className="max-w-3xl mx-auto reveal">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
