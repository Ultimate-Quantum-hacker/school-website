"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createStaffMember,
  deleteStaffMember,
  reorderStaffMember,
  updateStaffMember,
  uploadStaffPhoto,
} from "@/actions/staff";
import { Button, Input, Select, Textarea } from "@/components/ui/FormElements";
import { Badge, Modal, Toast } from "@/components/ui/Card";
import type { StaffMember } from "@/types";

interface StaffManagerProps {
  members: StaffMember[];
}

const DEFAULT_DEPARTMENTS = [
  "Administration",
  "Junior High School Faculty",
  "Primary Faculty",
  "Specialist Teachers",
];

export function StaffManager({ members }: StaffManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<StaffMember | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const knownDepartments = useMemo(() => {
    const set = new Set<string>(DEFAULT_DEPARTMENTS);
    members.forEach((m) => set.add(m.department));
    return Array.from(set);
  }, [members]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteStaffMember(deleteId);
    setDeleteId(null);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) router.refresh();
  }

  async function handleMove(id: string, direction: "up" | "down") {
    setReorderingId(id);
    const result = await reorderStaffMember(id, direction);
    setReorderingId(null);
    if (!result.success) {
      showToast(result.message, "error");
    } else {
      router.refresh();
    }
  }

  // Group members by leadership / department for display.
  const leaders = members.filter((m) => m.is_leadership);
  const byDepartment = new Map<string, StaffMember[]>();
  for (const m of members) {
    const list = byDepartment.get(m.department) ?? [];
    list.push(m);
    byDepartment.set(m.department, list);
  }

  const current = editing === "new" ? null : editing;

  return (
    <div className="space-y-8">
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-text">Staff</h1>
            <p className="text-sm text-muted mt-1">
              Manage the staff directory and leadership team. Edits appear
              instantly on the public site.
            </p>
          </div>
          <Button onClick={() => setEditing("new")}>+ Add Staff Member</Button>
        </div>
        <p className="text-xs text-muted">
          Tick <span className="font-medium">Show in Leadership</span> to also
          surface a member on the home page leadership grid. Use the up/down
          arrows to reorder within a group.
        </p>
      </div>

      <Group
        title="Leadership"
        subtitle="Members shown on the About page leadership grid."
        members={leaders}
        emptyHint="No leadership members yet. Add one and tick 'Show in Leadership'."
        onEdit={(m) => setEditing(m)}
        onDelete={(id) => setDeleteId(id)}
        onMove={handleMove}
        reorderingId={reorderingId}
      />

      {Array.from(byDepartment.entries()).map(([dept, list]) => (
        <Group
          key={dept}
          title={dept}
          subtitle={`${list.length} ${list.length === 1 ? "member" : "members"} in this department.`}
          members={list}
          emptyHint=""
          onEdit={(m) => setEditing(m)}
          onDelete={(id) => setDeleteId(id)}
          onMove={handleMove}
          reorderingId={reorderingId}
        />
      ))}

      {members.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center bg-surface">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-sm font-medium text-text">No staff yet</p>
          <p className="text-xs text-muted mt-1">
            Add your first staff member to populate the public Staff page and
            About page leadership grid.
          </p>
        </div>
      )}

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={current ? "Edit staff member" : "Add staff member"}
        size="md"
      >
        <StaffForm
          key={current?.id ?? "new"}
          initial={current}
          knownDepartments={knownDepartments}
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
        title="Delete staff member?"
        size="sm"
      >
        <p className="text-sm text-muted mb-6">
          This will permanently remove this person from the public staff
          directory and (if applicable) the leadership grid.
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

interface GroupProps {
  title: string;
  subtitle: string;
  members: StaffMember[];
  emptyHint: string;
  onEdit: (m: StaffMember) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  reorderingId: string | null;
}

function Group({
  title,
  subtitle,
  members,
  emptyHint,
  onEdit,
  onDelete,
  onMove,
  reorderingId,
}: GroupProps) {
  if (members.length === 0 && !emptyHint) return null;
  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>

      {members.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
          {emptyHint}
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {members.map((m, idx) => (
            <li key={m.id} className="py-3 flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-background border border-border flex-shrink-0">
                {m.image_url ? (
                  <Image
                    src={m.image_url}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-lg">
                    👤
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-text truncate">{m.name}</p>
                  {m.is_leadership && (
                    <Badge variant="info">Leadership</Badge>
                  )}
                  {!m.published && <Badge variant="default">Hidden</Badge>}
                </div>
                <p className="text-sm text-muted truncate">{m.role}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0 || reorderingId === m.id}
                  onClick={() => onMove(m.id, "up")}
                  className="p-1.5 rounded-lg text-muted hover:bg-background hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Move ${m.name} up`}
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={idx === members.length - 1 || reorderingId === m.id}
                  onClick={() => onMove(m.id, "down")}
                  className="p-1.5 rounded-lg text-muted hover:bg-background hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Move ${m.name} down`}
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(m)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(m.id)}
                  className="text-red-600 hover:underline text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface StaffFormProps {
  initial: StaffMember | null;
  knownDepartments: string[];
  onCancel: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
}

function StaffForm({
  initial,
  knownDepartments,
  onCancel,
  onSaved,
  onError,
}: StaffFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [department, setDepartment] = useState(
    initial?.department ?? knownDepartments[0] ?? "Administration",
  );
  const [customDept, setCustomDept] = useState("");
  const [useCustomDept, setUseCustomDept] = useState(false);
  const [isLeadership, setIsLeadership] = useState(
    initial?.is_leadership ?? false,
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadStaffPhoto(fd);
    if (result.success && result.url) {
      setImageUrl(result.url);
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
    fd.set("name", name);
    fd.set("role", role);
    fd.set("bio", bio);
    fd.set("image_url", imageUrl);
    fd.set(
      "department",
      useCustomDept && customDept.trim() ? customDept.trim() : department,
    );
    fd.set("is_leadership", isLeadership ? "true" : "false");
    fd.set("published", published ? "true" : "false");
    fd.set("display_order", String(initial?.display_order ?? 0));

    const result = initial
      ? await updateStaffMember(initial.id, fd)
      : await createStaffMember(fd);
    setSaving(false);
    if (result.success) {
      onSaved(result.message);
    } else {
      onError(result.message);
    }
  }

  const departmentOptions = knownDepartments.map((d) => ({
    value: d,
    label: d,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mrs. Abena Mensah"
          required
        />
        <Input
          label="Role / Title *"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Head of School"
          required
        />
      </div>

      <Textarea
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={3}
        placeholder="Short biography shown under their name."
      />

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-colors disabled:opacity-50"
        />
        {uploading && (
          <p className="text-xs text-primary mt-1">Uploading…</p>
        )}
        {imageUrl && !uploading && (
          <div className="mt-2 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border bg-background">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <Input
        label="Or paste image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://..."
      />

      <div>
        {!useCustomDept ? (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                label="Department *"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={departmentOptions}
              />
            </div>
            <button
              type="button"
              onClick={() => setUseCustomDept(true)}
              className="text-sm text-primary hover:underline mb-2.5"
            >
              + New
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="New department *"
                value={customDept}
                onChange={(e) => setCustomDept(e.target.value)}
                placeholder="e.g. Boarding House Staff"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setUseCustomDept(false);
                setCustomDept("");
              }}
              className="text-sm text-muted hover:underline mb-2.5"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isLeadership}
            onChange={(e) => setIsLeadership(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-text">Show in Leadership</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-text">Published</span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? "Save Changes" : "Add Staff Member"}
        </Button>
      </div>
    </form>
  );
}
