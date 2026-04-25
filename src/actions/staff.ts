"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { ActionResult, StaffMember } from "@/types";

function parseForm(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim();
  const role = ((formData.get("role") as string) || "").trim();
  const bio = ((formData.get("bio") as string) || "").trim() || null;
  const image_url =
    ((formData.get("image_url") as string) || "").trim() || null;
  const department =
    ((formData.get("department") as string) || "").trim() || "Administration";
  const is_leadership = formData.get("is_leadership") === "true";
  const orderRaw = (formData.get("display_order") as string) || "0";
  const display_order = Number.isFinite(Number.parseInt(orderRaw, 10))
    ? Number.parseInt(orderRaw, 10)
    : 0;
  const published = formData.get("published") !== "false";
  return {
    name,
    role,
    bio,
    image_url,
    department,
    is_leadership,
    display_order,
    published,
  };
}

export async function getPublishedStaff(): Promise<StaffMember[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("staff_members")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data as StaffMember[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllStaffAdmin(): Promise<StaffMember[]> {
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("staff_members")
      .select("*")
      .order("is_leadership", { ascending: false })
      .order("department", { ascending: true })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data as StaffMember[]) ?? [];
  } catch {
    return [];
  }
}

export async function createStaffMember(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const data = parseForm(formData);
    if (!data.name || !data.role) {
      return { success: false, message: "Name and role are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("staff_members").insert(data);
    if (error) {
      console.error("Create staff member error:", error);
      return { success: false, message: "Failed to create staff member." };
    }

    revalidatePath("/staff");
    revalidatePath("/about");
    revalidatePath("/admin/staff");
    return { success: true, message: "Staff member created." };
  } catch (err) {
    console.error("Create staff member error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function updateStaffMember(
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
    if (!data.name || !data.role) {
      return { success: false, message: "Name and role are required." };
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("staff_members")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      console.error("Update staff member error:", error);
      return { success: false, message: "Failed to update staff member." };
    }

    revalidatePath("/staff");
    revalidatePath("/about");
    revalidatePath("/admin/staff");
    return { success: true, message: "Staff member updated." };
  } catch (err) {
    console.error("Update staff member error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteStaffMember(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("staff_members")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Delete staff member error:", error);
      return { success: false, message: "Failed to delete staff member." };
    }

    revalidatePath("/staff");
    revalidatePath("/about");
    revalidatePath("/admin/staff");
    return { success: true, message: "Staff member deleted." };
  } catch (err) {
    console.error("Delete staff member error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function reorderStaffMember(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { data: current, error: fetchErr } = await adminClient
      .from("staff_members")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchErr || !current) {
      return { success: false, message: "Staff member not found." };
    }

    // Find the neighbour in the same group (leadership row vs same department).
    let neighbourQuery = adminClient
      .from("staff_members")
      .select("*")
      .neq("id", id);

    if (current.is_leadership) {
      neighbourQuery = neighbourQuery.eq("is_leadership", true);
    } else {
      neighbourQuery = neighbourQuery
        .eq("is_leadership", false)
        .eq("department", current.department);
    }

    const { data: peers, error: peersErr } = await neighbourQuery
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (peersErr) {
      return { success: false, message: "Failed to load peers." };
    }

    const sequence = [
      ...((peers as StaffMember[]) ?? []),
      current as StaffMember,
    ].sort((a, b) => {
      if (a.display_order !== b.display_order)
        return a.display_order - b.display_order;
      return a.created_at.localeCompare(b.created_at);
    });

    const idx = sequence.findIndex((m) => m.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sequence.length) {
      return { success: true, message: "Already at edge." };
    }

    const a = sequence[idx];
    const b = sequence[swapIdx];

    // Two updates with explicit display_order so even if all rows currently
    // share the same value (e.g. all 0), the swap still produces a new order.
    const { error: e1 } = await adminClient
      .from("staff_members")
      .update({ display_order: swapIdx })
      .eq("id", a.id);
    const { error: e2 } = await adminClient
      .from("staff_members")
      .update({ display_order: idx })
      .eq("id", b.id);
    if (e1 || e2) {
      return { success: false, message: "Failed to reorder." };
    }

    revalidatePath("/staff");
    revalidatePath("/about");
    revalidatePath("/admin/staff");
    return { success: true, message: "Order updated." };
  } catch (err) {
    console.error("Reorder staff member error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function uploadStaffPhoto(formData: FormData) {
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

    if (file.type && !file.type.startsWith("image/")) {
      return {
        success: false,
        url: null,
        message: "File must be an image.",
      };
    }

    const bucket = "images";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `staff/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}-${safeName}`;

    const adminClient = createAdminClient();
    const { error } = await adminClient.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (error) {
      console.error("Upload staff photo error:", error);
      return { success: false, url: null, message: "Upload failed." };
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(bucket).getPublicUrl(fileName);
    return { success: true, url: publicUrl, message: "Upload successful." };
  } catch (err) {
    console.error("Upload staff photo error:", err);
    return {
      success: false,
      url: null,
      message: "An unexpected error occurred.",
    };
  }
}
