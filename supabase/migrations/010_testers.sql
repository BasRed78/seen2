-- Tester management.
--
-- A `test_testers` row is created when Bas invites someone via /admin/testers.
-- It's linked 1:1 with a `users` row (the actual app user record), so once
-- the tester accepts the invite they appear in the rest of the system as a
-- regular Phase 2 user with `is_tester = true`.
--
-- Mirrors Goos's pattern, simplified for seen2.

-- Mark which users are testers vs real-world users. Affects test-only UI
-- (the in-app feedback widget, the /test guide button) and reporting.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_tester boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS test_testers (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invite_code              text NOT NULL UNIQUE,
  recipient_name           text NOT NULL,
  recipient_email          text,
  notes                    text,
  invited_at               timestamptz NOT NULL DEFAULT now(),
  nda_accepted_at          timestamptz,
  onboarded_at             timestamptz,
  last_active_at           timestamptz,
  revoked_at               timestamptz,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_test_testers_invite_code ON test_testers(invite_code);
CREATE INDEX IF NOT EXISTS idx_test_testers_user_id ON test_testers(user_id);

ALTER TABLE test_testers ENABLE ROW LEVEL SECURITY;
