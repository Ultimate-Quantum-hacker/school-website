"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export async function submitContactMessage(
  formData: FormData
): Promise<ActionResult> {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: (formData.get("subject") as string) || null,
      message: formData.get("message") as string,
    };

    // Validation
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("messages").insert(data);

    if (error) {
      console.error("Contact form error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "Your message has been sent successfully! We will get back to you shortly.",
    };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
