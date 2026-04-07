'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, Check, Calendar } from 'lucide-react'
import { colors } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'
import { VoiceMicButton } from '@/components/VoiceMicButton'
import useVoiceInput from '@/hooks/useVoiceInput'

interface Theme {
  id: string
  name: string
  description: string | null
  display_order: number
}

const TOTAL_STEPS = 4

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
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([])
  const [reflectionText, setReflectionText] = useState('')
  const [intentionText, setIntentionText] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [themesLoading, setThemesLoading] = useState(false)

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

  const canProceed = () => {
    switch (step) {
      case 1: return emotionalState !== null
      case 2: return selectedThemeIds.length > 0 || reflectionText.trim().length > 0
      case 3: return true // intention is optional
      case 4: return true
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
                      backgroundColor: emotionalState === num ? colors.cyan : colors.darkCard,
                      color: emotionalState === num ? colors.cream : colors.creamMuted,
                      border: `2px solid ${emotionalState === num ? colors.cyan : 'rgba(255,255,255,0.08)'}`,
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

          {/* Step 2: Topics + Reflection (combined) */}
          {step === 2 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                What came up in your session?
              </p>
              <p className="text-sm mb-5" style={{ color: colors.creamMuted }}>
                Select any topics that came up
              </p>

              {/* Theme chips */}
              {themesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" style={{ color: colors.cyan }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {themes.map(theme => {
                    const isSelected = selectedThemeIds.includes(theme.id)
                    return (
                      <button
                        key={theme.id}
                        onClick={() => toggleTheme(theme.id)}
                        className="px-3 py-3 rounded-xl text-sm font-medium transition-all text-left"
                        style={{
                          backgroundColor: isSelected ? colors.cyan + '20' : colors.darkCard,
                          color: isSelected ? colors.cyan : colors.creamMuted,
                          border: `1.5px solid ${isSelected ? colors.cyan : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        {theme.name}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Reflection textarea */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: colors.creamMuted }}>
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
                  backgroundColor: colors.darkCard,
                  border: `1px solid ${reflectionVoice.listening ? colors.cyan + '40' : 'rgba(255,255,255,0.08)'}`,
                  color: colors.cream,
                }}
              />
            </div>
          )}

          {/* Step 3: Practice intention (optional) */}
          {step === 3 && (
            <div className="pt-8">
              <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
                Set a practice intention
              </p>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm" style={{ color: colors.creamMuted }}>
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
                  backgroundColor: colors.darkCard,
                  border: `1px solid ${intentionVoice.listening ? colors.cyan + '40' : 'rgba(255,255,255,0.08)'}`,
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

          {/* Step 4: Confirmation */}
          {step === 4 && (
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
                      style={{ backgroundColor: colors.cyan, color: colors.cream }}
                    >
                      {emotionalState}
                    </div>
                    <span className="text-sm" style={{ color: colors.cream }}>
                      out of 10
                    </span>
                  </div>
                </div>

                {/* Topics */}
                {selectedThemeNames.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: colors.creamMuted }}>Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedThemeNames.map(name => (
                        <span
                          key={name}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: colors.cyan + '20',
                            color: colors.cyan,
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
                    style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-xs mb-1" style={{ color: colors.creamMuted }}>Reflection</p>
                    <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
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
        className="fixed bottom-0 left-0 right-0 px-6 py-4 z-20"
        style={{
          backgroundColor: colors.dark,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto">
          {step < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: canProceed() ? colors.cyan : colors.darkCard,
                color: canProceed() ? colors.cream : colors.creamMuted,
                opacity: canProceed() ? 1 : 0.5,
                cursor: canProceed() ? 'pointer' : 'default',
              }}
            >
              {step === 3 && !intentionText.trim() ? 'Skip' : 'Next'}
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.cyan,
                color: colors.cream,
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
