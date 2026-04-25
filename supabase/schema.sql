-- ============================================================
-- School Website Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── 1. ADMINS TABLE ──────────────────────────────────────────
-- Linked to Supabase auth.users for admin authentication
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. POSTS TABLE ──────────────────────────────────────────
-- News articles and announcements managed by admins
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'news' CHECK (category IN ('news', 'announcement')),
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- ─── 3. GALLERY TABLE ────────────────────────────────────────
-- Image gallery managed by admins
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for gallery ordering
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order ASC, created_at DESC);

-- ─── 4. APPLICATIONS TABLE ───────────────────────────────────
-- Admission applications submitted by the public
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  guardian_name TEXT,
  guardian_phone TEXT,
  grade_applying TEXT NOT NULL,
  previous_school TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(created_at DESC);

-- ─── 5. MESSAGES TABLE ───────────────────────────────────────
-- Contact form submissions from the public
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(created_at DESC);


-- ============================================================
-- TABLE GRANTS FOR SUPABASE ROLES
-- ============================================================
-- Supabase uses `anon` for unauthenticated requests and
-- `authenticated` for logged-in users. RLS policies (below)
-- control row-level access, but the roles still need base
-- table-level permissions.

-- Anon (public visitors): read posts & gallery, submit applications & messages
-- SELECT on admins is needed because RLS policies on other tables reference
-- the admins table in subqueries; the admins RLS policy itself prevents
-- anon from reading any actual admin rows.
GRANT SELECT ON admins TO anon;
GRANT SELECT ON posts TO anon;
GRANT SELECT ON gallery TO anon;
GRANT INSERT ON applications TO anon;
GRANT INSERT ON messages TO anon;

-- Authenticated (admin users): full CRUD on all tables
GRANT SELECT ON admins TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON gallery TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO authenticated;


-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ─── ADMINS POLICIES ─────────────────────────────────────────
-- Admins can read their own profile
CREATE POLICY "Admins can read own profile"
  ON admins FOR SELECT
  USING (auth.uid() = id);

-- ─── POSTS POLICIES ──────────────────────────────────────────
-- Public can read published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (published = true);

-- Admins have full access to all posts
CREATE POLICY "Admins full access to posts"
  ON posts FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- ─── GALLERY POLICIES ────────────────────────────────────────
-- Public can view all gallery images
CREATE POLICY "Public can view gallery"
  ON gallery FOR SELECT
  USING (true);

-- Admins have full access to gallery
CREATE POLICY "Admins full access to gallery"
  ON gallery FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- ─── APPLICATIONS POLICIES ───────────────────────────────────
-- Public can submit applications (INSERT only)
CREATE POLICY "Public can submit applications"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage applications
CREATE POLICY "Admins full access to applications"
  ON applications FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- ─── MESSAGES POLICIES ───────────────────────────────────────
-- Public can submit messages (INSERT only)
CREATE POLICY "Public can submit messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage messages
CREATE POLICY "Admins full access to messages"
  ON messages FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));


-- ============================================================
-- STORAGE BUCKET SETUP
-- ============================================================
-- Run these separately if the above completes first

-- Create a public storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images bucket
CREATE POLICY "Public read access to images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated admins to upload images
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.uid() IN (SELECT id FROM admins)
  );

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images'
    AND auth.uid() IN (SELECT id FROM admins)
  );


-- ============================================================
-- HELPER: AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- SEED: CREATE FIRST ADMIN USER
-- ============================================================
-- IMPORTANT: After running this schema, do the following:
--
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" and create an admin account with email/password
-- 3. Copy the user's UUID from the Users list
-- 4. Run the following SQL (replace the UUID and email):
--
-- INSERT INTO admins (id, email, full_name)
-- VALUES ('YOUR-USER-UUID-HERE', 'admin@school.edu', 'Admin User');
--
-- This links the auth user to the admins table, granting
-- them full access through the RLS policies above.
-- ============================================================
