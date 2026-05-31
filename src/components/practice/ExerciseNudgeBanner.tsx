'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { X, Clock, ArrowRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface ScheduledExercise {
  id: string
  exercise_id: string | null
  title: string
  scheduled_at: string
  status: string
}

interface Props {
  upcomingExercises?: ScheduledExercise[]
}

// Show the banner from 15 min before the exercise until 30 min after,
// as long as it's still in "scheduled" status. After that window it's
// either too late or the user already started it.
const APPROACHING_MIN = 15
const OVERDUE_MIN = 30
const REFRESH_INTERVAL_MS = 30_000

function dismissKey(scheduledId: string) {
  return `seen_nudge_dismissed_${scheduledId}`
}

/**
 * Fixed banner that appears at the top of the screen when a scheduled
 * exercise is imminent (within 15 minutes) or just past start (within 30
 * minutes). The user can tap Start now to launch the guided flow, or
 * dismiss the banner for that exercise.
 *
 * Dismissal persists per scheduled_id in sessionStorage so it comes back
 * if the user closes and reopens the app — but doesn't nag while they're
 * actively using the app.
 */
export function ExerciseNudgeBanner({ upcomingExercises }: Props) {
  const theme = useTheme()
  const [now, setNow] = useState(() => Date.now())
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set())

  // Hydrate dismissed list from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !upcomingExercises) return
    const dismissed = new Set<string>()
    for (const ex of upcomingExercises) {
      if (sessionStorage.getItem(dismissKey(ex.id))) dismissed.add(ex.id)
    }
    setDismissedIds(dismissed)
  }, [upcomingExercises])

  // Re-evaluate every 30s so the banner appears/disappears around the threshold
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), REFRESH_INTERVAL_MS)
    return () => clearInterval(t)
  }, [])

  const imminent = useMemo(() => {
    if (!upcomingExercises) return null
    const lower = now - OVERDUE_MIN * 60_000
    const upper = now + APPROACHING_MIN * 60_000
    const candidates = upcomingExercises
      .filter(ex => ex.status === 'scheduled' && !dismissedIds.has(ex.id))
      .map(ex => ({ ex, t: new Date(ex.scheduled_at).getTime() }))
      .filter(({ t }) => t >= lower && t <= upper)
      .sort((a, b) => Math.abs(a.t - now) - Math.abs(b.t - now))
    return candidates[0] || null
  }, [upcomingExercises, now, dismissedIds])

  if (!imminent) return null

  const { ex, t } = imminent
  const diffMin = Math.round((t - now) / 60_000)

  let label: string
  if (diffMin > 0) {
    label = `In ${diffMin} min`
  } else if (diffMin === 0) {
    label = 'Now'
  } else {
    label = `${Math.abs(diffMin)} min ago`
  }

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(dismissKey(ex.id), '1')
    }
    setDismissedIds(prev => {
      const next = new Set(prev)
      next.add(ex.id)
      return next
    })
  }

  const startHref = ex.exercise_id
    ? `/practice/exercises/${ex.exercise_id}?scheduled=${ex.id}`
    : null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        padding: '0.6rem 1rem max(0.6rem, env(safe-area-inset-top))',
        paddingTop: 'max(0.6rem, env(safe-area-inset-top))',
        backgroundColor: theme.cyan,
        color: '#fff',
        boxShadow: '0 4px 16px rgba(78,205,196,0.25)',
      }}
    >
      <div
        className="max-w-lg mx-auto"
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Clock size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </p>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: '0.95rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {ex.title}
          </p>
        </div>
        {startHref ? (
          <Link
            href={startHref}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              backgroundColor: '#fff',
              color: theme.cyanDeep,
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
            }}
          >
            Start
            <ArrowRight size={14} />
          </Link>
        ) : null}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.85)',
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
