-- Push subscriptions for Web Push notifications.
--
-- One row per (user, device/browser endpoint). A single user can have multiple
-- subscriptions (e.g. iPhone PWA + desktop Chrome). The endpoint URL is unique
-- to the browser/device; we upsert on (user_id, endpoint) so re-subscribing
-- on the same device just refreshes the keys.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint    text NOT NULL,
  keys_p256dh text NOT NULL,
  keys_auth   text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Add a sent_at column to scheduled_exercises so we can avoid double-sending
-- the nudge for the same scheduled item if the cron fires twice within the window.
ALTER TABLE scheduled_exercises
  ADD COLUMN IF NOT EXISTS nudge_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_scheduled_exercises_nudge
  ON scheduled_exercises(scheduled_at, status, nudge_sent_at);
