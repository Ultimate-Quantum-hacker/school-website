"use server";

import { createClient } from "@/lib/supabase/server";

export type SearchResult =
  | {
      kind: "post";
      id: string;
      title: string;
      excerpt: string | null;
      slug: string;
      category: "news" | "announcement";
      created_at: string;
    }
  | {
      kind: "gallery";
      id: string;
      title: string;
      caption: string | null;
      image_url: string;
    }
  | {
      kind: "event";
      id: string;
      title: string;
      description: string | null;
      starts_at: string;
      location: string | null;
    };

const MAX_PER_TYPE = 5;

export async function search(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  // Strip PostgREST/LIKE metacharacters so user input cannot break the .or()
  // filter string (commas/parens split the expression) or inject wildcards.
  const pattern = `%${q.replace(/[%_,()]/g, "")}%`;

  try {
    const supabase = await createClient();

    const [posts, gallery, events] = await Promise.all([
      supabase
        .from("posts")
        .select("id, title, slug, excerpt, category, created_at")
        .eq("published", true)
        .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(MAX_PER_TYPE),
      supabase
        .from("gallery")
        .select("id, title, caption, image_url")
        .or(`title.ilike.${pattern},caption.ilike.${pattern}`)
        .limit(MAX_PER_TYPE),
      supabase
        .from("events")
        .select("id, title, description, starts_at, location")
        .eq("published", true)
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .order("starts_at", { ascending: true })
        .limit(MAX_PER_TYPE),
    ]);

    const out: SearchResult[] = [];
    for (const p of posts.data ?? []) {
      out.push({
        kind: "post",
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        slug: p.slug,
        category: p.category,
        created_at: p.created_at,
      });
    }
    for (const g of gallery.data ?? []) {
      out.push({
        kind: "gallery",
        id: g.id,
        title: g.title,
        caption: g.caption,
        image_url: g.image_url,
      });
    }
    for (const e of events.data ?? []) {
      out.push({
        kind: "event",
        id: e.id,
        title: e.title,
        description: e.description,
        starts_at: e.starts_at,
        location: e.location,
      });
    }
    return out;
  } catch {
    return [];
  }
}
