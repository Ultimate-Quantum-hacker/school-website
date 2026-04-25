import { getAllEventsAdmin } from "@/actions/events";
import { getAllAcademicCalendarsAdmin } from "@/actions/academic-calendars";
import { EventsList } from "@/components/admin/EventsManager";
import { AcademicCalendarList } from "@/components/admin/AcademicCalendarManager";

export default async function AdminEventsPage() {
  const [events, calendars] = await Promise.all([
    getAllEventsAdmin(),
    getAllAcademicCalendarsAdmin(),
  ]);
  return (
    <>
      <AcademicCalendarList calendars={calendars} />
      <EventsList events={events} />
    </>
  );
}
