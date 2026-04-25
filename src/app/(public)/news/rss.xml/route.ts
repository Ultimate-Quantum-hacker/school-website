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

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getPosts(): Promise<PostRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, title, excerpt, created_at, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(30);
    return (data as PostRow[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Decide whether the caller is a browser (wants HTML) or a feed reader
 * (wants RSS XML). Browsers send `Accept: text/html,...` with html ranked
 * first; feed readers either omit `text/html` entirely or rank
 * application/rss+xml / application/atom+xml above it.
 *
 * The `?format=html` and `?format=xml` query params override detection
 * for testing and view-source verification.
 */
function wantsHtml(request: Request): boolean {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  if (format === "html") return true;
  if (format === "xml") return false;

  const accept = request.headers.get("accept") ?? "";
  if (!accept) return false;

  // Parse Accept into [type, q] pairs.
  const entries = accept.split(",").map((part) => {
    const [type, ...params] = part.trim().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number(qParam.split("=")[1]) : 1;
    return { type: type.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
  });

  const htmlQ = entries.find((e) => e.type === "text/html")?.q ?? 0;
  if (htmlQ === 0) return false;

  const feedTypes = new Set([
    "application/rss+xml",
    "application/atom+xml",
    "application/rdf+xml",
  ]);
  const feedQ = Math.max(
    0,
    ...entries.filter((e) => feedTypes.has(e.type)).map((e) => e.q),
  );

  // Tie goes to HTML — feed readers that explicitly want RSS rank it
  // strictly above text/html.
  return htmlQ >= feedQ;
}

function renderRss(posts: PostRow[], base: string): string {
  const feedUrl = `${base}/news/rss.xml`;
  const siteUrl = `${base}/news`;
  const lastBuild = new Date(
    posts[0]?.updated_at ?? posts[0]?.created_at ?? Date.now(),
  ).toUTCString();

  const items = posts
    .map((p) => {
      const link = `${base}/news/${p.slug}`;
      const pubDate = new Date(p.created_at).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        p.excerpt
          ? `      <description>${escapeXml(p.excerpt)}</description>`
          : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(schoolConfig.name)} — News</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(
      `Latest news and announcements from ${schoolConfig.name}.`,
    )}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

function renderHtml(posts: PostRow[], base: string): string {
  const feedUrl = `${base}/news/rss.xml`;
  const siteUrl = `${base}/news`;
  const schoolName = escapeHtml(schoolConfig.name);
  const primary = escapeHtml(schoolConfig.colors?.primary?.DEFAULT ?? "#2563eb");

  const items = posts
    .map((p) => {
      const link = `${base}/news/${p.slug}`;
      const pubDate = new Date(p.created_at).toUTCString();
      const description = p.excerpt
        ? `<p class="description">${escapeHtml(p.excerpt)}</p>`
        : "";
      return `        <article class="item">
          <h2><a href="${escapeHtml(link)}">${escapeHtml(p.title)}</a></h2>
          <time datetime="${escapeHtml(p.created_at)}">${escapeHtml(pubDate)}</time>
          ${description}
        </article>`;
    })
    .join("\n");

  const itemsSection = posts.length
    ? items
    : `        <div class="empty"><p>No items published yet. Check back soon.</p></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${schoolName} — News (RSS Feed)</title>
<meta name="robots" content="noindex" />
<link rel="alternate" type="application/rss+xml" title="${schoolName} News" href="${escapeHtml(feedUrl)}" />
<style>
  :root {
    --primary: ${primary};
    --text: #111827;
    --muted: #6b7280;
    --border: #e5e7eb;
    --surface: #ffffff;
    --bg: #f9fafb;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 2rem 1rem;
    line-height: 1.5;
  }
  .container { max-width: 720px; margin: 0 auto; }
  header {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .badge {
    display: inline-block;
    background: var(--primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  h1 { margin: 0.5rem 0 0.25rem; font-size: 1.75rem; font-weight: 700; }
  .description { color: var(--muted); margin: 0; }
  .hint {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #7c2d12;
  }
  .hint code {
    background: #fed7aa;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
  }
  .items { display: flex; flex-direction: column; gap: 0.75rem; }
  .item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .item:hover {
    border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }
  .item h2 { margin: 0 0 0.25rem; font-size: 1.125rem; font-weight: 600; }
  .item h2 a { color: var(--text); text-decoration: none; }
  .item h2 a:hover { color: var(--primary); }
  .item time { color: var(--muted); font-size: 0.8125rem; }
  .item p.description {
    margin: 0.5rem 0 0;
    color: #374151;
    font-size: 0.9375rem;
  }
  .empty { text-align: center; padding: 3rem 1rem; color: var(--muted); }
  footer {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.8125rem;
    color: var(--muted);
  }
  footer a { color: var(--primary); text-decoration: none; }
</style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge">RSS Feed</span>
      <h1>${schoolName} — News</h1>
      <p class="description">Latest news and announcements from ${schoolName}.</p>
      <div class="hint">
        <strong>Tip:</strong> This is an RSS feed. Paste this page's URL
        (<code>${escapeHtml(feedUrl)}</code>) into a feed reader like Feedly or
        Inoreader to subscribe.
      </div>
    </header>

    <section class="items">
${itemsSection}
    </section>

    <footer>
      <a href="${escapeHtml(siteUrl)}">← Back to ${schoolName}</a>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * News feed at `/news/rss.xml`.
 *
 * Uses content negotiation so the same URL works for both browsers and
 * feed readers without relying on client-side XSLT (which Chrome and
 * Firefox are removing — see
 * https://developer.chrome.com/docs/web-platform/deprecating-xslt):
 *
 * - Browsers (Accept includes `text/html` at higher priority than RSS
 *   types) get a styled HTML page listing the most recent posts with a
 *   subscribe hint.
 * - Feed readers (Accept lists `application/rss+xml` / `atom+xml`, or
 *   omits `text/html`) get plain RSS 2.0 XML.
 * - `?format=xml` and `?format=html` override detection for validators
 *   and manual inspection.
 *
 * Degrades to an empty-but-valid response if Supabase is unreachable.
 */
export async function GET(request: Request): Promise<Response> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? schoolConfig.siteUrl;
  const posts = await getPosts();

  if (wantsHtml(request)) {
    return new Response(renderHtml(posts, base), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        Vary: "Accept",
      },
    });
  }

  return new Response(renderRss(posts, base), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      Vary: "Accept",
    },
  });
}
