import { schoolConfig } from "@/config/school";

/**
 * XSL stylesheet served at `/news/rss.xsl`. When a browser (not a feed reader)
 * loads `/news/rss.xml`, it applies this stylesheet and renders a friendly
 * HTML page instead of raw XML. Feed readers ignore the stylesheet entirely.
 */
export async function GET(): Promise<Response> {
  const schoolName = escape(schoolConfig.name);
  const primary = escape(schoolConfig.colors?.primary?.DEFAULT ?? "#2563eb");

  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">

  <xsl:output method="html" encoding="UTF-8" indent="yes"
    doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="/rss/channel/title" /> (RSS Feed)</title>
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
          h1 {
            margin: 0.5rem 0 0.25rem;
            font-size: 1.75rem;
            font-weight: 700;
          }
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
          .item h2 {
            margin: 0 0 0.25rem;
            font-size: 1.125rem;
            font-weight: 600;
          }
          .item h2 a {
            color: var(--text);
            text-decoration: none;
          }
          .item h2 a:hover { color: var(--primary); }
          .item time { color: var(--muted); font-size: 0.8125rem; }
          .item p.description {
            margin: 0.5rem 0 0;
            color: #374151;
            font-size: 0.9375rem;
          }
          .empty {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--muted);
          }
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
            <h1><xsl:value-of select="/rss/channel/title" /></h1>
            <p class="description">
              <xsl:value-of select="/rss/channel/description" />
            </p>
            <div class="hint">
              <strong>Tip:</strong> This is an RSS feed. Paste this page's URL
              (<code><xsl:value-of select="/rss/channel/atom:link/@href" /></code>)
              into a feed reader like Feedly or Inoreader to subscribe.
            </div>
          </header>

          <section class="items">
            <xsl:choose>
              <xsl:when test="/rss/channel/item">
                <xsl:for-each select="/rss/channel/item">
                  <article class="item">
                    <h2>
                      <a>
                        <xsl:attribute name="href">
                          <xsl:value-of select="link" />
                        </xsl:attribute>
                        <xsl:value-of select="title" />
                      </a>
                    </h2>
                    <time>
                      <xsl:value-of select="pubDate" />
                    </time>
                    <xsl:if test="description">
                      <p class="description">
                        <xsl:value-of select="description" />
                      </p>
                    </xsl:if>
                  </article>
                </xsl:for-each>
              </xsl:when>
              <xsl:otherwise>
                <div class="empty">
                  <p>No items published yet. Check back soon.</p>
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </section>

          <footer>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link" />
              </xsl:attribute>
              ← Back to ${schoolName}
            </a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  return new Response(xsl, {
    headers: {
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
