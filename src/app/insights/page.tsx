'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Heart,
  Award,
  Brain,
  Eye,
  CheckCircle,
  MessageCircle,
  Flame,
  Layers,
  Unlock,
  TrendingUp,
  BarChart3
} from 'lucide-react'

const colors = {
  coral: '#FF6B5B',
  dark: '#1a1a2e',
  darkLight: '#252540',
  darkLighter: '#2f2f4a',
  cream: '#FAF8F5',
  cyan: '#4ECDC4',
  gold: '#FFD93D',
  purple: '#9D8DF1',
}

const StarIcon = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

interface User {
  id: string
  name: string
}

// Sample data structure - this would come from API
interface DashboardData {
  practice: {
    currentStreak: number
    checkinsThisWeek: number
    checkinsTotal: number
    weeksActive: number
  }
  depth: {
    current: number
    weekOne: number
    weeklyDepth: number[]
    currentLevel: string
    previousLevel: string
    indicators: {
      emotionsNamed: { current: number; weekOne: number }
      patternsRecognized: { current: number; weekOne: number }
      hardThingsShared: { current: number; weekOne: number }
    }
  }
  thisWeek: Array<{
    day: string
    checkedIn: boolean
    depth: number
    highlight?: string
  }>
  insight?: {
    title: string
    body: string
  }
  emotions: Array<{ word: string; count: number }>
  moments: Array<{ date: string; text: string; type: string }>
  reflection?: string
}

// Sample data for demo
const sampleData: DashboardData = {
  practice: {
    currentStreak: 5,
    checkinsThisWeek: 5,
    checkinsTotal: 23,
    weeksActive: 4,
  },
  depth: {
    current: 7.1,
    weekOne: 4.2,
    weeklyDepth: [4.2, 5.1, 6.3, 7.1],
    currentLevel: 'Opening up',
    previousLevel: 'Surface level',
    indicators: {
      emotionsNamed: { current: 29, weekOne: 8 },
      patternsRecognized: { current: 12, weekOne: 2 },
      hardThingsShared: { current: 7, weekOne: 1 },
    }
  },
  thisWeek: [
    { day: 'Mon', checkedIn: true, depth: 6 },
    { day: 'Tue', checkedIn: true, depth: 8, highlight: 'Named a hard emotion' },
    { day: 'Wed', checkedIn: true, depth: 7 },
    { day: 'Thu', checkedIn: true, depth: 7, highlight: 'Connected a pattern' },
    { day: 'Fri', checkedIn: true, depth: 8, highlight: 'Shared something difficult' },
    { day: 'Sat', checkedIn: false, depth: 0 },
    { day: 'Sun', checkedIn: false, depth: 0 },
  ],
  insight: {
    title: "You're seeing more clearly",
    body: "This week you named loneliness three times — something you hadn't mentioned at all in Week 1. That's not a problem getting worse. That's awareness getting sharper.",
  },
  emotions: [
    { word: 'anxious', count: 8 },
    { word: 'lonely', count: 6 },
    { word: 'stuck', count: 5 },
    { word: 'restless', count: 4 },
    { word: 'hopeful', count: 3 },
  ],
  moments: [
    { date: 'Dec 19', text: 'Named "loneliness" for the first time unprompted', type: 'honesty' },
    { date: 'Dec 17', text: 'Connected work deadline stress to evening patterns', type: 'pattern' },
    { date: 'Dec 14', text: "Shared something you said you'd never tell anyone", type: 'vulnerability' },
  ],
  reflection: `Four weeks of showing up to yourself.

What's changed isn't what you're doing — it's what you're seeing. Week 1, you described feeling "fine" or "stressed" and left it there. Now you're naming loneliness, recognizing when work pressure spills into your evenings, noticing the pull before it pulls.

That's not small. Naming something is the first step to choosing what to do with it.

Your conversations are going deeper. You're being more honest — with the questions, and with yourself. That takes courage, even when no one else is watching.`
}

