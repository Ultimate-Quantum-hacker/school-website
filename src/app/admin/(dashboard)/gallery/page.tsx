import { getGalleryImages } from "@/actions/gallery";
import { GalleryManager } from "@/components/admin/GalleryManager";
import type { GalleryImage } from "@/types";

export default async function AdminGalleryPage() {
  const images = (await getGalleryImages()) as GalleryImage[];

  return <GalleryManager images={images} />;
}
