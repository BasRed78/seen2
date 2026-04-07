'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  BarChart3,
  Home,
  MessageCircle,
  Settings,
  Shield,
  Check,
} from 'lucide-react'

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

interface User {
  id: string
  name: string
  pattern_type: string | null
  pattern_description: string | null
  stage: string
  email?: string | null
  current_phase?: string
  in_therapy?: boolean
  phase2_activated_at?: string | null
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activating, setActivating] = useState(false)
  const router = useRouter()

  const isPhase2 = (user?.current_phase || 'phase1') === 'phase2'

  useEffect(() => {
    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [router])

  const handlePhaseToggle = async (action: 'activate' | 'deactivate') => {
    if (!user) return
    setActivating(true)

    try {
      const response = await fetch('/api/practice/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('seen_user', JSON.stringify(data.user))
        setUser(data.user)
        setShowConfirm(false)
      }
    } catch (error) {
      console.error('Failed to update phase:', error)
    } finally {
      setActivating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('seen_user')
    router.push('/')
  }

  const patternLabel = (type: string | null) => {
    if (!type) return 'Not yet identified'
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <StarIcon size={40} style={{ color: colors.coral, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.dark }}>
      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/home">
            <ArrowLeft size={20} style={{ color: colors.cream }} />
          </Link>
          <div className="flex items-center gap-2">
            <Settings size={16} style={{ color: colors.coral }} />
            <span className="font-bold" style={{ color: colors.cream }}>Settings</span>
          </div>
        </div>

        {/* Profile Card */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-bold text-lg mb-1" style={{ color: colors.cream }}>
            {user.name}
          </p>
          <p className="text-sm" style={{ color: colors.creamMuted }}>
            Pattern: {patternLabel(user.pattern_type)}
          </p>
          {user.email && (
            <p className="text-sm mt-1" style={{ color: colors.creamMuted }}>
              {user.email}
            </p>
          )}
        </div>

        {/* Phase 2 Section */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3" style={{ color: colors.creamMuted }}>
            Your practice journey
          </p>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: colors.darkCard, border: `1px solid ${isPhase2 ? colors.cyan + '30' : 'rgba(255,255,255,0.08)'}` }}
          >
            {isPhase2 ? (
              /* Active state */
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.cyan + '20' }}
                  >
                    <Check size={20} style={{ color: colors.cyan }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.cream }}>Practice mode active</p>
                    <p className="text-xs" style={{ color: colors.creamMuted }}>Supporting your work between sessions</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePhaseToggle('deactivate')}
                  disabled={activating}
                  className="text-sm transition-colors"
                  style={{ color: colors.creamMuted }}
                >
                  {activating ? 'Updating...' : 'Deactivate practice mode'}
                </button>
              </div>
            ) : showConfirm ? (
              /* Confirmation step */
              <div>
                <p className="font-semibold mb-3" style={{ color: colors.cream }}>
                  Activate practice mode?
                </p>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.creamMuted }}>
                  Practice mode adds tools to support your work between therapy or counseling sessions
                  — post-session reflections, exercises, and practice tracking.
                </p>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.creamMuted }}>
                  Your daily check-ins continue as before. This adds new capabilities on top.
                </p>

                {/* Required disclaimer */}
                <div
                  className="rounded-xl p-4 mb-4"
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
                    onClick={() => handlePhaseToggle('activate')}
                    disabled={activating}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{ backgroundColor: colors.coral, color: colors.cream }}
                  >
                    {activating ? 'Activating...' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-sm"
                    style={{ color: colors.creamMuted }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Inactive state */
              <div>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.creamMuted }}>
                  If you're currently working with a therapist or counselor, you can activate
                  practice mode to support your work between sessions.
                </p>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: colors.coral, color: colors.cream }}
                >
                  <Heart size={16} />
                  I'm working with a therapist
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-sm transition-colors"
          style={{
            backgroundColor: colors.darkCard,
            color: colors.creamMuted,
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          Sign out
        </button>
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 px-6 py-3"
        style={{
          backgroundColor: colors.darkCard,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto flex justify-around">
          <Link href="/home" className="flex flex-col items-center gap-1 py-2 px-4">
            <Home size={22} style={{ color: colors.creamMuted }} />
            <span className="text-xs" style={{ color: colors.creamMuted }}>Home</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 py-2 px-4">
            <MessageCircle size={22} style={{ color: colors.creamMuted }} />
            <span className="text-xs" style={{ color: colors.creamMuted }}>Check-in</span>
          </Link>
          {isPhase2 && (
            <Link href="/practice" className="flex flex-col items-center gap-1 py-2 px-4">
              <Heart size={22} style={{ color: colors.creamMuted }} />
              <span className="text-xs" style={{ color: colors.creamMuted }}>Practice</span>
            </Link>
          )}
          <Link href="/insights" className="flex flex-col items-center gap-1 py-2 px-4">
            <BarChart3 size={22} style={{ color: colors.creamMuted }} />
            <span className="text-xs" style={{ color: colors.creamMuted }}>Insights</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
