'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, Check, Calendar } from 'lucide-react'

const colors = {
  coral: '#ff6b5b',
  coralLight: '#ff8a7a',
  dark: '#0f0f1a',
  darkCard: '#1a1a2e',
  darkCardHover: '#252542',
  cream: '#faf8f5',
  creamMuted: 'rgba(250, 248, 245, 0.6)',
  cyan: '#5B8F8F',
  cyanLight: '#7ab5b5',
}

const StarIcon = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

interface Theme {
  id: string
  name: string
  description: string | null
  display_order: number
}

const REFLECTION_PROMPTS: Record<string, string> = {
  'Awareness & pattern logging': 'What patterns did you notice in yourself today?',
  'Mindfulness & grounding': 'What came up for you today that you\'d like to stay present with?',
  'Defusion & acceptance': 'What difficult thought or feeling are you willing to make space for?',
  'Values & direction': 'What value felt most alive for you today, or most distant?',
  'Emotion regulation': 'What emotion felt strongest today, and how did you relate to it?',
  'Behavioral experiments': 'What assumption or habitual response came up that you could test differently?',
  'Reflection & journaling': 'What stood out to you most from today\'s session?',
  'Self-assessment & mapping': 'Where do you feel you are right now compared to where you want to be?',
}
const DEFAULT_PROMPT = 'What stood out to you most from today\'s session?'

const TOTAL_STEPS = 5

