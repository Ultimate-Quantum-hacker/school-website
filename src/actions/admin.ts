"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function getApplications() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch applications error:", error);
    return [];
  }
  return data || [];
}

export async function updateApplicationStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update application status error:", error);
      return { success: false, message: "Failed to update status." };
    }

    revalidatePath("/admin/applications");
    return { success: true, message: `Application marked as ${status}.` };
  } catch (err) {
    console.error("Update application status error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getMessages() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch messages error:", error);
    return [];
  }
  return data || [];
}

export async function markMessageRead(
  id: string,
  read: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("messages")
      .update({ read })
      .eq("id", id);

    if (error) {
      console.error("Mark message error:", error);
      return { success: false, message: "Failed to update message." };
    }

    revalidatePath("/admin/messages");
    return {
      success: true,
      message: read ? "Marked as read." : "Marked as unread.",
    };
  } catch (err) {
    console.error("Mark message error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete message error:", error);
      return { success: false, message: "Failed to delete message." };
    }

    revalidatePath("/admin/messages");
    return { success: true, message: "Message deleted." };
  } catch (err) {
    console.error("Delete message error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getDashboardStats() {
  const adminClient = createAdminClient();

  const [posts, applications, messages, gallery] = await Promise.all([
    adminClient.from("posts").select("id", { count: "exact", head: true }),
    adminClient.from("applications").select("id, status"),
    adminClient.from("messages").select("id, read"),
    adminClient
      .from("gallery")
      .select("id", { count: "exact", head: true }),
  ]);

  const pendingApplications =
    applications.data?.filter((a) => a.status === "pending").length || 0;
  const unreadMessages =
    messages.data?.filter((m) => !m.read).length || 0;

  return {
    totalPosts: posts.count || 0,
    totalApplications: applications.data?.length || 0,
    totalMessages: messages.data?.length || 0,
    totalGalleryImages: gallery.count || 0,
    pendingApplications,
    unreadMessages,
  };
}
