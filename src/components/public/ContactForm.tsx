"use client";

import { useState } from "react";
import { submitContactMessage } from "@/actions/messages";
import { Button, Input, Textarea } from "@/components/ui/FormElements";
import { Toast } from "@/components/ui/Card";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);

    setToast({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });

    if (result.success) {
      (e.target as HTMLFormElement).reset();
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
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Your Name *"
            name="name"
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address *"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>
        <Input
          label="Subject"
          name="subject"
          placeholder="What is this regarding?"
        />
        <Textarea
          label="Message *"
          name="message"
          placeholder="Write your message here..."
          rows={5}
          required
        />
        <Button type="submit" size="lg" loading={loading}>
          Send Message
        </Button>
      </form>
    </>
  );
}
