'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  Heart,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Home
} from 'lucide-react'

// Brand colors - SEEN dark theme (updated Dec 2024)
const colors = {
  coral: '#ff6b5b',
  coralLight: '#ff8a7a',
  coralDark: '#e85a4f',
  dark: '#0f0f1a',
  darkCard: '#1a1a2e',
  darkCardHover: '#252542',
  cream: '#faf8f5',
  creamMuted: 'rgba(250, 248, 245, 0.6)',
  cyan: '#5B8F8F',
  cyanLight: '#7ab5b5',
}

// Custom Star Icon
const StarIcon = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
)

// Gradient blur decoration
const GradientBlur = ({ color, className = "", opacity = 0.15, size = 300 }: { 
  color: string; 
  className?: string; 
  opacity?: number; 
  size?: number 
}) => (
  <div 
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: 'blur(80px)',
      opacity
    }}
  />
)

// Format date range
const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', options)}`
}

// Types
interface Aggregation {
  id: string
  user_id: string
  type: string
  period_start: string
  period_end: string
  summary_text: string
  data: {
    stats: {
      avg_stress: number | null
      gap_notices: number
      checkin_count: number
      episodes_almost: number
      episodes_occurred: number
      episodes_resisted: number
    }
    top_triggers: Array<{ name: string; count: number }>
    trigger_chains: Array<{ pattern: string; frequency: number }>
    emotion_patterns: {
      emotions_user_named: string[]
      most_common_before?: string[]
      most_common_after?: string[]
    }
    breakthroughs_this_week: Array<{
      id: string
      date: string
      category: string
      description: string
    }>
    alternative_actions_reported: Array<{ action: string; count: number }>
    readiness_indicators: {
      overall_readiness: string
      resistance_attempts: number
      change_talk_instances: number
    }
  }
}