export default function PostSessionPage() {
  const [user, setUser] = useState<{ id: string; name: string; current_phase?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  // Form state
  const [emotionalState, setEmotionalState] = useState<number | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [reflectionText, setReflectionText] = useState('')
  const [intentionText, setIntentionText] = useState('')
  const [targetDate, setTargetDate] = useState('')

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

  // Fetch themes when reaching step 2
  useEffect(() => {
    if (step === 2 && themes.length === 0) {
      fetch('/api/practice/themes')
        .then(res => res.json())
        .then(data => setThemes(data.themes || []))
        .catch(err => console.error('Failed to load themes:', err))
    }
  }, [step, themes.length])

  const selectedTheme = themes.find(t => t.id === selectedThemeId)
  const reflectionPrompt = selectedTheme
    ? REFLECTION_PROMPTS[selectedTheme.name] || DEFAULT_PROMPT
    : DEFAULT_PROMPT

  const canProceed = () => {
    switch (step) {
      case 1: return emotionalState !== null
      case 2: return selectedThemeId !== null
      case 3: return reflectionText.trim().length > 0
      case 4: return true // intention is optional
      case 5: return true
      default: return false
    }
  }

  const handleBack = () => {
    if (step === 1) {
      router.push('/practice')
    } else {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    }
  }

  const handleSkipIntention = () => {
    setIntentionText('')
    setTargetDate('')
    setStep(5)
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
          themeId: selectedThemeId,
          reflectionText: reflectionText.trim(),
          intentionText: intentionText.trim() || undefined,
          targetDate: targetDate || undefined,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => router.push('/practice'), 2000)
      } else {
        const data = await response.json()
        console.error('Failed to save:', data.error)
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <StarIcon size={40} style={{ color: colors.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: colors.dark }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: colors.cyan + '20' }}
          >
            <Check size={32} style={{ color: colors.cyan }} />
          </div>
          <p className="text-xl font-bold mb-2" style={{ color: colors.cream }}>Reflection saved</p>
          <p className="text-sm" style={{ color: colors.creamMuted }}>Returning to your practice space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.dark }}>
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${colors.cyan}10 0%, transparent 50%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft size={22} style={{ color: colors.cream }} />
          </button>
          <span className="text-sm font-medium" style={{ color: colors.creamMuted }}>
            Post-Session Reflection
          </span>
          <div className="w-8" /> {/* spacer */}
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
                backgroundColor: i + 1 <= step ? colors.cyan : colors.darkCardHover,
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
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                How are you feeling right now?
              </p>
              <p className="text-sm mb-8" style={{ color: colors.creamMuted }}>
                After your session today
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setEmotionalState(num)}
                    className="w-12 h-12 rounded-full font-semibold text-lg transition-all"
                    style={{
                      backgroundColor: emotionalState === num ? colors.coral : colors.darkCard,
                      color: emotionalState === num ? colors.cream : colors.creamMuted,
                      border: `2px solid ${emotionalState === num ? colors.coral : 'rgba(255,255,255,0.08)'}`,
                      transform: emotionalState === num ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-4 px-2">
                <span className="text-xs" style={{ color: colors.creamMuted }}>Low</span>
                <span className="text-xs" style={{ color: colors.creamMuted }}>High</span>
              </div>
            </div>
          )}

          {/* Step 2: Theme selection */}
          {step === 2 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                What theme came up in your session?
              </p>
              <p className="text-sm mb-6" style={{ color: colors.creamMuted }}>
                Choose what resonated most
              </p>

              <div className="space-y-3">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className="w-full text-left rounded-2xl p-4 transition-all"
                    style={{
                      backgroundColor: colors.darkCard,
                      border: `2px solid ${selectedThemeId === theme.id ? colors.cyan : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <p className="font-semibold text-sm mb-1" style={{ color: colors.cream }}>
                      {theme.name}
                    </p>
                    {theme.description && (
                      <p className="text-xs leading-relaxed" style={{ color: colors.creamMuted }}>
                        {theme.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Reflection */}
          {step === 3 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                Reflect on your session
              </p>
              <p className="text-sm mb-6" style={{ color: colors.cyan }}>
                {reflectionPrompt}
              </p>

              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write freely — this is just for you..."
                rows={5}
                className="w-full px-4 py-4 rounded-xl text-sm leading-relaxed resize-none focus:outline-none transition-all"
                style={{
                  backgroundColor: colors.darkCard,
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: colors.cream,
                }}
                autoFocus
              />
            </div>
          )}

          {/* Step 4: Practice intention (optional) */}
          {step === 4 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                Set a practice intention
              </p>
              <p className="text-sm mb-6" style={{ color: colors.creamMuted }}>
                Is there something you'd like to practice before your next session?
              </p>

              <textarea
                value={intentionText}
                onChange={(e) => setIntentionText(e.target.value)}
                placeholder="e.g. Notice when I start avoiding difficult conversations..."
                rows={3}
                className="w-full px-4 py-4 rounded-xl text-sm leading-relaxed resize-none focus:outline-none transition-all mb-4"
                style={{
                  backgroundColor: colors.darkCard,
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: colors.cream,
                }}
                autoFocus
              />

              <div className="flex items-center gap-3 mb-6">
                <Calendar size={18} style={{ color: colors.creamMuted }} />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: colors.darkCard,
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: colors.cream,
                    colorScheme: 'dark',
                  }}
                />
              </div>

              <button
                onClick={handleSkipIntention}
                className="w-full text-sm py-2"
                style={{ color: colors.creamMuted }}
              >
                Skip for now
              </button>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                Your reflection
              </p>
              <p className="text-sm mb-6" style={{ color: colors.creamMuted }}>
                Review before saving
              </p>

              <div className="space-y-4">
                {/* Emotional state */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-xs mb-1" style={{ color: colors.creamMuted }}>How you're feeling</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: colors.coral, color: colors.cream }}
                    >
                      {emotionalState}
                    </div>
                    <span className="text-sm" style={{ color: colors.cream }}>
                      out of 10
                    </span>
                  </div>
                </div>

                {/* Theme */}
                {selectedTheme && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-xs mb-1" style={{ color: colors.creamMuted }}>Theme</p>
                    <p className="text-sm font-medium" style={{ color: colors.cream }}>{selectedTheme.name}</p>
                  </div>
                )}

                {/* Reflection */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-xs mb-1" style={{ color: colors.creamMuted }}>Reflection</p>
                  <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
                    {reflectionText.length > 200
                      ? reflectionText.slice(0, 200) + '...'
                      : reflectionText}
                  </p>
                </div>

                {/* Intention (if set) */}
                {intentionText.trim() && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}30` }}
                  >
                    <p className="text-xs mb-1" style={{ color: colors.creamMuted }}>Practice intention</p>
                    <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
                      {intentionText}
                    </p>
                    {targetDate && (
                      <p className="text-xs mt-2" style={{ color: colors.cyan }}>
                        Target: {new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-4"
        style={{
          backgroundColor: colors.dark,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto">
          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: canProceed() ? colors.coral : colors.darkCard,
                color: canProceed() ? colors.cream : colors.creamMuted,
                opacity: canProceed() ? 1 : 0.5,
              }}
            >
              {step === 4 && intentionText.trim() ? 'Next' : step === 4 ? 'Skip' : 'Next'}
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.coral,
                color: colors.cream,
                opacity: submitting ? 0.7 : 1,
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
