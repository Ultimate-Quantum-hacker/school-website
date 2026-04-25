-- ============================================================
-- Site Settings — Content extension migration
-- Run AFTER site_settings.sql in the Supabase SQL Editor.
-- Adds editable long-form content fields used on About / Contact:
--   * about_story          — multi-paragraph "Our Story" body
--   * mission              — Mission statement
--   * vision               — Vision statement
--   * office_hours         — Office hours (one entry per line)
-- Safe to re-run.
-- ============================================================

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS about_story TEXT,
  ADD COLUMN IF NOT EXISTS mission TEXT,
  ADD COLUMN IF NOT EXISTS vision TEXT,
  ADD COLUMN IF NOT EXISTS office_hours TEXT;
