"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, deleteEvent, updateEvent } from "@/actions/events";
import { Button, Input, Select, Textarea } from "@/components/ui/FormElements";
import { Badge, Modal, Toast } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import type { Event } from "@/types";

interface EventsListProps {
  events: Event[];
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function EventsList({ events }: EventsListProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Event | null | "new">(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [saving, setSaving] = useState(false);

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const result =
      editing && editing !== "new"
        ? await updateEvent(editing.id, form)
        : await createEvent(form);
    setSaving(false);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      setEditing(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteEvent(deleteId);
    setDeleteId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) router.refresh();
  }

  const current = editing === "new" ? null : editing;

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Events</h1>
          <p className="text-sm text-muted mt-1">
            {events.length} total events
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>+ New Event</Button>
      </div>

      {events.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-semibold text-text mb-1">No events yet</p>
          <p className="text-sm text-muted mb-4">
            Add your first event so parents can see what&apos;s coming up.
          </p>
          <Button onClick={() => setEditing("new")}>Create First Event</Button>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 font-medium text-muted">Title</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Category</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Starts</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr
                    key={evt.id}
                    className="border-b border-gray-50 hover:bg-background transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-text truncate max-w-[260px]">
                        {evt.title}
                      </p>
                      {evt.location && (
                        <p className="text-xs text-muted">{evt.location}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{evt.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {formatDateTime(evt.starts_at)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={evt.published ? "success" : "default"}>
                        {evt.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(evt)}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(evt.id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / create modal */}
      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={current ? "Edit event" : "New event"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title *"
            name="title"
            defaultValue={current?.title ?? ""}
            required
          />
          <Textarea
            label="Description"
            name="description"
            rows={3}
            defaultValue={current?.description ?? ""}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Starts at *"
              name="starts_at"
              type="datetime-local"
              defaultValue={toLocalInput(current?.starts_at ?? null)}
              required
            />
            <Input
              label="Ends at"
              name="ends_at"
              type="datetime-local"
              defaultValue={toLocalInput(current?.ends_at ?? null)}
            />
          </div>
          <Input
            label="Location"
            name="location"
            defaultValue={current?.location ?? ""}
            placeholder="Main Hall"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              defaultValue={current?.category ?? "event"}
              options={[
                { value: "event", label: "Event" },
                { value: "holiday", label: "Holiday" },
                { value: "exam", label: "Exam" },
                { value: "meeting", label: "Meeting" },
              ]}
            />
            <Select
              label="Status"
              name="published"
              defaultValue={current?.published === false ? "false" : "true"}
              options={[
                { value: "true", label: "Published" },
                { value: "false", label: "Draft" },
              ]}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {current ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete event?"
        size="sm"
      >
        <p className="text-sm text-muted mb-6">
          This will permanently remove the event. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
