"use client";

import { useState } from "react";
import { submitTestimonial } from "@/actions/testimonials";
import { Button, Input, Textarea } from "@/components/ui/FormElements";
import { Toast } from "@/components/ui/Card";
import { TurnstileWidget } from "@/components/public/TurnstileWidget";

export function TestimonialForm() {
  const [loading, setLoading] = useState(false);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitTestimonial(formData);

    setToast({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });

    if (result.success) {
      (e.target as HTMLFormElement).reset();
      setTurnstileResetSignal((n) => n + 1);
    }

    setLoading(false);
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 5000);
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Textarea
          label="Your Story *"
          name="quote"
          placeholder="Share what makes our school special to your family..."
          rows={6}
          required
          maxLength={1000}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Your Name *"
            name="author"
            placeholder="Akosua Boateng"
            required
            maxLength={120}
          />
          <Input
            label="Relationship to School"
            name="role"
            placeholder="Parent, Basic 5"
            maxLength={120}
          />
        </div>
        <Input
          label="Email (optional, not displayed)"
          name="email"
          type="email"
          placeholder="you@example.com"
          maxLength={200}
        />
        <p className="text-xs text-muted">
          Submissions are reviewed before they appear on the website. By
          submitting you agree that your name and story may be displayed
          publicly if approved.
        </p>
        <TurnstileWidget resetSignal={turnstileResetSignal} />
        <Button type="submit" size="lg" loading={loading}>
          Share Your Story
        </Button>
      </form>
    </>
  );
}
