"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { schoolConfig } from "@/config/school";
import { revalidatePath } from "next/cache";
import type {
  ActionResult,
  SiteSettings,
  SiteSettingsRow,
} from "@/types";

const SETTINGS_ID = 1;

const DEFAULT_ABOUT_STORY = `Founded in ${schoolConfig.foundedYear}, ${schoolConfig.name} began with a simple yet powerful vision: to create a school in Accra where every child could reach their full potential regardless of background. What started as a small nursery has grown into one of the most respected basic schools in the Greater Accra Region.

Over the years, we have evolved our teaching methods, expanded our facilities, and embraced modern educational practices — all while staying true to our founding principles of academic rigour, discipline, and inclusive community.

Today, with over ${schoolConfig.studentCount} students and ${schoolConfig.staffCount} dedicated staff members, we continue to produce outstanding BECE results and well-rounded graduates who go on to excel in the best senior high schools across Ghana.`;

const DEFAULT_MISSION =
  "To provide quality basic education that empowers students with knowledge, critical thinking skills, and strong moral values. We are committed to fostering an inclusive learning environment where every child is encouraged to explore, innovate, and excel, while being prepared for the challenges of secondary education and beyond.";

const DEFAULT_VISION =
  "To be a leading basic school in Ghana that produces well-rounded, confident, and socially responsible young people who contribute meaningfully to national development. We envision a community where education transforms lives and empowers the next generation of Ghanaian leaders.";

const DEFAULT_OFFICE_HOURS =
  "Mon \u2013 Fri: 7:30 AM \u2013 4:00 PM\nSat: 9:00 AM \u2013 12:00 PM";

function defaults(): SiteSettings {
  return {
    contact: {
      email: schoolConfig.contact.email,
      phone: schoolConfig.contact.phone,
      phone2: schoolConfig.contact.phone2,
      address: schoolConfig.contact.address,
      mapEmbedUrl: schoolConfig.contact.mapEmbedUrl,
    },
    social: {
      facebook: schoolConfig.social.facebook ?? "",
      twitter: schoolConfig.social.twitter ?? "",
      instagram: schoolConfig.social.instagram ?? "",
      youtube: schoolConfig.social.youtube ?? "",
      linkedin: schoolConfig.social.linkedin ?? "",
      tiktok: "",
    },
    content: {
      aboutStory: DEFAULT_ABOUT_STORY,
      mission: DEFAULT_MISSION,
      vision: DEFAULT_VISION,
      officeHours: DEFAULT_OFFICE_HOURS,
    },
  };
}

function mergeRow(row: SiteSettingsRow | null): SiteSettings {
  const d = defaults();
  if (!row) return d;
  const pick = (value: string | null | undefined, fallback: string) =>
    value != null && value.trim().length > 0 ? value : fallback;
  return {
    contact: {
      email: pick(row.contact_email, d.contact.email),
      phone: pick(row.contact_phone, d.contact.phone),
      phone2: pick(row.contact_phone2, d.contact.phone2),
      address: pick(row.contact_address, d.contact.address),
      mapEmbedUrl: pick(row.contact_map_embed_url, d.contact.mapEmbedUrl),
    },
    social: {
      facebook: pick(row.social_facebook, d.social.facebook),
      twitter: pick(row.social_twitter, d.social.twitter),
      instagram: pick(row.social_instagram, d.social.instagram),
      youtube: pick(row.social_youtube, d.social.youtube),
      linkedin: pick(row.social_linkedin, d.social.linkedin),
      tiktok: pick(row.social_tiktok, d.social.tiktok),
    },
    content: {
      aboutStory: pick(row.about_story, d.content.aboutStory),
      mission: pick(row.mission, d.content.mission),
      vision: pick(row.vision, d.content.vision),
      officeHours: pick(row.office_hours, d.content.officeHours),
    },
  };
}

/**
 * Read the singleton site settings row, merged over schoolConfig
 * defaults. Returns defaults if the migration has not yet been
 * applied or any error occurs, so public pages never break.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (error) {
      return defaults();
    }
    return mergeRow(data as SiteSettingsRow | null);
  } catch {
    return defaults();
  }
}

/**
 * Admin-only: same as getSiteSettings but uses the service role
 * client so the admin editor can load the current values reliably
 * even before any RLS policy is set up.
 */
export async function getSiteSettingsAdmin(): Promise<SiteSettings> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("site_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (error) {
      return defaults();
    }
    return mergeRow(data as SiteSettingsRow | null);
  } catch {
    return defaults();
  }
}

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function updateSiteSettings(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const payload = {
      id: SETTINGS_ID,
      contact_email: str(formData, "contact_email") || null,
      contact_phone: str(formData, "contact_phone") || null,
      contact_phone2: str(formData, "contact_phone2") || null,
      contact_address: str(formData, "contact_address") || null,
      contact_map_embed_url: str(formData, "contact_map_embed_url") || null,
      social_facebook: str(formData, "social_facebook") || null,
      social_twitter: str(formData, "social_twitter") || null,
      social_instagram: str(formData, "social_instagram") || null,
      social_youtube: str(formData, "social_youtube") || null,
      social_linkedin: str(formData, "social_linkedin") || null,
      social_tiktok: str(formData, "social_tiktok") || null,
      about_story: str(formData, "about_story") || null,
      mission: str(formData, "mission") || null,
      vision: str(formData, "vision") || null,
      office_hours: str(formData, "office_hours") || null,
    };

    if (payload.contact_email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact_email);
      if (!emailOk) {
        return { success: false, message: "Contact email is not valid." };
      }
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("site_settings")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Update site settings error:", error);
      const msg = /relation .*site_settings.* does not exist/i.test(
        error.message ?? "",
      )
        ? "Site settings table is missing. Run supabase/site_settings.sql in the Supabase SQL Editor first."
        : "Failed to update site settings.";
      return { success: false, message: msg };
    }

    // Bust the cache on every page that renders contact or social data.
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/privacy");
    revalidatePath("/cookies");
    revalidatePath("/admissions");
    revalidatePath("/staff");
    revalidatePath("/admin/settings");
    return { success: true, message: "Site settings updated." };
  } catch (err) {
    console.error("Update site settings error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}
