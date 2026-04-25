-- ============================================================
-- Site Settings migration (run once in Supabase SQL Editor)
-- Singleton table holding editable contact details and social
-- media handles shown across the public site and the admin
-- dashboard. The row with id = 1 is the only row we ever read
-- or write — the CHECK constraint enforces this.
-- Safe to re-run: uses IF NOT EXISTS + DROP POLICY IF EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  contact_email TEXT,
  contact_phone TEXT,
  contact_phone2 TEXT,
  contact_address TEXT,
  contact_map_embed_url TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_youtube TEXT,
  social_linkedin TEXT,
  social_tiktok TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure the singleton row exists. All future reads/writes
-- target id = 1 so the public site always has something to load.
INSERT INTO site_settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON site_settings TO authenticated;

-- Public pages (Footer, /contact, /privacy, etc.) need to read
-- the single settings row to render contact info and socials.
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Only admins can change the row.
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admins));

DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;
CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admins));

-- Auto-update updated_at on row changes (function defined in schema.sql).
DROP TRIGGER IF EXISTS set_site_settings_updated_at ON site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
