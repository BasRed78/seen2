-- ============================================================
-- SEEN Phase 2: Migration 002 — New tables
-- ============================================================
-- Creates 6 new tables for Phase 2 practice functionality.
-- Includes foreign keys, CHECK constraints, indexes, and RLS.
-- ============================================================

-- ------------------------------------------------------------
-- 1. user_phase_status — Tracks phase transitions (audit log)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_phase_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phase text NOT NULL CHECK (phase IN ('phase1', 'phase2', 'phase3')),
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  activated_at timestamptz NOT NULL DEFAULT now(),
  deactivated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_user_phase_status_user
  ON user_phase_status (user_id);
CREATE INDEX IF NOT EXISTS idx_user_phase_status_user_phase
  ON user_phase_status (user_id, phase);

ALTER TABLE user_phase_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own phase status"
  ON user_phase_status FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phase status"
  ON user_phase_status FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 2. practice_themes — Reference table for exercise themes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_practice_themes_active_order
  ON practice_themes (is_active, display_order);

ALTER TABLE practice_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active themes"
  ON practice_themes FOR SELECT
  USING (true);

-- ------------------------------------------------------------
-- 3. exercises — Practice exercise library
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructions jsonb,
  theme_id uuid REFERENCES practice_themes(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN (
    'awareness', 'mindfulness', 'defusion', 'values',
    'emotion_regulation', 'behavioral', 'reflection', 'self_assessment'
  )),
  exercise_type text NOT NULL CHECK (exercise_type IN (
    'reflection', 'journaling', 'behavioral', 'grounding',
    'psychoeducation', 'mapping'
  )),
  duration_minutes integer,
  pattern_relevance text[],
  methodology text,
  is_onboarding boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

COMMENT ON COLUMN exercises.instructions IS 'Structured exercise steps as JSON. Not shown raw to users.';
COMMENT ON COLUMN exercises.pattern_relevance IS 'Array of pattern types this exercise is most relevant for';
COMMENT ON COLUMN exercises.methodology IS 'Internal reference only (CBT/ACT/DBT/MBSR/12-step). Never shown to users.';

CREATE INDEX IF NOT EXISTS idx_exercises_theme
  ON exercises (theme_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category
  ON exercises (category);
CREATE INDEX IF NOT EXISTS idx_exercises_active_order
  ON exercises (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_exercises_onboarding
  ON exercises (is_onboarding) WHERE is_onboarding = true;

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active exercises"
  ON exercises FOR SELECT
  USING (true);

-- ------------------------------------------------------------
-- 4. post_session_checkins — After-therapy reflections
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_session_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  emotional_state integer CHECK (emotional_state >= 1 AND emotional_state <= 10),
  selected_theme_id uuid REFERENCES practice_themes(id) ON DELETE SET NULL,
  reflection_text text,
  practice_intention text,
  scheduled_practice_at timestamptz
);

COMMENT ON COLUMN post_session_checkins.reflection_text IS 'SENSITIVE: User reflection after therapy session. Encrypt at application layer when encryption is implemented.';
COMMENT ON COLUMN post_session_checkins.practice_intention IS 'SENSITIVE: User-stated practice intention. Encrypt at application layer when encryption is implemented.';

CREATE INDEX IF NOT EXISTS idx_post_session_checkins_user
  ON post_session_checkins (user_id);
CREATE INDEX IF NOT EXISTS idx_post_session_checkins_user_date
  ON post_session_checkins (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_session_checkins_theme
  ON post_session_checkins (selected_theme_id);

ALTER TABLE post_session_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post-session checkins"
  ON post_session_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own post-session checkins"
  ON post_session_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. exercise_completions — Tracks user exercise progress
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exercise_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  reflection_text text,
  self_rating integer CHECK (self_rating >= 1 AND self_rating <= 5)
);

COMMENT ON COLUMN exercise_completions.reflection_text IS 'SENSITIVE: User reflection after exercise. Encrypt at application layer when encryption is implemented.';

CREATE INDEX IF NOT EXISTS idx_exercise_completions_user
  ON exercise_completions (user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_completions_user_exercise
  ON exercise_completions (user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_completions_user_date
  ON exercise_completions (user_id, completed_at DESC);

ALTER TABLE exercise_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercise completions"
  ON exercise_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own exercise completions"
  ON exercise_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise completions"
  ON exercise_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. practice_intentions — User-set practice commitments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_intentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_session_checkin_id uuid REFERENCES post_session_checkins(id) ON DELETE SET NULL,
  intention_text text,
  theme_id uuid REFERENCES practice_themes(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  target_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'completed', 'skipped', 'expired'
  )),
  completed_at timestamptz
);

COMMENT ON COLUMN practice_intentions.intention_text IS 'SENSITIVE: User-stated practice intention. Encrypt at application layer when encryption is implemented.';

CREATE INDEX IF NOT EXISTS idx_practice_intentions_user
  ON practice_intentions (user_id);
CREATE INDEX IF NOT EXISTS idx_practice_intentions_user_status
  ON practice_intentions (user_id, status);
CREATE INDEX IF NOT EXISTS idx_practice_intentions_active_target
  ON practice_intentions (user_id, target_date) WHERE status = 'active';

ALTER TABLE practice_intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice intentions"
  ON practice_intentions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own practice intentions"
  ON practice_intentions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice intentions"
  ON practice_intentions FOR UPDATE
  USING (auth.uid() = user_id);
