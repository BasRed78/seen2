-- Calendar integration tables
-- Stores Google OAuth tokens and scheduled exercises

-- User calendar connections (Google OAuth tokens)
CREATE TABLE IF NOT EXISTS user_calendar_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('google')),
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expires_at timestamptz NOT NULL,
  calendar_id text DEFAULT 'primary',
  connected_at timestamptz DEFAULT now(),
  disconnected_at timestamptz,
  UNIQUE(user_id, provider)
);

-- Scheduled exercises (planned from post-session flow)
CREATE TABLE IF NOT EXISTS scheduled_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  custom_title text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 15,
  calendar_provider text NOT NULL CHECK (calendar_provider IN ('google', 'ics', 'none')),
  calendar_event_id text,
  post_session_checkin_id uuid REFERENCES post_session_checkins(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_exercises_user_status ON scheduled_exercises(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_exercises_user_date ON scheduled_exercises(user_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_calendar_connections_user ON user_calendar_connections(user_id, provider);
