/**
 * Required document slots that the application form lets the
 * applicant upload. Storing slot keys here keeps the form, the
 * server validation, and the admin display in sync.
 *
 * Lives in `lib/` so both client components (form) and server
 * actions can import it — server-action modules can only export
 * async functions, so constants must live elsewhere.
 */
export const APPLICATION_DOCUMENT_SLOTS = [
  { key: "birth_certificate", label: "Birth Certificate" },
  { key: "passport_photo", label: "Passport Photograph" },
  { key: "report_card", label: "Latest Report Card" },
  { key: "immunization", label: "Immunization / Health Records" },
  { key: "guardian_id", label: "Guardian Ghana Card / ID" },
] as const;

export type ApplicationDocumentSlotKey =
  (typeof APPLICATION_DOCUMENT_SLOTS)[number]["key"];

export function applicationDocumentLabel(key: string): string {
  return (
    APPLICATION_DOCUMENT_SLOTS.find((s) => s.key === key)?.label ?? key
  );
}
