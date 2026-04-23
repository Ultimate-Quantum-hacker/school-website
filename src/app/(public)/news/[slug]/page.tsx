import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, readingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/FormElements";
import { SharePostButtons } from "@/components/public/SharePostButtons";
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

async function getAdjacentPosts(
  currentCreatedAt: string,
): Promise<{ prev: Post | null; next: Post | null }> {
  try {
    const supabase = await createClient();
    const [{ data: nextRows }, { data: prevRows }] = await Promise.all([
      supabase
        .from("posts")
        .select("id, title, slug, created_at")
        .eq("published", true)
        .gt("created_at", currentCreatedAt)
        .order("created_at", { ascending: true })
        .limit(1),
      supabase
        .from("posts")
        .select("id, title, slug, created_at")
        .eq("published", true)
        .lt("created_at", currentCreatedAt)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);
    return {
      next: (nextRows?.[0] as Post | undefined) ?? null,
      prev: (prevRows?.[0] as Post | undefined) ?? null,
    };
  } catch {
    return { prev: null, next: null };
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
    openGraph: post.cover_image
      ? {
          type: "article",
          title: post.title,
          description: post.excerpt || post.content.substring(0, 160),
          images: [post.cover_image],
          publishedTime: post.created_at,
          modifiedTime: post.updated_at,
        }
      : undefined,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getAdjacentPosts(post.created_at);
  const minutes = readingTime(post.content);

  return (
    <>
      {/* ─── Header ────────────────────────────────────────────── */}
      <section className="border-b border-border py-10">
        <div className="container-wide max-w-4xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors"
          >
            ← Back to News
          </Link>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
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
            <span className="text-sm text-muted">·</span>
            <span className="text-sm text-muted">{minutes} min read</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight animate-fade-in">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ─── Cover Image ───────────────────────────────────────── */}
      {post.cover_image && (
        <div className="container-wide max-w-4xl -mt-6">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
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

          <div className="mt-10 pt-6 border-t border-border">
            <SharePostButtons slug={post.slug} title={post.title} />
          </div>

          {/* Prev / next navigation */}
          {(prev || next) && (
            <nav
              aria-label="Related posts"
              className="mt-10 grid sm:grid-cols-2 gap-4"
            >
              {prev ? (
                <Link
                  href={`/news/${prev.slug}`}
                  className="group block rounded-xl border border-border bg-surface p-5 hover:border-primary transition-colors"
                >
                  <p className="text-xs text-muted mb-1">← Previous</p>
                  <p className="font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/news/${next.slug}`}
                  className="group block rounded-xl border border-border bg-surface p-5 hover:border-primary transition-colors sm:text-right"
                >
                  <p className="text-xs text-muted mb-1">Next →</p>
                  <p className="font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}

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
