"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { ActionResult, Event } from "@/types";

function parseForm(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description =
    ((formData.get("description") as string) || "").trim() || null;
  const starts_at = formData.get("starts_at") as string;
  const ends_at = (formData.get("ends_at") as string) || null;
  const location =
    ((formData.get("location") as string) || "").trim() || null;
  const category = (formData.get("category") as string) || "event";
  const published = formData.get("published") === "true";
  return { title, description, starts_at, ends_at, location, category, published };
}

export async function getUpcomingEvents(limit = 50): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(limit);
    return (data as Event[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("events")
      .select("*")
      .order("starts_at", { ascending: true });
    return (data as Event[]) ?? [];
  } catch {
    return [];
  }
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const data = parseForm(formData);
    if (!data.title || !data.starts_at) {
      return { success: false, message: "Title and start date are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("events").insert(data);
    if (error) {
      console.error("Create event error:", error);
      return { success: false, message: "Failed to create event." };
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, message: "Event created." };
  } catch (err) {
    console.error("Create event error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function updateEvent(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const data = parseForm(formData);
    if (!data.title || !data.starts_at) {
      return { success: false, message: "Title and start date are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("events")
      .update(data)
      .eq("id", id);
    if (error) {
      console.error("Update event error:", error);
      return { success: false, message: "Failed to update event." };
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, message: "Event updated." };
  } catch (err) {
    console.error("Update event error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("events").delete().eq("id", id);
    if (error) {
      console.error("Delete event error:", error);
      return { success: false, message: "Failed to delete event." };
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, message: "Event deleted." };
  } catch (err) {
    console.error("Delete event error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}
