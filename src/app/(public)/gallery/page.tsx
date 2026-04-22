import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { schoolConfig } from "@/config/school";
import { SectionHeader, EmptyState } from "@/components/ui/Card";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import type { GalleryImage } from "@/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photo gallery showcasing life at ${schoolConfig.name} — events, activities, and campus highlights.`,
};

export const revalidate = 60;

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as GalleryImage[]) || [];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      {/* ─── Page Header ───────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Photo Gallery
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto animate-fade-in-up">
            A glimpse into life at {schoolConfig.name}
          </p>
        </div>
      </section>

      {/* ─── Gallery Grid ──────────────────────────────────────── */}
      <section className="section-padding bg-base">
        <div className="container-wide">
          {images.length === 0 ? (
            <EmptyState
              icon={<span>📷</span>}
              title="Gallery is empty"
              description="Check back soon for photos of our school events and activities."
            />
          ) : (
            <>
              <SectionHeader
                title="Campus Life"
                subtitle={`${images.length} photos`}
              />
              <GalleryGrid images={images} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
