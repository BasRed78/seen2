'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  BookOpen,
  Target,
  Check,
  X,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { StarIcon } from '@/components/StarIcon'
import { BottomNav } from '@/components/BottomNav'

interface Checkin {
  id: string
  created_at: string
  emotional_state: number
  theme_name: string | null
  reflection_text: string | null
  practice_intention: string | null
}

interface Completion {
  id: string
  exercise_title: string
  exercise_category: string
  started_at: string
  completed_at: string
  self_rating: number | null
  duration_minutes: number | null
}

interface Intention {
  id: string
  intention_text: string
  theme_name: string | null
  target_date: string | null
  status: string
  created_at: string
  completed_at: string | null
}

interface Stats {
  total_checkins: number
  total_exercises_completed: number
  avg_self_rating: number | null
  avg_emotional_state: number | null
  intentions_completed: number
  intentions_total: number
}

type TimelineEntry =
  | { type: 'checkin'; date: string; data: Checkin }
  | { type: 'exercise'; date: string; data: Completion }
  | { type: 'intention'; date: string; data: Intention }

const categoryLabels: Record<string, string> = {
  awareness: 'Awareness',
  mindfulness: 'Mindfulness',
  defusion: 'Defusion',
  values: 'Values',
  emotion_regulation: 'Emotion Regulation',
  behavioral: 'Behavioral',
  reflection: 'Reflection',
  self_assessment: 'Self-Assessment',
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function RatingStars({ rating }: { rating: number }) {
  const theme = useTheme()
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          style={{
            color: i < rating ? theme.gold : theme.cardHover,
            fill: i < rating ? theme.gold : 'none',
          }}
        />
      ))}
    </div>
  )
}

