-- ============================================================
-- Testimonials migration (run once in Supabase SQL Editor)
-- Powers the "What Families Say" carousel on the home page and
-- the public "Share Your Story" submission form.
-- Submissions land as status = 'pending' and only show up on the
-- public site once an admin approves them.
-- Safe to re-run: uses IF NOT EXISTS + DROP POLICY IF EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status_created
  ON testimonials(status, display_order ASC, created_at DESC);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials TO authenticated;

-- Public can read only approved testimonials.
DROP POLICY IF EXISTS "Public can read approved testimonials" ON testimonials;
CREATE POLICY "Public can read approved testimonials"
  ON testimonials FOR SELECT
  USING (status = 'approved');

-- Public can submit new testimonials, but only as 'pending'. This prevents
-- a malicious client from inserting an already-approved row.
DROP POLICY IF EXISTS "Public can submit pending testimonials" ON testimonials;
CREATE POLICY "Public can submit pending testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (status = 'pending');

-- Admins have full access (read all statuses, approve/reject/delete).
DROP POLICY IF EXISTS "Admins full access to testimonials" ON testimonials;
CREATE POLICY "Admins full access to testimonials"
  ON testimonials FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- Auto-update updated_at on row changes (function defined in schema.sql).
DROP TRIGGER IF EXISTS set_testimonials_updated_at ON testimonials;
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
