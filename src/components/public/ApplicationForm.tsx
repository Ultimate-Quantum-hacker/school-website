"use client";

import { useState } from "react";
import { submitApplication } from "@/actions/applications";
import { APPLICATION_DOCUMENT_SLOTS } from "@/lib/applications";
import { schoolConfig } from "@/config/school";
import { Button, Input, Textarea, Select } from "@/components/ui/FormElements";
import { Toast } from "@/components/ui/Card";
import { TurnstileWidget } from "@/components/public/TurnstileWidget";

const ACCEPTED_FILE_TYPES = "application/pdf,image/*";
const MAX_FILE_MB = 8;

export function ApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

  const gradeOptions = schoolConfig.admissions.grades.map((g) => ({
    value: g,
    label: g,
  }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitApplication(formData);

    setToast({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });

    if (result.success) {
      (e.target as HTMLFormElement).reset();
      setTurnstileResetSignal((n) => n + 1);
      setFileNames({});
    }

    setLoading(false);
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 5000);
  }

  function handleFileChange(
    slot: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    setFileNames((prev) => {
      const next = { ...prev };
      if (file) {
        next[slot] = file.name;
      } else {
        delete next[slot];
      }
      return next;
    });
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Student Full Name *"
            name="student_name"
            placeholder="Enter student's full name"
            required
          />
          <Input
            label="Email Address *"
            name="email"
            type="email"
            placeholder="parent@example.com"
            required
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+233 XX XXX XXXX"
          />
          <Input
            label="Date of Birth"
            name="date_of_birth"
            type="date"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Guardian Name"
            name="guardian_name"
            placeholder="Parent/Guardian full name"
          />
          <Input
            label="Guardian Phone"
            name="guardian_phone"
            type="tel"
            placeholder="+233 XX XXX XXXX"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Grade Applying For *"
            name="grade_applying"
            options={gradeOptions}
            placeholder="Select a grade"
            required
          />
          <Input
            label="Previous School"
            name="previous_school"
            placeholder="Name of previous school"
          />
        </div>
        <Textarea
          label="Additional Information"
          name="message"
          placeholder="Any additional information you'd like to share..."
          rows={4}
        />

        {/* ─── Required Documents ─────────────────────────────── */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-text">
              Supporting Documents
            </h3>
            <p className="text-xs text-muted mt-1">
              Upload PDFs or images (max {MAX_FILE_MB}MB each). All documents
              are optional but uploading them now speeds up the review process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {APPLICATION_DOCUMENT_SLOTS.map((slot) => {
              const inputId = `document_${slot.key}`;
              const fileName = fileNames[slot.key];
              return (
                <label
                  key={slot.key}
                  htmlFor={inputId}
                  className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-background/50 p-3 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <span className="text-sm font-medium text-text">
                    {slot.label}
                  </span>
                  <span className="text-xs text-muted truncate">
                    {fileName ?? "PDF, JPG, or PNG \u2014 tap to choose a file"}
                  </span>
                  <input
                    id={inputId}
                    name={inputId}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    className="sr-only"
                    onChange={(e) => handleFileChange(slot.key, e)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <TurnstileWidget resetSignal={turnstileResetSignal} />
        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full sm:w-auto"
        >
          Submit Application
        </Button>
      </form>
    </>
  );
}
