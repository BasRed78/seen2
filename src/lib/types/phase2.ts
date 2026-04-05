// ============================================================
// SEEN Phase 2: Type definitions
// ============================================================

// --- Enum-like union types ---

export type UserPhase = 'phase1' | 'phase2' | 'phase3'

export type PhaseStatus = 'active' | 'inactive'

export type CheckinType = 'daily' | 'post_session'

export type ExerciseCategory =
  | 'awareness'
  | 'mindfulness'
  | 'defusion'
  | 'values'
  | 'emotion_regulation'
  | 'behavioral'
  | 'reflection'
  | 'self_assessment'

export type ExerciseType =
  | 'reflection'
  | 'journaling'
  | 'behavioral'
  | 'grounding'
  | 'psychoeducation'
  | 'mapping'

export type IntentionStatus = 'active' | 'completed' | 'skipped' | 'expired'

// The six stress-response patterns
export type PatternType =
  | 'intimacy_seeking'
  | 'substance_soothing'
  | 'compulsive_spending'
  | 'achievement_hiding'
  | 'approval_chasing'
  | 'withdrawal_avoidance'

// --- Phase 2 fields added to existing tables ---

export interface UserPhase2Fields {
  current_phase: UserPhase
  in_therapy: boolean
  phase2_activated_at: string | null
  subscription_tier: string | null
}

export interface CheckinPhase2Fields {
  checkin_type: CheckinType
}

// --- New table row types ---

export interface UserPhaseStatusRow {
  id: string
  user_id: string
  phase: UserPhase
  status: PhaseStatus
  activated_at: string
  deactivated_at: string | null
}

export interface PracticeTheme {
  id: string
  name: string
  description: string | null
  display_order: number
  is_active: boolean
}

export interface Exercise {
  id: string
  title: string
  description: string | null
  instructions: ExerciseInstructions | null
  theme_id: string | null
  category: ExerciseCategory
  exercise_type: ExerciseType
  duration_minutes: number | null
  pattern_relevance: PatternType[] | null
  methodology: string | null
  is_onboarding: boolean
  display_order: number
  is_active: boolean
}

// Structured format for exercise instructions stored as jsonb
export interface ExerciseInstructions {
  steps: ExerciseStep[]
  intro?: string
  closing?: string
}

export interface ExerciseStep {
  order: number
  text: string
  duration_minutes?: number
  type?: 'instruction' | 'prompt' | 'pause' | 'reflection'
}

export interface PostSessionCheckin {
  id: string
  user_id: string
  created_at: string
  emotional_state: number | null
  selected_theme_id: string | null
  reflection_text: string | null
  practice_intention: string | null
  scheduled_practice_at: string | null
}

export interface ExerciseCompletion {
  id: string
  user_id: string
  exercise_id: string
  started_at: string
  completed_at: string | null
  reflection_text: string | null
  self_rating: number | null
}

export interface PracticeIntention {
  id: string
  user_id: string
  post_session_checkin_id: string | null
  intention_text: string | null
  theme_id: string | null
  created_at: string
  target_date: string | null
  status: IntentionStatus
  completed_at: string | null
}
