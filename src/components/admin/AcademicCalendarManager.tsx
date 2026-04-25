"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAcademicCalendar,
  upsertAcademicCalendar,
  uploadCalendarPdf,
} from "@/actions/academic-calendars";
import { Button, Input, Select } from "@/components/ui/FormElements";
import { Badge, Modal, Toast } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { AcademicCalendar } from "@/types";

interface AcademicCalendarListProps {
  calendars: AcademicCalendar[];
}

const TERM_OPTIONS = [
  { value: "1", label: "Term 1" },
  { value: "2", label: "Term 2" },
  { value: "3", label: "Term 3" },
];

function defaultAcademicYear(): string {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 7 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
}

export function AcademicCalendarList({ calendars }: AcademicCalendarListProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<AcademicCalendar | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteAcademicCalendar(deleteId);
    setDeleteId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) router.refresh();
  }

  const current = editing === "new" ? null : editing;

  return (
    <div className="bg-surface rounded-xl border border-border p-6 mb-8">
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text">Academic Calendar</h2>
          <p className="text-sm text-muted mt-0.5">
            Upload a PDF per term. One PDF per (year, term) — uploading again
            replaces the previous one.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>+ Upload PDF</Button>
      </div>

      {calendars.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-3xl mb-2">📄</p>
          <p className="text-sm font-medium text-text">No calendars uploaded</p>
          <p className="text-xs text-muted mt-1">
            Add the termly academic calendar so parents can download it from
            the public Events page.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="text-left py-2 font-medium">Year</th>
                <th className="text-left py-2 font-medium">Term</th>
                <th className="text-left py-2 font-medium">Title</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Updated</th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calendars.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-50 hover:bg-background transition-colors"
                >
                  <td className="py-3 text-text">{c.academic_year}</td>
                  <td className="py-3">
                    <Badge variant="info">Term {c.term}</Badge>
                  </td>
                  <td className="py-3 text-text">
                    {c.title || <span className="text-muted">—</span>}
                  </td>
                  <td className="py-3">
                    <Badge variant={c.published ? "success" : "default"}>
                      {c.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted">{formatDate(c.updated_at)}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a
                        href={c.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View PDF
                      </a>
                      <button
                        onClick={() => setEditing(c)}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
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
      )}

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={current ? "Edit academic calendar" : "Upload academic calendar"}
        size="md"
      >
        <CalendarForm
          key={current?.id ?? "new"}
          initial={current}
          onCancel={() => setEditing(null)}
          onSaved={(msg) => {
            showToast(msg, "success");
            setEditing(null);
            router.refresh();
          }}
          onError={(msg) => showToast(msg, "error")}
        />
      </Modal>

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete calendar?"
        size="sm"
      >
        <p className="text-sm text-muted mb-6">
          This will permanently remove this term&apos;s calendar PDF from the
          public Events page.
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

interface CalendarFormProps {
  initial: AcademicCalendar | null;
  onCancel: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
}

function CalendarForm({
  initial,
  onCancel,
  onSaved,
  onError,
}: CalendarFormProps) {
  const [academicYear, setAcademicYear] = useState(
    initial?.academic_year ?? defaultAcademicYear(),
  );
  const [term, setTerm] = useState(String(initial?.term ?? 1));
  const [title, setTitle] = useState(initial?.title ?? "");
  const [pdfUrl, setPdfUrl] = useState(initial?.pdf_url ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadCalendarPdf(fd);
    if (result.success && result.url) {
      setPdfUrl(result.url);
    } else {
      onError(result.message || "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.set("academic_year", academicYear);
    fd.set("term", term);
    fd.set("title", title);
    fd.set("pdf_url", pdfUrl);
    fd.set("published", published ? "true" : "false");

    const result = await upsertAcademicCalendar(fd);
    setSaving(false);
    if (result.success) {
      onSaved(result.message);
    } else {
      onError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Academic Year *"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          placeholder="2025/2026"
          required
        />
        <Select
          label="Term *"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          options={TERM_OPTIONS}
          required
        />
      </div>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Term 1 Academic Calendar (optional)"
      />

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          PDF *
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-colors disabled:opacity-50"
        />
        {uploading && (
          <p className="text-xs text-primary mt-1">Uploading...</p>
        )}
        {pdfUrl && !uploading && (
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-muted">Current:</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {pdfUrl.split("/").pop()}
            </a>
            <button
              type="button"
              onClick={() => setPdfUrl("")}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <Input
        label="Or paste PDF URL"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        placeholder="https://..."
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPublished(!published)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            published ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow transition-transform duration-200 ${
              published ? "translate-x-5" : ""
            }`}
          />
        </button>
        <span className="text-sm text-text">
          {published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={!pdfUrl}>
          {initial ? "Save Changes" : "Upload Calendar"}
        </Button>
      </div>
    </form>
  );
}
