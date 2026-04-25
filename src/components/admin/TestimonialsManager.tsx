"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveTestimonial,
  deleteTestimonial,
  rejectTestimonial,
  unapproveTestimonial,
} from "@/actions/testimonials";
import { Button } from "@/components/ui/FormElements";
import { Badge, Modal, Toast } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { downloadCsv, toCsv } from "@/lib/csv";
import type { Testimonial } from "@/types";

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
}

type Filter = "all" | "pending" | "approved" | "rejected";

export function TestimonialsManager({
  testimonials,
}: TestimonialsManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("pending");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  }

  async function handleApprove(id: string) {
    setBusyId(id);
    const result = await approveTestimonial(id);
    setBusyId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      if (selected?.id === id) setSelected(null);
      router.refresh();
    }
  }

  async function handleReject(id: string) {
    setBusyId(id);
    const result = await rejectTestimonial(id);
    setBusyId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      if (selected?.id === id) setSelected(null);
      router.refresh();
    }
  }

  async function handleUnapprove(id: string) {
    setBusyId(id);
    const result = await unapproveTestimonial(id);
    setBusyId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      if (selected?.id === id) setSelected(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusyId(deleteId);
    const result = await deleteTestimonial(deleteId);
    setBusyId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (selected?.id === deleteId) setSelected(null);
    setDeleteId(null);
    if (result.success) router.refresh();
  }

  const filtered =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.status === filter);

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;
  const approvedCount = testimonials.filter(
    (t) => t.status === "approved",
  ).length;
  const rejectedCount = testimonials.filter(
    (t) => t.status === "rejected",
  ).length;

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Testimonials</h1>
          <p className="text-sm text-muted mt-1">
            {testimonials.length} total · {pendingCount} pending ·{" "}
            {approvedCount} approved · {rejectedCount} rejected
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportTestimonialsCsv(filtered)}
          disabled={filtered.length === 0}
        >
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "approved", label: `Approved (${approvedCount})` },
            { key: "rejected", label: `Rejected (${rejectedCount})` },
            { key: "all", label: "All" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as Filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-primary text-white"
                : "bg-surface text-muted border border-border hover:bg-background"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-semibold text-text mb-1">No testimonials</p>
          <p className="text-sm text-muted">
            {filter === "all"
              ? "No testimonials submitted yet."
              : `No ${filter} testimonials.`}
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden divide-y divide-border">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 px-6 py-4 hover:bg-background transition-colors cursor-pointer"
              onClick={() => setSelected(t)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-text">
                    {t.author}
                  </p>
                  {t.role && (
                    <span className="text-xs text-muted">· {t.role}</span>
                  )}
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-sm text-muted line-clamp-2">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-xs text-muted mt-1">
                  Submitted {formatDateTime(t.created_at)}
                </p>
              </div>

              <div
                className="flex items-center gap-2 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {t.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="primary"
                    loading={busyId === t.id}
                    onClick={() => handleApprove(t.id)}
                  >
                    Approve
                  </Button>
                )}
                {t.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={busyId === t.id}
                    onClick={() => handleReject(t.id)}
                  >
                    Reject
                  </Button>
                )}
                {t.status === "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={busyId === t.id}
                    onClick={() => handleUnapprove(t.id)}
                  >
                    Unpublish
                  </Button>
                )}
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                  aria-label="Delete testimonial"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Testimonial"
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted">Author</p>
                <p className="text-sm text-text font-medium">
                  {selected.author}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">
                  Relationship to school
                </p>
                <p className="text-sm text-text">
                  {selected.role || <span className="text-muted">—</span>}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Email</p>
                {selected.email ? (
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                ) : (
                  <p className="text-sm text-muted">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Status</p>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Submitted</p>
                <p className="text-sm text-text">
                  {formatDateTime(selected.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">Last updated</p>
                <p className="text-sm text-text">
                  {formatDateTime(selected.updated_at)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted mb-1">Story</p>
              <div className="text-sm text-text bg-background rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
                {selected.quote}
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-border">
              {selected.status !== "approved" && (
                <Button
                  size="sm"
                  loading={busyId === selected.id}
                  onClick={() => handleApprove(selected.id)}
                >
                  Approve
                </Button>
              )}
              {selected.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={busyId === selected.id}
                  onClick={() => handleReject(selected.id)}
                >
                  Reject
                </Button>
              )}
              {selected.status === "approved" && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={busyId === selected.id}
                  onClick={() => handleUnapprove(selected.id)}
                >
                  Unpublish
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setDeleteId(selected.id);
                  setSelected(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Testimonial"
        size="sm"
      >
        <p className="text-sm text-muted mb-6">
          Are you sure you want to permanently delete this testimonial? This
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
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

function StatusBadge({ status }: { status: Testimonial["status"] }) {
  if (status === "approved")
    return <Badge variant="success">Approved</Badge>;
  if (status === "rejected")
    return <Badge variant="danger">Rejected</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

function exportTestimonialsCsv(rows: Testimonial[]) {
  const csv = toCsv(rows as unknown as Record<string, unknown>[], [
    { key: "author", header: "Author" },
    { key: "role", header: "Role" },
    { key: "email", header: "Email" },
    { key: "quote", header: "Story" },
    { key: "status", header: "Status" },
    { key: "created_at", header: "Submitted At" },
  ]);
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCsv(`testimonials-${stamp}.csv`, csv);
}
