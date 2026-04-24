'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  MessageCircle,
  BookOpen,
  CheckCircle,
  Shield,
  Target,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface ScheduledExercise {
  id: string
  exercise_id: string | null
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number
  status: string
}

interface HomeSummary {
  activeIntentions: {
    id: string
    intention_text: string
    target_date: string | null
    status: string
    created_at: string
  }[]
  recentCompletions: {
    id: string
    exercise_id: string
    started_at: string
    completed_at: string
    self_rating: number | null
  }[]
  recommendedExercises: {
    id: string
    title: string
    description: string
    category: string
    duration_minutes: number
    is_onboarding: boolean
  }[]
  exercisesCompleted: number
  hasCheckedInToday: boolean
}

interface PracticeHomeProps {
  userName: string
  summary: HomeSummary | null
  upcomingExercises?: ScheduledExercise[]
  onMarkDone?: (id: string) => void
}

export function PracticeHome({ userName, summary, upcomingExercises, onMarkDone }: PracticeHomeProps) {
  const theme = useTheme()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      {/* Background gradient - cyan tinted */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${theme.cyan}12 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-8">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
            {greeting}, {userName}
          </p>
          <p style={{ color: theme.text, opacity: 0.5 }}>
            Your practice space
          </p>
        </div>

        {/* Check-in CTA — compact for Phase 2 */}
        <div
          className="rounded-2xl p-4 mb-4 flex items-center justify-between"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}25`, boxShadow: theme.shadow }}
        >
          {summary?.hasCheckedInToday ? (
            <>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} style={{ color: theme.cyan }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: theme.text }}>
                    Checked in today
                  </p>
                  <p className="text-xs" style={{ color: theme.text, opacity: 0.4 }}>
                    See you tomorrow
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <MessageCircle size={20} style={{ color: theme.cyan }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: theme.text }}>
                    Daily check-in
                  </p>
                  <p className="text-xs" style={{ color: theme.text, opacity: 0.4 }}>
                    A few minutes of honest reflection
                  </p>
                </div>
              </div>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ backgroundColor: theme.cyan, color: theme.text }}
              >
                Start
              </Link>
            </>
          )}
        </div>

        {/* Session Prep CTA */}
        <Link
          href="/practice/session-prep"
          className="block rounded-2xl p-4 mb-4 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}25`, boxShadow: theme.shadow }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={18} style={{ color: theme.cyan }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text }}>
                  Prepare for session
                </p>
                <p className="text-xs" style={{ color: theme.text, opacity: 0.4 }}>
                  Review your week before therapy
                </p>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: theme.text, opacity: 0.3 }} />
          </div>
        </Link>

        {/* Post-Session Reflection CTA */}
        <Link
          href="/practice/post-session"
          className="block rounded-2xl p-5 mb-4 relative overflow-hidden transition-all hover:scale-[1.01]"
          style={{ backgroundColor: theme.cyan }}
        >
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.text}20 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="font-bold text-lg mb-1" style={{ color: theme.text }}>
                I had a session
              </p>
              <p className="text-sm" style={{ color: theme.text, opacity: 0.8 }}>
                Reflect on your therapy session
              </p>
            </div>
            <ArrowRight size={20} style={{ color: theme.text }} />
          </div>
        </Link>

        {/* Active Practice Intentions */}
        {summary?.activeIntentions && summary.activeIntentions.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} style={{ color: theme.cyan }} />
              <p className="text-xs font-semibold" style={{ color: theme.cyan }}>
                Active intentions
              </p>
            </div>
            <div className="space-y-2">
              {summary.activeIntentions.map((intention) => (
                <div
                  key={intention.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: theme.cardHover }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.cyan }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: theme.text }}>
                      {intention.intention_text}
                    </p>
                    {intention.target_date && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar size={10} style={{ color: theme.text, opacity: 0.3 }} />
                        <p className="text-xs" style={{ color: theme.text, opacity: 0.3 }}>
                          By {new Date(intention.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Scheduled Exercises */}
        {upcomingExercises && upcomingExercises.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} style={{ color: theme.gold }} />
              <p className="text-xs font-semibold" style={{ color: theme.gold }}>
                Upcoming this week
              </p>
            </div>
            <div className="space-y-2">
              {upcomingExercises.map((scheduled) => {
                const scheduledDate = new Date(scheduled.scheduled_at)
                const now = new Date()
                const hoursUntil = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60)
                const isApproaching = hoursUntil > 0 && hoursUntil <= 1
                const startHref = scheduled.exercise_id
                  ? `/practice/exercises/${scheduled.exercise_id}?scheduled=${scheduled.id}`
                  : null

                return (
                  <div
                    key={scheduled.id}
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: isApproaching ? `${theme.gold}10` : theme.cardHover,
                      border: isApproaching ? `1px solid ${theme.gold}30` : 'none',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: theme.text }}>
                          {scheduled.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                          {scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {' at '}
                          {scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      {isApproaching && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: theme.gold, color: theme.bg }}
                        >
                          Soon
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {startHref && (
                        <Link
                          href={startHref}
                          className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.01]"
                          style={{
                            backgroundColor: isApproaching ? theme.gold : theme.cyan,
                            color: isApproaching ? theme.bg : theme.text,
                          }}
                        >
                          Start now
                        </Link>
                      )}
                      {onMarkDone && (
                        <button
                          onClick={() => onMarkDone(scheduled.id)}
                          className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            backgroundColor: 'transparent',
                            color: theme.textMuted,
                            border: `1px solid ${theme.textMuted}30`,
                          }}
                        >
                          Mark done
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recommended Exercises */}
        {summary?.recommendedExercises && summary.recommendedExercises.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen size={14} style={{ color: theme.cyan }} />
                <p className="text-xs font-semibold" style={{ color: theme.cyan }}>
                  Recommended exercises
                </p>
              </div>
              <Link
                href="/practice/exercises"
                className="text-xs font-semibold flex items-center gap-1"
                style={{ color: theme.text, opacity: 0.4 }}
              >
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {summary.recommendedExercises.map((exercise) => (
                <Link
                  key={exercise.id}
                  href={`/practice/exercises/${exercise.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ backgroundColor: theme.cardHover }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${theme.cyan}15` }}
                  >
                    <BookOpen size={18} style={{ color: theme.cyan }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: theme.text }}>
                      {exercise.title}
                    </p>
                    <p className="text-xs" style={{ color: theme.text, opacity: 0.4 }}>
                      {exercise.duration_minutes} min · {exercise.category}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: theme.text, opacity: 0.3 }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Progress summary */}
        {(summary?.exercisesCompleted ?? 0) > 0 && (
          <div
            className="rounded-2xl p-4 mb-4 flex items-center justify-between"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
          >
            <div className="flex items-center gap-3">
              <Heart size={16} style={{ color: theme.cyan }} />
              <p className="text-sm" style={{ color: theme.text, opacity: 0.7 }}>
                {summary?.exercisesCompleted} exercise{(summary?.exercisesCompleted ?? 0) !== 1 ? 's' : ''} completed
              </p>
            </div>
            <Link
              href="/insights"
              className="text-xs font-semibold"
              style={{ color: theme.cyan }}
            >
              View insights
            </Link>
          </div>
        )}

        {/* Clinical Disclaimer */}
        <div
          className="rounded-2xl p-4 mt-2"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}15`, boxShadow: theme.shadow }}
        >
          <div className="flex items-start gap-3">
            <Shield size={14} style={{ color: theme.cyan, flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
              These tools support your own reflection and self-awareness. They are not therapy,
              treatment, or medical advice, and do not replace professional guidance.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
