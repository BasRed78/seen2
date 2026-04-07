'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

const colors = {
  coral: '#ff6b5b',
  coralLight: '#ff8a7a',
  dark: '#0f0f1a',
  darkCard: '#1a1a2e',
  cream: '#faf8f5',
  creamMuted: 'rgba(250, 248, 245, 0.6)',
  cyan: '#4ECDC4',
}

const StarIcon = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

export default function OnboardingPage() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [activating, setActivating] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    // Already completed onboarding — go straight to home
    if (localStorage.getItem('seen_onboarding_complete')) {
      router.push('/home')
      return
    }

    const parsed = JSON.parse(storedUser)
    setUser(parsed)

    // Check if the quiz already captured the therapy answer
    const quizTherapyAnswer = localStorage.getItem('seen_quiz_in_therapy')
    if (quizTherapyAnswer !== null) {
      // Clean up the quiz flag
      localStorage.removeItem('seen_quiz_in_therapy')

      if (quizTherapyAnswer === 'true') {
        // Auto-activate Phase 2 without asking again
        activatePhase2(parsed.id)
        return
      } else {
        // They said no in the quiz — skip the question
        localStorage.setItem('seen_onboarding_complete', 'true')
        router.push('/home')
        return
      }
    }

    setLoading(false)
  }, [router])

  const activatePhase2 = async (userId: string) => {
    try {
      const response = await fetch('/api/practice/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'activate' }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('seen_user', JSON.stringify(data.user))
      }
    } catch (error) {
      console.error('Failed to activate Phase 2:', error)
    }

    localStorage.setItem('seen_onboarding_complete', 'true')
    router.push('/home')
  }

  const handleNo = () => {
    localStorage.setItem('seen_onboarding_complete', 'true')
    router.push('/home')
  }

  const handleYes = () => {
    setShowDisclaimer(true)
  }

  const handleConfirm = async () => {
    if (!user) return
    setActivating(true)
    await activatePhase2(user.id)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <StarIcon size={40} style={{ color: colors.coral, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: colors.dark }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${colors.coral}10 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <StarIcon size={20} style={{ color: colors.coral }} />
          <span className="font-bold text-lg" style={{ color: colors.cream }}>SEEN</span>
        </div>

        {/* Greeting */}
        <p className="text-2xl font-bold mb-2" style={{ color: colors.cream }}>
          Welcome, {user.name?.split(' ')[0] || 'there'}
        </p>
        <p className="text-sm mb-10" style={{ color: colors.creamMuted }}>
          One quick question before we start
        </p>

        {/* Question */}
        <div
          className="rounded-2xl p-6 mb-6 text-left"
          style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-semibold text-lg mb-6" style={{ color: colors.cream }}>
            Are you currently working with a therapist or counselor?
          </p>

          {showDisclaimer ? (
            /* Disclaimer + confirm */
            <div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.creamMuted }}>
                We'll activate practice mode — tools to support your work between sessions,
                alongside your daily check-ins.
              </p>

              <div
                className="rounded-xl p-4 mb-5"
                style={{ backgroundColor: colors.dark, border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start gap-2">
                  <Shield size={16} style={{ color: colors.cyan, flexShrink: 0, marginTop: 2 }} />
                  <p className="text-xs leading-relaxed" style={{ color: colors.creamMuted }}>
                    Seen is a self-reflection tool, not a replacement for professional support.
                    Practice exercises are for personal exploration between sessions and are not
                    therapy, treatment, or medical advice.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={activating}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ backgroundColor: colors.coral, color: colors.cream }}
                >
                  {activating ? 'Setting up...' : 'Continue with practice mode'}
                </button>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="w-full mt-3 text-sm"
                style={{ color: colors.creamMuted }}
              >
                Go back
              </button>
            </div>
          ) : (
            /* Main choice */
            <div className="space-y-3">
              <button
                onClick={handleYes}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ backgroundColor: colors.coral, color: colors.cream }}
              >
                Yes, I am
              </button>
              <button
                onClick={handleNo}
                className="w-full py-3 rounded-xl text-sm transition-colors"
                style={{ color: colors.creamMuted }}
              >
                No, not right now
              </button>
            </div>
          )}
        </div>

        <p className="text-xs" style={{ color: colors.creamMuted }}>
          You can always change this later in Settings
        </p>
      </div>
    </div>
  )
}
