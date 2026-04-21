"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export async function submitApplication(
  formData: FormData
): Promise<ActionResult> {
  try {
    const data = {
      student_name: formData.get("student_name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      date_of_birth: (formData.get("date_of_birth") as string) || null,
      guardian_name: (formData.get("guardian_name") as string) || null,
      guardian_phone: (formData.get("guardian_phone") as string) || null,
      grade_applying: formData.get("grade_applying") as string,
      previous_school: (formData.get("previous_school") as string) || null,
      message: (formData.get("message") as string) || null,
    };

    // Validation
    if (!data.student_name || !data.email || !data.grade_applying) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("applications").insert(data);

    if (error) {
      console.error("Application submission error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      message:
        "Your application has been submitted successfully! We will contact you soon.",
    };
  } catch (err) {
    console.error("Application submission error:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
