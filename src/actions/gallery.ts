"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function addGalleryImage(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const title = formData.get("title") as string;
    const image_url = formData.get("image_url") as string;
    const caption = (formData.get("caption") as string) || null;

    if (!title || !image_url) {
      return { success: false, message: "Title and image are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("gallery")
      .insert({ title, image_url, caption });

    if (error) {
      console.error("Add gallery image error:", error);
      return { success: false, message: "Failed to add image." };
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Image added successfully." };
  } catch (err) {
    console.error("Add gallery image error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("gallery").delete().eq("id", id);

    if (error) {
      console.error("Delete gallery image error:", error);
      return { success: false, message: "Failed to delete image." };
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Image deleted successfully." };
  } catch (err) {
    console.error("Delete gallery image error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getGalleryImages() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch gallery error:", error);
    return [];
  }
  return data || [];
}

export async function uploadFile(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, url: null, message: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, url: null, message: "No file provided." };

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const bucket = formData.get("bucket") as string || "images";

    const adminClient = createAdminClient();
    const { error } = await adminClient.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, url: null, message: "Upload failed." };
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(bucket).getPublicUrl(fileName);

    return { success: true, url: publicUrl, message: "Upload successful." };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, url: null, message: "An unexpected error occurred." };
  }
}
