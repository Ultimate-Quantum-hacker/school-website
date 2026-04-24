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

export interface DailyActivityPoint {
  date: string;          // ISO yyyy-mm-dd
  label: string;         // short "Mon 12" label for the axis
  applications: number;
  messages: number;
}

/**
 * Returns the last N days of applications + messages activity.
 * Fills missing days with zeros so the chart has one bar per day.
 */
export async function getActivityTimeSeries(
  days = 30,
): Promise<DailyActivityPoint[]> {
  const adminClient = createAdminClient();

  const now = new Date();
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const [{ data: apps }, { data: msgs }] = await Promise.all([
    adminClient
      .from("applications")
      .select("created_at")
      .gte("created_at", start.toISOString()),
    adminClient
      .from("messages")
      .select("created_at")
      .gte("created_at", start.toISOString()),
  ]);

  const buckets = new Map<string, { applications: number; messages: number }>();
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    buckets.set(d.toISOString().slice(0, 10), { applications: 0, messages: 0 });
  }

  for (const row of apps ?? []) {
    const key = row.created_at?.slice(0, 10);
    const b = key ? buckets.get(key) : undefined;
    if (b) b.applications += 1;
  }
  for (const row of msgs ?? []) {
    const key = row.created_at?.slice(0, 10);
    const b = key ? buckets.get(key) : undefined;
    if (b) b.messages += 1;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return Array.from(buckets.entries()).map(([date, counts]) => ({
    date,
    label: formatter.format(new Date(`${date}T00:00:00Z`)),
    applications: counts.applications,
    messages: counts.messages,
  }));
}
