import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { schoolConfig } from "@/config/school";

const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/academics", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/admissions", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/news", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/gallery", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? schoolConfig.siteUrl;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  // Best-effort: pull published news slugs from Supabase. If the query
  // fails (missing envs during build, DB unavailable, etc.) we still
  // return the static routes rather than failing the whole sitemap.
  let newsEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("published", true);

    if (data) {
      newsEntries = data.map((post) => ({
        url: `${base}/news/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    }
  } catch {
    // Ignore; sitemap degrades gracefully to static routes only.
  }

  return [...staticEntries, ...newsEntries];
}
