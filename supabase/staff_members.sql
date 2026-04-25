-- ============================================================
-- Staff Members migration (run once in Supabase SQL Editor)
-- Single table powering BOTH:
--   • the Leadership grid on /about       (is_leadership = true)
--   • the Staff directory on /staff        (grouped by department)
-- A staff member can appear in both views simultaneously.
-- Safe to re-run: uses IF NOT EXISTS + DROP POLICY IF EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  department TEXT NOT NULL DEFAULT 'Administration',
  is_leadership BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_members_dept_order
  ON staff_members(department, display_order ASC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_staff_members_leadership_order
  ON staff_members(is_leadership, display_order ASC, created_at ASC);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON staff_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON staff_members TO authenticated;

DROP POLICY IF EXISTS "Public can read published staff" ON staff_members;
CREATE POLICY "Public can read published staff"
  ON staff_members FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins full access to staff" ON staff_members;
CREATE POLICY "Admins full access to staff"
  ON staff_members FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- Auto-update updated_at on row changes (function defined in schema.sql).
DROP TRIGGER IF EXISTS set_staff_members_updated_at ON staff_members;
CREATE TRIGGER set_staff_members_updated_at
  BEFORE UPDATE ON staff_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
