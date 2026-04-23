"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/actions/admin";
import { Button } from "@/components/ui/FormElements";
import { Modal, Toast } from "@/components/ui/Card";
import { formatDate, getStatusColor } from "@/lib/utils";
import { downloadCsv, toCsv } from "@/lib/csv";
import type { Application } from "@/types";

interface ApplicationsManagerProps {
  applications: Application[];
}

export function ApplicationsManager({ applications }: ApplicationsManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Application | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [filter, setFilter] = useState("all");

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }

  async function handleStatusChange(id: string, status: string) {
    const result = await updateApplicationStatus(id, status);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) router.refresh();
  }

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    reviewed: applications.filter(a => a.status === "reviewed").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  return (
    <div>
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast(t => ({ ...t, show: false }))} />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Applications</h1>
          <p className="text-sm text-muted mt-1">{applications.length} total applications</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportApplicationsCsv(filtered)}
          disabled={filtered.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "reviewed", "accepted", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-primary text-white"
                : "bg-surface text-muted border border-border hover:bg-background"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold text-text mb-1">No applications found</p>
          <p className="text-sm text-muted">
            {filter === "all" ? "No applications have been submitted yet." : `No ${filter} applications.`}
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 font-medium text-muted">Student</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Grade</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Date</th>
                  <th className="text-right px-6 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-background transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-text">{app.student_name}</p>
                      <p className="text-xs text-muted">{app.email}</p>
                    </td>
                    <td className="px-6 py-4 text-muted">{app.grade_applying}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">{formatDate(app.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelected(app)} className="text-primary hover:underline text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Application Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <DetailField label="Student Name" value={selected.student_name} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.phone || "—"} />
              <DetailField label="Date of Birth" value={selected.date_of_birth || "—"} />
              <DetailField label="Guardian Name" value={selected.guardian_name || "—"} />
              <DetailField label="Guardian Phone" value={selected.guardian_phone || "—"} />
              <DetailField label="Grade Applying" value={selected.grade_applying} />
              <DetailField label="Previous School" value={selected.previous_school || "—"} />
            </div>
            {selected.message && (
              <div>
                <p className="text-xs font-medium text-muted mb-1">Additional Message</p>
                <p className="text-sm text-text bg-background rounded-lg p-3">{selected.message}</p>
              </div>
            )}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {["pending", "reviewed", "accepted", "rejected"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selected.status === status ? "primary" : "outline"}
                    onClick={() => {
                      handleStatusChange(selected.id, status);
                      setSelected({ ...selected, status: status as Application["status"] });
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function exportApplicationsCsv(rows: Application[]) {
  const csv = toCsv(rows as unknown as Record<string, unknown>[], [
    { key: "student_name", header: "Student Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "grade_applying", header: "Grade" },
    { key: "guardian_name", header: "Guardian" },
    { key: "guardian_phone", header: "Guardian Phone" },
    { key: "previous_school", header: "Previous School" },
    { key: "status", header: "Status" },
    { key: "created_at", header: "Submitted At" },
  ]);
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCsv(`applications-${stamp}.csv`, csv);
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text">{value}</p>
    </div>
  );
}
