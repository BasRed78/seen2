'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Flame,
  TrendingUp,
  CheckCircle,
  Eye,
} from 'lucide-react'
import { colors } from '@/lib/constants/colors'

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

interface AwarenessHomeProps {
  userName: string
  insights: InsightData | null
}

export function AwarenessHome({ userName, insights }: AwarenessHomeProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      {/* Background gradient - coral tinted */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 10%, ${colors.coral}15 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-8">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-2xl font-bold mb-1" style={{ color: colors.cream }}>
            {greeting}, {userName}
          </p>
          <p style={{ color: colors.cream, opacity: 0.5 }}>
            Week {insights?.weeksActive || 1} of your journey
          </p>
        </div>

        {/* Streak Card */}
        {(insights?.streak ?? 0) > 0 && (
          <div
            className="rounded-2xl p-5 mb-4 flex items-center justify-between"
            style={{ backgroundColor: colors.darkCardHover, border: '1px solid rgba(255,255,255,0.08)' }}
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
              filter: 'blur(20px)',
            }}
          />

          {insights?.hasCheckedInToday ? (
            <div className="text-center relative">
              <CheckCircle size={32} className="mx-auto mb-2" style={{ color: colors.cream }} />
              <p className="font-bold text-lg" style={{ color: colors.cream }}>
                You have checked in today
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
                style={{ backgroundColor: colors.darkCard, color: colors.cream }}
              >
                Start Check-in <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>

        {/* Insights & This Week — combined card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: colors.darkCard, border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Latest insight summary */}
          {insights?.latestInsight && (
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: colors.cyan }}>
                {insights.latestInsight.title}
              </p>
              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: colors.cream, opacity: 0.7 }}>
                {insights.latestInsight.body}
              </p>
            </div>
          )}

          {/* This week dots */}
          {insights?.thisWeek && insights.thisWeek.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: colors.cream, opacity: 0.4 }}>
                This week
              </p>
              <div className="flex gap-1.5">
                {insights.thisWeek.map((day, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div
                      className="h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: day.checkedIn ? colors.darkCardHover : colors.dark,
                        border: day.checkedIn ? `1px solid ${colors.cyan}30` : '1px solid transparent',
                      }}
                    >
                      {day.checkedIn && <CheckCircle size={12} style={{ color: colors.cyan }} />}
                    </div>
                    <span className="text-xs mt-1 block" style={{ color: colors.cream, opacity: 0.3 }}>
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View insights button */}
          <Link
            href="/insights"
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{ backgroundColor: colors.darkCardHover, color: colors.cream }}
          >
            <BarChart3 size={16} style={{ color: colors.coral }} />
            View your insights
            <ArrowRight size={16} style={{ opacity: 0.4 }} />
          </Link>
        </div>
      </div>
    </>
  )
}
