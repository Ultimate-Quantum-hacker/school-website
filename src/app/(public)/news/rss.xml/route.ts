import { createClient } from "@/lib/supabase/server";
import { schoolConfig } from "@/config/school";

export const revalidate = 300;

interface PostRow {
  slug: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  updated_at: string | null;
}

function escape(xml: string): string {
  return xml
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed of the most recent 30 published news posts.
 *
 * Served at `/news/rss.xml`. Content is regenerated at most every 5
 * minutes (see `revalidate`). Degrades to an empty-but-valid feed if
 * Supabase is unreachable rather than 5xx-ing, so subscribers never
 * see their feed "break".
 */
export async function GET(): Promise<Response> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? schoolConfig.siteUrl;
  const feedUrl = `${base}/news/rss.xml`;
  const siteUrl = `${base}/news`;

  let posts: PostRow[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, title, excerpt, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) posts = data as PostRow[];
  } catch {
    posts = [];
  }

  const lastBuild = new Date(
    posts[0]?.updated_at ?? posts[0]?.created_at ?? Date.now(),
  ).toUTCString();

  const items = posts
    .map((p) => {
      const link = `${base}/news/${p.slug}`;
      const pubDate = new Date(p.created_at).toUTCString();
      return [
        "    <item>",
        `      <title>${escape(p.title)}</title>`,
        `      <link>${escape(link)}</link>`,
        `      <guid isPermaLink="true">${escape(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        p.excerpt
          ? `      <description>${escape(p.excerpt)}</description>`
          : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(schoolConfig.name)} — News</title>
    <link>${escape(siteUrl)}</link>
    <description>${escape(
      `Latest news and announcements from ${schoolConfig.name}.`,
    )}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escape(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
