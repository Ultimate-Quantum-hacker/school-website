import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { schoolConfig } from "@/config/school";
import { SectionHeader, Badge, EmptyState } from "@/components/ui/Card";
import { formatDate, truncate } from "@/lib/utils";
import type { Post } from "@/types";

export const metadata: Metadata = {
  title: "News & Announcements",
  description: `Latest news, updates, and announcements from ${schoolConfig.name}.`,
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Post[]) || [];
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="gradient-hero text-white py-24">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4 animate-fade-in">
            News & Announcements
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up">
            Stay updated with the latest happenings at {schoolConfig.name}
          </p>
        </div>
      </section>

      {/* ─── Posts Grid ────────────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          {posts.length === 0 ? (
            <EmptyState
              icon={<span>📰</span>}
              title="No posts yet"
              description="Check back soon for the latest news and announcements from our school."
            />
          ) : (
            <>
              <SectionHeader
                title="Latest Updates"
                subtitle={`${posts.length} post${posts.length !== 1 ? "s" : ""}`}
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Cover Image */}
                      <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-4xl">📰</span>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={
                              post.category === "announcement"
                                ? "warning"
                                : "info"
                            }
                          >
                            {post.category === "announcement"
                              ? "Announcement"
                              : "News"}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed flex-1">
                          {post.excerpt
                            ? truncate(post.excerpt, 120)
                            : truncate(post.content.replace(/<[^>]*>/g, ""), 120)}
                        </p>
                        <div className="mt-4 text-sm font-medium text-primary group-hover:underline">
                          Read more →
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
