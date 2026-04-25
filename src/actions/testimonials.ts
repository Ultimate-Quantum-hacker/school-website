"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import {
  getTurnstileToken,
  verifyTurnstileToken,
} from "@/lib/turnstile";
import type { ActionResult, Testimonial } from "@/types";

const MAX_QUOTE_LEN = 1000;
const MAX_AUTHOR_LEN = 120;
const MAX_ROLE_LEN = 120;
const MAX_EMAIL_LEN = 200;

export async function submitTestimonial(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const quote = ((formData.get("quote") as string) || "").trim();
    const author = ((formData.get("author") as string) || "").trim();
    const role = ((formData.get("role") as string) || "").trim() || null;
    const email = ((formData.get("email") as string) || "").trim() || null;

    if (!quote || !author) {
      return {
        success: false,
        message: "Please share your story and let us know your name.",
      };
    }
    if (quote.length > MAX_QUOTE_LEN) {
      return {
        success: false,
        message: `Story must be ${MAX_QUOTE_LEN} characters or fewer.`,
      };
    }
    if (author.length > MAX_AUTHOR_LEN) {
      return { success: false, message: "Name is too long." };
    }
    if (role && role.length > MAX_ROLE_LEN) {
      return { success: false, message: "Role/relationship is too long." };
    }
    if (email && email.length > MAX_EMAIL_LEN) {
      return { success: false, message: "Email is too long." };
    }

    const turnstileOk = await verifyTurnstileToken(
      getTurnstileToken(formData),
    );
    if (!turnstileOk) {
      return {
        success: false,
        message:
          "Spam check failed. Please refresh the page and try again.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").insert({
      quote,
      author,
      role,
      email,
      status: "pending",
    });

    if (error) {
      console.error("Submit testimonial error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "Thank you for sharing! Your story has been submitted for review.",
    };
  } catch (err) {
    console.error("Submit testimonial error:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", "approved")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

async function setStatus(
  id: string,
  status: Testimonial["status"],
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("testimonials")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Update testimonial status error:", error);
      return { success: false, message: "Failed to update testimonial." };
    }

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return {
      success: true,
      message:
        status === "approved"
          ? "Testimonial approved."
          : status === "rejected"
            ? "Testimonial rejected."
            : "Testimonial set to pending.",
    };
  } catch (err) {
    console.error("Update testimonial status error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function approveTestimonial(id: string) {
  return setStatus(id, "approved");
}

export async function rejectTestimonial(id: string) {
  return setStatus(id, "rejected");
}

export async function unapproveTestimonial(id: string) {
  return setStatus(id, "pending");
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete testimonial error:", error);
      return { success: false, message: "Failed to delete testimonial." };
    }

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, message: "Testimonial deleted." };
  } catch (err) {
    console.error("Delete testimonial error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}
