import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/FormElements";
import type { Post } from "@/types";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) return null;
    return data as Post;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* ─── Header ────────────────────────────────────────────── */}
      <section className="border-b border-border py-10">
        <div className="container-wide max-w-4xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-white mb-6 transition-colors"
          >
            ← Back to News
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant={
                post.category === "announcement" ? "warning" : "info"
              }
            >
              {post.category === "announcement" ? "Announcement" : "News"}
            </Badge>
            <span className="text-sm text-muted">
              {formatDate(post.created_at)}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight animate-fade-in">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ─── Cover Image ───────────────────────────────────────── */}
      {post.cover_image && (
        <div className="container-wide max-w-4xl -mt-6">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ─── Content ───────────────────────────────────────────── */}
      <section className="section-padding bg-surface">
        <div className="container-wide max-w-4xl">
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/news">
              <Button variant="outline">← Back to All News</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
