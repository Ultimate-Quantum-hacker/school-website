"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addGalleryImage, deleteGalleryImage, uploadFile } from "@/actions/gallery";
import { Button, Input } from "@/components/ui/FormElements";
import { Modal, Toast } from "@/components/ui/Card";
import type { GalleryImage } from "@/types";

interface GalleryManagerProps {
  images: GalleryImage[];
}

export function GalleryManager({ images }: GalleryManagerProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("bucket", "images");

    const result = await uploadFile(formData);
    if (result.success && result.url) {
      setImageUrl(result.url);
      if (!title) setTitle(file.name.split(".")[0].replace(/[-_]/g, " "));
    } else {
      showToast(result.message || "Upload failed", "error");
    }
    setUploading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !imageUrl) return;
    setSaving(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("image_url", imageUrl);
    formData.set("caption", caption);

    const result = await addGalleryImage(formData);
    showToast(result.message, result.success ? "success" : "error");

    if (result.success) {
      setShowAdd(false);
      setTitle("");
      setCaption("");
      setImageUrl("");
      router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteGalleryImage(deleteId);
    showToast(result.message, result.success ? "success" : "error");
    setDeleteId(null);
    if (result.success) router.refresh();
  }

  return (
    <div>
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast(t => ({ ...t, show: false }))} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">{images.length} images</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Image</Button>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="font-semibold text-gray-900 mb-1">No images yet</p>
          <p className="text-sm text-gray-500 mb-4">Upload your first gallery image</p>
          <Button onClick={() => setShowAdd(true)}>Upload Image</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img src={image.image_url} alt={image.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{image.title}</p>
                {image.caption && <p className="text-xs text-gray-500 truncate mt-0.5">{image.caption}</p>}
              </div>
              <button
                onClick={() => setDeleteId(image.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Gallery Image" size="md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-colors"
            />
            {uploading && <p className="text-xs text-primary mt-1">Uploading...</p>}
          </div>
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}
          <Input label="Or paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          <Input label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title" required />
          <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional caption" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" loading={saving} disabled={!imageUrl || !title}>Add Image</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Image" size="sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this image?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
