import { getAllEventsAdmin } from "@/actions/events";
import { EventsList } from "@/components/admin/EventsManager";

export default async function AdminEventsPage() {
  const events = await getAllEventsAdmin();
  return <EventsList events={events} />;
}
