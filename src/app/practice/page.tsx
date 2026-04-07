'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MessageCircle,
  Shield,
  BookOpen,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { colors } from '@/lib/constants/colors'
import { StarIcon } from '@/components/StarIcon'
import { FixedHeader } from '@/components/FixedHeader'
import { BottomNav } from '@/components/BottomNav'

interface User {
  id: string
  name: string
  current_phase?: string
}

export default function PracticePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <StarIcon size={40} style={{ color: colors.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  const comingSoonCards = [
    {
      icon: <Clock size={22} style={{ color: colors.cyan }} />,
      title: 'Practice History',
      description: 'Track your practice intentions, completions, and progress.',
    },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.dark }}>
      {/* Background gradient - cyan tinted for Phase 2 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${colors.cyan}12 0%, transparent 40%)`,
        }}
      />

      <FixedHeader phase="phase2" title="Practice" />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-8">
        {/* Welcome */}
        <div className="mb-6">
          <p className="text-2xl font-bold mb-1" style={{ color: colors.cream }}>
            Your practice space
          </p>
          <p className="text-sm" style={{ color: colors.creamMuted }}>
            Tools to support your work between sessions
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: colors.darkCard, border: `1px solid ${colors.cyan}20` }}
        >
          <div className="flex items-start gap-3">
            <Shield size={16} style={{ color: colors.cyan, flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: colors.creamMuted }}>
              These tools support your own reflection and self-awareness. They are not therapy,
              treatment, or medical advice, and do not replace professional guidance.
            </p>
          </div>
        </div>

        {/* Post-Session Reflection */}
        <Link
          href="/practice/post-session"
          className="block rounded-2xl p-5 mb-3 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: colors.darkCard,
            border: `1px solid ${colors.cyan}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.cyan + '15' }}
            >
              <MessageCircle size={22} style={{ color: colors.cyan }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold" style={{ color: colors.cream }}>Post-Session Reflection</p>
                <ChevronRight size={18} style={{ color: colors.cyan }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.creamMuted }}>
                Process how you feel after a therapy session and set your practice focus.
              </p>
            </div>
          </div>
        </Link>

        {/* Exercises */}
        <Link
          href="/practice/exercises"
          className="block rounded-2xl p-5 mb-3 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: colors.darkCard,
            border: `1px solid ${colors.cyan}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.cyan + '15' }}
            >
              <BookOpen size={22} style={{ color: colors.cyan }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold" style={{ color: colors.cream }}>Exercises</p>
                <ChevronRight size={18} style={{ color: colors.cyan }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.creamMuted }}>
                Guided reflection, mindfulness, and skill-building exercises.
              </p>
            </div>
          </div>
        </Link>

        {/* Coming Soon Cards */}
        <div className="space-y-3">
          {comingSoonCards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.cyan + '15' }}
                >
                  {card.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold" style={{ color: colors.cream }}>{card.title}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: colors.darkCardHover, color: colors.creamMuted }}
                    >
                      Coming soon
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: colors.creamMuted }}>
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav currentPage="practice" phase="phase2" />
    </div>
  )
}
