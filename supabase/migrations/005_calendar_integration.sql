-- Scheduled exercises (planned from post-session flow)

CREATE TABLE IF NOT EXISTS scheduled_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  custom_title text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 15,
  post_session_checkin_id uuid REFERENCES post_session_checkins(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_exercises_user_status ON scheduled_exercises(user_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_exercises_user_date ON scheduled_exercises(user_id, scheduled_at);