export default function PracticeHistoryPage() {
  const theme = useTheme()
  const [user, setUser] = useState<{ id: string; name: string; current_phase?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [intentions, setIntentions] = useState<Intention[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [updatingIntention, setUpdatingIntention] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    const parsed = JSON.parse(storedUser)
    if ((parsed.current_phase || 'phase1') !== 'phase2') {
      router.push('/home')
      return
    }
    setUser(parsed)
  }, [router])

  useEffect(() => {
    if (!user) return
    fetchHistory()
  }, [user, period])

  const fetchHistory = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`/api/practice/history?userId=${user.id}&period=${period}`)
      if (res.ok) {
        const data = await res.json()
        setCheckins(data.checkins || [])
        setCompletions(data.completions || [])
        setIntentions(data.intentions || [])
        setStats(data.stats || null)
      }
    } catch (err) {
      console.error('Failed to fetch practice history:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const updateIntention = async (intentionId: string, status: 'completed' | 'skipped') => {
    if (!user) return
    setUpdatingIntention(intentionId)
    try {
      const res = await fetch(`/api/practice/intentions/${intentionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, status }),
      })
      if (res.ok) {
        setIntentions(prev =>
          prev.map(i =>
            i.id === intentionId
              ? { ...i, status, completed_at: status === 'completed' ? new Date().toISOString() : null }
              : i
          )
        )
        // Update stats
        if (stats && status === 'completed') {
          setStats({ ...stats, intentions_completed: stats.intentions_completed + 1 })
        }
      }
    } catch (err) {
      console.error('Failed to update intention:', err)
    } finally {
      setUpdatingIntention(null)
    }
  }

  // Build unified timeline
  const timeline: TimelineEntry[] = [
    ...checkins.map(c => ({ type: 'checkin' as const, date: c.created_at, data: c })),
    ...completions.map(c => ({ type: 'exercise' as const, date: c.completed_at, data: c })),
    ...intentions.map(i => ({ type: 'intention' as const, date: i.created_at, data: i })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Active intentions (for the tracker section)
  const activeIntentions = intentions.filter(i => i.status === 'active')
  const pastDueIntentions = activeIntentions.filter(
    i => i.target_date && new Date(i.target_date) < new Date()
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <StarIcon size={40} style={{ color: theme.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: theme.bg }}>
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${theme.cyan}12 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/practice')}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.card }}
          >
            <ArrowLeft size={18} style={{ color: theme.text }} />
          </button>
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: theme.cyan }} />
            <span className="font-bold" style={{ color: theme.text }}>Practice History</span>
          </div>
        </div>

        {/* Period filter */}
        <div className="flex gap-2 mb-6">
          {(['7d', '30d', 'all'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: period === p ? theme.cyan + '25' : theme.card,
                color: period === p ? theme.cyan : theme.textMuted,
                border: `1px solid ${period === p ? theme.cyan + '50' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {p === '7d' ? '7 days' : p === '30d' ? '30 days' : 'All time'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <StarIcon size={32} style={{ color: theme.cyan, animation: 'pulse 2s infinite' }} />
          </div>
        ) : timeline.length === 0 && activeIntentions.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <Clock size={48} style={{ color: theme.cyan, opacity: 0.3 }} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
              No practice activity yet
            </h2>
            <p className="text-sm mb-8" style={{ color: theme.textMuted }}>
              Complete a post-session reflection or an exercise to start building your history.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/practice/post-session"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: theme.cyan, color: theme.text }}
              >
                <MessageCircle size={16} /> Post-Session Reflection
              </Link>
              <Link
                href="/practice/exercises"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: theme.card, color: theme.text, border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <BookOpen size={16} /> Browse Exercises
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            {stats && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: theme.card }}>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.textMuted }}>
                    Sessions
                  </p>
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {stats.total_checkins}
                  </p>
                  <p className="text-xs" style={{ color: theme.textMuted }}>reflected</p>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: theme.card }}>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.textMuted }}>
                    Exercises
                  </p>
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {stats.total_exercises_completed}
                  </p>
                  <p className="text-xs" style={{ color: theme.textMuted }}>completed</p>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: theme.card }}>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.textMuted }}>
                    Intentions
                  </p>
                  <p className="text-2xl font-bold" style={{ color: theme.text }}>
                    {stats.intentions_completed}
                    <span className="text-sm font-normal" style={{ color: theme.textMuted }}>
                      /{stats.intentions_total}
                    </span>
                  </p>
                  <p className="text-xs" style={{ color: theme.textMuted }}>met</p>
                </div>
              </div>
            )}

            {/* Active intentions tracker */}
            {activeIntentions.length > 0 && (
              <div
                className="rounded-2xl p-5 mb-6"
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}20` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target size={14} style={{ color: theme.cyan }} />
                  <p className="text-xs font-semibold" style={{ color: theme.cyan }}>
                    Active intentions ({activeIntentions.length})
                  </p>
                </div>
                <div className="space-y-3">
                  {activeIntentions.map(intention => {
                    const isPastDue = intention.target_date && new Date(intention.target_date) < new Date()
                    return (
                      <div
                        key={intention.id}
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: theme.cardHover,
                          borderLeft: `3px solid ${isPastDue ? theme.coral : theme.cyan}`,
                        }}
                      >
                        <p className="text-sm mb-1" style={{ color: theme.text }}>
                          {intention.intention_text}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {intention.target_date && (
                              <span className="text-xs" style={{ color: isPastDue ? theme.coral : theme.textMuted }}>
                                {isPastDue ? 'Past due: ' : 'By '}
                                {new Date(intention.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                            {intention.theme_name && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: theme.cyan + '15', color: theme.cyan }}
                              >
                                {intention.theme_name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateIntention(intention.id, 'completed')}
                              className="p-1.5 rounded-lg transition-all"
                              style={{
                                backgroundColor: theme.cyan + '20',
                                opacity: updatingIntention === intention.id ? 0.5 : 1,
                              }}
                            >
                              <Check size={14} style={{ color: theme.cyan }} />
                            </button>
                            <button
                              onClick={() => updateIntention(intention.id, 'skipped')}
                              className="p-1.5 rounded-lg transition-all"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                opacity: updatingIntention === intention.id ? 0.5 : 1,
                              }}
                            >
                              <X size={14} style={{ color: theme.textMuted }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>
                  Timeline
                </p>
                <div className="space-y-3">
                  {timeline.map(entry => {
                    const isExpanded = expandedItems.has(entry.data.id)

                    if (entry.type === 'checkin') {
                      const c = entry.data as Checkin
                      return (
                        <div
                          key={`checkin-${c.id}`}
                          className="rounded-xl p-4"
                          style={{
                            backgroundColor: theme.card,
                            borderLeft: `3px solid ${theme.cyan}`,
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MessageCircle size={14} style={{ color: theme.cyan }} />
                              <span className="text-xs font-medium" style={{ color: theme.cyan }}>
                                Session reflection
                              </span>
                            </div>
                            <span className="text-xs" style={{ color: theme.textMuted }}>
                              {formatRelativeDate(c.created_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                              style={{ backgroundColor: theme.cyan + '20', color: theme.cyan }}
                            >
                              {c.emotional_state}
                            </div>
                            <span className="text-sm" style={{ color: theme.text }}>
                              Feeling: {c.emotional_state}/10
                            </span>
                            {c.theme_name && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: theme.cyan + '15', color: theme.cyan }}
                              >
                                {c.theme_name}
                              </span>
                            )}
                          </div>

                          {c.reflection_text && (
                            <div>
                              <p
                                className={`text-sm leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}
                                style={{ color: theme.text, opacity: 0.8 }}
                              >
                                {c.reflection_text}
                              </p>
                              {c.reflection_text.length > 120 && (
                                <button
                                  onClick={() => toggleExpanded(c.id)}
                                  className="text-xs mt-1 font-medium"
                                  style={{ color: theme.cyan }}
                                >
                                  {isExpanded ? 'Show less' : 'Read more'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }

                    if (entry.type === 'exercise') {
                      const c = entry.data as Completion
                      return (
                        <div
                          key={`exercise-${c.id}`}
                          className="rounded-xl p-4"
                          style={{
                            backgroundColor: theme.card,
                            borderLeft: `3px solid ${theme.gold}`,
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <BookOpen size={14} style={{ color: theme.gold }} />
                              <span className="text-xs font-medium" style={{ color: theme.gold }}>
                                Exercise completed
                              </span>
                            </div>
                            <span className="text-xs" style={{ color: theme.textMuted }}>
                              {formatRelativeDate(c.completed_at)}
                            </span>
                          </div>

                          <p className="text-sm font-semibold mb-1" style={{ color: theme.text }}>
                            {c.exercise_title}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: theme.textMuted }}>
                              {categoryLabels[c.exercise_category] || c.exercise_category}
                            </span>
                            {c.duration_minutes != null && (
                              <span className="text-xs" style={{ color: theme.textMuted }}>
                                {c.duration_minutes} min
                              </span>
                            )}
                            {c.self_rating != null && <RatingStars rating={c.self_rating} />}
                          </div>
                        </div>
                      )
                    }

                    if (entry.type === 'intention') {
                      const i = entry.data as Intention
                      const statusColors: Record<string, string> = {
                        active: theme.cyan,
                        completed: theme.cyan,
                        skipped: theme.textMuted,
                        expired: theme.coral,
                      }
                      const statusLabels: Record<string, string> = {
                        active: 'Active',
                        completed: 'Completed',
                        skipped: 'Skipped',
                        expired: 'Expired',
                      }
                      return (
                        <div
                          key={`intention-${i.id}`}
                          className="rounded-xl p-4"
                          style={{
                            backgroundColor: theme.card,
                            borderLeft: `3px solid ${theme.cyanLight}`,
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Target size={14} style={{ color: theme.cyanLight }} />
                              <span className="text-xs font-medium" style={{ color: theme.cyanLight }}>
                                Intention set
                              </span>
                            </div>
                            <span className="text-xs" style={{ color: theme.textMuted }}>
                              {formatRelativeDate(i.created_at)}
                            </span>
                          </div>

                          <p className="text-sm mb-2" style={{ color: theme.text }}>
                            {i.intention_text}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: statusColors[i.status] + '20',
                                color: statusColors[i.status],
                              }}
                            >
                              {statusLabels[i.status] || i.status}
                            </span>
                            {i.theme_name && (
                              <span className="text-xs" style={{ color: theme.textMuted }}>
                                {i.theme_name}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }

                    return null
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav currentPage="practice" phase="phase2" />
    </div>
  )
}
