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
  };
}

function mergeRow(row: SiteSettingsRow | null): SiteSettings {
  const d = defaults();
  if (!row) return d;
  const pick = (value: string | null, fallback: string) =>
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
