"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getTurnstileToken,
  verifyTurnstileToken,
} from "@/lib/turnstile";
import { APPLICATION_DOCUMENT_SLOTS } from "@/lib/applications";
import type { ActionResult, ApplicationDocument } from "@/types";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per file
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf"];

const BUCKET = "application-documents";

function isAllowedFile(file: File): boolean {
  if (file.size === 0) return false;
  if (file.size > MAX_FILE_BYTES) return false;
  return ALLOWED_MIME_PREFIXES.some((p) => file.type.startsWith(p));
}

function safeFileName(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
}

export async function submitApplication(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const data = {
      student_name: (formData.get("student_name") as string) ?? "",
      email: (formData.get("email") as string) ?? "",
      phone: (formData.get("phone") as string) || null,
      date_of_birth: (formData.get("date_of_birth") as string) || null,
      guardian_name: (formData.get("guardian_name") as string) || null,
      guardian_phone: (formData.get("guardian_phone") as string) || null,
      grade_applying: (formData.get("grade_applying") as string) ?? "",
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

    // Collect uploaded files keyed by document slot.
    const uploads: { slot: string; file: File }[] = [];
    for (const slot of APPLICATION_DOCUMENT_SLOTS) {
      const entry = formData.get(`document_${slot.key}`);
      if (entry instanceof File && entry.size > 0) {
        if (!isAllowedFile(entry)) {
          return {
            success: false,
            message: `${slot.label}: only PDFs or images up to 8MB are allowed.`,
          };
        }
        uploads.push({ slot: slot.key, file: entry });
      }
    }

    const turnstileOk = await verifyTurnstileToken(getTurnstileToken(formData));
    if (!turnstileOk) {
      return {
        success: false,
        message:
          "Spam check failed. Please refresh the page and try again.",
      };
    }

    // Use the admin client for the application insert + document
    // inserts so we can read back the new row's id and bypass RLS on
    // the anon role. Never exposed to the client.
    const adminClient = createAdminClient();
    const { data: inserted, error } = await adminClient
      .from("applications")
      .insert(data)
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("Application submission error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    if (uploads.length > 0) {
      const docRows: Omit<ApplicationDocument, "id" | "created_at">[] = [];

      for (const { slot, file } of uploads) {
        const path = `${inserted.id}/${slot}-${Date.now()}-${safeFileName(file.name)}`;
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await adminClient.storage
          .from(BUCKET)
          .upload(path, new Uint8Array(arrayBuffer), {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (uploadError) {
          console.error("Application document upload error:", uploadError);
          // Continue — the application itself is saved, document is just missing.
          continue;
        }
        docRows.push({
          application_id: inserted.id,
          document_type: slot,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type || null,
          size_bytes: file.size,
        });
      }

      if (docRows.length > 0) {
        const { error: docsError } = await adminClient
          .from("application_documents")
          .insert(docRows);
        if (docsError) {
          console.error("Application documents insert error:", docsError);
          // Do not fail the whole submission — documents are recoverable
          // from the storage bucket if needed.
        }
      }
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

/**
 * Admin-only: generate a short-lived signed URL the admin can use to
 * download a single application document from the private bucket.
 */
export async function getApplicationDocumentUrl(
  storagePath: string,
): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const adminClient = createAdminClient();
    const { data, error } = await adminClient.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 60 * 10); // 10-minute access
    if (error || !data) {
      console.error("Signed URL error:", error);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error("Signed URL error:", err);
    return null;
  }
}
