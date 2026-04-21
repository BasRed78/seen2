'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Target,
  MessageCircle,
  Heart,
  Star as StarLucide,
} from 'lucide-react'
import { colors } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'

interface User {
  id: string
  name: string
  current_phase?: string
}

interface PostSession {
  id: string
  created_at: string
  emotional_state: number | null
  theme_name: string | null
  reflection_text: string | null
  practice_intention: string | null
}

interface Completion {
  id: string
  exercise_title: string
  exercise_category: string | null
  completed_at: string
  self_rating: number | null
  reflection_text: string | null
}

interface Intention {
  id: string
  intention_text: string
  theme_name: string | null
  target_date: string | null
  status: string
  created_at: string
}

interface Stats {
  days_since_session: number | null
  checkins_count: number
  exercises_completed: number
  avg_self_rating: number | null
  intentions_active: number
  intentions_completed: number
}

interface PrepData {
  post_session: PostSession | null
  completions: Completion[]
  intentions: Intention[]
  stats: Stats
  used_fallback: boolean
}

export default function SessionPrepPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PrepData | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('seen_user')
    if (!stored) {
      router.push('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if ((parsed.current_phase || 'phase1') !== 'phase2') {
      router.push('/home')
      return
    }
    setUser(parsed)

    // Load persisted notes for this user
    const savedNotes = localStorage.getItem(`seen_session_prep_notes_${parsed.id}`)
    if (savedNotes) setNotes(savedNotes)

    fetch(`/api/practice/session-prep?userId=${parsed.id}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load session prep:', err)
        setLoading(false)
      })
  }, [router])

  // Persist notes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`seen_session_prep_notes_${user.id}`, notes)
    }
  }, [notes, user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <StarIcon size={40} style={{ color: colors.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  const postSession = data?.post_session
  const stats = data?.stats
  const completions = data?.completions || []
  const intentions = data?.intentions || []
  const activeIntentions = intentions.filter(i => i.status === 'active')
  const completedIntentions = intentions.filter(i => i.status === 'completed')

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.dark }}>
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${colors.cyan}12 0%, transparent 40%)`,
        }}
      />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 px-6 py-4" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/home" className="p-2 -ml-2">
            <ArrowLeft size={20} style={{ color: colors.cream }} />
          </Link>
          <p className="text-lg font-bold" style={{ color: colors.cream }}>Session prep</p>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-8">
        {/* Intro */}
        <div className="mb-5">
          <p className="text-sm" style={{ color: colors.creamMuted }}>
            A snapshot of your week to take into your next session.
          </p>
        </div>

        {/* Since last session — hero card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}25` }}
        >
          {postSession ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} style={{ color: colors.cyan }} />
                <p className="text-xs font-semibold" style={{ color: colors.cyan }}>
                  Since your last session
                </p>
              </div>
              <p className="text-2xl font-bold mb-4" style={{ color: colors.cream }}>
                {stats?.days_since_session === 0
                  ? 'Today'
                  : stats?.days_since_session === 1
                  ? '1 day ago'
                  : `${stats?.days_since_session} days ago`}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: colors.darkCardHover }}>
                  <p className="text-xl font-bold" style={{ color: colors.cyan }}>
                    {stats?.checkins_count || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.creamMuted }}>Check-ins</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: colors.darkCardHover }}>
                  <p className="text-xl font-bold" style={{ color: colors.cyan }}>
                    {stats?.exercises_completed || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.creamMuted }}>Exercises</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: colors.darkCardHover }}>
                  <p className="text-xl font-bold" style={{ color: colors.cyan }}>
                    {stats?.intentions_completed || 0}
                    <span className="text-sm font-normal" style={{ color: colors.creamMuted }}>
                      /{(stats?.intentions_active || 0) + (stats?.intentions_completed || 0)}
                    </span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.creamMuted }}>Intentions</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} style={{ color: colors.cyan }} />
                <p className="text-xs font-semibold" style={{ color: colors.cyan }}>
                  Your recent practice
                </p>
              </div>
              <p className="text-sm" style={{ color: colors.creamMuted }}>
                Showing the last 14 days. After your next session, this view will be scoped to the time between sessions.
              </p>
            </>
          )}
        </div>

        {/* Last session reflection */}
        {postSession && (postSession.reflection_text || postSession.theme_name) && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={14} style={{ color: colors.cream, opacity: 0.5 }} />
              <p className="text-xs font-semibold" style={{ color: colors.cream, opacity: 0.5 }}>
                What came up last time
              </p>
            </div>
            {postSession.theme_name && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{ backgroundColor: `${colors.cyan}20`, color: colors.cyan }}
              >
                {postSession.theme_name}
              </span>
            )}
            {postSession.reflection_text && (
              <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
                {postSession.reflection_text}
              </p>
            )}
          </div>
        )}

        {/* Practice intentions */}
        {(activeIntentions.length > 0 || completedIntentions.length > 0) && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} style={{ color: colors.cyan }} />
              <p className="text-xs font-semibold" style={{ color: colors.cyan }}>
                Practice intentions
              </p>
            </div>
            <div className="space-y-2">
              {activeIntentions.map(i => (
                <div
                  key={i.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: colors.darkCardHover }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: colors.cyan }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: colors.cream }}>
                      {i.intention_text}
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.creamMuted }}>
                      Active
                    </p>
                  </div>
                </div>
              ))}
              {completedIntentions.map(i => (
                <div
                  key={i.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: colors.darkCardHover, opacity: 0.7 }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: colors.cyan, opacity: 0.5 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-through" style={{ color: colors.cream, opacity: 0.7 }}>
                      {i.intention_text}
                    </p>
                    <p className="text-xs mt-1" style={{ color: colors.creamMuted }}>
                      Completed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises completed */}
        {completions.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen size={14} style={{ color: colors.cyan }} />
                <p className="text-xs font-semibold" style={{ color: colors.cyan }}>
                  What you practiced
                </p>
              </div>
              {stats?.avg_self_rating != null && (
                <div className="flex items-center gap-1">
                  <StarLucide size={12} style={{ color: colors.gold }} fill={colors.gold} />
                  <span className="text-xs font-semibold" style={{ color: colors.cream }}>
                    {stats.avg_self_rating} avg
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {completions.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: colors.darkCardHover }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: colors.cream }}>
                        {c.exercise_title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: colors.creamMuted }}>
                        {new Date(c.completed_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {c.self_rating != null && (
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map(n => (
                          <StarLucide
                            key={n}
                            size={10}
                            style={{ color: n <= c.self_rating! ? colors.gold : colors.creamMuted }}
                            fill={n <= c.self_rating! ? colors.gold : 'none'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {c.reflection_text && (
                    <p className="text-xs mt-2 pl-0 italic" style={{ color: colors.creamMuted }}>
                      &ldquo;{c.reflection_text}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {completions.length === 0 && activeIntentions.length === 0 && completedIntentions.length === 0 && (
          <div
            className="rounded-2xl p-5 mb-4 text-center"
            style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Heart size={20} style={{ color: colors.cyan, opacity: 0.5, margin: '0 auto 8px' }} />
            <p className="text-sm" style={{ color: colors.cream }}>
              Nothing to show here yet.
            </p>
            <p className="text-xs mt-1" style={{ color: colors.creamMuted }}>
              Reflect after your sessions and schedule some practice to see this fill up.
            </p>
          </div>
        )}

        {/* Notes to bring up */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}25` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} style={{ color: colors.cyan }} />
            <p className="text-xs font-semibold" style={{ color: colors.cyan }}>
              Notes to bring up
            </p>
          </div>
          <p className="text-xs mb-3" style={{ color: colors.creamMuted }}>
            Jot down things you want to discuss. Saved on your device only.
          </p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Something I noticed this week..."
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
            rows={5}
            style={{
              backgroundColor: colors.dark,
              border: '1px solid rgba(255,255,255,0.08)',
              color: colors.cream,
            }}
          />
        </div>

        {/* Clinical disclaimer */}
        <div
          className="rounded-2xl p-4 mt-2"
          style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}15` }}
        >
          <p className="text-xs leading-relaxed" style={{ color: colors.creamMuted }}>
            This is a tool to help you prepare. Your therapist leads the session.
          </p>
        </div>
      </div>
    </div>
  )
}
