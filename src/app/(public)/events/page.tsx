import type { Metadata } from "next";
import { getUpcomingEvents } from "@/actions/events";
import { getPublishedAcademicCalendars } from "@/actions/academic-calendars";
import { schoolConfig } from "@/config/school";
import { SectionHeader, Badge, EmptyState } from "@/components/ui/Card";
import type { AcademicCalendar, Event } from "@/types";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description: `Upcoming events, holidays, and important dates at ${schoolConfig.name}.`,
};

export const revalidate = 300;

const CATEGORY_META: Record<
  Event["category"],
  { label: string; variant: "default" | "info" | "success" | "warning"; icon: string }
> = {
  event: { label: "Event", variant: "info", icon: "🎉" },
  holiday: { label: "Holiday", variant: "success", icon: "🌴" },
  exam: { label: "Exam", variant: "warning", icon: "📝" },
  meeting: { label: "Meeting", variant: "default", icon: "👥" },
};

function formatRange(start: string, end: string | null): string {
  const s = new Date(start);
  const fmtDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const fmtTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!end) return `${fmtDate.format(s)} · ${fmtTime.format(s)}`;
  const e = new Date(end);
  const sameDay =
    s.getFullYear() === e.getFullYear() &&
    s.getMonth() === e.getMonth() &&
    s.getDate() === e.getDate();
  if (sameDay) {
    return `${fmtDate.format(s)} · ${fmtTime.format(s)} – ${fmtTime.format(e)}`;
  }
  return `${fmtDate.format(s)} → ${fmtDate.format(e)}`;
}

function groupByMonth(events: Event[]): Record<string, Event[]> {
  return events.reduce<Record<string, Event[]>>((acc, evt) => {
    const d = new Date(evt.starts_at);
    const key = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    (acc[key] ??= []).push(evt);
    return acc;
  }, {});
}

function groupCalendarsByYear(
  calendars: AcademicCalendar[],
): [string, AcademicCalendar[]][] {
  const map = new Map<string, AcademicCalendar[]>();
  for (const c of calendars) {
    const list = map.get(c.academic_year) ?? [];
    list.push(c);
    map.set(c.academic_year, list);
  }
  return Array.from(map.entries()).map(([year, list]) => [
    year,
    list.sort((a, b) => a.term - b.term),
  ]);
}

export default async function EventsPage() {
  const [events, calendars] = await Promise.all([
    getUpcomingEvents(),
    getPublishedAcademicCalendars(),
  ]);
  const grouped = groupByMonth(events);
  const calendarsByYear = groupCalendarsByYear(calendars);

  return (
    <>
      <section className="border-b border-border py-10 sm:py-14">
        <div className="container-wide text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Events & Calendar
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up">
            Stay up to date with open days, parent meetings, holidays, and BECE
            milestones.
          </p>
        </div>
      </section>

      {calendarsByYear.length > 0 && (
        <section className="section-padding bg-soft border-b border-border">
          <div className="container-wide max-w-4xl">
            <SectionHeader
              title="Academic Calendar"
              subtitle="Download the termly academic calendar PDF."
            />
            <div className="space-y-8">
              {calendarsByYear.map(([year, list]) => (
                <div key={year}>
                  <h3 className="text-lg font-semibold text-text mb-3">
                    {year}
                  </h3>
                  <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {list.map((c) => (
                      <li key={c.id}>
                        <a
                          href={c.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text">
                              {c.title || `Term ${c.term} Calendar`}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              PDF · Download
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-base">
        <div className="container-wide max-w-4xl">
          {events.length === 0 ? (
            <EmptyState
              icon={<span>📅</span>}
              title="No upcoming events"
              description="Check back soon — new events are added throughout the term."
            />
          ) : (
            <>
              <SectionHeader
                title="Upcoming Schedule"
                subtitle={`${events.length} upcoming event${events.length !== 1 ? "s" : ""}`}
              />
              <div className="space-y-12">
                {Object.entries(grouped).map(([month, list]) => (
                  <div key={month}>
                    <h2 className="text-xl font-semibold text-text mb-4">
                      {month}
                    </h2>
                    <ul className="space-y-3">
                      {list.map((evt) => {
                        const meta = CATEGORY_META[evt.category];
                        const d = new Date(evt.starts_at);
                        return (
                          <li
                            key={evt.id}
                            className="flex gap-4 items-start bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                          >
                            <div className="flex-shrink-0 w-14 text-center rounded-lg bg-primary/10 text-primary py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wide">
                                {d.toLocaleDateString("en-US", {
                                  month: "short",
                                })}
                              </p>
                              <p className="text-xl font-bold leading-none">
                                {d.getDate()}
                              </p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge variant={meta.variant}>
                                  {meta.icon} {meta.label}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-text">
                                {evt.title}
                              </h3>
                              <p className="text-sm text-muted mt-0.5">
                                {formatRange(evt.starts_at, evt.ends_at)}
                                {evt.location ? ` · ${evt.location}` : ""}
                              </p>
                              {evt.description && (
                                <p className="text-sm text-muted mt-2 leading-relaxed">
                                  {evt.description}
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
