-- ============================================================
-- SEEN Phase 2: Migration 003 — Seed practice themes
-- ============================================================
-- Populates the practice_themes table with the 8 initial themes
-- defined in the Phase 2 briefing (section 3.3 / 3.4.1).
--
-- Safe to re-run: uses ON CONFLICT DO NOTHING on name.
-- To support this, we add a unique constraint on name first.
-- ============================================================

ALTER TABLE practice_themes
  ADD CONSTRAINT practice_themes_name_unique UNIQUE (name);

INSERT INTO practice_themes (name, description, display_order, is_active)
VALUES
  (
    'Awareness & pattern logging',
    'Notice and record your patterns as they happen — thoughts, triggers, emotions, and behaviors.',
    1,
    true
  ),
  (
    'Mindfulness & grounding',
    'Practices to bring you into the present moment when stress pulls you away.',
    2,
    true
  ),
  (
    'Defusion & acceptance',
    'Create distance from difficult thoughts and make room for uncomfortable feelings.',
    3,
    true
  ),
  (
    'Values & direction',
    'Clarify what matters to you and align your actions with those values.',
    4,
    true
  ),
  (
    'Emotion regulation',
    'Build skills to name, understand, and work with intense emotions.',
    5,
    true
  ),
  (
    'Behavioral experiments',
    'Test assumptions by trying new responses and observing what actually happens.',
    6,
    true
  ),
  (
    'Reflection & journaling',
    'Structured writing and reflection to process experiences and track progress.',
    7,
    true
  ),
  (
    'Self-assessment & mapping',
    'Map your behaviors, boundaries, and goals to build a clearer picture of where you are.',
    8,
    true
  )
ON CONFLICT (name) DO NOTHING;
