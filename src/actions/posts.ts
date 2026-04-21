"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function createPost(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || null;
    const category = (formData.get("category") as string) || "news";
    const published = formData.get("published") === "true";
    const cover_image = (formData.get("cover_image") as string) || null;

    if (!title || !content) {
      return { success: false, message: "Title and content are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("posts").insert({
      title,
      slug: slugify(title) + "-" + Date.now().toString(36),
      content,
      excerpt,
      category,
      published,
      cover_image,
      author_id: user.id,
    });

    if (error) {
      console.error("Create post error:", error);
      return { success: false, message: "Failed to create post." };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true, message: "Post created successfully." };
  } catch (err) {
    console.error("Create post error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function updatePost(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || null;
    const category = (formData.get("category") as string) || "news";
    const published = formData.get("published") === "true";
    const cover_image = (formData.get("cover_image") as string) || null;

    if (!title || !content) {
      return { success: false, message: "Title and content are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("posts")
      .update({
        title,
        content,
        excerpt,
        category,
        published,
        cover_image,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Update post error:", error);
      return { success: false, message: "Failed to update post." };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true, message: "Post updated successfully." };
  } catch (err) {
    console.error("Update post error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Delete post error:", error);
      return { success: false, message: "Failed to delete post." };
    }

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true, message: "Post deleted successfully." };
  } catch (err) {
    console.error("Delete post error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getPosts() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch posts error:", error);
    return [];
  }
  return data || [];
}

export async function getPost(id: string) {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
