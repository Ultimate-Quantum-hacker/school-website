-- ============================================================
-- Application Documents migration
-- Run AFTER schema.sql in the Supabase SQL Editor.
--
-- Adds:
--   * application_documents table — one row per uploaded file,
--     linked to its parent application.
--   * application-documents storage bucket — PRIVATE so files
--     are only fetched server-side via signed URLs by admins.
--   * Row-Level Security so the public can INSERT documents
--     they just uploaded, but only admins can read/delete.
-- Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_application_documents_application
  ON application_documents(application_id);

GRANT INSERT ON application_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON application_documents TO authenticated;

ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Public submitters insert document rows together with their application.
DROP POLICY IF EXISTS "Public can submit application documents" ON application_documents;
CREATE POLICY "Public can submit application documents"
  ON application_documents FOR INSERT
  WITH CHECK (true);

-- Only admins read application documents.
DROP POLICY IF EXISTS "Admins can read application documents" ON application_documents;
CREATE POLICY "Admins can read application documents"
  ON application_documents FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admins));

DROP POLICY IF EXISTS "Admins can delete application documents" ON application_documents;
CREATE POLICY "Admins can delete application documents"
  ON application_documents FOR DELETE
  USING (auth.uid() IN (SELECT id FROM admins));

-- ─── Storage bucket ─────────────────────────────────────────
-- Private bucket; admin server reads via signed URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-documents', 'application-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload into this bucket. The folder structure
-- is application_id-prefixed so files are partitioned per
-- application. We rely on the documents table + admin client
-- for retrieval, so listing is not granted.
DROP POLICY IF EXISTS "Public can upload application documents"
  ON storage.objects;
CREATE POLICY "Public can upload application documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'application-documents');

DROP POLICY IF EXISTS "Admins can read application documents"
  ON storage.objects;
CREATE POLICY "Admins can read application documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'application-documents'
    AND auth.uid() IN (SELECT id FROM admins)
  );

DROP POLICY IF EXISTS "Admins can delete application documents storage"
  ON storage.objects;
CREATE POLICY "Admins can delete application documents storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'application-documents'
    AND auth.uid() IN (SELECT id FROM admins)
  );
