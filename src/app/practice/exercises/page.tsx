'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { StarIcon } from '@/components/StarIcon'
import { BottomNav } from '@/components/BottomNav'

interface User {
  id: string
  name: string
  current_phase?: string
}

interface PracticeTheme {
  id: string
  name: string
  description: string | null
  display_order: number
}

interface Exercise {
  id: string
  title: string
  description: string | null
  theme_id: string | null
  category: string
  exercise_type: string
  duration_minutes: number | null
  is_onboarding: boolean
}

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

export default function ExercisesPage() {
  const theme = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [themes, setThemes] = useState<PracticeTheme[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
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

    // Fetch themes and exercises in parallel
    Promise.all([
      fetch('/api/practice/themes').then(r => r.json()),
      fetch('/api/practice/exercises').then(r => r.json()),
    ]).then(([themesData, exercisesData]) => {
      setThemes(themesData.themes || [])
      setExercises(exercisesData.exercises || [])
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load data:', err)
      setLoading(false)
    })
  }, [router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <StarIcon size={40} style={{ color: theme.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  // Filter exercises by selected theme
  const filteredExercises = selectedThemeId
    ? exercises.filter(e => e.theme_id === selectedThemeId)
    : exercises

  // Group exercises by category for display
  const grouped: Record<string, Exercise[]> = {}
  filteredExercises.forEach(ex => {
    const cat = ex.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(ex)
  })

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
            <BookOpen size={16} style={{ color: theme.cyan }} />
            <span className="font-bold" style={{ color: theme.text }}>Exercises</span>
          </div>
        </div>

        {/* Intro */}
        <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
          Guided exercises to support your practice between sessions.
        </p>

        {/* Theme filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedThemeId(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: !selectedThemeId ? theme.cyan + '30' : theme.card,
              color: !selectedThemeId ? theme.cyan : theme.textMuted,
              border: `1px solid ${!selectedThemeId ? theme.cyan + '50' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            All
          </button>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedThemeId(t.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: selectedThemeId === t.id ? theme.cyan + '30' : theme.card,
                color: selectedThemeId === t.id ? theme.cyan : theme.textMuted,
                border: `1px solid ${selectedThemeId === t.id ? theme.cyan + '50' : theme.border}`,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Exercise list grouped by category */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: theme.textMuted }}>No exercises found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, exs]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: theme.cyan }}>
                  {categoryLabels[category] || category}
                </p>
                <div className="space-y-2">
                  {exs.map(ex => (
                    <Link
                      key={ex.id}
                      href={`/practice/exercises/${ex.id}`}
                      className="block rounded-2xl p-4 transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: theme.card,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-3">
                          <p className="font-medium text-sm mb-1" style={{ color: theme.text }}>
                            {ex.title}
                          </p>
                          {ex.description && (
                            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: theme.textMuted }}>
                              {ex.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {ex.duration_minutes && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: theme.textMuted }}>
                                <Clock size={12} />
                                {ex.duration_minutes} min
                              </span>
                            )}
                            {ex.is_onboarding && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: theme.cyan + '20', color: theme.cyan }}
                              >
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={18} style={{ color: theme.cyan, flexShrink: 0 }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentPage="practice" phase="phase2" />
    </div>
  )
}
