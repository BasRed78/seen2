-- ============================================================
-- SEEN Phase 2: Migration 001 — ALTER existing tables
-- ============================================================
-- Adds Phase 2 columns to users and checkins tables.
-- Safe to re-run: uses ADD COLUMN IF NOT EXISTS.
-- ============================================================

-- ------------------------------------------------------------
-- users: Phase 2 fields
-- ------------------------------------------------------------
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS current_phase text NOT NULL DEFAULT 'phase1',
  ADD COLUMN IF NOT EXISTS in_therapy boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phase2_activated_at timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_tier text;

COMMENT ON COLUMN users.current_phase IS 'Active product phase: phase1, phase2, or phase3';
COMMENT ON COLUMN users.in_therapy IS 'User self-reported as currently in therapy/professional support';
COMMENT ON COLUMN users.phase2_activated_at IS 'Timestamp when user first activated Phase 2';
COMMENT ON COLUMN users.subscription_tier IS 'Future use: subscription tier for feature gating';

-- ------------------------------------------------------------
-- checkins: distinguish daily vs post-session
-- ------------------------------------------------------------
ALTER TABLE checkins
  ADD COLUMN IF NOT EXISTS checkin_type text NOT NULL DEFAULT 'daily';

COMMENT ON COLUMN checkins.checkin_type IS 'Type of check-in: daily or post_session';
