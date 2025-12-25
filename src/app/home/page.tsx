'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowRight, 
  Bell, 
  BarChart3, 
  Flame, 
  TrendingUp, 
  CheckCircle,
  Eye
} from 'lucide-react'

const colors = {
  coral: '#FF6B5B',
  dark: '#1a1a2e',
  darkLight: '#252540',
  cream: '#FAF8F5',
  cyan: '#4ECDC4',
  gold: '#FFD93D',
}

const StarIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

interface User {
  id: string
  name: string
  pattern_type: string | null
  pattern_description: string | null
  stage: string
}

interface InsightData {
  streak: number
  totalCheckins: number
  weeksActive: number
  hasCheckedInToday: boolean
  latestInsight?: {
    title: string
    body: string
  }
  thisWeek?: {
    day: string
    checkedIn: boolean
  }[]
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    fetchInsights(parsedUser.id)
  }, [router])

  const fetchInsights = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/insights?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      } else {
        // If no insights yet, use defaults
        setInsights({
          streak: 0,
          totalCheckins: 0,
          weeksActive: 1,
          hasCheckedInToday: false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      setInsights({
        streak: 0,
        totalCheckins: 0,
        weeksActive: 1,
        hasCheckedInToday: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('seen_user')
    router.push('/')
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <div className="text-center">
          <StarIcon size={40} className="animate-pulse mx-auto mb-4" style={{ color: colors.coral }} />
          <p style={{ color: colors.cream, opacity: 0.6 }}>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: colors.dark }}>
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${colors.coral}15 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <StarIcon size={16} style={{ color: colors.coral }} />
            <span className="font-bold" style={{ color: colors.cream }}>SEEN</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm"
            style={{ color: colors.cream, opacity: 0.5 }}
          >
            Sign out
          </button>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <p className="text-2xl font-bold mb-1" style={{ color: colors.cream }}>
            {greeting}, {user.name?.split(' ')[0] || 'there'}
          </p>
          <p style={{ color: colors.cream, opacity: 0.5 }}>
            Week {insights?.weeksActive || 1} of your practice
          </p>
        </div>

        {/* Streak Card */}
        {(insights?.streak ?? 0) > 0 && (
          <div 
            className="rounded-2xl p-5 mb-4 flex items-center justify-between"
            style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.gold}20` }}
              >
                <Flame size={24} style={{ color: colors.gold }} />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: colors.cream }}>
                  {insights?.streak} day streak
                </p>
                <p className="text-sm" style={{ color: colors.cream, opacity: 0.5 }}>
                  {insights?.totalCheckins || 0} check-ins total
                </p>
              </div>
            </div>
            <TrendingUp size={16} style={{ color: colors.cyan }} />
          </div>
        )}

        {/* Check-in CTA */}
        <div 
          className="rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{ backgroundColor: colors.coral }}
        >
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${colors.cream}20 0%, transparent 70%)`,
              filter: 'blur(20px)'
            }}
          />
          
          {insights?.hasCheckedInToday ? (
            <div className="text-center relative">
              <CheckCircle size={32} className="mx-auto mb-2" style={{ color: colors.cream }} />
              <p className="font-bold text-lg" style={{ color: colors.cream }}>
                You've checked in today
              </p>
              <p className="text-sm" style={{ color: colors.cream, opacity: 0.8 }}>
                See you tomorrow
              </p>
            </div>
          ) : (
            <div className="relative">
              <p className="font-bold text-lg mb-1" style={{ color: colors.cream }}>
                Ready for today's check-in?
              </p>
              <p className="text-sm mb-4" style={{ color: colors.cream, opacity: 0.8 }}>
                A few minutes of honest reflection
              </p>
              <Link
                href="/chat"
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: colors.dark, color: colors.cream }}
              >
                Start Check-in <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Insight */}
        {insights?.latestInsight && (
          <div 
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: `${colors.cyan}10`, border: `1px solid ${colors.cyan}20` }}
          >
            <div className="flex items-start gap-3">
              <Eye size={20} style={{ color: colors.cyan }} />
              <div>
                <p className="font-semibold mb-1" style={{ color: colors.cream }}>
                  {insights.latestInsight.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: colors.cream, opacity: 0.7 }}>
                  {insights.latestInsight.body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View Insights Link */}
        <Link
          href="/insights"
          className="w-full rounded-2xl p-4 flex items-center justify-between"
          style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={20} style={{ color: colors.coral }} />
            <span style={{ color: colors.cream }}>View your insights</span>
          </div>
          <ArrowRight size={18} style={{ color: colors.cream, opacity: 0.4 }} />
        </Link>

        {/* This Week Strip (if data available) */}
        {insights?.thisWeek && insights.thisWeek.length > 0 && (
          <div 
            className="rounded-2xl p-5 mt-4"
            style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: colors.cream, opacity: 0.6 }}>
              This week
            </p>
            <div className="flex gap-1.5">
              {insights.thisWeek.map((day, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <div 
                    className="h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: day.checkedIn ? colors.darkLight : colors.dark,
                      border: day.checkedIn ? `1px solid ${colors.cyan}30` : '1px solid transparent',
                    }}
                  >
                    {day.checkedIn && <CheckCircle size={14} style={{ color: colors.cyan }} />}
                  </div>
                  <span 
                    className="text-xs mt-1 block"
                    style={{ color: colors.cream, opacity: 0.4 }}
                  >
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav 
        className="fixed bottom-0 left-0 right-0 px-6 py-3"
        style={{ 
          backgroundColor: colors.darkLight, 
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-lg mx-auto flex justify-around">
          <Link href="/home" className="flex flex-col items-center gap-1 py-2 px-4">
            <StarIcon size={22} style={{ color: colors.coral }} />
            <span className="text-xs" style={{ color: colors.coral }}>Home</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 py-2 px-4">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.cream, opacity: 0.4 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="text-xs" style={{ color: colors.cream, opacity: 0.4 }}>Check-in</span>
          </Link>
          <Link href="/insights" className="flex flex-col items-center gap-1 py-2 px-4">
            <BarChart3 size={22} style={{ color: colors.cream, opacity: 0.4 }} />
            <span className="text-xs" style={{ color: colors.cream, opacity: 0.4 }}>Insights</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
