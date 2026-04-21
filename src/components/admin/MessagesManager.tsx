"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markMessageRead, deleteMessage } from "@/actions/admin";
import { Button } from "@/components/ui/FormElements";
import { Badge, Modal, Toast } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import type { Message } from "@/types";

interface MessagesManagerProps {
  messages: Message[];
}

export function MessagesManager({ messages }: MessagesManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }

  async function handleOpen(msg: Message) {
    setSelected(msg);
    if (!msg.read) {
      await markMessageRead(msg.id, true);
      router.refresh();
    }
  }

  async function handleToggleRead(id: string, currentRead: boolean) {
    const result = await markMessageRead(id, !currentRead);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteMessage(deleteId);
    showToast(result.message, result.success ? "success" : "error");
    setDeleteId(null);
    if (selected?.id === deleteId) setSelected(null);
    if (result.success) router.refresh();
  }

  const filtered =
    filter === "all"
      ? messages
      : filter === "unread"
        ? messages.filter(m => !m.read)
        : messages.filter(m => m.read);

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast(t => ({ ...t, show: false }))} />

      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          {messages.length} total · {unreadCount} unread
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">✉️</p>
          <p className="font-semibold text-gray-900 mb-1">No messages</p>
          <p className="text-sm text-gray-500">
            {filter === "all" ? "No messages received yet." : `No ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpen(msg)}
              className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !msg.read ? "bg-primary-50/30" : ""
              }`}
            >
              {/* Read indicator */}
              <div className="pt-1.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    msg.read ? "bg-gray-200" : "bg-primary"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm truncate ${!msg.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                    {msg.name}
                  </p>
                  {!msg.read && <Badge variant="info">New</Badge>}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {msg.subject || "(No subject)"}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {msg.message.substring(0, 100)}...
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDateTime(msg.created_at)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">From</p>
                <p className="text-sm text-gray-900 font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Email</p>
                <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">{selected.email}</a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Subject</p>
                <p className="text-sm text-gray-900">{selected.subject || "(No subject)"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Received</p>
                <p className="text-sm text-gray-900">{formatDateTime(selected.created_at)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Message</p>
              <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleRead(selected.id, selected.read)}
              >
                Mark as {selected.read ? "Unread" : "Read"}
              </Button>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}`}>
                  <Button variant="outline" size="sm">Reply via Email</Button>
                </a>
                <Button variant="danger" size="sm" onClick={() => { setDeleteId(selected.id); setSelected(null); }}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Message" size="sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this message?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
