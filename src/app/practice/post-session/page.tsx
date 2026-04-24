'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, Check, Calendar, Plus, Clock, ChevronDown } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { StarIcon } from '@/components/StarIcon'
import { VoiceMicButton } from '@/components/VoiceMicButton'
import useVoiceInput from '@/hooks/useVoiceInput'
import { downloadICS } from '@/lib/calendar/ics'

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
  category: string
  duration_minutes: number | null
}

interface SelectedExercise {
  exerciseId?: string
  title: string
  description: string
  durationMinutes: number
}

interface ScheduleEntry {
  date: string
  time: string
}

const TOTAL_STEPS = 6

export default function PostSessionPage() {
  const theme = useTheme()
  const [user, setUser] = useState<{ id: string; name: string; current_phase?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  // Form state
  const [emotionalState, setEmotionalState] = useState<number | null>(null)
  const [themes, setThemes] = useState<PracticeTheme[]>([])
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([])
  const [reflectionText, setReflectionText] = useState('')
  const [intentionText, setIntentionText] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [themesLoading, setThemesLoading] = useState(false)

  // Exercise selection state (step 4)
  const [matchedExercises, setMatchedExercises] = useState<Exercise[]>([])
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [showAllExercises, setShowAllExercises] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([])
  const [customActivityText, setCustomActivityText] = useState('')
  const [exercisesLoading, setExercisesLoading] = useState(false)

  // Scheduling state (step 5)
  const [scheduleEntries, setScheduleEntries] = useState<Record<number, ScheduleEntry>>({})

  // Voice input for reflection textarea
  const reflectionVoice = useVoiceInput({
    onTranscript: (text) => setReflectionText(text),
  })

  // Voice input for intention textarea
  const intentionVoice = useVoiceInput({
    onTranscript: (text) => setIntentionText(text),
  })

  // Auth & phase gate
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
    setLoading(false)
  }, [router])

  // Pre-fetch themes on page load
  useEffect(() => {
    setThemesLoading(true)
    fetch('/api/practice/themes')
      .then(res => res.json())
      .then(data => setThemes(data.themes || []))
      .catch(err => console.error('Failed to load themes:', err))
      .finally(() => setThemesLoading(false))
  }, [])

  const toggleTheme = (themeId: string) => {
    setSelectedThemeIds(prev =>
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    )
  }

  const selectedThemeNames = themes
    .filter(t => selectedThemeIds.includes(t.id))
    .map(t => t.name)

  // Fetch matched exercises when entering step 4
  useEffect(() => {
    if (step !== 4 || matchedExercises.length > 0) return
    setExercisesLoading(true)

    // Fetch exercises matching selected themes
    const fetchMatched = async () => {
      const exerciseSet = new Map<string, Exercise>()

      for (const themeId of selectedThemeIds) {
        try {
          const res = await fetch(`/api/practice/exercises?themeId=${themeId}`)
          const data = await res.json()
          for (const ex of (data.exercises || [])) {
            exerciseSet.set(ex.id, ex)
          }
        } catch { /* ignore */ }
      }

      setMatchedExercises(Array.from(exerciseSet.values()).slice(0, 6))
      setExercisesLoading(false)
    }

    fetchMatched()
  }, [step, selectedThemeIds, matchedExercises.length])

  // Fetch all exercises when user expands the list
  useEffect(() => {
    if (!showAllExercises || allExercises.length > 0) return

    fetch('/api/practice/exercises')
      .then(res => res.json())
      .then(data => setAllExercises(data.exercises || []))
      .catch(() => {})
  }, [showAllExercises, allExercises.length])

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => {
      const exists = prev.find(e => e.exerciseId === exercise.id)
      if (exists) {
        return prev.filter(e => e.exerciseId !== exercise.id)
      }
      return [...prev, {
        exerciseId: exercise.id,
        title: exercise.title,
        description: exercise.description || '',
        durationMinutes: exercise.duration_minutes || 15,
      }]
    })
  }

  const addCustomActivity = () => {
    if (!customActivityText.trim()) return
    setSelectedExercises(prev => [...prev, {
      title: customActivityText.trim(),
      description: 'Custom activity',
      durationMinutes: 15,
    }])
    setCustomActivityText('')
  }

  const getNextWeekDates = () => {
    const dates: string[] = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const updateSchedule = (index: number, field: 'date' | 'time', value: string) => {
    setScheduleEntries(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return emotionalState !== null
      case 2: return selectedThemeIds.length > 0 || reflectionText.trim().length > 0
      case 3: return true // intention is optional
      case 4: return true // exercise selection is optional
      case 5: return selectedExercises.length === 0 || Object.keys(scheduleEntries).length > 0
      case 6: return true
      default: return false
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    if (step === 1) {
      router.push('/practice')
    } else {
      setStep(step - 1)
      scrollToTop()
    }
  }

  const handleNext = () => {
    if (!canProceed()) return
    if (step === 4 && selectedExercises.length === 0) {
      // Skip scheduling if no exercises selected
      setStep(6)
      scrollToTop()
      return
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
      scrollToTop()
    }
  }

  const handleSkipIntention = () => {
    setIntentionText('')
    setTargetDate('')
    setStep(4)
    scrollToTop()
  }

  const handleSkipExercises = () => {
    setSelectedExercises([])
    setStep(6) // Skip to confirmation
    scrollToTop()
  }

  const handleSkipScheduling = () => {
    setStep(6)
    scrollToTop()
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)

    try {
      const response = await fetch('/api/practice/post-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          emotionalState,
          themeIds: selectedThemeIds,
          reflectionText: reflectionText.trim(),
          intentionText: intentionText.trim() || undefined,
          targetDate: targetDate || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('Failed to save:', data.error)
        setSubmitting(false)
        return
      }

      const result = await response.json()

      // Schedule exercises if any were selected with times
      if (selectedExercises.length > 0 && Object.keys(scheduleEntries).length > 0) {
        const exercisesToSchedule = selectedExercises
          .map((ex, i) => {
            const schedule = scheduleEntries[i]
            if (!schedule?.date || !schedule?.time) return null
            return {
              exerciseId: ex.exerciseId,
              customTitle: ex.exerciseId ? undefined : ex.title,
              title: ex.title,
              description: ex.description,
              scheduledAt: new Date(`${schedule.date}T${schedule.time}`).toISOString(),
              durationMinutes: ex.durationMinutes,
            }
          })
          .filter(Boolean)

        if (exercisesToSchedule.length > 0) {
          // Save to database for in-app tracking
          await fetch('/api/calendar/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              exercises: exercisesToSchedule,
              postSessionCheckinId: result.checkin?.id,
            }),
          })
        }
      }

      setSubmitted(true)
      setTimeout(() => router.push('/practice'), 2000)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <StarIcon size={40} style={{ color: theme.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: theme.bg }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: theme.cyan + '20' }}
          >
            <Check size={32} style={{ color: theme.cyan }} />
          </div>
          <p className="text-xl font-bold mb-2" style={{ color: theme.text }}>Reflection saved</p>
          <p className="text-sm" style={{ color: theme.textMuted }}>Returning to your practice space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.bg }}>
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${theme.cyan}10 0%, transparent 50%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft size={22} style={{ color: theme.text }} />
          </button>
          <span className="text-sm font-medium" style={{ color: theme.textMuted }}>
            Post-Session Reflection
          </span>
          <div className="w-8" />
        </div>

        {/* Progress dots */}
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i + 1 === step ? 24 : 8,
                height: 8,
                backgroundColor: i + 1 <= step ? theme.cyan : theme.cardHover,
              }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 px-6 pb-32">
        <div className="max-w-lg mx-auto">

          {/* Step 1: Emotional check-in */}
          {step === 1 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                How are you feeling right now?
              </p>
              <p className="text-sm mb-8" style={{ color: theme.textMuted }}>
                After your session today
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setEmotionalState(num)}
                    className="w-12 h-12 rounded-full font-semibold text-lg transition-all"
                    style={{
                      backgroundColor: emotionalState === num ? theme.cyan : theme.card,
                      color: emotionalState === num ? theme.text : theme.textMuted,
                      border: `2px solid ${emotionalState === num ? theme.cyan : 'rgba(255,255,255,0.08)'}`,
                      transform: emotionalState === num ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-4 px-2">
                <span className="text-xs" style={{ color: theme.textMuted }}>Low</span>
                <span className="text-xs" style={{ color: theme.textMuted }}>High</span>
              </div>
            </div>
          )}

          {/* Step 2: Topics + Reflection (combined) */}
          {step === 2 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                What came up in your session?
              </p>
              <p className="text-sm mb-5" style={{ color: theme.textMuted }}>
                Select any topics that came up
              </p>

              {/* Theme chips */}
              {themesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" style={{ color: theme.cyan }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {themes.map(t => {
                    const isSelected = selectedThemeIds.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTheme(t.id)}
                        className="px-3 py-3 rounded-xl text-sm font-medium transition-all text-left"
                        style={{
                          backgroundColor: isSelected ? theme.cyan + '20' : theme.card,
                          color: isSelected ? theme.cyan : theme.textMuted,
                          border: `1.5px solid ${isSelected ? theme.cyan : theme.border}`,
                        }}
                      >
                        {t.name}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Reflection textarea */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  Capture any thoughts, insights, or ideas
                </p>
                {reflectionVoice.supported && (
                  <VoiceMicButton
                    listening={reflectionVoice.listening}
                    onToggle={() => {
                      if (reflectionVoice.listening) {
                        reflectionVoice.stop()
                      } else {
                        reflectionVoice.setPrefix(reflectionText)
                        reflectionVoice.start()
                      }
                    }}
                  />
                )}
              </div>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder={reflectionVoice.listening ? 'Listening...' : 'Write or speak freely — this is just for you...'}
                rows={5}
                className="w-full px-4 py-4 rounded-xl text-sm leading-relaxed resize-none focus:outline-none transition-all"
                style={{
                  backgroundColor: theme.card,
                  border: `1px solid ${reflectionVoice.listening ? theme.cyan + '40' : 'rgba(255,255,255,0.08)'}`,
                  color: theme.text,
                }}
              />
            </div>
          )}

          {/* Step 3: Practice intention (optional) */}
          {step === 3 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                Set a practice intention
              </p>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  Is there something you'd like to practice before your next session?
                </p>
                {intentionVoice.supported && (
                  <VoiceMicButton
                    listening={intentionVoice.listening}
                    onToggle={() => {
                      if (intentionVoice.listening) {
                        intentionVoice.stop()
                      } else {
                        intentionVoice.setPrefix(intentionText)
                        intentionVoice.start()
                      }
                    }}
                  />
                )}
              </div>

              <textarea
                value={intentionText}
                onChange={(e) => setIntentionText(e.target.value)}
                placeholder={intentionVoice.listening ? 'Listening...' : 'e.g. Notice when I start avoiding difficult conversations...'}
                rows={3}
                className="w-full px-4 py-4 rounded-xl text-sm leading-relaxed resize-none focus:outline-none transition-all mb-4"
                style={{
                  backgroundColor: theme.card,
                  border: `1px solid ${intentionVoice.listening ? theme.cyan + '40' : 'rgba(255,255,255,0.08)'}`,
                  color: theme.text,
                }}
                autoFocus
              />

              <div className="flex items-center gap-3 mb-6">
                <Calendar size={18} style={{ color: theme.textMuted }} />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: theme.card,
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: theme.text,
                    colorScheme: 'dark',
                  }}
                />
              </div>

              <button
                onClick={handleSkipIntention}
                className="w-full text-sm py-2"
                style={{ color: theme.textMuted }}
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 4: Exercise selection */}
          {step === 4 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                Plan your practice
              </p>
              <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
                Choose exercises to do before your next session
              </p>

              {exercisesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" style={{ color: theme.cyan }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : (
                <>
                  {/* Matched exercises */}
                  {matchedExercises.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium mb-3" style={{ color: theme.cyan }}>
                        Based on your session
                      </p>
                      <div className="space-y-2">
                        {matchedExercises.map(ex => {
                          const isSelected = selectedExercises.some(s => s.exerciseId === ex.id)
                          return (
                            <button
                              key={ex.id}
                              onClick={() => toggleExercise(ex)}
                              className="w-full rounded-xl p-4 text-left transition-all"
                              style={{
                                backgroundColor: isSelected ? theme.cyan + '15' : theme.card,
                                border: `1.5px solid ${isSelected ? theme.cyan : 'rgba(255,255,255,0.08)'}`,
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium" style={{ color: theme.text }}>{ex.title}</p>
                                  {ex.description && (
                                    <p className="text-xs mt-1 line-clamp-2" style={{ color: theme.textMuted }}>{ex.description}</p>
                                  )}
                                  {ex.duration_minutes && (
                                    <div className="flex items-center gap-1 mt-2">
                                      <Clock size={12} style={{ color: theme.textMuted }} />
                                      <span className="text-xs" style={{ color: theme.textMuted }}>{ex.duration_minutes} min</span>
                                    </div>
                                  )}
                                </div>
                                {isSelected && (
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center ml-3 flex-shrink-0"
                                    style={{ backgroundColor: theme.cyan }}>
                                    <Check size={14} style={{ color: theme.text }} />
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Show all exercises */}
                  {!showAllExercises ? (
                    <button
                      onClick={() => setShowAllExercises(true)}
                      className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mb-4"
                      style={{
                        backgroundColor: theme.card,
                        color: theme.textMuted,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      Browse all exercises <ChevronDown size={16} />
                    </button>
                  ) : (
                    <div className="mb-4">
                      <p className="text-xs font-medium mb-3" style={{ color: theme.textMuted }}>
                        All exercises
                      </p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {allExercises
                          .filter(ex => !matchedExercises.some(m => m.id === ex.id))
                          .map(ex => {
                            const isSelected = selectedExercises.some(s => s.exerciseId === ex.id)
                            return (
                              <button
                                key={ex.id}
                                onClick={() => toggleExercise(ex)}
                                className="w-full rounded-xl p-3 text-left transition-all"
                                style={{
                                  backgroundColor: isSelected ? theme.cyan + '15' : theme.card,
                                  border: `1.5px solid ${isSelected ? theme.cyan : 'rgba(255,255,255,0.08)'}`,
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium" style={{ color: theme.text }}>{ex.title}</p>
                                    <p className="text-xs" style={{ color: theme.textMuted }}>{ex.category.replace(/_/g, ' ')}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: theme.cyan }}>
                                      <Check size={12} style={{ color: theme.text }} />
                                    </div>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  )}

                  {/* Custom activity */}
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      value={customActivityText}
                      onChange={(e) => setCustomActivityText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomActivity()}
                      placeholder="Add your own activity..."
                      className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{
                        backgroundColor: theme.card,
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: theme.text,
                      }}
                    />
                    <button
                      onClick={addCustomActivity}
                      className="p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: customActivityText.trim() ? theme.cyan : theme.card,
                        color: theme.text,
                      }}
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Selected count */}
                  {selectedExercises.length > 0 && (
                    <p className="text-xs text-center mb-2" style={{ color: theme.cyan }}>
                      {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </>
              )}

              <button
                onClick={handleSkipExercises}
                className="w-full text-sm py-2 mt-2"
                style={{ color: theme.textMuted }}
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 5: Scheduling */}
          {step === 5 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                Schedule your exercises
              </p>
              <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
                Pick a day and time for each one
              </p>

              <div className="space-y-4 mb-6">
                {selectedExercises.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: theme.card, border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-sm font-medium mb-3" style={{ color: theme.text }}>{ex.title}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Calendar size={16} style={{ color: theme.textMuted }} />
                        <select
                          value={scheduleEntries[i]?.date || ''}
                          onChange={(e) => updateSchedule(i, 'date', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                          style={{
                            backgroundColor: theme.bg,
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: theme.text,
                            colorScheme: 'dark',
                          }}
                        >
                          <option value="">Day</option>
                          {getNextWeekDates().map(d => (
                            <option key={d} value={d}>
                              {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} style={{ color: theme.textMuted }} />
                        <input
                          type="time"
                          value={scheduleEntries[i]?.time || '09:00'}
                          onChange={(e) => updateSchedule(i, 'time', e.target.value)}
                          className="px-3 py-2 rounded-lg text-sm focus:outline-none"
                          style={{
                            backgroundColor: theme.bg,
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: theme.text,
                            colorScheme: 'dark',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add to calendar */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}30` }}
              >
                <p className="text-xs font-medium mb-3" style={{ color: theme.cyan }}>
                  Add to your calendar
                </p>
                <button
                  onClick={() => {
                    const events = selectedExercises.map((ex, i) => {
                      const schedule = scheduleEntries[i]
                      const dateStr = schedule?.date || getNextWeekDates()[0]
                      const timeStr = schedule?.time || '09:00'
                      return {
                        title: ex.title,
                        description: ex.description || 'Scheduled via Seen',
                        startAt: new Date(`${dateStr}T${timeStr}:00`),
                        durationMinutes: ex.durationMinutes || 15,
                      }
                    })
                    downloadICS(events, 'seen-exercises.ics')
                  }}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.cyan, color: theme.text }}
                >
                  <Calendar size={16} />
                  Add to calendar
                </button>
                <p className="text-xs text-center mt-2" style={{ color: theme.textMuted }}>
                  Downloads a .ics file — works with Google, Apple, and Outlook
                </p>
              </div>

              <button
                onClick={handleSkipScheduling}
                className="w-full text-sm py-2"
                style={{ color: theme.textMuted }}
              >
                Skip — just remind me in the app
              </button>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                Your reflection
              </p>
              <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
                Review before saving
              </p>

              <div className="space-y-4">
                {/* Emotional state */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: theme.card, border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-xs mb-1" style={{ color: theme.textMuted }}>How you're feeling</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: theme.cyan, color: theme.text }}
                    >
                      {emotionalState}
                    </div>
                    <span className="text-sm" style={{ color: theme.text }}>
                      out of 10
                    </span>
                  </div>
                </div>

                {/* Topics */}
                {selectedThemeNames.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: theme.card, border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: theme.textMuted }}>Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedThemeNames.map(name => (
                        <span
                          key={name}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: theme.cyan + '20',
                            color: theme.cyan,
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reflection */}
                {reflectionText.trim() && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: theme.card, border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Reflection</p>
                    <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                      {reflectionText.length > 200
                        ? reflectionText.slice(0, 200) + '...'
                        : reflectionText}
                    </p>
                  </div>
                )}

                {/* Intention */}
                {intentionText.trim() && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}30` }}
                  >
                    <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Practice intention</p>
                    <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                      {intentionText}
                    </p>
                    {targetDate && (
                      <p className="text-xs mt-2" style={{ color: theme.cyan }}>
                        Target: {new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Scheduled exercises */}
                {selectedExercises.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: theme.card, border: `1px solid ${theme.gold}30` }}
                  >
                    <p className="text-xs mb-2" style={{ color: theme.textMuted }}>Scheduled exercises</p>
                    <div className="space-y-2">
                      {selectedExercises.map((ex, i) => {
                        const schedule = scheduleEntries[i]
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: theme.text }}>{ex.title}</span>
                            {schedule?.date && (
                              <span className="text-xs" style={{ color: theme.gold }}>
                                {new Date(schedule.date + 'T00:00:00').toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                                {schedule.time && ` at ${schedule.time}`}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs mt-2" style={{ color: theme.textMuted }}>
                      Added to your calendar
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-4 z-20"
        style={{
          backgroundColor: theme.bg,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto">
          {step < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: canProceed() ? theme.cyan : theme.card,
                color: canProceed() ? theme.text : theme.textMuted,
                opacity: canProceed() ? 1 : 0.5,
                cursor: canProceed() ? 'pointer' : 'default',
              }}
            >
              {step === 3 && !intentionText.trim() ? 'Skip' :
               step === 4 && selectedExercises.length === 0 ? 'Skip' :
               step === 4 ? `Schedule ${selectedExercises.length}` :
               'Next'}
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.cyan,
                color: theme.text,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'default' : 'pointer',
              }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save Reflection
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
