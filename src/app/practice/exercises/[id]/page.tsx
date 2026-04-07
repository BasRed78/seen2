'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
} from 'lucide-react'
import { colors } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'

interface User {
  id: string
  name: string
  current_phase?: string
}

interface ExerciseStep {
  order: number
  text: string
  duration_minutes?: number
  type?: 'instruction' | 'prompt' | 'pause' | 'reflection'
}

interface ExerciseInstructions {
  intro?: string
  steps: ExerciseStep[]
  closing?: string
}

interface Exercise {
  id: string
  title: string
  description: string | null
  instructions: ExerciseInstructions | null
  theme_id: string | null
  category: string
  exercise_type: string
  duration_minutes: number | null
  is_onboarding: boolean
}

type Phase = 'intro' | 'steps' | 'completion'

export default function ExerciseDoPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completionId, setCompletionId] = useState<string | null>(null)
  const [reflectionText, setReflectionText] = useState('')
  const [selfRating, setSelfRating] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const params = useParams()
  const exerciseId = params.id as string

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

    fetch(`/api/practice/exercises/${exerciseId}`)
      .then(r => r.json())
      .then(data => {
        if (data.exercise) {
          setExercise(data.exercise)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load exercise:', err)
        setLoading(false)
      })
  }, [router, exerciseId])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const startExercise = async () => {
    if (!user || !exercise) return

    try {
      const res = await fetch(`/api/practice/exercises/${exerciseId}/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (data.completionId) {
        setCompletionId(data.completionId)
      }
    } catch (err) {
      console.error('Failed to start exercise:', err)
    }

    setPhase('steps')
    setCurrentStepIndex(0)
    scrollToTop()
  }

  const nextStep = () => {
    if (!exercise?.instructions) return
    const totalSteps = exercise.instructions.steps.length
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1)
      scrollToTop()
    } else {
      // Done with steps, go to completion
      setPhase('completion')
      scrollToTop()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
      scrollToTop()
    } else {
      // Back to intro
      setPhase('intro')
      scrollToTop()
    }
  }

  const completeExercise = async () => {
    if (!completionId || saving) return
    setSaving(true)

    try {
      await fetch(`/api/practice/exercises/${exerciseId}/completions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completionId,
          reflectionText: reflectionText.trim() || null,
          selfRating,
        }),
      })
      setSaved(true)
      setTimeout(() => {
        router.push('/practice/exercises')
      }, 1500)
    } catch (err) {
      console.error('Failed to complete exercise:', err)
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <StarIcon size={40} style={{ color: colors.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: colors.dark }}>
        <p style={{ color: colors.cream }}>Exercise not found</p>
        <button
          onClick={() => router.push('/practice/exercises')}
          className="text-sm underline"
          style={{ color: colors.cyan }}
        >
          Back to exercises
        </button>
      </div>
    )
  }

  const instructions = exercise.instructions
  const totalSteps = instructions?.steps?.length || 0

  // Step type styling
  const getStepTypeLabel = (type?: string) => {
    switch (type) {
      case 'pause': return 'Pause'
      case 'prompt': return 'Reflect'
      case 'reflection': return 'Journal'
      case 'instruction': return 'Guide'
      default: return null
    }
  }

  const getStepTypeColor = (type?: string) => {
    switch (type) {
      case 'pause': return colors.cyanLight
      case 'prompt': return colors.cyan
      case 'reflection': return colors.cyanLight
      default: return colors.cyan
    }
  }

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: colors.dark }}>
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${colors.cyan}12 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        {/* Header with back */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (phase === 'intro') {
                router.push('/practice/exercises')
              } else if (phase === 'steps' && currentStepIndex === 0) {
                setPhase('intro')
                scrollToTop()
              } else if (phase === 'steps') {
                prevStep()
              } else {
                // completion phase - go back to last step
                setPhase('steps')
                setCurrentStepIndex(totalSteps - 1)
                scrollToTop()
              }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.darkCard }}
          >
            <ArrowLeft size={18} style={{ color: colors.cream }} />
          </button>
          <span className="font-bold text-sm flex-1" style={{ color: colors.cream }}>
            {exercise.title}
          </span>
          {exercise.duration_minutes && (
            <span className="flex items-center gap-1 text-xs" style={{ color: colors.creamMuted }}>
              <Clock size={12} />
              {exercise.duration_minutes} min
            </span>
          )}
        </div>

        {/* Progress bar for steps phase */}
        {phase === 'steps' && totalSteps > 0 && (
          <div className="flex gap-1 mb-6">
            {instructions!.steps.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full flex-1 transition-all"
                style={{
                  backgroundColor: i <= currentStepIndex ? colors.cyan : colors.darkCard,
                }}
              />
            ))}
          </div>
        )}

        {/* ===== INTRO PHASE ===== */}
        {phase === 'intro' && (
          <div>
            {exercise.description && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: colors.creamMuted }}>
                {exercise.description}
              </p>
            )}

            {instructions?.intro && (
              <div
                className="rounded-2xl p-5 mb-6"
                style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}20` }}
              >
                <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
                  {instructions.intro}
                </p>
              </div>
            )}

            {/* Exercise info */}
            <div className="space-y-3 mb-6">
              {totalSteps > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.cyan + '15' }}>
                    <ChevronRight size={16} style={{ color: colors.cyan }} />
                  </div>
                  <p className="text-sm" style={{ color: colors.creamMuted }}>
                    {totalSteps} step{totalSteps !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
              {exercise.duration_minutes && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.cyan + '15' }}>
                    <Clock size={16} style={{ color: colors.cyan }} />
                  </div>
                  <p className="text-sm" style={{ color: colors.creamMuted }}>
                    About {exercise.duration_minutes} minutes
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== STEPS PHASE ===== */}
        {phase === 'steps' && instructions && instructions.steps[currentStepIndex] && (
          <div>
            {(() => {
              const step = instructions.steps[currentStepIndex]
              const typeLabel = getStepTypeLabel(step.type)
              const typeColor = getStepTypeColor(step.type)
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-medium" style={{ color: colors.creamMuted }}>
                      Step {currentStepIndex + 1} of {totalSteps}
                    </p>
                    {typeLabel && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: typeColor + '20', color: typeColor }}
                      >
                        {typeLabel}
                      </span>
                    )}
                  </div>

                  <div
                    className="rounded-2xl p-6 mb-6"
                    style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}20` }}
                  >
                    <p className="text-base leading-relaxed" style={{ color: colors.cream }}>
                      {step.text}
                    </p>
                    {step.duration_minutes && (
                      <p className="text-xs mt-4 flex items-center gap-1" style={{ color: colors.creamMuted }}>
                        <Clock size={12} />
                        Take about {step.duration_minutes} minute{step.duration_minutes !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Prompt/reflection steps get a text area */}
                  {(step.type === 'prompt' || step.type === 'reflection') && (
                    <textarea
                      placeholder="Write your thoughts here (optional)..."
                      className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none"
                      style={{
                        backgroundColor: colors.darkCard,
                        color: colors.cream,
                        border: `1px solid rgba(255,255,255,0.1)`,
                        minHeight: '100px',
                      }}
                    />
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ===== COMPLETION PHASE ===== */}
        {phase === 'completion' && (
          <div>
            {saved ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.cyan + '20' }}
                >
                  <Check size={32} style={{ color: colors.cyan }} />
                </div>
                <p className="text-lg font-semibold mb-2" style={{ color: colors.cream }}>
                  Well done
                </p>
                <p className="text-sm" style={{ color: colors.creamMuted }}>
                  Your practice has been recorded.
                </p>
              </div>
            ) : (
              <div>
                {instructions?.closing && (
                  <div
                    className="rounded-2xl p-5 mb-6"
                    style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}20` }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
                      {instructions.closing}
                    </p>
                  </div>
                )}

                {/* Self rating */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3" style={{ color: colors.cream }}>
                    How helpful was this exercise?
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setSelfRating(n)}
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: selfRating === n ? colors.cyan + '30' : colors.darkCard,
                          border: `1px solid ${selfRating === n ? colors.cyan : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        <Star
                          size={20}
                          style={{ color: selfRating !== null && n <= selfRating ? colors.cyan : colors.creamMuted }}
                          fill={selfRating !== null && n <= selfRating ? colors.cyan : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reflection */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3" style={{ color: colors.cream }}>
                    Any reflections? (optional)
                  </p>
                  <textarea
                    value={reflectionText}
                    onChange={e => setReflectionText(e.target.value)}
                    placeholder="What came up for you during this exercise..."
                    className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none"
                    style={{
                      backgroundColor: colors.darkCard,
                      color: colors.cream,
                      border: '1px solid rgba(255,255,255,0.1)',
                      minHeight: '100px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {!saved && (
        <div
          className="fixed bottom-0 left-0 right-0 px-6 py-4 z-20"
          style={{
            backgroundColor: colors.darkCard,
            borderTop: `1px solid rgba(255,255,255,0.05)`,
          }}
        >
          <div className="max-w-lg mx-auto">
            {phase === 'intro' && (
              <button
                onClick={startExercise}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ backgroundColor: colors.cyan, color: colors.cream }}
              >
                Begin Exercise
              </button>
            )}

            {phase === 'steps' && (
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.darkCardHover }}
                >
                  <ChevronLeft size={20} style={{ color: colors.cream }} />
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ backgroundColor: colors.cyan, color: colors.cream }}
                >
                  {currentStepIndex < totalSteps - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
            )}

            {phase === 'completion' && (
              <button
                onClick={() => {
                  if (saving) return
                  completeExercise()
                }}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  backgroundColor: saving ? colors.darkCardHover : colors.cyan,
                  color: colors.cream,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save & Finish'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
