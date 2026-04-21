"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/actions/admin";
import { Button, Select } from "@/components/ui/FormElements";
import { Badge, Modal, Toast } from "@/components/ui/Card";
import { formatDate, getStatusColor } from "@/lib/utils";
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

      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">{applications.length} total applications</p>
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
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold text-gray-900 mb-1">No applications found</p>
          <p className="text-sm text-gray-500">
            {filter === "all" ? "No applications have been submitted yet." : `No ${filter} applications.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Student</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Grade</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{app.student_name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{app.grade_applying}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(app.created_at)}</td>
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
                <p className="text-xs font-medium text-gray-500 mb-1">Additional Message</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.message}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">Update Status</p>
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

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}
