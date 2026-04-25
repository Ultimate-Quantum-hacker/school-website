"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/actions/site-settings";
import { Button, Input, Textarea } from "@/components/ui/FormElements";
import { Toast } from "@/components/ui/Card";
import type { SiteSettings } from "@/types";

interface SettingsManagerProps {
  settings: SiteSettings;
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettings(formData);
    setSubmitting(false);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) router.refresh();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-1">Site Settings</h1>
        <p className="text-sm text-muted">
          Update the school&apos;s contact details and social media handles.
          Changes appear across the public website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-text mb-1">
            Contact Information
          </h2>
          <p className="text-sm text-muted mb-6">
            Shown in the footer, on the Contact page, and in the admissions
            and staff pages.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Contact email"
              name="contact_email"
              type="email"
              defaultValue={settings.contact.email}
              placeholder="info@school.edu"
            />
            <Input
              label="Primary phone"
              name="contact_phone"
              type="tel"
              defaultValue={settings.contact.phone}
              placeholder="+233 30 000 0000"
            />
            <Input
              label="Secondary phone"
              name="contact_phone2"
              type="tel"
              defaultValue={settings.contact.phone2}
              placeholder="+233 24 000 0000"
            />
            <Input
              label="Address"
              name="contact_address"
              defaultValue={settings.contact.address}
              placeholder="Street, City, Country"
              className="sm:col-span-1"
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Google Maps embed URL"
                name="contact_map_embed_url"
                defaultValue={settings.contact.mapEmbedUrl}
                placeholder="https://www.google.com/maps/embed?pb=..."
                rows={3}
              />
              <p className="mt-1 text-xs text-muted">
                From Google Maps: Share → Embed a map → copy the{" "}
                <code>src</code> URL.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-text mb-1">
            Social Media
          </h2>
          <p className="text-sm text-muted mb-6">
            Leave blank to hide the icon from the footer.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Facebook URL"
              name="social_facebook"
              type="url"
              defaultValue={settings.social.facebook}
              placeholder="https://facebook.com/yourschool"
            />
            <Input
              label="Twitter / X URL"
              name="social_twitter"
              type="url"
              defaultValue={settings.social.twitter}
              placeholder="https://twitter.com/yourschool"
            />
            <Input
              label="Instagram URL"
              name="social_instagram"
              type="url"
              defaultValue={settings.social.instagram}
              placeholder="https://instagram.com/yourschool"
            />
            <Input
              label="YouTube URL"
              name="social_youtube"
              type="url"
              defaultValue={settings.social.youtube}
              placeholder="https://youtube.com/@yourschool"
            />
            <Input
              label="LinkedIn URL"
              name="social_linkedin"
              type="url"
              defaultValue={settings.social.linkedin}
              placeholder="https://linkedin.com/school/yourschool"
            />
            <Input
              label="TikTok URL"
              name="social_tiktok"
              type="url"
              defaultValue={settings.social.tiktok}
              placeholder="https://tiktok.com/@yourschool"
            />
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Button type="submit" loading={submitting} disabled={submitting}>
            Save changes
          </Button>
        </div>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}
