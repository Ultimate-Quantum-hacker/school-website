"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/actions/posts";
import { uploadFile } from "@/actions/gallery";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button, Input, Select } from "@/components/ui/FormElements";
import { Badge, Toast, Modal } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

// ─── Posts List ────────────────────────────────────────────────

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const router = useRouter();

  function handleEdit(post: Post) {
    setEditingPost(post);
    setShowEditor(true);
  }

  function handleNew() {
    setEditingPost(null);
    setShowEditor(true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deletePost(deleteId);
    setToast({ show: true, message: result.message, type: result.success ? "success" : "error" });
    setDeleteId(null);
    if (result.success) router.refresh();
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }

  function handleSaved() {
    setShowEditor(false);
    setEditingPost(null);
    router.refresh();
  }

  if (showEditor) {
    return (
      <PostEditor
        post={editingPost}
        onBack={() => { setShowEditor(false); setEditingPost(null); }}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div>
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast(t => ({ ...t, show: false }))} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Posts</h1>
          <p className="text-sm text-muted mt-1">{posts.length} total posts</p>
        </div>
        <Button onClick={handleNew}>+ New Post</Button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-semibold text-text mb-1">No posts yet</p>
          <p className="text-sm text-muted mb-4">Create your first news post or announcement</p>
          <Button onClick={handleNew}>Create First Post</Button>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 font-medium text-muted">Title</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Category</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-muted">Date</th>
                  <th className="text-right px-6 py-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-background transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-text truncate max-w-[250px]">{post.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={post.category === "announcement" ? "warning" : "info"}>
                        {post.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={post.published ? "success" : "default"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(post)} className="text-primary hover:underline text-sm font-medium">
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(post.id)} className="text-red-600 hover:underline text-sm font-medium">
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

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Post" size="sm">
        <p className="text-sm text-muted mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Post Editor ───────────────────────────────────────────────

interface PostEditorProps {
  post: Post | null;
  onBack: () => void;
  onSaved: () => void;
}

function PostEditor({ post, onBack, onSaved }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState<"news" | "announcement">(post?.category || "news");
  const [published, setPublished] = useState(post?.published ?? false);
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("bucket", "images");

    const result = await uploadFile(formData);
    if (result.success && result.url) {
      setCoverImage(result.url);
    } else {
      setToast({ show: true, message: result.message || "Upload failed", type: "error" });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
    }
    setUploadingCover(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("excerpt", excerpt);
    formData.set("category", category);
    formData.set("published", published.toString());
    formData.set("cover_image", coverImage);

    const result = post
      ? await updatePost(post.id, formData)
      : await createPost(formData);

    setToast({ show: true, message: result.message, type: result.success ? "success" : "error" });
    setLoading(false);

    if (result.success) {
      setTimeout(() => onSaved(), 1000);
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  }

  return (
    <div>
      <Toast message={toast.message} type={toast.type} show={toast.show} onClose={() => setToast(t => ({ ...t, show: false }))} />

      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-background text-muted transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">
            {post ? "Edit Post" : "New Post"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
              <Input label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" required />
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Content *</label>
                <RichTextEditor content={content} onChange={setContent} placeholder="Write your post content..." />
              </div>
              <Input label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary (optional)" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-semibold text-text">Settings</h3>
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as "news" | "announcement")}
                options={[
                  { value: "news", label: "News" },
                  { value: "announcement", label: "Announcement" },
                ]}
              />
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100 transition-colors disabled:opacity-50"
                />
                {uploadingCover && <p className="text-xs text-primary mt-1">Uploading...</p>}
                {coverImage && !uploadingCover && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-border h-32">
                    <Image
                      src={coverImage}
                      alt="Cover preview"
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                      title="Remove cover image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <Input label="Or paste image URL" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${published ? "bg-primary" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow transition-transform duration-200 ${published ? "translate-x-5" : ""}`} />
                </button>
                <span className="text-sm text-text">{published ? "Published" : "Draft"}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" loading={loading} className="flex-1">
                {post ? "Update" : "Create"} Post
              </Button>
              <Button type="button" variant="ghost" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