export default function InsightsPage() {
  const router = useRouter()
  const [aggregation, setAggregation] = useState<Aggregation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    reflection: true,
    emotions: false,
    triggers: false,
    breakthroughs: true
  })

  useEffect(() => {
    async function fetchInsights() {
      try {
        // Get current user from localStorage
        const userStr = localStorage.getItem('seen_user')
        if (!userStr) {
          router.push('/login')
          return
        }
        
        const user = JSON.parse(userStr)
        const userId = user.id

        // Fetch insights via API route
        const response = await fetch(`/api/insights?userId=${userId}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch insights')
        }

        if (result.aggregation) {
          setAggregation(result.aggregation)
        } else {
          setAggregation(null)
        }
      } catch (err) {
        console.error('Error fetching insights:', err)
        setError('Failed to load insights')
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [router])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Collapsible section component
  const Section = ({ 
    id, 
    title, 
    icon, 
    children, 
    accentColor = colors.coral 
  }: { 
    id: keyof typeof expandedSections
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    accentColor?: string
  }) => {
    const isOpen = expandedSections[id]
    
    return (
      <div 
        className="rounded-2xl overflow-hidden mb-4"
        style={{ backgroundColor: colors.darkCard }}
      >
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-5 flex items-center justify-between text-left transition-colors"
          style={{ 
            borderBottom: isOpen ? `1px solid rgba(250, 248, 245, 0.1)` : 'none'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              {icon}
            </div>
            <span className="text-lg font-semibold" style={{ color: colors.cream }}>
              {title}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp size={20} style={{ color: colors.creamMuted }} />
          ) : (
            <ChevronDown size={20} style={{ color: colors.creamMuted }} />
          )}
        </button>
        
        {isOpen && (
          <div className="p-5 pt-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.dark }}>
        <div className="text-center">
          <StarIcon size={32} style={{ color: colors.coral, animation: 'pulse 2s infinite' }} />
          <p className="mt-4" style={{ color: colors.creamMuted }}>Loading insights...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.dark }}>
        <div className="text-center">
          <p style={{ color: colors.coral }}>{error}</p>
          <button 
            onClick={() => router.push('/home')}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.darkCard, color: colors.cream }}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // No data state
  if (!aggregation) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-sm mb-8"
            style={{ color: colors.creamMuted }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="text-center py-16">
            <StarIcon size={48} style={{ color: colors.coral, opacity: 0.5 }} />
            <h2 className="text-xl font-bold mt-6 mb-2" style={{ color: colors.cream }}>
              No insights yet
            </h2>
            <p className="mb-8" style={{ color: colors.creamMuted }}>
              Complete a few check-ins and your weekly insights will appear here.
            </p>
            <button
              onClick={() => router.push('/chat')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: colors.coral, color: colors.cream }}
            >
              Start Check-in <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main render with data
  const { data, summary_text, period_start, period_end } = aggregation
  const { stats, top_triggers, trigger_chains, emotion_patterns, breakthroughs_this_week, alternative_actions_reported } = data

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: colors.dark }}>
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-8 pb-6">
        <GradientBlur color={colors.coral} className="-top-40 -right-40" opacity={0.12} size={350} />
        <GradientBlur color={colors.cyan} className="-bottom-32 -left-32" opacity={0.08} size={250} />
        
        <div className="max-w-lg mx-auto relative">
          {/* Back button */}
          <button 
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-100"
            style={{ color: colors.creamMuted }}
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <StarIcon size={14} style={{ color: colors.coral }} />
            <span 
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.coral }}
            >
              Your Insights
            </span>
          </div>
          
          <h1 
            className="text-2xl font-bold mb-1"
            style={{ color: colors.cream }}
          >
            {formatDateRange(period_start, period_end)}
          </h1>
          
          <p className="text-sm" style={{ color: colors.creamMuted }}>
            {stats.checkin_count} check-in{stats.checkin_count !== 1 ? 's' : ''} this week
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-6">
        
        {/* Weekly Reflection - Primary */}
        <Section 
          id="reflection" 
          title="This Week" 
          icon={<MessageCircle size={20} style={{ color: colors.coral }} />}
        >
          <div 
            className="rounded-xl p-5"
            style={{ 
              backgroundColor: colors.dark,
              borderLeft: `3px solid ${colors.coral}`
            }}
          >
            {summary_text.split('\n\n').map((paragraph, idx) => (
              <p 
                key={idx} 
                className={`text-base leading-relaxed ${idx > 0 ? 'mt-4' : ''}`}
                style={{ color: colors.cream, opacity: 0.9 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

        {/* Emotions Named */}
        {emotion_patterns?.emotions_user_named?.length > 0 && (
          <Section 
            id="emotions" 
            title="Emotions You Named" 
            icon={<Heart size={20} style={{ color: colors.coralLight }} />}
            accentColor={colors.coralLight}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {emotion_patterns.emotions_user_named.map((emotion, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${colors.coral}20`,
                    color: colors.coralLight
                  }}
                >
                  {emotion}
                </span>
              ))}
            </div>
            <p className="text-sm" style={{ color: colors.creamMuted }}>
              Naming emotions activates your prefrontal cortex, reducing their intensity.
            </p>
          </Section>
        )}

        {/* Triggers & Patterns */}
        {(top_triggers?.length > 0 || trigger_chains?.length > 0) && (
          <Section 
            id="triggers" 
            title="What Triggered You" 
            icon={<AlertTriangle size={20} style={{ color: colors.cyan }} />}
            accentColor={colors.cyan}
          >
            {/* Top Triggers */}
            {top_triggers?.length > 0 && (
              <div className="mb-6">
                <p 
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: colors.creamMuted }}
                >
                  Top Triggers
                </p>
                <div className="space-y-3">
                  {top_triggers.map((trigger, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span 
                            className="text-sm font-medium capitalize"
                            style={{ color: colors.cream }}
                          >
                            {trigger.name.replace(/_/g, ' ')}
                          </span>
                          <span 
                            className="text-xs font-bold"
                            style={{ color: colors.cyan }}
                          >
                            {trigger.count}×
                          </span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: `${colors.cyan}20` }}
                        >
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${Math.min((trigger.count / 3) * 100, 100)}%`,
                              backgroundColor: colors.cyan
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trigger Chains */}
            {trigger_chains?.length > 0 && (
              <div>
                <p 
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: colors.creamMuted }}
                >
                  The Pattern You Followed
                </p>
                <div className="space-y-3">
                  {trigger_chains.map((chain, idx) => (
                    <div 
                      key={idx}
                      className="rounded-xl p-4"
                      style={{ backgroundColor: colors.dark }}
                    >
                      <div className="flex items-center flex-wrap gap-2">
                        {chain.pattern.split(' → ').map((step, stepIdx, arr) => (
                          <span key={stepIdx} className="flex items-center gap-2">
                            <span 
                              className="px-3 py-1.5 rounded-lg text-sm font-medium"
                              style={{
                                backgroundColor: stepIdx === 0 
                                  ? colors.cyan 
                                  : stepIdx === arr.length - 1 
                                    ? colors.coral 
                                    : colors.darkCardHover,
                                color: stepIdx === 0 || stepIdx === arr.length - 1 
                                  ? colors.dark 
                                  : colors.cream
                              }}
                            >
                              {step}
                            </span>
                            {stepIdx < arr.length - 1 && (
                              <ChevronRight size={16} style={{ color: colors.creamMuted }} />
                            )}
                          </span>
                        ))}
                      </div>
                      {chain.frequency > 1 && (
                        <p className="text-xs mt-3" style={{ color: colors.creamMuted }}>
                          This happened {chain.frequency} times
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-4" style={{ color: colors.creamMuted }}>
                  Seeing the chain is the first step to breaking it.
                </p>
              </div>
            )}
          </Section>
        )}

        {/* Breakthroughs */}
        {breakthroughs_this_week?.length > 0 && (
          <Section 
            id="breakthroughs" 
            title="Breakthroughs" 
            icon={<Flame size={20} style={{ color: colors.coral }} />}
          >
            <div className="space-y-3">
              {breakthroughs_this_week.map((breakthrough, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl p-4"
                  style={{ 
                    backgroundColor: `${colors.cyan}10`,
                    borderLeft: `3px solid ${colors.cyan}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} style={{ color: colors.cyan }} />
                    <span 
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: colors.cyan }}
                    >
                      {breakthrough.category?.replace(/_/g, ' ') || 'Moment'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: colors.cream }}>
                    {breakthrough.description}
                  </p>
                  <p className="text-xs mt-3" style={{ color: colors.creamMuted }}>
                    {breakthrough.date}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* What You Did Instead */}
        {alternative_actions_reported?.length > 0 && (
          <div 
            className="rounded-2xl p-5 mb-4"
            style={{ backgroundColor: colors.darkCard }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.cyan}20` }}
              >
                <TrendingUp size={20} style={{ color: colors.cyan }} />
              </div>
              <span className="text-lg font-semibold" style={{ color: colors.cream }}>
                What You Did Instead
              </span>
            </div>
            <div className="space-y-2">
              {alternative_actions_reported.map((action, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: colors.dark }}
                >
                  <span className="text-sm capitalize" style={{ color: colors.cream }}>
                    {action.action.replace(/_/g, ' ')}
                  </span>
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${colors.cyan}20`, color: colors.cyan }}
                  >
                    {action.count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simple Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { 
              label: 'Avg Stress', 
              value: stats.avg_stress ?? '—', 
              subtext: 'of 10',
              good: stats.avg_stress !== null && stats.avg_stress < 5
            },
            { 
              label: 'Episodes', 
              value: stats.episodes_occurred ?? 0, 
              subtext: 'occurred',
              good: stats.episodes_occurred === 0
            },
            { 
              label: 'Resisted', 
              value: stats.episodes_resisted ?? 0, 
              subtext: stats.episodes_resisted === 1 ? 'time' : 'times',
              good: (stats.episodes_resisted ?? 0) > 0
            },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: colors.darkCard }}
            >
              <p 
                className="text-xs uppercase tracking-wide mb-2"
                style={{ color: colors.creamMuted }}
              >
                {stat.label}
              </p>
              <p 
                className="text-3xl font-bold mb-1"
                style={{ color: colors.cream }}
              >
                {stat.value}
              </p>
              <p 
                className="text-xs font-medium"
                style={{ color: stat.good ? colors.cyan : colors.creamMuted }}
              >
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{ backgroundColor: colors.coral }}
        >
          <div 
            className="absolute rounded-full pointer-events-none -top-10 -right-10"
            style={{
              width: 120,
              height: 120,
              background: `radial-gradient(circle, ${colors.cream} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              opacity: 0.1
            }}
          />
          
          <p 
            className="text-lg font-bold mb-1"
            style={{ color: colors.cream }}
          >
            Ready for today's check-in?
          </p>
          <p 
            className="text-sm mb-4"
            style={{ color: colors.cream, opacity: 0.8 }}
          >
            Every check-in builds the picture
          </p>
          <button
            onClick={() => router.push('/chat')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: colors.dark, color: colors.cream }}
          >
            Start Check-in <ArrowRight size={18} />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-px" style={{ backgroundColor: colors.creamMuted, opacity: 0.3 }} />
            <StarIcon size={10} style={{ color: colors.creamMuted, opacity: 0.5 }} />
            <span 
              className="text-xs font-bold tracking-widest"
              style={{ color: colors.creamMuted, opacity: 0.5 }}
            >
              SEEN
            </span>
            <StarIcon size={10} style={{ color: colors.creamMuted, opacity: 0.5 }} />
            <div className="w-6 h-px" style={{ backgroundColor: colors.creamMuted, opacity: 0.3 }} />
          </div>
        </div>
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
          <Link href="/insights" className="flex flex-col items-center gap-1 py-2 px-4">
            <BarChart3 size={22} style={{ color: colors.coral }} />
            <span className="text-xs" style={{ color: colors.coral }}>Insights</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
