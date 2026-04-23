-- ============================================================
-- Events migration (run once in Supabase SQL Editor)
-- Adds an `events` table for the public events calendar + admin CRUD.
-- Safe to re-run: uses IF NOT EXISTS + DROP POLICY IF EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location TEXT,
  category TEXT DEFAULT 'event'
    CHECK (category IN ('event', 'holiday', 'exam', 'meeting')),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_starts_at
  ON events(starts_at);
CREATE INDEX IF NOT EXISTS idx_events_published
  ON events(published, starts_at);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published events" ON events;
CREATE POLICY "Public can read published events"
  ON events FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins full access to events" ON events;
CREATE POLICY "Admins full access to events"
  ON events FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));
