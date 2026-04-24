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
import { useTheme } from '@/lib/theme'
import { StarIcon } from '@/components/StarIcon'
import { FixedHeader } from '@/components/FixedHeader'
import { BottomNav } from '@/components/BottomNav'

interface User {
  id: string
  name: string
  current_phase?: string
}

export default function PracticePage() {
  const theme = useTheme()
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <StarIcon size={40} style={{ color: theme.cyan, animation: 'pulse 2s infinite' }} />
      </div>
    )
  }

  // No more coming soon cards - Practice History is now live

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: theme.bg }}>
      {/* Background gradient - cyan tinted for Phase 2 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${theme.cyan}12 0%, transparent 40%)`,
        }}
      />

      <FixedHeader phase="phase2" title="Practice" />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-8">
        {/* Welcome */}
        <div className="mb-6">
          <p className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
            Your practice space
          </p>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            Tools to support your work between sessions
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.cyan}20` }}
        >
          <div className="flex items-start gap-3">
            <Shield size={16} style={{ color: theme.cyan, flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>
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
            backgroundColor: theme.card,
            border: `1px solid ${theme.cyan}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.cyan + '15' }}
            >
              <MessageCircle size={22} style={{ color: theme.cyan }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold" style={{ color: theme.text }}>Post-Session Reflection</p>
                <ChevronRight size={18} style={{ color: theme.cyan }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>
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
            backgroundColor: theme.card,
            border: `1px solid ${theme.cyan}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.cyan + '15' }}
            >
              <BookOpen size={22} style={{ color: theme.cyan }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold" style={{ color: theme.text }}>Exercises</p>
                <ChevronRight size={18} style={{ color: theme.cyan }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                Guided reflection, mindfulness, and skill-building exercises.
              </p>
            </div>
          </div>
        </Link>

        {/* Practice History */}
        <Link
          href="/practice/history"
          className="block rounded-2xl p-5 mb-3 transition-all hover:scale-[1.01]"
          style={{
            backgroundColor: theme.card,
            border: `1px solid ${theme.cyan}30`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.cyan + '15' }}
            >
              <Clock size={22} style={{ color: theme.cyan }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold" style={{ color: theme.text }}>Practice History</p>
                <ChevronRight size={18} style={{ color: theme.cyan }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                Track your practice intentions, completions, and progress.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <BottomNav currentPage="practice" phase="phase2" />
    </div>
  )
}
