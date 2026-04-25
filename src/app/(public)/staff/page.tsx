import type { Metadata } from "next";
import Image from "next/image";
import { schoolConfig } from "@/config/school";
import { SectionHeader } from "@/components/ui/Card";
import { getPublishedStaff } from "@/actions/staff";
import { staffDirectoryFromRows } from "@/lib/staff";
import { getSiteSettings } from "@/actions/site-settings";

export const metadata: Metadata = {
  title: "Staff Directory",
  description: `Meet the teaching and administrative staff of ${schoolConfig.name} — grouped by department.`,
};

export const revalidate = 60;

export default async function StaffPage() {
  const [rows, settings] = await Promise.all([
    getPublishedStaff(),
    getSiteSettings(),
  ]);
  const directory = staffDirectoryFromRows(rows);

  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="border-b border-border py-14 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={schoolConfig.images.classroom}
            alt=""
            fill
            className="object-cover opacity-15"
            sizes="100vw"
            aria-hidden
          />
        </div>
        <div className="relative container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Our Staff
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up">
            The teachers, specialists, and administrators who make{" "}
            {schoolConfig.name} the community it is.
          </p>
        </div>
      </section>

      {/* ─── Departments ───────────────────────────────────────── */}
      {directory.map((dept, idx) => (
        <section
          key={dept.department}
          className={
            idx % 2 === 0
              ? "section-padding bg-base"
              : "section-padding bg-soft"
          }
        >
          <div className="container-wide">
            <div className="reveal">
              <SectionHeader
                title={dept.department}
                subtitle={`${dept.members.length} ${dept.members.length === 1 ? "member" : "members"}`}
              />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {dept.members.map((member) => (
                <article
                  key={`${dept.department}-${member.name}`}
                  className="reveal bg-surface rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="aspect-[4/3] overflow-hidden img-zoom relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="section-padding bg-warm">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Interested in joining our team?
          </h2>
          <p className="text-muted mb-6">
            We&apos;re always looking for passionate educators. Send your CV and
            a short note to{" "}
            <a
              href={`mailto:${settings.contact.email}`}
              className="text-primary hover:underline font-medium"
            >
              {settings.contact.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
