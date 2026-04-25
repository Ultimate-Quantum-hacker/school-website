"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { AcademicCalendar, ActionResult } from "@/types";

function parseForm(formData: FormData) {
  const academic_year = (formData.get("academic_year") as string)?.trim();
  const termRaw = formData.get("term") as string;
  const term = Number.parseInt(termRaw, 10) as 1 | 2 | 3;
  const title = ((formData.get("title") as string) || "").trim() || null;
  const pdf_url = (formData.get("pdf_url") as string)?.trim();
  const published = formData.get("published") !== "false";
  return { academic_year, term, title, pdf_url, published };
}

export async function getPublishedAcademicCalendars(): Promise<
  AcademicCalendar[]
> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("academic_calendars")
      .select("*")
      .eq("published", true)
      .order("academic_year", { ascending: false })
      .order("term", { ascending: true });
    return (data as AcademicCalendar[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllAcademicCalendarsAdmin(): Promise<
  AcademicCalendar[]
> {
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("academic_calendars")
      .select("*")
      .order("academic_year", { ascending: false })
      .order("term", { ascending: true });
    return (data as AcademicCalendar[]) ?? [];
  } catch {
    return [];
  }
}

export async function upsertAcademicCalendar(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const data = parseForm(formData);
    if (!data.academic_year || !data.pdf_url) {
      return {
        success: false,
        message: "Academic year and PDF are required.",
      };
    }
    if (![1, 2, 3].includes(data.term)) {
      return { success: false, message: "Term must be 1, 2, or 3." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("academic_calendars")
      .upsert(
        { ...data, updated_at: new Date().toISOString() },
        { onConflict: "academic_year,term" },
      );

    if (error) {
      console.error("Upsert academic calendar error:", error);
      return { success: false, message: "Failed to save calendar." };
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, message: "Academic calendar saved." };
  } catch (err) {
    console.error("Upsert academic calendar error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteAcademicCalendar(
  id: string,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("academic_calendars")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Delete academic calendar error:", error);
      return { success: false, message: "Failed to delete calendar." };
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, message: "Academic calendar deleted." };
  } catch (err) {
    console.error("Delete academic calendar error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function uploadCalendarPdf(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return { success: false, url: null, message: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file)
      return { success: false, url: null, message: "No file provided." };

    if (file.type && file.type !== "application/pdf") {
      return { success: false, url: null, message: "File must be a PDF." };
    }

    const bucket = "images";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `academic-calendars/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}-${safeName}`;

    const adminClient = createAdminClient();
    const { error } = await adminClient.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: "application/pdf",
      });

    if (error) {
      console.error("Upload calendar pdf error:", error);
      return { success: false, url: null, message: "Upload failed." };
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(bucket).getPublicUrl(fileName);

    return { success: true, url: publicUrl, message: "Upload successful." };
  } catch (err) {
    console.error("Upload calendar pdf error:", err);
    return {
      success: false,
      url: null,
      message: "An unexpected error occurred.",
    };
  }
}