export default function InsightsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('seen_user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    fetchDashboardData(parsedUser.id)
  }, [router])

  const fetchDashboardData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/insights?userId=${userId}&full=true`)
      if (response.ok) {
        const apiData = await response.json()
        // Merge API data with sample structure
        setData({ ...sampleData, ...apiData })
      } else {
        // Use sample data for demo
        setData(sampleData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setData(sampleData)
    } finally {
      setLoading(false)
    }
  }

  const Section = ({ id, title, icon, children }: { 
    id: string; 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode 
  }) => {
    const isOpen = expandedSection === id
    return (
      <div 
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => setExpandedSection(isOpen ? null : id)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.coral}15` }}
            >
              {icon}
            </div>
            <span className="font-semibold" style={{ color: colors.cream }}>{title}</span>
          </div>
          {isOpen ? (
            <ChevronUp size={18} style={{ color: colors.cream, opacity: 0.4 }} />
          ) : (
            <ChevronDown size={18} style={{ color: colors.cream, opacity: 0.4 }} />
          )}
        </button>
        {isOpen && <div className="px-4 pb-4">{children}</div>}
      </div>
    )
  }

  if (loading || !user || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <div className="text-center">
          <StarIcon size={40} style={{ color: colors.coral }} className="animate-pulse mx-auto mb-4" />
          <p style={{ color: colors.cream, opacity: 0.6 }}>Loading insights...</p>
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
          background: `radial-gradient(circle at 70% 20%, ${colors.purple}10 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/home"
            className="flex items-center gap-2 text-sm"
            style={{ color: colors.cream, opacity: 0.6 }}
          >
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <StarIcon size={14} style={{ color: colors.coral }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.coral }}>
              Week {data.practice.weeksActive}
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.cream }}>
          Your Practice
        </h1>

        {/* This Week Strip */}
        <div 
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold" style={{ color: colors.cream }}>This Week</span>
            <div className="flex items-center gap-1">
              <Flame size={16} style={{ color: colors.gold }} />
              <span className="text-sm font-bold" style={{ color: colors.cream }}>
                {data.practice.currentStreak} days
              </span>
            </div>
          </div>
          
          <div className="flex gap-1.5">
            {data.thisWeek.map((day, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div 
                  className="h-12 rounded-xl flex items-center justify-center relative"
                  style={{ 
                    backgroundColor: day.checkedIn ? colors.darkLighter : colors.dark,
                    border: day.checkedIn ? `1px solid ${colors.cyan}30` : '1px solid transparent',
                    opacity: idx >= 5 ? 0.4 : 1
                  }}
                >
                  {day.checkedIn && <CheckCircle size={16} style={{ color: colors.cyan }} />}
                  {day.highlight && (
                    <div 
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: colors.gold }}
                    />
                  )}
                </div>
                <span className="text-xs mt-1 block" style={{ color: colors.cream, opacity: 0.4 }}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          {/* Highlights */}
          {data.thisWeek.filter(d => d.highlight).length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs uppercase tracking-wide opacity-40 mb-2" style={{ color: colors.cream }}>
                This week's moments
              </p>
              <div className="space-y-1.5">
                {data.thisWeek.filter(d => d.highlight).map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.gold }}
                    />
                    <span className="text-sm" style={{ color: colors.cream, opacity: 0.7 }}>
                      {d.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Depth Score */}
        <div 
          className="rounded-2xl p-5 mb-4 relative overflow-hidden"
          style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${colors.purple}20 0%, transparent 70%)`,
              filter: 'blur(30px)'
            }}
          />
          
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-xs uppercase tracking-wide opacity-40 mb-1" style={{ color: colors.cream }}>
                Conversation depth
              </p>
              <p className="text-3xl font-black" style={{ color: colors.cream }}>
                {data.depth.current}
              </p>
              <p className="text-sm mt-1" style={{ color: colors.cream, opacity: 0.5 }}>
                {data.depth.currentLevel}
              </p>
              <div 
                className="flex items-center gap-1 mt-2 px-2 py-1 rounded-full w-fit"
                style={{ backgroundColor: `${colors.purple}15` }}
              >
                <TrendingUp size={12} style={{ color: colors.purple }} />
                <span className="text-xs font-semibold" style={{ color: colors.purple }}>
                  +{Math.round(((data.depth.current - data.depth.weekOne) / data.depth.weekOne) * 100)}% since Week 1
                </span>
              </div>
            </div>
            
            {/* Mini chart */}
            <div className="flex items-end gap-1.5 h-16">
              {data.depth.weeklyDepth.map((d, idx) => (
                <div 
                  key={idx}
                  className="w-4 rounded-t"
                  style={{ 
                    height: `${(d / 10) * 100}%`,
                    backgroundColor: colors.purple,
                    opacity: 0.4 + (idx / 4) * 0.6
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Insight */}
        {data.insight && (
          <div 
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: `${colors.cyan}08`, border: `1px solid ${colors.cyan}20` }}
          >
            <div className="flex items-start gap-3">
              <Eye size={20} style={{ color: colors.cyan }} />
              <div>
                <p className="font-semibold mb-1" style={{ color: colors.cream }}>
                  {data.insight.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: colors.cream, opacity: 0.7 }}>
                  {data.insight.body}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Building Honesty */}
        <div 
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: colors.darkLight, border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Unlock size={16} style={{ color: colors.coral }} />
            <span className="font-semibold" style={{ color: colors.cream }}>Building Honesty</span>
          </div>
          
          {[
            { label: 'Emotions named', ...data.depth.indicators.emotionsNamed, icon: Heart },
            { label: 'Patterns recognized', ...data.depth.indicators.patternsRecognized, icon: Layers },
            { label: 'Hard things shared', ...data.depth.indicators.hardThingsShared, icon: MessageCircle },
          ].map((item, idx) => {
            const growth = Math.round(((item.current - item.weekOne) / item.weekOne) * 100)
            return (
              <div 
                key={idx}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.cyan}15` }}
                  >
                    <item.icon size={16} style={{ color: colors.cyan }} />
                  </div>
                  <span className="text-sm" style={{ color: colors.cream }}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: colors.cream }}>{item.current}</span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${colors.cyan}15`, color: colors.cyan }}
                  >
                    {growth > 100 ? `${Math.round(item.current/item.weekOne)}×` : `+${growth}%`}
                  </span>
                </div>
              </div>
            )
          })}
          
          <p className="text-xs mt-3 text-center" style={{ color: colors.cream, opacity: 0.4 }}>
            Compared to your first week
          </p>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3">
          <Section id="emotions" title="Emotions Named" icon={<Heart size={18} style={{ color: colors.coral }} />}>
            <div className="flex flex-wrap gap-2">
              {data.emotions.map((e, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-sm"
                  style={{ 
                    backgroundColor: idx < 2 ? `${colors.coral}15` : `${colors.cream}08`,
                    color: idx < 2 ? colors.coral : colors.cream,
                    opacity: idx < 2 ? 1 : 0.6
                  }}
                >
                  {e.word} <span style={{ opacity: 0.5 }}>×{e.count}</span>
                </span>
              ))}
            </div>
            <p className="text-xs mt-4" style={{ color: colors.cream, opacity: 0.4 }}>
              Naming emotions activates your prefrontal cortex, reducing their intensity.
            </p>
          </Section>

          <Section id="moments" title="Moments" icon={<Award size={18} style={{ color: colors.coral }} />}>
            {data.moments.map((m, idx) => (
              <div 
                key={idx}
                className={`flex items-start gap-3 ${idx < data.moments.length - 1 ? 'mb-3 pb-3' : ''}`}
                style={{ borderBottom: idx < data.moments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${colors.cyan}15` }}
                >
                  {m.type === 'honesty' && <MessageCircle size={14} style={{ color: colors.cyan }} />}
                  {m.type === 'pattern' && <Layers size={14} style={{ color: colors.cyan }} />}
                  {m.type === 'vulnerability' && <Unlock size={14} style={{ color: colors.cyan }} />}
                </div>
                <div>
                  <p className="text-sm" style={{ color: colors.cream }}>{m.text}</p>
                  <p className="text-xs mt-1" style={{ color: colors.cream, opacity: 0.3 }}>{m.date}</p>
                </div>
              </div>
            ))}
          </Section>

          {data.reflection && (
            <Section id="reflection" title="Your Reflection" icon={<Brain size={18} style={{ color: colors.coral }} />}>
              <div 
                className="rounded-xl p-4"
                style={{ backgroundColor: colors.dark, borderLeft: `3px solid ${colors.coral}` }}
              >
                {data.reflection.split('\n\n').map((p, idx) => (
                  <p 
                    key={idx}
                    className={`text-sm leading-relaxed ${idx > 0 ? 'mt-3' : ''}`}
                    style={{ color: colors.cream, opacity: 0.8 }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* CTA */}
        <div 
          className="rounded-2xl p-6 mt-6 text-center relative overflow-hidden"
          style={{ backgroundColor: colors.coral }}
        >
          <p className="text-lg font-bold mb-1" style={{ color: colors.cream }}>
            Keep showing up
          </p>
          <p className="text-sm mb-4" style={{ color: colors.cream, opacity: 0.8 }}>
            {data.practice.currentStreak} days in — every check-in builds the practice
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
            style={{ backgroundColor: colors.dark, color: colors.cream }}
          >
            Today's Check-in <ArrowRight size={18} />
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-px" style={{ backgroundColor: colors.cream, opacity: 0.15 }} />
            <StarIcon size={10} style={{ color: colors.cream, opacity: 0.2 }} />
            <span className="text-xs font-bold" style={{ color: colors.cream, opacity: 0.2 }}>SEEN</span>
            <StarIcon size={10} style={{ color: colors.cream, opacity: 0.2 }} />
            <div className="w-6 h-px" style={{ backgroundColor: colors.cream, opacity: 0.15 }} />
          </div>
        </div>
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
            <StarIcon size={22} style={{ color: colors.cream, opacity: 0.4 }} />
            <span className="text-xs" style={{ color: colors.cream, opacity: 0.4 }}>Home</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 py-2 px-4">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.cream, opacity: 0.4 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="text-xs" style={{ color: colors.cream, opacity: 0.4 }}>Check-in</span>
          </Link>
          <Link href="/insights" className="flex flex-col items-center gap-1 py-2 px-4">
            <BarChart3 size={22} style={{ color: colors.coral }} />
            <span className="text-xs" style={{ color: colors.coral }}>Insights</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
