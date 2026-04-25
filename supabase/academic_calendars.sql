-- ============================================================
-- Academic Calendars migration (run once in Supabase SQL Editor)
-- Stores one PDF per (academic_year, term) shown on /events.
-- Safe to re-run: uses IF NOT EXISTS + DROP POLICY IF EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year TEXT NOT NULL,
  term INT NOT NULL CHECK (term IN (1, 2, 3)),
  title TEXT,
  pdf_url TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (academic_year, term)
);

CREATE INDEX IF NOT EXISTS idx_academic_calendars_year_term
  ON academic_calendars(academic_year DESC, term ASC);

ALTER TABLE academic_calendars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published academic calendars"
  ON academic_calendars;
CREATE POLICY "Public can read published academic calendars"
  ON academic_calendars FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins full access to academic calendars"
  ON academic_calendars;
CREATE POLICY "Admins full access to academic calendars"
  ON academic_calendars FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));
